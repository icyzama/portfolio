import { ActionLink, PageHero, Tags } from "@/components/ui/design";
import { services } from "@/content/portfolio";

export function ServicesPage() {
  return (
    <>
      <PageHero
        label="03 / Services"
        title={
          <>
            WEB
            <br />
            DEVELOPMENT.
          </>
        }
        accent="blue"
        square
        className="services-hero"
      />
      <div className="service-strip">
        <p>
          <span />
          FREELANCE WEB DEVELOPMENT — LET’S DISCUSS YOUR PROJECT
        </p>
        <ActionLink href="/contact" tone="yellow">
          CONTACT ME →
        </ActionLink>
      </div>
      <div>
        {services.map((service, index) => (
          <article className="service-row" key={service.name}>
            <span className="row-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <Tags items={service.tags} />
            </div>
            <div className="service-status">
              <span>LET’S DISCUSS</span>
              <ActionLink href="/contact">CONTACT ME</ActionLink>
            </div>
          </article>
        ))}
      </div>
      <section className="services-bottom tone-blue">
        <h2>
          LET’S BUILD
          <br />
          YOUR IDEA.
        </h2>
        <ActionLink href="/contact" tone="yellow">
          GET IN TOUCH →
        </ActionLink>
      </section>
    </>
  );
}
