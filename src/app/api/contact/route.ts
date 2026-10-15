import nodemailer from "nodemailer";
import { createHash } from "node:crypto";
import { profile } from "@/content/portfolio";

export const runtime = "nodejs";

const windowMs = 15 * 60 * 1000;
// Best-effort per-instance protection. Hosting-level limits can also be applied.
const attempts = new Map<string, { count: number; expires: number }>();
const emailPattern = /^[^\s@<>,;:"]+@[^\s@<>,;:"]+\.[^\s@<>,;:"]+$/;

function reply(status: number, message: string, headers?: Record<string, string>) {
  return Response.json({ message }, { status, headers: { "Cache-Control": "no-store", ...headers } });
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
  // Hidden field catches automated submissions without sending an email.
  if (typeof fields.website === "string" && fields.website.trim()) {
    return reply(200, "Thanks! Your message has been sent.");
  }
  const read = (key: string) => typeof fields[key] === "string" ? fields[key].trim() : "";
  const name = read("name");
  const email = read("email");
  const subject = read("subject");
  const message = read("message");
  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 254 || !subject || subject.length > 160 || !message || message.length > 5000 || /[\r\n\0]/.test(name + email + subject) || message.includes("\0")) {
    return reply(400, "Please enter a valid name, email, subject, and message within the form limits.");
  }

  const user = process.env.GMAIL_USER?.trim();
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const recipient = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;
  if (!user || !password || !emailPattern.test(user) || !emailPattern.test(recipient)) {
    return reply(503, "The contact form is temporarily unavailable. Please use the email link above.");
  }

  const now = Date.now();
  for (const [key, attempt] of attempts) if (attempt.expires <= now) attempts.delete(key);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256").update(ip).digest("hex");
  const attempt = attempts.get(key) || { count: 0, expires: now + windowMs };
  if (attempt.count >= 5) {
    return reply(429, "Too many messages. Please wait a few minutes before trying again.", { "Retry-After": String(Math.ceil((attempt.expires - now) / 1000)) });
  }
  // Bound memory if the deployment receives many different client addresses.
  if (attempts.size >= 10_000 && !attempts.has(key)) return reply(429, "The form is busy. Please try again shortly.", { "Retry-After": "60" });
  attempt.count += 1;
  attempts.set(key, attempt);

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const sent = await transport.sendMail({
      from: { name: "Reynald's Portfolio", address: user },
      to: recipient,
      replyTo: { name, address: email },
      subject: `[Portfolio] ${subject}`,
      text: `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
    if (!sent.accepted.length) throw new Error("Message not accepted");
    return reply(200, "Thanks! Your message has been sent. I’ll get back to you by email.");
  } catch {
    return reply(502, "Your message could not be sent. Please try again later or use the email link above.");
  } finally {
    transport.close();
  }
}
