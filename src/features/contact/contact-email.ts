type ContactMessage = {
  name: string;
  email: string;
  topic: string;
  organization: string;
  timeline?: string;
  message: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

export function contactEmail(details: ContactMessage) {
  const fields = [
    ["Name", details.name],
    ["Email", details.email],
    ["Reason", details.topic],
    ["Organization", details.organization || "Not provided"],
    ...(details.timeline ? [["Project timeline", details.timeline]] : []),
  ];

  const rows = fields.map(([label, value]) => `<tr>
    <th scope="row" style="padding:10px 12px;border-bottom:1px solid #dedbd3;text-align:left;vertical-align:top;width:32%;font-size:13px;">${label}</th>
    <td style="padding:10px 12px;border-bottom:1px solid #dedbd3;word-break:break-word;font-size:14px;">${escapeHtml(value)}</td>
  </tr>`).join("");

  return {
    text: `New message from your portfolio\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${details.message}`,
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New portfolio message</title></head>
<body style="margin:0;padding:24px 12px;background:#f5f3ee;color:#0f0f0f;font-family:Arial,sans-serif;">
  <table role="presentation" style="width:100%;max-width:600px;margin:auto;border:2px solid #0f0f0f;border-collapse:collapse;background:#ffffff;">
    <tr><td style="padding:24px;background:#ff5533;border-bottom:2px solid #0f0f0f;">
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:2px;">REYNALD'S PORTFOLIO</p>
      <h1 style="margin:0;font-size:28px;line-height:1.2;">NEW MESSAGE.</h1>
    </td></tr>
    <tr><td style="padding:16px 12px;"><table aria-label="Contact details" style="width:100%;border-collapse:collapse;">${rows}</table></td></tr>
    <tr><td style="padding:12px 24px 28px;">
      <h2 style="margin:0 0 12px;font-size:16px;">Message</h2>
      <p style="margin:0;line-height:1.7;word-break:break-word;">${escapeHtml(details.message).replace(/\r\n|\r|\n/g, "<br>")}</p>
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f5f3ee;border-top:2px solid #0f0f0f;font-size:12px;line-height:1.6;">Reply to this email to respond directly to the visitor.</td></tr>
  </table>
</body></html>`,
  };
}

type ContactReceipt = {
  name: string;
  email: string;
  topic: string;
  ownerName: string;
  ownerBio: string;
  siteUrl: string;
  projectsUrl: string;
  linkedinUrl: string;
};

export function contactSenderReceiptEmail(details: ContactReceipt) {
  const name = escapeHtml(details.name);
  const email = escapeHtml(details.email);
  const topic = escapeHtml(details.topic);
  const ownerName = escapeHtml(details.ownerName);
  const ownerBio = escapeHtml(details.ownerBio);
  const siteUrl = escapeHtml(details.siteUrl);
  const projectsUrl = escapeHtml(details.projectsUrl);
  const linkedinUrl = escapeHtml(details.linkedinUrl);

  return {
    subject: "I received your message",
    text: `Hi ${details.name},\n\nThanks for reaching out about ${details.topic}. Your message has reached me, and I'll reply to ${details.email} as soon as I can.\n\nA little about me: ${details.ownerBio}\n\nView my portfolio: ${details.siteUrl}\nExplore selected projects: ${details.projectsUrl}\nConnect on LinkedIn: ${details.linkedinUrl}\n\n${details.ownerName}`,
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Message received</title></head>
<body style="margin:0;padding:24px 12px;background:#f5f3ee;color:#0f0f0f;font-family:Arial,sans-serif;">
  <table role="presentation" style="width:100%;max-width:600px;margin:auto;border:2px solid #0f0f0f;border-collapse:collapse;background:#ffffff;">
    <tr><td style="padding:24px;background:#ff5533;border-bottom:2px solid #0f0f0f;">
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:2px;">REYNALD'S PORTFOLIO</p>
      <h1 style="margin:0;font-size:26px;line-height:1.2;">MESSAGE RECEIVED.</h1>
    </td></tr>
    <tr><td style="padding:24px;line-height:1.65;">
      <p style="margin:0 0 16px;">Hi ${name},</p>
      <p style="margin:0 0 16px;">Thanks for reaching out about <strong>${topic}</strong>. Your message has reached me, and I'll reply to <strong>${email}</strong> as soon as I can.</p>
      <p style="margin:0 0 8px;">While you wait, here's a little about me:</p>
      <p style="margin:0 0 20px;">${ownerBio}</p>
      <p style="margin:0 0 8px;font-weight:bold;">Explore my work</p>
      <p style="margin:0 0 10px;"><a href="${siteUrl}" style="color:#1359a6;">View my portfolio</a></p>
      <p style="margin:0 0 10px;"><a href="${projectsUrl}" style="color:#1359a6;">Explore selected projects</a></p>
      <p style="margin:0 0 24px;"><a href="${linkedinUrl}" style="color:#1359a6;">Connect on LinkedIn</a></p>
      <p style="margin:0;padding-top:16px;border-top:1px solid #dedbd3;">${ownerName}</p>
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f5f3ee;border-top:2px solid #0f0f0f;font-size:12px;line-height:1.6;">This is an automatic confirmation of your contact form submission.</td></tr>
  </table>
</body></html>`,
  };
}
