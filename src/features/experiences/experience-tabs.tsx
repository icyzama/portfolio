"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./experiences.module.css";

const tabs = ["Student Organizations", "Projects & Hackathons", "Internships"];
const tabKeys = ["orgs", "hackathons", "internships"] as const;

export function ExperienceTabs({ activeTab }: { activeTab: number }) {
  const router = useRouter();
  return (
    <div className={styles.tabs} role="tablist" aria-label="Experience categories">
      {tabs.map((name, index) => (
        <Link
          key={name}
          href={`/experiences?tab=${tabKeys[index]}`}
          replace
          scroll={false}
          id={`experience-tab-${index}`}
          role="tab"
          aria-selected={activeTab === index}
          aria-controls="experience-panel"
          tabIndex={activeTab === index ? 0 : -1}
          onKeyDown={(event) => {
            const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
              : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length
              : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
            if (next !== null) {
              event.preventDefault();
              router.replace(`/experiences?tab=${tabKeys[next]}`, { scroll: false });
              document.getElementById(`experience-tab-${next}`)?.focus();
            }
          }}
        >
          <span className={styles.tabNumber} aria-hidden="true">0{index + 1}</span>
          {name}
        </Link>
      ))}
    </div>
  );
}
