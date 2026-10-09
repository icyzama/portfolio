"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Asset, PageHero, Tags } from "@/components/ui/design";
import { organizations, projects } from "@/content/portfolio";

const tabs = ["Student Orgs", "Projects & Hackathons", "Internships"];
export function ExperiencesPage() {
  const query = useSearchParams().get("tab");
  const router = useRouter();
  const tab = query === "hackathons" ? 1 : query === "internships" ? 2 : 0;
  function selectTab(index: number) {
    router.replace(
      `/experiences?tab=${["orgs", "hackathons", "internships"][index]}`,
      { scroll: false },
    );
  }
  const [selected, setSelected] = useState(0);
  const org = organizations[selected];
  function move(direction: number) {
    setSelected(
      (selected + direction + organizations.length) % organizations.length,
    );
  }
  return (
    <>
      <PageHero
        label="02 / Experiences"
        title={
          <>
            STUDENT
            <br />
            ORGS &<br />
            HACKATHONS.
          </>
        }
        accent="yellow"
        className="experiences-hero"
      />
      <div
        className="filter-bar"
        role="tablist"
        aria-label="Experience categories"
      >
        {tabs.map((name, index) => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === index}
            aria-controls="experience-panel"
            id={`experience-tab-${index}`}
            tabIndex={tab === index ? 0 : -1}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (index + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : null;
              if (next !== null) {
                event.preventDefault();
                selectTab(next);
                document.getElementById(`experience-tab-${next}`)?.focus();
              }
            }}
            onClick={() => selectTab(index)}
          >
            {name}
          </button>
        ))}
      </div>
      <section
        id="experience-panel"
        role="tabpanel"
        aria-labelledby={`experience-tab-${tab}`}
      >
        {tab === 0 ? (
          <div className="experience-grid">
            <div className="experience-feature">
              <div className="feature-heading">
                <h2>FEATURED ORG</h2>
                <div className="carousel-controls">
                  <button
                    onClick={() => move(-1)}
                    aria-label="Previous organization"
                  >
                    <Asset src="/figma/experiences-icon.svg" width={12} />
                  </button>
                  <button
                    onClick={() => move(1)}
                    aria-label="Next organization"
                  >
                    <Asset src="/figma/experiences-icon1.svg" width={12} />
                  </button>
                </div>
              </div>
              <article className="organization-card">
                <div className="organization-photo organization-mark" aria-hidden="true">
                  AWS
                </div>
                <div className="organization-copy" aria-live="polite">
                  <h3>{org.name}</h3>
                  <p className="role">
                    {org.role}{org.period ? ` · ${org.period}` : ""}
                  </p>
                  <p>{org.description}</p>
                  {"highlights" in org && org.highlights && (
                    <ul className="org-highlights">
                      {org.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  <Tags items={org.tags} />
                </div>
              </article>
              <div
                className="carousel-dots"
                aria-label="Select an organization"
              >
                {organizations.map((item, index) => (
                  <button
                    key={`${item.name}-${index}`}
                    onClick={() => setSelected(index)}
                    aria-label={`${item.name}, ${item.role}`}
                    aria-pressed={selected === index}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>
            <aside className="organization-list" aria-label="All organizations">
              <h2>ALL ORGANISATIONS</h2>
              {organizations.map((item, index) => (
                <button
                  key={`${item.name}-${index}`}
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  <strong>{item.shortName}</strong>
                  <small>{item.role}</small>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </aside>
          </div>
        ) : tab === 1 ? (
          <div className="experience-placeholder">
            <p className="eyebrow">University and Hackathon Projects</p>
            {projects
              .filter((project) => project.category === "Hackathon")
              .map((project) => (
                <article className="experience-project" key={project.slug}>
                  <p className="recognition">{project.recognition}</p>
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>
                </article>
              ))}
          </div>
        ) : (
          <div className="experience-placeholder">
            <p className="eyebrow">Professional Experience</p>
            <h2>NEXVISION INNOVATIONS INC.</h2>
            <p className="role">FULL STACK DEVELOPER INTERN · SEPTEMBER 2026 - PRESENT</p>
            <ul>
              <li>Develop and maintain CRM features using PostgreSQL, Express.js, React, Node.js, and TypeScript.</li>
              <li>Work with APIs, databases, and application logic to support reliable data flow.</li>
              <li>Collaborate with the development team to debug, test, and improve application components.</li>
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
