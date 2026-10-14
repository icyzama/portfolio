import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./editorial.module.css";
import { SectionLabel } from "./page-label";

export function EditorialHero({ label, title, highlight, description, topics }: {
  label: string; title: string; highlight: string; description: string; topics: readonly string[];
}) {
  return <header className={styles.hero}>
    <div><SectionLabel>{label}</SectionLabel><h1>{title}<br /><span>{highlight}</span></h1></div>
    <div className={styles.heroNote}><p>{description}</p><ul>{topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></div>
  </header>;
}

export function EditorialTags({ items }: { items: readonly string[] }) {
  return <ul className={styles.tags} aria-label="Skills and tools">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function EditorialLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return <Link className={`${styles.button} ${primary ? styles.primary : ""}`} href={href}>{children}</Link>;
}
