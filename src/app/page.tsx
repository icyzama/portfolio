export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-foreground px-6 py-5 sm:px-12">
        <a href="/" className="text-sm font-bold uppercase tracking-wide">&lt;/&gt; My Portfolio</a>
        <a href="mailto:quijanorrq@gmail.com" className="bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-foreground">Contact me <span aria-hidden="true">→</span></a>
      </header>
      <main>
        <section className="border-b-2 border-foreground px-6 py-8 sm:px-12">
          <p className="font-display text-2xl sm:text-4xl">REYNALD QUIJANO</p>
          <p className="mt-3 text-xs font-bold tracking-wide">FOURTH-YEAR IT STUDENT / OPEN TO OPPORTUNITIES</p>
        </section>
        <section className="grid lg:grid-cols-[2fr_1fr]">
          <div className="px-6 py-14 sm:px-12 sm:py-20">
            <p className="mb-6 text-xs font-bold tracking-widest">WEB DEVELOPMENT · CLOUD · SOFTWARE</p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.05] tracking-tight">TURNING<br />CONCEPTS<br />INTO<br />SOLUTIONS.</h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed">I’m Reynald, a fourth-year Information Technology student at National University – Manila. I build thoughtful websites and useful software.</p>
          </div>
          <aside className="flex flex-col justify-center border-t-2 border-foreground bg-accent px-6 py-12 sm:px-12 lg:border-t-0 lg:border-l-2">
            <h2 className="font-display text-3xl leading-tight">LET’S BUILD<br />SOMETHING<br />TOGETHER.</h2>
            <p className="mt-6 leading-relaxed">Have a website idea or an opportunity? Let’s discuss your goals.</p>
            <a href="mailto:quijanorrq@gmail.com" className="mt-8 border-2 border-foreground bg-background px-6 py-4 text-center text-sm font-bold hover:bg-foreground hover:text-background">GET IN TOUCH <span aria-hidden="true">→</span></a>
          </aside>
        </section>
      </main>
      <footer className="flex flex-wrap justify-between gap-4 bg-foreground px-6 py-6 text-sm text-background sm:px-12">
        <p>© {new Date().getFullYear()} Reynald Quijano</p>
        <div className="flex gap-6">
          <a href="https://github.com/icyzama" className="underline-offset-4 hover:underline">GitHub</a>
          <a href="https://linkedin.com/in/reynaldquijano" className="underline-offset-4 hover:underline">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
