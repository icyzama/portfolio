export const profile = {
  name: "Reynald Quijano",
  email: "quijanorrq@gmail.com",
  github: "https://github.com/icyzama",
  linkedin: "https://linkedin.com/in/reynaldquijano",
  homeBio:
    "Fourth-year IT student passionate about cloud, data, and software engineering. I build scalable solutions, design with purpose, and turn ideas into impactful technology.",
  bio: "I’m a fourth-year IT student at National University – Manila passionate about cloud computing, data, and software engineering. I enjoy turning ideas into scalable, user-focused applications and bringing together design and engineering to build technology that makes an impact.",
  bioMore:
    "Outside of class, you’ll find me leading student organizations, working on innovative projects, or exploring cloud and full-stack development. I’m always looking for opportunities to learn, collaborate, and build meaningful solutions.",
  resume: null as string | null,
};

export const navigation = [
  {
    label: "About",
    href: "/about",
    description: "About Me + Tech Stack",
    color: "yellow",
  },
  {
    label: "Experiences",
    href: "/experiences",
    description: "Orgs + Hackathons",
    color: "orange",
  },
  {
    label: "Projects",
    href: "/projects",
    description: "Work & Side Projects",
    color: "blue",
  },
  { label: "Blog", href: "/blog", description: "Coming Soon", color: "orange" },
  {
    label: "Services",
    href: "/services",
    description: "Web Development",
    color: "ink",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Let’s build something",
    color: "ink",
  },
] as const;

export type ProjectCategory =
  "Hackathon" | "Research" | "Side Project" | "Personal";
export type Project = {
  slug: string;
  name: string;
  description: string;
  recognition: string;
  tags: string[];
  year: string;
  category: ProjectCategory;
  tone: string;
  icon?: string;
  liveUrl?: string;
  sourceUrl?: string;
};

// Sample entries copied from the original Figma design; replace before publishing.
export const projects: Project[] = [
  {
    slug: "adaptlearn",
    name: "AdaptLearn",
    recognition: "Best AI Hack · HackMIT",
    description:
      "Adaptive learning platform that generates personalised quiz paths using LLM embeddings and spaced repetition.",
    tags: ["Python", "OpenAI", "React", "FastAPI"],
    year: "2024",
    category: "Hackathon",
    tone: "yellow",
    icon: "/figma/projects-icontrophy.svg",
  },
  {
    slug: "signsync",
    name: "SignSync",
    recognition: "Top 10 · TreeHacks Stanford",
    description:
      "Real-time ASL interpreter using a custom transformer model and MediaPipe for hand landmark detection.",
    tags: ["PyTorch", "OpenCV", "React"],
    year: "2024",
    category: "Research",
    tone: "cream",
    icon: "/figma/projects-iconmedal.svg",
  },
  {
    slug: "flashdeck",
    name: "FlashDeck",
    recognition: "1st Place · MLH",
    description:
      "Chrome extension that turns lecture PDFs into spaced-repetition flashcard decks in one click.",
    tags: ["TypeScript", "Chrome API", "PDF.js"],
    year: "2023",
    category: "Side Project",
    tone: "blue",
    icon: "/figma/projects-iconmedal1.svg",
  },
  {
    slug: "campuscarbon",
    name: "CampusCarbon",
    recognition: "Participant · HackHarvard",
    description:
      "Carbon footprint tracker for university campuses with live dashboards and department comparisons.",
    tags: ["React", "Node.js", "MongoDB", "Chart.js"],
    year: "2023",
    category: "Hackathon",
    tone: "orange",
  },
  {
    slug: "portfolioos",
    name: "PortfolioOS",
    recognition: "WIP",
    description:
      "This portfolio — a brutalist multi-page site built with React, Vite, and Tailwind CSS v4.",
    tags: ["React", "TypeScript", "Tailwind v4"],
    year: "2024",
    category: "Personal",
    tone: "cream",
  },
];

export const organizations = [
  {
    name: "AWS Student User Group Philippines",
    shortName: "AWS Student User Group PH",
    role: "Director for Marketing",
    period: "2025 – Present",
    description:
      "Lead technical workshops and grow a 200+ member community of computing students on campus.",
    tags: ["Leadership", "Events", "Tech", "Marketing"],
  },
  {
    name: "AWS Learning Club – Legarda",
    shortName: "AWS Learning Club – Legarda",
    role: "Chief Executive Officer and Lead",
    period: "[Dates]",
    description: "[Add your responsibilities and contributions.]",
    tags: ["Leadership", "Cloud"],
  },
  {
    name: "AWS Learning Club – Legarda",
    shortName: "AWS Learning Club – Legarda",
    role: "Cloud Computing and Infrastructure Officer",
    period: "[Dates]",
    description: "[Add your responsibilities and contributions.]",
    tags: ["Cloud", "Infrastructure"],
  },
  {
    name: "NU Wizards’ Circle",
    shortName: "NU Wizards’ Circle",
    role: "Communications Director",
    period: "[Dates]",
    description: "[Add your responsibilities and contributions.]",
    tags: ["Communications"],
  },
  {
    name: "NU CCIT Student Council",
    shortName: "NU CCIT Student Council",
    role: "Director Auditor for Bookkeeping and Budgeting",
    period: "[Dates]",
    description: "[Add your responsibilities and contributions.]",
    tags: ["Leadership"],
  },
  {
    name: "Google Developers on Campus – NU Manila",
    shortName: "Google Developers on Campus – NU Manila",
    role: "Creatives",
    period: "[Dates]",
    description: "[Add your responsibilities and contributions.]",
    tags: ["Creatives"],
  },
];

export const services = [
  {
    name: "Freelance Development",
    description:
      "Full-stack web apps built with React, TypeScript, and Node.js. From landing pages to SaaS MVPs.",
    tags: ["React", "TypeScript", "Node.js", "Tailwind"],
  },
  {
    name: "Business Websites",
    description:
      "Responsive websites for small businesses, personal brands, and portfolios.",
    tags: ["Responsive", "Multi-page", "Portfolio"],
  },
  {
    name: "Custom Web Applications",
    description:
      "Custom interfaces, dashboards, and API integrations shaped around your workflow.",
    tags: ["Interfaces", "APIs", "Dashboards"],
  },
];

export const upcomingPosts = [
  { category: "Life", title: "[Project lessons and hackathon notes]" },
  { category: "Dev", title: "[Development notes and open-source stories]" },
  { category: "Leadership", title: "[Community and leadership reflections]" },
  { category: "Dev", title: "[Tools, techniques, and things I’m learning]" },
];
