"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { organizations, projects } from "@/content/portfolio";
import styles from "./experiences.module.css";
import pageStyles from "@/components/ui/page-system.module.css";
import { EditorialHero, EditorialTags } from "@/components/ui/editorial";
import editorialStyles from "@/components/ui/editorial.module.css";
import { TitlePanel } from "@/components/ui/title-panel";
import { pageLabels } from "@/components/ui/page-label";
import { ExperiencePhoto } from "./experience-photo";

const hackathons = projects.filter(
  (project) => project.category === "Hackathon" || project.slug === "smartflood",
);
const tabs = ["Student Organizations", "Projects & Hackathons", "Internships"];
const tabKeys = ["orgs", "hackathons", "internships"] as const;

export function ExperiencesPage({ tab }: { tab?: string }) {
  const router = useRouter();
  const activeTab = tab === "hackathons" ? 1 : tab === "internships" ? 2 : 0;

  function selectTab(index: number) {
    router.replace(`/experiences?tab=${tabKeys[index]}`, { scroll: false });
  }

  return (
    <div className={`${pageStyles.surface} focus-sections`}>
      <TitlePanel label="Experiences introduction">
        <EditorialHero
          label={pageLabels.experiences}
          title="EXPERIENCE."
          highlight="IN ACTION."
          description="Building applications, bringing communities together, and learning through real projects."
          topics={["DEVELOPMENT", "COMMUNITY", "COLLABORATION"]}
          className={editorialStyles.openingHero}
        />
      </TitlePanel>
      <div className={styles.tabs} role="tablist" aria-label="Experience categories">
        {tabs.map((name, index) => (
          <Link
            href={`/experiences?tab=${tabKeys[index]}`}
            replace
            scroll={false}
            key={name}
            id={`experience-tab-${index}`}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls="experience-panel"
            tabIndex={activeTab === index ? 0 : -1}
            onKeyDown={(event) => {
              const next = event.key === "ArrowRight"
                ? (index + 1) % tabs.length
                : event.key === "ArrowLeft"
                  ? (index + tabs.length - 1) % tabs.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? tabs.length - 1
                      : null;
              if (next !== null) {
                event.preventDefault();
                selectTab(next);
                document.getElementById(`experience-tab-${next}`)?.focus();
              }
            }}
          >
            <span className={styles.tabNumber} aria-hidden="true">0{index + 1}</span>
            {name}
          </Link>
        ))}
      </div>
      <div
        id="experience-panel"
        className={styles.panel}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`experience-tab-${activeTab}`}
      >
      <section className={`${styles.section} screen-panel`} aria-labelledby="organizations-title" hidden={activeTab !== 0}>
        <header className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / STUDENT ORGANIZATIONS</p>
          <h2 id="organizations-title">LEARNING WITH COMMUNITY.</h2>
          <p className={styles.sectionDescription}>Taking on student leadership roles and creating opportunities to learn and build together.</p>
        </header>
        <div className={styles.organizationGrid}>
          {organizations.map((item, index) => (
            <article className={styles.organizationCard} key={`${item.name}-${item.role}`}>
              <ExperiencePhoto src={item.photo} alt={item.photoAlt ?? `${item.name} event photo`} fit={item.photoFit} />
              <div className={styles.organizationCardBody}>
                <p className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / {String(organizations.length).padStart(2, "0")} · STUDENT ORGANIZATION</p>
                <h3>{item.name}</h3>
                <p className={styles.role}>{item.role}</p>
                <p className={styles.period}>{item.period}</p>
                <p className={styles.description}>{item.description}</p>
                {item.highlights && <div className={styles.contributions}><h4>HOW I CONTRIBUTE</h4><ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>}
                <div className={styles.organizationCardFooter}>
                  <EditorialTags items={item.tags} />
                  {item.link && <a className={`${pageStyles.button} ${styles.orgLink}`} href={item.link} target="_blank" rel="noreferrer">VIEW ORGANIZATION <span aria-hidden="true">↗</span></a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} screen-panel`} aria-labelledby="projects-title" hidden={activeTab !== 1}>
        <header className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 / PROJECTS & HACKATHONS</p>
          <h2 id="projects-title">BUILDING WITH A TEAM.</h2>
          <p className={styles.sectionDescription}>Ideas shaped through collaboration, research, and hands-on development.</p>
        </header>
        <div className={styles.projectGrid}>{hackathons.map((project, index) => (
          <article className={styles.project} key={project.slug}>
            {project.slug === "smartflood" ? (
              <figure
                className={`${styles.photo} ${styles.smartFloodPhoto}`}
              >
                {project.preview && <Image src={project.preview.src} alt={project.preview.alt} fill sizes="(max-width: 700px) 85vw, (max-width: 1000px) 42vw, 28vw" loading="lazy" className={styles.smartFloodImage} />}
              </figure>
            ) : (
              <ExperiencePhoto
                src={project.preview?.src}
                alt={project.preview?.alt ?? `${project.name} team or event photo`}
                sizes="(max-width: 700px) 85vw, (max-width: 1000px) 42vw, 28vw"
              />
            )}
            <div className={styles.projectMeta}><span className={styles.projectNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{project.year} / {project.category}</span></div>
            <p className={styles.recognition}>{project.recognition}</p><h3>{project.name}</h3>{project.subtitle && <p className={styles.projectSubtitle}>{project.subtitle}</p>}<p className={styles.description}>{project.description}</p>
            <EditorialTags items={project.tags} />
          </article>
        ))}</div>
      </section>

      <section className={`${styles.section} screen-panel`} aria-labelledby="internship-title" hidden={activeTab !== 2}>
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
