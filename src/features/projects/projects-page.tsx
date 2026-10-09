"use client";

import { useRef, useState } from "react";
import { ActionLink, Asset, PageHero, Tags } from "@/components/ui/design";
import { projects, type Project } from "@/content/portfolio";

const categories = ["All", "Hackathon", "University Project"];
export function ProjectsPage() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible =
    category === "All"
      ? projects
      : projects.filter((project) => project.category === category);
  function show(project: Project) {
    setSelected(project);
    dialog.current?.showModal();
  }
  return (
    <>
      <PageHero
        label="✦ Projects"
        title={
          <>
            SELECTED
            <br />
            WORK.
          </>
        }
        className="projects-hero"
        accent="yellow"
        count="3 Projects"
      />
      <div className="filter-bar" aria-label="Filter projects">
        {categories.map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
        <span className="filter-status">{visible.length} RESULTS</span>
      </div>
      <div className="project-list" aria-live="polite">
        {visible.map((project) => (
          <article
            className={`project-row tone-${project.tone}`}
            key={project.slug}
          >
            <div className="row-number">
              {String(projects.indexOf(project) + 1).padStart(2, "0")}
            </div>
            <div className="project-copy">
              <div className="project-title">
                <h2>{project.name}</h2>
                {project.slug === "portfolioos" && <span className="recognition">{project.recognition}</span>}
              </div>
              {project.slug !== "portfolioos" && <p className="recognition">
                {project.icon && <Asset src={project.icon} width={14} />}
                {project.recognition}
              </p>}
              <p>{project.description}</p>
              <Tags items={project.tags} />
            </div>
            <div className="project-meta">
              <div>
                <span>YEAR</span>
                <strong>{project.year}</strong>
              </div>
              <div>
                <span>TYPE</span>
                <strong>{project.category}</strong>
              </div>
              <button className="action" onClick={() => show(project)}>
                VIEW PROJECT <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="project-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        aria-labelledby="project-dialog-title"
      >
        <button
          className="dialog-close action"
          aria-label="Close project details"
          onClick={() => dialog.current?.close()}
        >
          CLOSE ×
        </button>
        {selected && (
          <>
            <p className="eyebrow">Sample project / {selected.category}</p>
            <h2 id="project-dialog-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <Tags items={selected.tags} />
            <p className="sample-note">
              Sample content from the portfolio design. Project links and full
              details will be added later.
            </p>
            <ActionLink href="/contact" tone="yellow">
              LET’S TALK →
            </ActionLink>
          </>
        )}
      </dialog>
    </>
  );
}
