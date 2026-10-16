"use client";

import { type FormEvent } from "react";
import { EditorialHero } from "@/components/ui/editorial";
import { upcomingPosts, profile } from "@/content/portfolio";
import { pageLabels } from "@/components/ui/page-label";
import pageStyles from "@/components/ui/page-system.module.css";
import editorialStyles from "@/components/ui/editorial.module.css";
import { TitlePanel } from "@/components/ui/title-panel";
import styles from "./blog-page.module.css";

export function BlogPage() {
  function contact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    window.location.href = `mailto:${profile.email}?subject=Blog%20topic%20suggestion&body=${encodeURIComponent(`Reply to: ${email}\n\nMy topic suggestion: `)}`;
  }

  return (
    <div className={pageStyles.surface}>
      <TitlePanel label="Blog introduction">
        <EditorialHero
          label={pageLabels.blog}
          title="THOUGHTS"
          highlight="& WRITING."
          description="Notes on projects, tools, and lessons from building in tech."
          topics={["DEVELOPMENT", "COMMUNITY"]}
          className={editorialStyles.openingHero}
        />
      </TitlePanel>
      <section className={styles.content} aria-labelledby="writing-list-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>CURRENTLY IN PROGRESS</p>
            <h2 id="writing-list-title">THE WRITING LIST</h2>
          </div>
          <span className={styles.count} role="status">
            {String(upcomingPosts.length).padStart(2, "0")} TOPICS
          </span>
        </div>
        <div className={styles.list}>
          {upcomingPosts.map((post, index) => (
            <article className={styles.topic} key={post.title}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{post.title.replace(/^\[|\]$/g, "")}</h3>
              <span className={styles.category}>{post.category}</span>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.suggestion} aria-labelledby="suggestion-title">
        <div>
          <p className={styles.eyebrow}>HAVE AN IDEA?</p>
          <h2 id="suggestion-title">Suggest a topic.</h2>
          <p>Send a topic you would like to read about.</p>
        </div>
        <form className={styles.form} onSubmit={contact}>
          <label className="sr-only" htmlFor="blog-email">Your email address</label>
          <input id="blog-email" name="email" type="email" autoComplete="email" placeholder="your@email.com" required />
          <button className={pageStyles.button} type="submit">
            SEND SUGGESTION <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </div>
  );
}
