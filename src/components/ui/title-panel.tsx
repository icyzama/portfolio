import type { ReactNode } from "react";
import styles from "./page-system.module.css";

type TitlePanelProps = {
  children: ReactNode;
  label: string;
  id?: string;
  className?: string;
};

export function TitlePanel({ children, label, id, className = "" }: TitlePanelProps) {
  return (
    <section
      id={id}
      className={`${styles.titlePanel} screen-panel ${className}`}
      aria-label={label}
    >
      {children}
    </section>
  );
}
