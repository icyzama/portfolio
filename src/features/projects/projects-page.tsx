"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Asset } from "@/components/ui/design";
import { EditorialHero, EditorialTags, EditorialLink } from "@/components/ui/editorial";
import { projects, type Project } from "@/content/portfolio";
import styles from "@/components/ui/editorial.module.css";
import { pageLabels } from "@/components/ui/page-label";
import pageStyles from "@/components/ui/page-system.module.css";

const categories = ["All", "Hackathon", "University Project"];
export function ProjectsPage() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = category === "All" ? projects : projects.filter((project) => project.category === category);
  function show(project: Project) {
    setSelected(project);
    dialog.current?.showModal();
  }
  return (
    <div className={pageStyles.surface}>
      <section className={`${pageStyles.titlePanel} screen-panel`} aria-label="Projects introduction">
        <EditorialHero label={pageLabels.projects} title="SELECTED" highlight="WORK." description="Interfaces, applications, and ideas built through university projects and hackathons." topics={["FULL STACK", "UI/UX", "TEAMWORK"]} className={styles.openingHero} />
      </section>
      <div className={styles.filters} role="group" aria-label="Filter projects">
        {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        <span className={styles.filterStatus} role="status">{visible.length} {visible.length === 1 ? "PROJECT" : "PROJECTS"}</span>
      </div>
      <section className={styles.section} aria-label="Selected projects">
        <div className={styles.grid}>
          {visible.map((project) => (
            <article className={styles.card} key={project.slug}>
              <div className={styles.meta}><span className={styles.number} aria-hidden="true">{String(projects.indexOf(project) + 1).padStart(2, "0")}</span><span>{project.year}<br />{project.category}</span></div>
              <p className={styles.recognition}>{project.icon && <Asset src={project.icon} width={14} />}{project.recognition}</p>
              <h2>{project.name}</h2>
              {project.subtitle && <p className={styles.fullTitle}>{project.subtitle}</p>}
              <p className={styles.description}>{project.description}</p>
              {project.preview && (
                <figure className={styles.projectPreview}>
                  <Image
                    src={project.preview.src}
                    alt=""
                    fill
                    sizes="1px"
                    aria-hidden="true"
                    className={styles.previewBackdrop}
                  />
                  <Image
                    src={project.preview.src}
                    alt={project.preview.alt}
                    sizes="(max-width: 700px) calc(100vw - 96px), (max-width: 1000px) 42vw, 28vw"
                    className={`${styles.previewImage} ${project.preview.zoom ? styles.previewZoom : ""} ${project.preview.cropTop ? styles.previewCropTop : ""}`}
                    fill
                  />
                </figure>
              )}
              <EditorialTags items={project.tags} />
              <div className={styles.cardFooter}><button type="button" className={pageStyles.button} onClick={() => show(project)} aria-haspopup="dialog">VIEW PROJECT <span aria-hidden="true">↗</span></button></div>
            </article>
          ))}
        </div>
        {visible.length === 0 && <p className={styles.empty}>No projects in this category yet.</p>}
      </section>
      <section className={styles.cta}><div><h2>LET’S BUILD SOMETHING.</h2><p>Have an idea or a project in mind? Let’s start a conversation.</p></div><EditorialLink href="/contact" primary>GET IN TOUCH ↗</EditorialLink></section>
      <dialog ref={dialog} className={styles.dialog} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-labelledby="project-dialog-title">
        <div className={styles.dialogHeader}><p className={styles.eyebrow}>PROJECT DETAILS</p><button type="button" className={pageStyles.button} onClick={() => dialog.current?.close()} aria-label="Close project details">CLOSE ×</button></div>
        {selected && (
          <>
            <p className={styles.recognition}>{selected.recognition}</p>
            <h2 id="project-dialog-title">{selected.fullTitle ?? selected.name}</h2>
            <p className={styles.eyebrow}>{selected.year} / {selected.category}</p>
            <p className={styles.description} style={{ marginTop: 18 }}>{selected.description}</p>
            <EditorialTags items={selected.tags} />
            {(selected.liveUrl || selected.sourceUrl) && (
              <div className={styles.dialogActions}>
                {selected.liveUrl && (
                  <a className={pageStyles.button} href={selected.liveUrl} target="_blank" rel="noreferrer">
                    LIVE PROJECT &#8599;
                  </a>
                )}
                {selected.sourceUrl && (
                  <a className={pageStyles.button} href={selected.sourceUrl} target="_blank" rel="noreferrer">
                    VIEW ON GITHUB &#8599;
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
