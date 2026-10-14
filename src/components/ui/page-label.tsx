import styles from "./page-label.module.css";

export const pageLabels = {
  about: "01 / ABOUT",
  experiences: "02 / EXPERIENCES",
  projects: "03 / PROJECTS",
  blog: "04 / BLOG",
  services: "05 / SERVICES",
  contact: "06 / CONTACT",
} as const;

export function SectionLabel({ children }: { children: string }) {
  return <p className={styles.label}>{children}</p>;
}

export function PageLabel({ page }: { page: keyof typeof pageLabels }) {
  return <SectionLabel>{pageLabels[page]}</SectionLabel>;
}
