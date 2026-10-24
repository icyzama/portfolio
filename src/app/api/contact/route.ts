import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { profile } from "@/content/portfolio";
import { contactEmail, contactSenderReceiptEmail } from "@/features/contact/contact-email";

export const runtime = "nodejs";

const windowMs = 15 * 60 * 1000;
// Best-effort per-instance protection. Hosting-level limits can also be applied.
const attempts = new Map<string, { count: number; expires: number }>();
const emailPattern = /^[^\s@<>,;:"]+@[^\s@<>,;:"]+\.[^\s@<>,;:"]+$/;

function reply(status: number, message: string, headers?: Record<string, string>) {
  return Response.json({ message }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

class EmailDeliveryError extends Error {
  constructor(readonly providerStatus: number | null, readonly reason: string) {
    super("Email delivery failed");
  }
}

async function sendWithResend(apiKey: string, message: Record<string, unknown>) {
  let providerStatus: number | undefined;
  try {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      cache: "no-store",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(15_000),
    });
    providerStatus = sent.status;
    if (!sent.ok) {
      const failure: unknown = await sent.json().catch(() => null);
      const detail = failure && typeof failure === "object" && "message" in failure && typeof failure.message === "string"
        ? failure.message.toLowerCase() : "";
      // Classify known failures without logging provider messages that may contain addresses.
      const reason = sent.status === 401 ? "provider_authentication"
        : sent.status === 429 ? "provider_rate_limit"
        : sent.status === 403 && detail.includes("only send testing emails") ? "test_recipient_not_allowed"
        : sent.status === 403 && detail.includes("not verified") ? "sender_domain_not_verified"
        : "provider_rejection";
      throw new EmailDeliveryError(sent.status, reason);
    }
    const result: unknown = await sent.json().catch(() => null);
    if (!result || typeof result !== "object" || !("id" in result) || typeof result.id !== "string" || !result.id.trim()) {
      throw new EmailDeliveryError(sent.status, "provider_invalid_response");
    }
    return result.id;
  } catch (error) {
    if (error instanceof EmailDeliveryError) throw error;
    const reason = error && typeof error === "object" && "name" in error && (error.name === "TimeoutError" || error.name === "AbortError")
      ? "provider_timeout" : "provider_connection";
    throw new EmailDeliveryError(providerStatus ?? null, reason);
  }
}

function logDeliveryFailure(message: string, error: unknown) {
  const failure = error instanceof EmailDeliveryError
    ? { providerStatus: error.providerStatus, reason: error.reason }
    : { providerStatus: null, reason: "provider_connection" };
  console.error(`${message} ${JSON.stringify(failure)}`);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    return reply(403, "Please send your message from the contact page.");
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return reply(415, "Please send your message using the contact form.");
  }

  let payload: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, "Please complete the contact form.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32_768) {
        await reader.cancel();
        return reply(413, "Your message is too long. Please shorten it and try again.");
      }
      chunks.push(value);
    }
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return reply(400, "Your message could not be read. Please try again.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return reply(400, "Please complete the contact form.");
  }
  const fields = payload as Record<string, unknown>;
  const read = (key: string) => typeof fields[key] === "string" ? fields[key].trim() : "";
  const name = read("name");
  const email = read("email");
  const topic = read("topic");
  const topicLabels: Record<string, string> = {
    job: "Job or internship",
    project: "Freelance project",
    collaboration: "Collaboration",
    general: "General question",
  };
  const topicLabel = Object.hasOwn(topicLabels, topic) ? topicLabels[topic] : undefined;
  const organization = read("organization");
  const timeline = read("timeline");
  const timelineLabels: Record<string, string> = {
    asap: "As soon as possible",
    "within-month": "Within a month",
    "one-to-three-months": "1–3 months",
    flexible: "Flexible / still planning",
  };
  const timelineLabel = Object.hasOwn(timelineLabels, timeline) ? timelineLabels[timeline] : undefined;
  const message = read("message");
  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 254 || !topicLabel || organization.length > 120 || /[\r\n\0]/.test(name + email + organization) || (timeline && (!timelineLabel || topic !== "project")) || !message || message.length > 5000 || /\0/.test(message)) {
    return reply(400, "Please enter a valid name, email, reason for reaching out, and message within the form limits.");
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const sender = process.env.CONTACT_FROM_EMAIL?.trim();
  const recipient = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;
  if (!apiKey || !sender || !emailPattern.test(sender) || !emailPattern.test(recipient)) {
    console.error(`Contact email configuration is missing or invalid ${JSON.stringify({
      apiKeyPresent: Boolean(apiKey), senderValid: Boolean(sender && emailPattern.test(sender)), recipientValid: emailPattern.test(recipient),
    })}`);
    return reply(503, "The contact form is temporarily unavailable. Please use the email link above.");
  }

  const now = Date.now();
  for (const [key, attempt] of attempts) if (attempt.expires <= now) attempts.delete(key);
  // Only trust a header our deployment proxy overwrites. Unknown clients share a
  // conservative bucket rather than letting caller-selected headers bypass it.
  const trustedHeader = process.env.VERCEL === "1"
    ? "x-vercel-forwarded-for"
    : process.env.CONTACT_TRUSTED_IP_HEADER?.trim();
  const forwarded = trustedHeader && /^[a-z0-9-]+$/i.test(trustedHeader)
    ? request.headers.get(trustedHeader)?.trim()
    : undefined;
  const ip = forwarded && isIP(forwarded) ? forwarded : "untrusted";
  const key = createHash("sha256").update(ip).digest("hex");
  const attempt = attempts.get(key) || { count: 0, expires: now + windowMs };
  if (attempt.count >= 5) {
    return reply(429, "Too many messages. Please wait a few minutes before trying again.", { "Retry-After": String(Math.ceil((attempt.expires - now) / 1000)) });
  }
  // Bound memory if the deployment receives many different client addresses.
  if (attempts.size >= 10_000 && !attempts.has(key)) return reply(429, "The form is busy. Please try again shortly.", { "Retry-After": "60" });
  attempt.count += 1;
  attempts.set(key, attempt);

  let ownerMessageId: string;
  try {
    const ownerMessage = contactEmail({ name, email, topic: topicLabel, organization, timeline: timelineLabel, message });
    ownerMessageId = await sendWithResend(apiKey, {
      from: `Reynald's Portfolio <${sender}>`,
      to: [recipient],
      reply_to: email,
      subject: `[Portfolio] ${topicLabel}`,
      ...ownerMessage,
    });
  } catch (error) {
    logDeliveryFailure("Contact email delivery failed", error);
    return reply(502, "Your message could not be sent. Please try again later or use the email link above.");
  }

  console.info(`Contact email accepted by Resend ${JSON.stringify({ messageId: ownerMessageId })}`);
  try {
    const receipt = contactSenderReceiptEmail({
      name,
      email,
      topic: topicLabel,
      ownerName: profile.name,
      ownerBio: profile.contactReceiptBio,
      siteUrl: profile.siteUrl,
      projectsUrl: new URL("/projects", profile.siteUrl).toString(),
      linkedinUrl: profile.linkedin,
    });
    const receiptMessageId = await sendWithResend(apiKey, {
      from: `Reynald's Portfolio <${sender}>`,
      to: [email],
      reply_to: recipient,
      ...receipt,
    });
    console.info(`Contact sender receipt accepted by Resend ${JSON.stringify({ messageId: receiptMessageId })}`);
  } catch (error) {
    // Do not report a failed submission once the owner's notification was accepted.
    logDeliveryFailure("Contact sender receipt failed", error);
  }

  return reply(200, "Thanks! Your message has been sent. I’ll get back to you by email.");
}
