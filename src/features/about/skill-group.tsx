"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./about-skills.module.css";

type Skill = { label: string; logo: string; description: string };

export function SkillGroup({ group, index }: {
  group: { label: string; skills: Skill[] };
  index: number;
}) {
  const [active, setActive] = useState<Skill | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupId = `skill-details-${index}`;

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function open(skill: Skill, trigger: HTMLButtonElement) {
    cancelClose();
    triggerRef.current = trigger;
    setActive(skill);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (document.activeElement === triggerRef.current || popupRef.current?.contains(document.activeElement)) return;
      setActive(null);
    }, 180);
  }

  useLayoutEffect(() => {
    const popup = popupRef.current;
    const trigger = triggerRef.current;
    if (!active || !popup || !trigger) return;
    popup.showPopover();
    const anchor = trigger.getBoundingClientRect();
    const bounds = popup.getBoundingClientRect();
    const left = Math.max(16, Math.min(anchor.left, window.innerWidth - bounds.width - 16));
    const below = anchor.bottom + 10;
    const top = below + bounds.height <= window.innerHeight - 16
      ? below
      : Math.max(16, anchor.top - bounds.height - 10);
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const close = () => setActive(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [active]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <section className={styles.group} aria-labelledby={`skill-group-${index}`}>
      <div className={styles.groupHeader}>
        <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <h3 id={`skill-group-${index}`}>{group.label}</h3>
      </div>
      <ul className={styles.skills}>
        {group.skills.map((skill) => (
          <li key={skill.label}>
            <button
              type="button"
              className={styles.skill}
              data-active={active?.label === skill.label}
              aria-haspopup="dialog"
              aria-expanded={active?.label === skill.label}
              aria-controls={active?.label === skill.label ? popupId : undefined}
              onMouseEnter={(event) => open(skill, event.currentTarget)}
              onMouseLeave={scheduleClose}
              onFocus={(event) => open(skill, event.currentTarget)}
              onBlur={scheduleClose}
              onClick={(event) => open(skill, event.currentTarget)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  cancelClose();
                  setActive(null);
                }
              }}
            >
              <Image src={`/skills/${skill.logo}.svg`} width={32} height={32} alt="" />
              <span>{skill.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {active && (
        <div
          ref={popupRef}
          id={popupId}
          className={styles.popup}
          popover="auto"
          role="dialog"
          aria-labelledby={`${popupId}-title`}
          aria-describedby={`${popupId}-description`}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onFocusCapture={cancelClose}
          onBlurCapture={scheduleClose}
          onToggle={(event) => {
            if (event.newState === "closed") setActive(null);
          }}
        >
          <div className={styles.popupHeader}>
            <Image src={`/skills/${active.logo}.svg`} width={36} height={36} alt="" />
            <div>
              <p className={styles.popupLabel}>{group.label}</p>
              <h4 id={`${popupId}-title`}>{active.label}</h4>
            </div>
            <button type="button" className={styles.close} aria-label="Close skill details" onClick={() => { cancelClose(); setActive(null); }}>×</button>
          </div>
          <p id={`${popupId}-description`}>{active.description}</p>
        </div>
      )}
    </section>
  );
}
