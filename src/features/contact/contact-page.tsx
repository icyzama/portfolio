"use client";

import { useRef, useState } from "react";
import { Asset } from "@/components/ui/design";
import { EditorialHero } from "@/components/ui/editorial";
import editorialStyles from "@/components/ui/editorial.module.css";
import { profile } from "@/content/portfolio";
import successStyles from "./contact-success.module.css";
import pageStyles from "@/components/ui/page-system.module.css";
import { TitlePanel } from "@/components/ui/title-panel";
import styles from "./contact-page.module.css";

export function ContactPage() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [topic, setTopic] = useState("");
  const inFlight = useRef(false);
  const successDialog = useRef<HTMLDialogElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const [replyEmail, setReplyEmail] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    inFlight.current = true;
    setSending(true);
    setFailed(false);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
        signal: AbortSignal.timeout(30_000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Your message could not be sent. Please try again.");
      setReplyEmail(String(data.get("email") ?? "").trim());
      form.reset();
      setTopic("");
      successDialog.current?.showModal();
    } catch (error) {
      setFailed(true);
      setStatus(error instanceof Error && error.name === "Error" ? error.message : "Could not connect to send your message. Please try again or use the email link above.");
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }
  return (
    <div className={`${pageStyles.surface} ${styles.surface}`}>
      <TitlePanel label="Contact introduction">
        <EditorialHero
          label="06 / CONTACT"
          title="LET’S"
          highlight="TALK."
          description="Choose a contact channel or send me a message about a project, opportunity, or collaboration."
          topics={["EMAIL", "LINKEDIN", "GITHUB"]}
          className={editorialStyles.openingHero}
        />
      </TitlePanel>
      <div className="contact-links">
        <a href={`mailto:${profile.email}`}>
          <span className="contact-icon" aria-hidden="true">
            <Asset src="/skills/contact-gmail.svg" width={30} height={23} />
          </span>
          <span>
            <small>EMAIL</small>
            <strong>{profile.email}</strong>
          </span>
        </a>
        <a href={profile.github}>
          <span className="contact-icon" aria-hidden="true">
            <Asset src="/skills/contact-github.svg" width={30} />
          </span>
          <span>
            <small>GITHUB</small>
            <strong>github.com/icyzama</strong>
          </span>
        </a>
        <a href={profile.linkedin}>
          <span className="contact-icon" aria-hidden="true">
            <Asset src="/skills/contact-linkedin.svg" width={30} />
          </span>
          <span>
            <small>LINKEDIN</small>
            <strong>linkedin.com/in/reynaldquijano</strong>
          </span>
        </a>
      </div>
      <div className="contact-grid">
        <form className="contact-form" onSubmit={submit} aria-busy={sending}>
          <div className={styles.formHeading}>
            <p className={styles.eyebrow}>01 / DIRECT MESSAGE</p>
            <h2>SEND A MESSAGE.</h2>
          </div>
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <fieldset className="contact-fields" disabled={sending}>
          <div className="form-pair">
            <label>
              <span className="sr-only">Your name</span>
              <input
                name="name"
                placeholder="Your name"
                autoComplete="name"
                required
                maxLength={100}
              />
            </label>
            <label>
              <span className="sr-only">Email address</span>
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          </div>
          <div className="form-pair">
            <label>
              <span className="sr-only">Reason for reaching out</span>
              <select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)} required>
                <option value="" disabled>Reason for reaching out</option>
                <option value="job">Job or internship</option>
                <option value="project">Freelance project</option>
                <option value="collaboration">Collaboration</option>
                <option value="general">General question</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Company or organization, optional</span>
              <input name="organization" placeholder="Company or organization (optional)" maxLength={120} autoComplete="organization" />
            </label>
          </div>
          {topic === "project" && (
            <label>
              <span className="sr-only">Project timeline, optional</span>
              <select name="timeline" defaultValue="">
                <option value="">Project timeline (optional)</option>
                <option value="asap">As soon as possible</option>
                <option value="within-month">Within a month</option>
                <option value="one-to-three-months">1–3 months</option>
                <option value="flexible">Flexible / still planning</option>
              </select>
            </label>
          )}
          <label>
            <span className="sr-only">Your message</span>
            <textarea
              name="message"
              placeholder="Share a little context about what you have in mind..."
              required
              maxLength={5000}
              rows={5}
            />
          </label>
          </fieldset>
          <button ref={submitButton} type="submit" className="action action-yellow" disabled={sending}>
            {sending ? "SENDING…" : "SEND MESSAGE →"}
          </button>
          <p className="form-note sr-only">Sends your message directly to Reynald’s inbox.</p>
          <p className="form-status" role={failed ? "alert" : "status"} aria-live="polite">
            {status}
          </p>
        </form>
        <aside className="contact-aside">
          <h2>
            LET&apos;S BUILD
            <br />
            SOMETHING
            <br />
            TOGETHER.
          </h2>
          <p>
            Whether it’s a quick question, a collab idea, or a full project —
            I’m always happy to chat.
          </p>
          <div className="response-note">
            <p className="eyebrow">RESPONSE TIME</p>
            <span>
              <i />
              Usually within 24 hours
            </span>
          </div>
        </aside>
      </div>
      <dialog
        ref={successDialog}
        className={successStyles.dialog}
        aria-labelledby="contact-success-title"
        aria-describedby="contact-success-description"
        onClose={() => submitButton.current?.focus({ preventScroll: true })}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) successDialog.current?.close();
        }}
      >
        <div className={successStyles.icon} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 4 4L19 6" /></svg>
        </div>
        <h2 id="contact-success-title">MESSAGE SENT.</h2>
        <p id="contact-success-description">Thanks for reaching out! I’ll get back to you by email at <strong className={successStyles.email}>{replyEmail}</strong>.</p>
        <button type="button" className="action action-yellow" autoFocus onClick={() => successDialog.current?.close()}>GOT IT ✓</button>
      </dialog>
    </div>
  );
}
