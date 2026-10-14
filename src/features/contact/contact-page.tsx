"use client";

import { useState } from "react";
import { Asset, PageHero } from "@/components/ui/design";
import { profile } from "@/content/portfolio";

export function ContactPage() {
  const [status, setStatus] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `${String(data.get("subject")) || "Portfolio enquiry"} — ${String(data.get("name"))}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(
      "Your email draft is ready in your email app. Send it there to complete your enquiry.",
    );
  }
  return (
    <>
      <PageHero
        label="06 / CONTACT"
        title={
          <>
            LET&apos;S
            <br />
            TALK.
          </>
        }
        accent="orange"
      />
      <div className="contact-links">
        <a href={`mailto:${profile.email}`}>
          <span className="contact-icon">
            <Asset src="/figma/contact-iconmail.svg" width={21} />
          </span>
          <span>
            <small>EMAIL</small>
            <strong>{profile.email}</strong>
          </span>
        </a>
        <a href={profile.github}>
          <span className="contact-icon text-icon" aria-hidden="true">
            ⌥
          </span>
          <span>
            <small>GITHUB</small>
            <strong>github.com/icyzama</strong>
          </span>
        </a>
        <a href={profile.linkedin}>
          <span className="contact-icon text-icon" aria-hidden="true">
            in
          </span>
          <span>
            <small>LINKEDIN</small>
            <strong>linkedin.com/in/reynaldquijano</strong>
          </span>
        </a>
      </div>
      <div className="contact-grid">
        <form className="contact-form" onSubmit={submit}>
          <h2>SEND A MESSAGE</h2>
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
          <label>
            <span className="sr-only">Subject</span>
            <input
              name="subject"
              placeholder="Subject"
              required
              maxLength={160}
            />
          </label>
          <label>
            <span className="sr-only">Your message</span>
            <textarea
              name="message"
              placeholder="Tell me about your project or just say hi..."
              required
              maxLength={5000}
              rows={5}
            />
          </label>
          <button type="submit" className="action action-blue">
            SEND MESSAGE →
          </button>
          <p className="form-note sr-only">Opens an email draft in your email app.</p>
          <p className="form-status" role="status">
            {status}
          </p>
        </form>
        <aside className="contact-aside">
          <h2>
            LET&apos;S BUILD
            <br />
            SOMETHING
            <br />
            AMAZING
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
    </>
  );
}
