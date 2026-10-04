import Link from "next/link";
import { ActionLink, Asset, Tags } from "@/components/ui/design";
import { navigation, profile } from "@/content/portfolio";

const updates = [
  { icon: "icontrophy", text: "Best AI Hack · HackMIT 2024" },
  { icon: "iconusers", text: "VP · ACM Chapter" },
  { icon: "iconflask", text: "Research Assistant · ML Lab" },
  { icon: "iconbriefcase", text: "Open to Internships · Summer 2026" },
];

export function HomePage() {
  return (
    <>
      <section className="home-masthead">
        <p className="eyebrow">Wednesday, August 26, 2026</p>
        <h1>{profile.name}</h1>
        <p className="availability">
          <span />
          Open to work
        </p>
      </section>
      <div className="edition-strip">
        <span>Dev Portfolio</span>
        <span aria-hidden="true">·</span>
        <span>Vol. 3</span>
        <span aria-hidden="true">·</span>
        <span>Est. 2026</span>
        <span aria-hidden="true">·</span>
        <span>Seeking Internship 2026</span>
      </div>
      <div className="home-grid">
        <section className="home-intro">
          <p className="eyebrow">Information Technology Student</p>
          <h2>
            TURNING
            <br />
            CONCEPTS
            <br />
            INTO
            <br />
            SOLUTIONS
          </h2>
          <p className="intro-caption">
            <span />
            Hackathons · Orgs · Code
          </p>
          <Tags
            items={[
              "React",
              "TypeScript",
              "Python",
              "Node.js",
              "ML / AI",
              "Open Source",
            ]}
          />
        </section>
        <nav className="home-navigation" aria-label="Explore the portfolio">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className={`nav-dot tone-${item.color}`} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <span className="home-nav-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </nav>
        <section className="home-about">
          <h2>WHO AM I?</h2>
          <p>{profile.homeBio}</p>
          <ActionLink href="/about">
            READ MORE →
          </ActionLink>
        </section>
        <section className="home-stats" aria-label="At a glance">
          {[
            ["3+", "Hackathons won"],
            ["200+", "Org members led"],
            ["6", "Tech skills"],
          ].map(([number, label]) => (
            <div key={label}>
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>
        <section className="home-cta">
          <h2>
            LET&apos;S
            <br />
            WORK
            <br />
            TOGETHER.
          </h2>
          <ActionLink href="/contact" tone="yellow">
            GET IN TOUCH →
          </ActionLink>
          <span className="accent-square" aria-hidden="true" />
        </section>
      </div>
      <section className="latest-strip" aria-label="Latest updates">
        <h2>LATEST</h2>
        <div className="latest-items">
          {[...updates, ...updates, ...updates].map((item, index) => (
            <span key={`${item.text}-${index}`} aria-hidden={index >= updates.length}>
              <Asset src={`/figma/home-${item.icon}.svg`} width={14} />
              {item.text}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
