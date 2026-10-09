import Link from "next/link";
import { ActionLink, Asset, Tags } from "@/components/ui/design";
import { navigation, profile } from "@/content/portfolio";

const updates = [
  { icon: "iconbriefcase", text: "Full Stack Developer Intern - NexVision Innovations" },
  { icon: "iconusers", text: "CEO & Lead - AWS Learning Club, Legarda" },
  { icon: "icontrophy", text: "Best Website - DALO" },
  { icon: "iconflask", text: "Director for Marketing - AWS Student User Group PH" },
];

export function HomePage() {
  return (
    <>
      <section className="home-masthead">
        <p className="eyebrow">October 2026 - Manila, Philippines</p>
        <h1>{profile.name}</h1>
        <p className="home-brand-note">
          <span className="home-brand-dot" aria-hidden="true" />
          <span className="home-brand-copy">
            <strong>FULL STACK DEVELOPER</strong>
            <small>CLOUD + COMMUNITY LEADERSHIP</small>
          </span>
        </p>
      </section>
      <div className="edition-strip">
        <span>Dev Portfolio</span>
        <span aria-hidden="true">·</span>
        <span>Vol. 3</span>
        <span aria-hidden="true">·</span>
        <span>Est. 2026</span>
        <span aria-hidden="true">·</span>
        <span>Full Stack Developer</span>
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
            Cloud · Web · Leadership
          </p>
          <Tags
            items={["React.js", "TypeScript", "Node.js", "PostgreSQL", "Python", "AWS"]}
          />
        </section>
        <nav className="home-navigation" aria-label="Explore the portfolio">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} data-tone={item.color}>
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
            LEARN MORE →
          </ActionLink>
        </section>
        <section className="home-stats" aria-label="At a glance">
          {[
            ["200+", "Community members"],
            ["5+", "Workshops organized"],
            ["80+", "Workshop participants"],
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
        <div className="latest-viewport">
          <div className="latest-items">
            {[0, 1].map((copy) => (
              <div className="latest-group" key={copy} aria-hidden={copy === 1}>
                {updates.map((item) => (
                  <span key={item.text}>
                    <Asset src={`/figma/home-${item.icon}.svg`} width={14} />
                    {item.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
