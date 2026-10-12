import Image from "next/image";
import { ActionLink, PageHero } from "@/components/ui/design";
import { profile } from "@/content/portfolio";

const skillGroups = [
  {
    label: "Frontend & Design",
    skills: [
      { label: "React.js", logo: "react" },
      { label: "HTML5", logo: "html5" },
      { label: "CSS3", logo: "css" },
      { label: "Tailwind CSS", logo: "tailwindcss" },
      { label: "Figma", logo: "figma" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { label: "Node.js", logo: "nodedotjs" },
      { label: "Express.js", logo: "express" },
    ],
  },
  {
    label: "Databases",
    skills: [
      { label: "MongoDB Atlas", logo: "mongodb" },
      { label: "MySQL", logo: "mysql" },
      { label: "Supabase", logo: "supabase" },
    ],
  },
  {
    label: "Cloud",
    skills: [
      { label: "Amazon EC2", logo: "amazonaws" },
      { label: "Amazon S3", logo: "amazonaws" },
      { label: "Amazon DynamoDB", logo: "amazonaws" },
    ],
  },
  {
    label: "Languages",
    skills: [
      { label: "JavaScript", logo: "javascript" },
      { label: "TypeScript", logo: "typescript" },
      { label: "Dart", logo: "dart" },
      { label: "Python", logo: "python" },
    ],
  },
  {
    label: "Tools",
    skills: [
      { label: "Git", logo: "git" },
      { label: "GitHub", logo: "github" },
      { label: "Adobe Photoshop", logo: "adobephotoshop" },
      { label: "Canva", logo: "canva" },
      { label: "CapCut", logo: "capcut" },
    ],
  },
];
export function AboutPage() {
  return (
    <>
      <div className="about-deck">
      <div id="about-me" className="about-opening about-panel">
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
      </div>
      <section id="about-bio" className="about-bio about-panel">
        <div className="about-copy">
          <h2>HEY, I&apos;M REYNALD!</h2>
          <p>{profile.bio}</p>
          <p>{profile.bioMore}</p>
          <div className="about-pillars" aria-label="How I contribute">
            <article>
              <span>01 / BUILD</span>
              <strong>Full stack development</strong>
              <p>Building responsive web and mobile applications, from interfaces to data-backed features.</p>
            </article>
            <article>
              <span>02 / DESIGN</span>
              <strong>Thoughtful experiences</strong>
              <p>Shaping clear UI/UX flows and delivering polished work across the application.</p>
            </article>
            <article>
              <span>03 / LEAD</span>
              <strong>Teams that learn</strong>
              <p>Coordinating projects and creating opportunities for students to learn cloud technology.</p>
            </article>
          </div>
          <div className="about-focus">
            <p className="eyebrow">WHAT I FOCUS ON</p>
            <ul>
              <li>UI/UX Design</li>
              <li>Full Stack Development</li>
              <li>Cloud Computing</li>
            </ul>
          </div>
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
            <a
              className="action action-plain"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              Connect with Me
            </a>
          </div>
        </div>
        <div className="portrait-panel">
          <p className="portrait-location">NU MANILA · MANILA, PH</p>
          <div className="portrait-frame"><div className="portrait-crop"><Image
            src="/figma/about-img74051.png"
            width={199}
            height={259}
            alt="Reynald Quijano"
            className="portrait"
            priority
          /></div></div>
          <div className="portrait-role">
            <span aria-hidden="true" />
            <div>
              <small>CURRENT ROLE</small>
              <strong>FULL STACK DEVELOPER INTERN</strong>
            </div>
          </div>
        </div>
      </section>
      <section id="tech-stack" className="tech-stack about-panel">
        <h2>
          <span />
          TECHNICAL SKILLS
        </h2>
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <section className="skill-group" key={group.label}>
              <h3>{group.label}</h3>
              <ul className="tags">
                {group.skills.map((skill) => (
                  <li className="skill-item" key={skill.label}>
                    <img src={`/skills/${skill.logo}.svg`} width={24} height={24} alt={`${skill.label} logo`} />
                    <span>{skill.label}</span>
                  </li>
                ))}
              </ul>
            </section>
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
      </div>
    </>
  );
}
