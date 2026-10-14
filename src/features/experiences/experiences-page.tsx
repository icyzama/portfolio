"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { organizations, projects } from "@/content/portfolio";
import styles from "./experiences.module.css";
import { PageLabel } from "@/components/ui/page-label";
import { ExperiencePhoto } from "./experience-photo";

const tabs = ["Student Organizations", "Projects & Hackathons", "Internships"];
const hackathons = projects.filter((project) => project.category === "Hackathon");

export function ExperiencesPage() {
  const query = useSearchParams().get("tab");
  const router = useRouter();
  const tab = query === "hackathons" ? 1 : query === "internships" ? 2 : 0;
  const [selected, setSelected] = useState(0);
  const org = organizations[selected];
  function selectTab(index: number) {
    router.replace(`/experiences?tab=${["orgs", "hackathons", "internships"][index]}`, { scroll: false });
  }
  function move(direction: number) {
    setSelected((current) => (current + direction + organizations.length) % organizations.length);
  }
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div><PageLabel page="experiences" /><h1>EXPERIENCE.<br /><span>IN ACTION.</span></h1></div>
        <div className={styles.heroNote}><p>Building applications, bringing communities together, and learning through real projects.</p><ul><li>DEVELOPMENT</li><li>COMMUNITY</li><li>COLLABORATION</li></ul></div>
      </header>
      <div className={styles.tabs} role="tablist" aria-label="Experience categories">
        {tabs.map((name, index) => (
          <button type="button" key={name} role="tab" aria-selected={tab === index} aria-controls="experience-panel" id={`experience-tab-${index}`} tabIndex={tab === index ? 0 : -1}
            onKeyDown={(event) => {
              const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
              if (next !== null) { event.preventDefault(); selectTab(next); document.getElementById(`experience-tab-${next}`)?.focus(); }
            }} onClick={() => selectTab(index)}>
            <span className={styles.tabNumber} aria-hidden="true">0{index + 1}</span>{name}
          </button>
        ))}
      </div>
      <section id="experience-panel" className={styles.panel} role="tabpanel" tabIndex={0} aria-labelledby={`experience-tab-${tab}`}>
        {tab === 0 ? (
          <div className={styles.organizations}>
            <aside className={styles.directory} aria-label="All organization roles">
              <div className={styles.directoryHeading}><h2>COMMUNITY & LEADERSHIP</h2><span>{organizations.length} ROLES</span></div>
              {organizations.map((item, index) => (
                <button type="button" key={`${item.name}-${index}`} aria-pressed={selected === index} aria-controls="organization-detail" onClick={() => setSelected(index)}>
                  <span className={styles.rowNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.directoryCopy}><strong>{item.shortName}</strong><span>{item.role}</span><small>{item.period}</small></span>
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </button>
              ))}
            </aside>
            <div className={styles.feature}>
              <article id="organization-detail" className={styles.detail} aria-live="polite" aria-atomic="true">
                <div className={styles.detailMeta}><p className={styles.eyebrow}>STUDENT ORGANIZATION</p><span>{String(selected + 1).padStart(2, "0")} / {String(organizations.length).padStart(2, "0")}</span></div>
                <ExperiencePhoto alt={`${org.name} event photo`} />
                <h2>{org.name}</h2><p className={styles.role}>{org.role}</p><p className={styles.period}>{org.period}</p>
                <p className={styles.description}>{org.description}</p>
                {"highlights" in org && org.highlights && <div className={styles.contributions}><h3>HOW I CONTRIBUTE</h3><ul>{org.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>}
                <ul className={styles.tags} aria-label="Focus areas">{org.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </article>
              <div className={styles.navigation}><button type="button" onClick={() => move(-1)} aria-label="Previous organization role">← PREVIOUS</button><button type="button" onClick={() => move(1)} aria-label="Next organization role">NEXT →</button></div>
            </div>
          </div>
        ) : tab === 1 ? (
          <div className={styles.projectSection}>
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>BUILDING WITH A TEAM</p><h2>PROJECTS & HACKATHONS</h2></div>
            <div className={styles.projectGrid}>{hackathons.map((project, index) => (
              <article className={styles.project} key={project.slug}>
                <ExperiencePhoto alt={`${project.name} team or event photo`} />
                <div className={styles.projectMeta}><span className={styles.projectNumber} aria-hidden="true">0{index + 1}</span><span>{project.year} / {project.category}</span></div>
                <p className={styles.recognition}>{project.recognition}</p><h3>{project.name}</h3><p className={styles.description}>{project.description}</p>
                <ul className={styles.tags} aria-label="Skills and tools">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </article>
            ))}</div>
          </div>
        ) : (
          <div className={styles.internshipSection}>
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>PROFESSIONAL EXPERIENCE</p><h2>LEARNING BY BUILDING.</h2></div>
            <article className={styles.internship}>
              <div className={styles.internshipMeta}><p className={styles.eyebrow}>CURRENT ROLE</p><p>SEPTEMBER 2026<br /><span>— PRESENT</span></p><span className={styles.current}>IN PROGRESS</span></div>
              <div className={styles.internshipCopy}><p className={styles.eyebrow}>NEXVISION INNOVATIONS INC.</p><h3>Full Stack<br />Developer Intern</h3>
                <ExperiencePhoto alt="NexVision internship photo" />
                <ul className={styles.responsibilities}><li>Develop and maintain CRM features using PostgreSQL, Express.js, React, Node.js, and TypeScript.</li><li>Work with APIs, databases, and application logic to support reliable data flow.</li><li>Collaborate with the development team to debug, test, and improve application components.</li></ul>
                <ul className={styles.tags} aria-label="Technology stack">{["PostgreSQL", "Express.js", "React", "Node.js", "TypeScript"].map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </div>
            </article>
          </div>
        )}
      </section>
    </div>
  );
}
