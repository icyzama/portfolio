"use client";

import { useState, type FormEvent } from "react";
import { EditorialHero, EditorialLink } from "@/components/ui/editorial";
import { upcomingPosts, profile } from "@/content/portfolio";
import styles from "@/components/ui/editorial.module.css";
import { pageLabels } from "@/components/ui/page-label";
import pageStyles from "@/components/ui/page-system.module.css";

export function BlogPage() {
  function contact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    window.location.href = `mailto:${profile.email}?subject=Blog%20topic%20suggestion&body=${encodeURIComponent(`Reply to: ${email}\n\nMy topic suggestion: `)}`;
  }
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? upcomingPosts : upcomingPosts.filter((post) => post.category === category);
  return (
    <div className={pageStyles.surface}>
      <EditorialHero label={pageLabels.blog} title="THOUGHTS" highlight="& WRITING." description="Development notes, project lessons, and reflections from my journey in technology. The first posts are on the way." topics={["DEVELOPMENT", "RESEARCH", "COMMUNITY"]} />
      <div className={styles.filters} role="group" aria-label="Filter upcoming posts">
        {["All", "Dev", "Research", "Life", "Leadership"].map((item) => <button type="button" key={item} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}
        <span className={styles.filterStatus}>COMING SOON</span>
      </div>
      <section className={styles.section} aria-label="Upcoming writing">
        {(category === "All" || category === "Research") && <section className={styles.feature} aria-labelledby="writing-feature-title"><div className={styles.featureCopy}><p className={styles.eyebrow}>NOTES IN PROGRESS</p><h2 id="writing-feature-title">LEARNING. BUILDING.<br />SHARING THE PROCESS.</h2><p className={styles.description}>Project lessons and thoughts from my journey in technology. While the first posts are in progress, explore what I’ve been building.</p><EditorialLink href="/projects">EXPLORE PROJECTS ↗</EditorialLink></div><div className={styles.featureAside} aria-hidden="true"><span>↗</span><p>COMING SOON</p></div></section>}
        <div className={styles.sectionHeading}><h2>ON THE WRITING LIST</h2><span role="status">{visible.length} {visible.length === 1 ? "TOPIC" : "TOPICS"}</span></div>
        <div className={styles.postGrid}>
          {visible.map((post) => <article className={styles.post} key={post.title}><div className={styles.meta}><span className={styles.postLabel}>{post.category}</span><span>COMING SOON</span></div><h3>{post.title.replace(/^\[|\]$/g, "")}</h3></article>)}
        </div>
        {visible.length === 0 && <p className={styles.empty}>No topics listed in this category yet. Have a suggestion? Send it below.</p>}
      </section>
      <section className={styles.cta}><div><h2>WHAT SHOULD I WRITE ABOUT?</h2><p>Have a topic in mind? Leave your email to start a conversation.</p></div><form className={styles.topicForm} onSubmit={contact}><label className="sr-only" htmlFor="blog-email">Your email address</label><input id="blog-email" name="email" type="email" autoComplete="email" placeholder="your@email.com" required /><button className={`${pageStyles.button} ${styles.primary}`} type="submit">SUGGEST A TOPIC ↗</button></form></section>
    </div>
  );
}
