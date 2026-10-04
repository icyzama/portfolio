"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Asset, PageHero, Tags } from "@/components/ui/design";
import { organizations } from "@/content/portfolio";

const tabs = ["Student Orgs", "Hackathons & Comps", "Internships"];
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
                <div className="organization-photo">
                  <Asset
                    src="/figma/experiences-imageacmstudentchapter.png"
                    width={800}
                    height={220}
                    alt="Student organization event from the original design"
                  />
                </div>
                <div className="organization-copy" aria-live="polite">
                  <h3>{org.name}</h3>
                  <p className="role">
                    {org.role} · {org.period}
                  </p>
                  <p>{org.description}</p>
                  <Tags items={org.tags} />
                </div>
              </article>
              <div
                className="carousel-dots"
                aria-label="Select an organization"
              >
                {organizations.slice(0, 3).map((item, index) => (
                  <button
                    key={`${item.name}-${index}`}
                    onClick={() => setSelected(index)}
                    aria-label={`${item.name}, ${item.role}`}
                    aria-pressed={selected % 3 === index}
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
        ) : (
          <div className="experience-placeholder">
            <p className="eyebrow">Details to be added</p>
            <h2>{tabs[tab].toUpperCase()}</h2>
            <p>
              {tab === 1
                ? "[Add your competition name, date, role, project, and result.]"
                : "[Add your company, internship dates, role, and contributions.]"}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
