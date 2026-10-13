import Image from "next/image";
import { ActionLink, PageHero } from "@/components/ui/design";
import { profile } from "@/content/portfolio";
import styles from "./about-bio.module.css";
import skillsStyles from "./about-skills.module.css";
import { SkillGroup } from "./skill-group";

const skillGroups = [
  {
    label: "Frontend & Design",
    skills: [
      { label: "React.js", logo: "react", description: "Build interactive interfaces with reusable components." },
      { label: "HTML5", logo: "html5", description: "Structure web pages with semantic, accessible markup." },
      { label: "CSS3", logo: "css", description: "Style responsive layouts, typography, and animations." },
      { label: "SCSS", logo: "sass", description: "Organize styles with variables, nesting, and reusable mixins." },
      { label: "Tailwind CSS", logo: "tailwindcss", description: "Create responsive interfaces with utility classes." },
      { label: "Figma", logo: "figma", description: "Design interfaces and prototype user flows." },
    ],
  },
  {
    label: "Backend",
    skills: [
      { label: "Node.js", logo: "nodedotjs", description: "Run JavaScript on the server for backend applications." },
      { label: "Express.js", logo: "express", description: "Build web APIs with routing and middleware." },
    ],
  },
  {
    label: "Databases",
    skills: [
      { label: "MongoDB Atlas", logo: "mongodb", description: "Manage document databases through a cloud platform." },
      { label: "MySQL", logo: "mysql", description: "Store and query structured data with SQL." },
      { label: "Supabase", logo: "supabase", description: "Build with PostgreSQL, authentication, and storage services." },
    ],
  },
  {
    label: "Cloud",
    skills: [
      { label: "Amazon EC2", logo: "amazon-ec2", description: "Run applications on configurable cloud servers." },
      { label: "Amazon S3", logo: "amazon-s3", description: "Store files and assets in cloud object storage." },
      { label: "Amazon DynamoDB", logo: "amazon-dynamodb", description: "Store key-value and document data in a managed database." },
    ],
  },
  {
    label: "Languages",
    skills: [
      { label: "JavaScript", logo: "javascript", description: "Add application logic and interactive web behavior." },
      { label: "TypeScript", logo: "typescript", description: "Add static types to JavaScript for clearer, safer code." },
      { label: "Dart", logo: "dart", description: "Write application logic for mobile and web interfaces." },
      { label: "Python", logo: "python", description: "Write scripts for automation and data processing." },
    ],
  },
  {
    label: "Tools",
    skills: [
      { label: "Git", logo: "git", description: "Track code changes and manage development branches." },
      { label: "GitHub", logo: "github", description: "Host repositories and collaborate through pull requests." },
      { label: "Adobe Photoshop", logo: "adobephotoshop", description: "Edit images and create visual assets." },
      { label: "Canva", logo: "canva", description: "Create graphics, presentations, and visual content." },
      { label: "CapCut", logo: "capcut", description: "Edit videos with captions, transitions, and effects." },
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
      <section id="about-bio" className={`${styles.bio} about-panel`} aria-labelledby="bio-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>02 / THE PERSON BEHIND THE CODE</p>
          <h2 id="bio-title" className={styles.heading}>HEY, I&apos;M<br /><span>REYNALD.</span></h2>
          <p className={styles.lead}>Building reliable applications.<br />Exploring cloud and data.</p>
          <div className={styles.story}>
            <p>I’m Reynald, a fourth-year BS Information Technology student at National University – Manila, specializing in Mobile and Web Applications. An aspiring cloud and data engineer, I enjoy building responsive, database-driven applications with the PERN stack and TypeScript.</p>
            <p>Currently a Full Stack Developer Intern at NexVision Innovations, I contribute to frontend development, UI/UX, quality assurance, and project coordination. Beyond the code, I help organize AWS learning initiatives and bring student technology communities together.</p>
          </div>
          <div className={styles.focus}>
            <p className={styles.eyebrow}>WHERE I FOCUS</p>
            <ul><li>Full Stack Development</li><li>UI/UX Design</li><li>Cloud Computing</li></ul>
          </div>
          <div className={styles.actions}>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect with Me
            </a>
          </div>
        </div>
        <figure className={styles.portraitPanel}>
          <div className={styles.portraitMeta}><span>MANILA, PHILIPPINES</span><span aria-hidden="true">↗</span></div>
          <div className={styles.portraitFrame}><Image
            src="/figma/about-img74051.png"
            width={1279}
            height={1919}
            sizes="(max-width: 700px) 300px, (max-width: 1100px) 32vw, 360px"
            alt="Reynald Quijano"
            className={styles.portrait}
            preload
          /></div>
          <figcaption className={styles.role}><span className={styles.eyebrow}>CURRENTLY AT NEXVISION</span><strong>Full Stack Developer Intern</strong></figcaption>
          <p className={styles.graduation}>EXPECTED GRADUATION / SEPTEMBER 2027</p>
        </figure>
        <div className={styles.expertise} aria-label="How I contribute">
          {[
            ["01", "BUILD", "Full Stack Development", "Responsive interfaces, APIs, and databases that work together."],
            ["02", "DESIGN", "UI/UX & Product Design", "Clear flows and thoughtful interfaces shaped around the people using them."],
            ["03", "LEAD", "Community & Technology", "Creating opportunities for students to learn cloud technology and build together."],
          ].map(([number, label, title, description]) => (
            <article key={number} className={styles.expertiseItem}>
              <div className={styles.expertiseMeta}><span>{number}</span><p className={styles.eyebrow}>{label}</p></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="tech-stack" className={`${skillsStyles.stack} about-panel`} aria-labelledby="skills-title">
        <header className={skillsStyles.header}>
          <div>
            <p className={skillsStyles.eyebrow}>03 / MY TOOLKIT</p>
            <h2 id="skills-title">TECHNICAL <span>SKILLS.</span></h2>
          </div>
          <p className={skillsStyles.intro}>From interfaces and APIs to databases and cloud infrastructure.</p>
        </header>
        <div className={skillsStyles.groups}>
          {skillGroups.map((group, index) => (
            <SkillGroup key={group.label} group={group} index={index} />
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
