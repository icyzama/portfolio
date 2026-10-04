import Image from "next/image";
import { ActionLink, Asset, PageHero } from "@/components/ui/design";
import { profile } from "@/content/portfolio";

const skills = [
  { label: "React", years: "3 yrs", icon: "/figma/about-iconreactatom.svg" },
  { label: "TypeScript", years: "2 yrs", text: "TS" },
  { label: "Python", years: "4 yrs", icon: "/figma/about-iconcode.svg" },
  { label: "Node.js", years: "2 yrs", text: "◈" },
  { label: "MongoDB", years: "1 yr", icon: "/figma/about-iconleaf.svg" },
  { label: "Git", years: "4 yrs", text: "⌥" },
];
export function AboutPage() {
  return (
    <>
      <PageHero
        label="01 / About"
        title={
          <>
            ABOUT
            <br />
            ME.
          </>
        }
        className="about-hero"
      />
      <section className="about-bio">
        <div className="about-copy">
          <h2>HEY, I&apos;M REYNALD!</h2>
          <p>{profile.bio}</p>
          <p>{profile.bioMore}</p>
          <div className="about-actions">
            {profile.resume ? (
              <ActionLink href={profile.resume} tone="yellow">
                DOWNLOAD RESUME ↓
              </ActionLink>
            ) : (
              <button
                className="action action-yellow"
                disabled
                title="Resume file will be added soon"
              >
                DOWNLOAD RESUME ↓
              </button>
            )}
            <ActionLink href="/contact">Connect with Me</ActionLink>
          </div>
        </div>
        <div className="portrait-panel">
          <div className="portrait-frame"><div className="portrait-crop"><Image
            src="/figma/about-img74051.png"
            width={199}
            height={259}
            alt="Reynald Quijano"
            className="portrait"
            priority
          /></div></div>
        </div>
      </section>
      <section id="tech-stack" className="tech-stack">
        <h2>
          <span />
          TECH STACK
        </h2>
        <div className="skill-grid">
          {skills.map((skill) => (
            <div key={skill.label}>
              {skill.icon ? (
                <Asset src={skill.icon} width={28} />
              ) : (
                <span className="skill-symbol" aria-hidden="true">
                  {skill.text}
                </span>
              )}
              <h3>{skill.label}</h3>
              <p>{skill.years}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="about-facts">
        {[
          ["Year", "SENIOR (4TH YR)"],
          ["Major", "INFORMATION TECH - MWA"],
          ["Status", "OPEN TO OFFERS"],
        ].map(([label, value], i) => (
          <section key={label}>
            <span className={`fact-rule fact-rule-${i}`} />
            <p className="eyebrow">{label}</p>
            <h2>{value}</h2>
          </section>
        ))}
      </div>
    </>
  );
}
