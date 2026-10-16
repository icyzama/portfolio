import { EditorialHero, EditorialTags, EditorialLink } from "@/components/ui/editorial";
import { services } from "@/content/portfolio";
import styles from "@/components/ui/editorial.module.css";
import { pageLabels } from "@/components/ui/page-label";
import pageStyles from "@/components/ui/page-system.module.css";

export function ServicesPage() {
  return (
    <div className={pageStyles.surface}>
      <section className={`${pageStyles.titlePanel} screen-panel`} aria-label="Services introduction">
        <EditorialHero label={pageLabels.services} title="LET’S BUILD" highlight="YOUR IDEA." description="Responsive websites and full-stack applications, with thoughtful interfaces and practical functionality." topics={["WEB DEVELOPMENT", "INTERFACES", "INTEGRATIONS"]} className={styles.openingHero} />
      </section>
      <div className={styles.serviceStrip}><p><span aria-hidden="true" />FREELANCE WEB DEVELOPMENT — LET’S DISCUSS YOUR PROJECT</p><EditorialLink href="/contact" primary>CONTACT ME ↗</EditorialLink></div>
      <section className={styles.section} aria-labelledby="services-title">
        <div className={styles.sectionHeading}><h2 id="services-title">HOW I CAN HELP</h2><span>DESIGN / DEVELOPMENT</span></div>
        <div className={styles.grid}>
          {services.map((service, index) => <article className={styles.card} key={service.name}><div className={styles.meta}><span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>WEB DEVELOPMENT</span></div><h3>{service.name}</h3><p className={styles.description}>{service.description}</p><EditorialTags items={service.tags} /><div className={styles.cardFooter}><EditorialLink href="/contact">LET’S DISCUSS ↗</EditorialLink></div></article>)}
        </div>
      </section>
      <section className={styles.cta}><div><h2>FROM IDEA TO INTERFACE.</h2><p>Tell me what you want to build. We’ll discuss the scope and what your project needs.</p></div><EditorialLink href="/contact" primary>GET IN TOUCH ↗</EditorialLink></section>
    </div>
  );
}
