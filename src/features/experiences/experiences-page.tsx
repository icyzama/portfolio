"use client";

import { useState } from "react";
import { organizations, projects } from "@/content/portfolio";
import styles from "./experiences.module.css";
import pageStyles from "@/components/ui/page-system.module.css";
import { EditorialHero, EditorialTags } from "@/components/ui/editorial";
import { pageLabels } from "@/components/ui/page-label";
import { ExperiencePhoto } from "./experience-photo";

const hackathons = projects.filter((project) => project.category === "Hackathon");

export function ExperiencesPage() {
  const [selected, setSelected] = useState(0);
  const org = organizations[selected];

  function move(direction: number) {
    setSelected((current) => (current + direction + organizations.length) % organizations.length);
  }

  return (
    <div className={pageStyles.surface}>
      <div className={styles.deck}>
      <section className={`${styles.opening} screen-panel ${pageStyles.titlePanel}`} aria-label="Experiences introduction">
        <EditorialHero
          label={pageLabels.experiences}
          title="EXPERIENCE."
          highlight="IN ACTION."
          description="Building applications, bringing communities together, and learning through real projects."
          topics={["DEVELOPMENT", "COMMUNITY", "COLLABORATION"]}
          className={styles.openingHero}
        />
      </section>

      <section className={styles.section} aria-labelledby="organizations-title">
        <header className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / STUDENT ORGANIZATIONS</p>
          <h2 id="organizations-title">LEARNING WITH COMMUNITY.</h2>
          <p className={styles.sectionDescription}>Taking on student leadership roles and creating opportunities to learn and build together.</p>
        </header>
        <div className={styles.organizations}>
          <aside className={styles.directory} aria-label="All organization roles">
            <div className={styles.directoryHeading}><h3>COMMUNITY & LEADERSHIP</h3><span>{organizations.length} ROLES</span></div>
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
              <ExperiencePhoto src={org.photo} alt={org.photoAlt ?? `${org.name} event photo with Reynald and fellow members`} fit={org.photoFit} />
              <h3>{org.name}</h3><p className={styles.role}>{org.role}</p><p className={styles.period}>{org.period}</p>
              <p className={styles.description}>{org.description}</p>
              {"highlights" in org && org.highlights && <div className={styles.contributions}><h4>HOW I CONTRIBUTE</h4><ul>{org.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>}
              <EditorialTags items={org.tags} />
              {org.link && <a className={`${pageStyles.button} ${styles.orgLink}`} href={org.link} target="_blank" rel="noreferrer">VIEW ORGANIZATION ON FACEBOOK <span aria-hidden="true">↗</span></a>}
            </article>
            <div className={styles.navigation}><button className={pageStyles.button} type="button" onClick={() => move(-1)} aria-label="Previous organization role">← PREVIOUS</button><button className={pageStyles.button} type="button" onClick={() => move(1)} aria-label="Next organization role">NEXT →</button></div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="projects-title">
        <header className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 / PROJECTS & HACKATHONS</p>
          <h2 id="projects-title">BUILDING WITH A TEAM.</h2>
          <p className={styles.sectionDescription}>Ideas shaped through collaboration, research, and hands-on development.</p>
        </header>
        <div className={styles.projectGrid}>{hackathons.map((project, index) => (
          <article className={styles.project} key={project.slug}>
            <ExperiencePhoto src={project.preview?.src} alt={project.preview?.alt ?? `${project.name} team or event photo`} />
            <div className={styles.projectMeta}><span className={styles.projectNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{project.year} / {project.category}</span></div>
            <p className={styles.recognition}>{project.recognition}</p><h3>{project.name}</h3>{project.subtitle && <p className={styles.projectSubtitle}>{project.subtitle}</p>}<p className={styles.description}>{project.description}</p>
            <EditorialTags items={project.tags} />
          </article>
        ))}</div>
      </section>

      <section className={styles.section} aria-labelledby="internship-title">
        <header className={styles.sectionHeading}>
          <p className={styles.eyebrow}>03 / INTERNSHIP</p>
          <h2 id="internship-title">LEARNING BY BUILDING.</h2>
          <p className={styles.sectionDescription}>Applying my full-stack skills in a professional product development environment.</p>
        </header>
        <article className={styles.internship}>
          <div className={styles.internshipMeta}><p className={styles.eyebrow}>CURRENT ROLE</p><p>SEPTEMBER 2026<br /><span>— PRESENT</span></p><span className={styles.current}>IN PROGRESS</span></div>
          <div className={styles.internshipCopy}><p className={styles.eyebrow}>NEXVISION INNOVATIONS INC.</p><h3>Full Stack Developer Intern</h3>
            <ExperiencePhoto alt="NexVision internship photo" />
            <ul className={styles.responsibilities}><li>Develop and maintain CRM features using PostgreSQL, Express.js, React, Node.js, and TypeScript.</li><li>Work with APIs, databases, and application logic to support reliable data flow.</li><li>Collaborate with the development team to debug, test, and improve application components.</li></ul>
            <EditorialTags items={["PostgreSQL", "Express.js", "React", "Node.js", "TypeScript"]} />
          </div>
        </article>
      </section>
      </div>
    </div>
  );
}
