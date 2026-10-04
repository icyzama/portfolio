"use client";

import { useState } from "react";
import { ActionLink, PageHero } from "@/components/ui/design";
import { upcomingPosts, profile } from "@/content/portfolio";

export function BlogPage() {
  function contact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    window.location.href = `mailto:${profile.email}?subject=Blog%20topic%20suggestion&body=${encodeURIComponent(`Reply to: ${email}\n\nMy topic suggestion: `)}`;
  }
  const [category, setCategory] = useState("All");
  const visible =
    category === "All"
      ? upcomingPosts
      : upcomingPosts.filter((post) => post.category === category);
  return (
    <>
      <PageHero
        label="✦ Blog"
        title={
          <>
            THOUGHTS
            <br />& WRITING.
          </>
        }
        accent="blue"
        count="Coming soon"
      />
      <div className="filter-bar" aria-label="Filter upcoming posts">
        {["All", "Dev", "Research", "Life", "Leadership"].map((item) => (
          <button
            key={item}
            aria-pressed={item === category}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
        <span className="filter-status">Coming soon</span>
      </div>
      {(category === "All" || category === "Research") && (
        <section className="blog-feature tone-blue">
          <div>
            <div className="blog-feature-label"><strong>Research</strong><span>Coming soon</span></div>
            <h2>COMING SOON</h2>
            <p>
              Development notes, project lessons, and thoughts from my journey
              in technology. New posts are on the way.
            </p>
            <div className="blog-feature-actions"><ActionLink href="/projects" tone="white">
              EXPLORE PROJECTS →
            </ActionLink><span>COMING SOON</span></div>
          </div>
          <div className="blog-date" aria-hidden="true">
            <strong>…</strong>
            <span>SOON</span>
          </div>
        </section>
      )}
      <div className="post-list" aria-live="polite">
        {visible.map((post) => (
          <article key={post.title} className="post-row">
            <span className="row-number">
              {String(upcomingPosts.indexOf(post) + 2).padStart(2, "0")}
            </span>
            <span className="post-category"><strong data-category={post.category}>{post.category}</strong><small>COMING SOON</small></span>
            <h2>{post.title}</h2>
            <span className="post-status">COMING SOON</span>
            <span className="post-arrow" aria-hidden="true">
              ↓
            </span>
          </article>
        ))}
      </div>
      <section className="blog-bottom">
        <div>
          <h2>THE FIRST POSTS ARE ON THE WAY.</h2>
          <p>Have a topic in mind? Let’s talk.</p>
        </div>
        <form className="blog-contact-form" onSubmit={contact}>
          <label className="sr-only" htmlFor="blog-email">
            Your email address
          </label>
          <input
            id="blog-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            required
          />
          <button className="action action-yellow" type="submit">
            CONTACT ME →
          </button>
        </form>
      </section>
    </>
  );
}
