export const profile = {
  name: "Reynald Quijano",
  email: "quijanorrq@gmail.com",
  github: "https://github.com/icyzama",
  linkedin: "https://linkedin.com/in/reynaldquijano",
  homeBio:
    "Fourth-year Information Technology - Mobile and Web Applications student at National University - Manila, aspiring cloud and data engineer. I build responsive, database-driven applications with the PERN stack and TypeScript, and contribute to frontend development, quality assurance, UI/UX, and project coordination.",
  bio: "I am a fourth-year Information Technology - Mobile and Web Applications student at National University - Manila, specializing in Mobile and Web Applications. I have hands-on full-stack experience with PostgreSQL, Express.js, React, Node.js, and TypeScript, and I am interested in cloud computing, data, and building reliable software.",
  bioMore:
    "I currently work as a Full Stack Developer Intern at NexVision Innovations. Outside of work, I lead AWS student communities, help organize cloud workshops, and contribute to university projects. I expect to graduate in August 2027.",
  resume: null as string | null,
};

export const navigation = [
  {
    label: "About",
    href: "/about",
    description: "About Me + Technical Skills",
    color: "yellow",
  },
  {
    label: "Experiences",
    href: "/experiences",
    description: "Organizations + Hackathons",
    color: "orange",
  },
  {
    label: "Projects",
    href: "/projects",
    description: "Work & Side Projects",
    color: "blue",
  },
  { label: "Blog", href: "/blog", description: "Coming soon", color: "orange" },
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
  "Hackathon" | "Research" | "Side Project" | "Personal" | "University Project";
export type Project = {
  slug: string;
  name: string;
  fullTitle?: string;
  subtitle?: string;
  description: string;
  recognition: string;
  tags: string[];
  year: string;
  category: ProjectCategory;
  tone: string;
  icon?: string;
  liveUrl?: string;
  sourceUrl?: string;
  preview?: { src: string; alt: string; zoom?: boolean; cropTop?: boolean };
};

export const projects: Project[] = [
  {
    slug: "smartflood",
    name: "SmartFlood",
    fullTitle: "SmartFlood: AI-Optimized Relief Allocation with Near-Real-Time Flood Monitoring for Flood-Affected Communities",
    subtitle: "AI-Optimized Relief Allocation with Near-Real-Time Flood Monitoring for Flood-Affected Communities",
    liveUrl: "https://smart-flood-landing-page-hb6z.vercel.app",
    sourceUrl: "https://github.com/wendev27/SmartFlood-V4",
    preview: {
      src: "/projects/smartflood.png",
      alt: "SmartFlood landing page showing flood alerts and a solar-powered monitoring device",
      zoom: true,
    },
    recognition: "Capstone Project",
    description:
      "AI-optimized relief allocation and near-real-time flood monitoring for flood-affected communities. Led project planning, task coordination, documentation, frontend development, UI/UX prototyping, and quality assurance.",
    tags: ["Next.js", "TypeScript", "UI/UX", "Quality Assurance"],
    year: "2026",
    category: "University Project",
    tone: "yellow",
    icon: "/figma/projects-icontrophy.svg",
  },
  {
    slug: "dalo",
    name: "DALO",
    fullTitle: "DALO: Where Every Event Becomes an Experience",
    subtitle: "Where Every Event Becomes an Experience",
    sourceUrl: "https://github.com/jamenggay/Event-Registration-System",
    preview: {
      src: "/projects/dalo.png",
      alt: "DALO event platform login page with a colorful logo and sign-in form",
      zoom: true,
      cropTop: true,
    },
    recognition: "Best Website",
    description:
      "An event platform project focused on making every event an experience. Designed the interfaces and interactive Figma prototypes, then contributed to frontend development.",
    tags: ["Figma", "Prototyping", "Frontend"],
    year: "2025",
    category: "University Project",
    tone: "cream",
    icon: "/figma/projects-iconmedal.svg",
  },
  {
    slug: "ecobridge",
    name: "EcoBridge",
    fullTitle: "EcoBridge: Sustainable Resource Redistribution System",
    subtitle: "Sustainable Resource Redistribution System",
    sourceUrl: "https://github.com/DDoS-Depressed-Devs-on-Site/EcoBridge-Full",
    preview: {
      src: "/projects/ecobridge.png",
      alt: "EcoBridge homepage with its forest-themed design and AI-assisted donation matching message",
    },
    recognition: "GDSC-L Hackfest 2025 Entry",
    description:
      "A platform that helps communities redistribute surplus food, clothing, and other supplies. In a five-person team, I designed the UI and prototypes in Figma and built frontend features with React.",
    tags: ["React", "Figma", "UI/UX", "Team Project"],
    year: "2025",
    category: "Hackathon",
    tone: "blue",
  },
  {
    slug: "kuryentech",
    name: "Kuryentech",
    sourceUrl: "https://github.com/0CottonBuds/KuryenTech",
    preview: {
      src: "/projects/kuryentech-team.jpg",
      alt: "The four-member Kuryentech team holding certificates at the IDOL hackathon",
    },
    recognition: "Top 15 Nationally - Philippines",
    description:
      "Worked as a frontend developer, designing the project interfaces and visuals. Also presented the project pitch and contributed research as part of a four-member team.",
    tags: ["Frontend", "UI Design", "Research", "Pitching"],
    year: "2024",
    category: "Hackathon",
    tone: "blue",
    icon: "/figma/projects-iconmedal1.svg",
  },
];

export const organizations = [
  {
    name: "AWS Student User Group Philippines",
    shortName: "AWS Student User Group PH",
    role: "Director for Marketing",
    period: "Dec 2025 - Present",
    description:
      "Lead technical workshops and grow a 200+ member community of computing students on campus. As Director for Marketing, manage the group's brand identity and creative output.",
    tags: ["Leadership", "Events", "Tech", "Marketing"],
    highlights: [
      "Manage the organization's brand identity and visual standards across digital and physical marketing channels.",
      "Keep creative outputs and communication strategies aligned with AWS learning objectives and professional standards.",
      "Oversee end-to-end production of graphic design and promotional assets.",
    ],
  },
  {
    name: "AWS Learning Club - Legarda",
    shortName: "AWS Learning Club - Legarda",
    role: "Chief Executive Officer and Lead",
    period: "Jul 2025 - Present",
    description:
      "Lead a 90+ member community focused on building students' technical and cloud-computing skills. Organized 5+ workshops attended by 80+ participants.",
    tags: ["Community Leadership", "Cloud", "Workshops"],
    highlights: [
      "Set the organization's strategic direction in line with AWS learning objectives.",
      "Coordinate and promote workshops, supporting smooth event delivery and strong participant engagement.",
      "Build opportunities for students to learn technical and cloud-computing skills.",
    ],
  },
  {
    name: "AWS Learning Club - Legarda",
    shortName: "AWS Learning Club - Legarda",
    role: "Cloud Computing and Infrastructure Officer",
    period: "Aug 2024 - Jul 2025",
    description:
      "Supported the club's cloud-learning program as a resource speaker and technical officer.",
    tags: ["AWS", "Cloud Fundamentals", "Technical Events"],
    highlights: [
      "Delivered workshops on AWS services and cloud fundamentals as a resource speaker.",
      "Supported technical setup for organization events, training, and cloud-related activities.",
    ],
  },
  {
    name: "NU Wizards' Circle",
    shortName: "NU Wizards' Circle",
    role: "Communications Coordinator",
    period: "Jul 2025 - Nov 2025",
    description:
      "Coordinated communications and partnership outreach for NU Wizards' Circle and its four houses.",
    tags: ["Communications", "Partnerships", "External Relations"],
    highlights: [
      "Helped the organization secure community partnerships and sponsors for the organization and its four houses.",
      "Coordinated communication between the Office of the Vice President for Linkages (OVP-Linkages), partners, and sponsors.",
      "Managed the official organization email and served as the primary contact for speakers, sponsors, and partners.",
    ],
  },
  {
    name: "Junior Blockchain Education Consortium of the Philippines - NU Manila",
    shortName: "JBECP - NU Manila",
    role: "Operations Committee Member",
    period: "Aug 2024 - Nov 2025",
    description:
      "Supported the planning and delivery of blockchain education events and activities at NU Manila.",
    tags: ["Event Operations", "Documentation", "Budget Support"],
    highlights: [
      "Assisted with event logistics, documentation, and coordination for blockchain education initiatives.",
      "Supported event operations to help deliver organized activities.",
      "Verified reimbursements, liquidation forms, and budget requests for accuracy and proper allocation.",
    ],
  },
  {
    name: "NU CCIT Student Council",
    shortName: "NU CCIT Student Council",
    role: "Director Auditor for Bookkeeping and Budgeting",
    period: "Aug 2024 - Nov 2025",
    description:
      "Oversaw financial records, budgets, and expense checks for the NU CCIT Student Council.",
    tags: ["Auditing", "Financial Records", "Budgeting"],
    highlights: [
      "Audited and maintained accurate, up-to-date financial records.",
      "Monitored budgets, expenses, and financial compliance to support transparency and accountability.",
      "Verified reimbursements, liquidation forms, and budget requests for accuracy and proper allocation.",
    ],
  },
  {
    name: "Google Developers on Campus - NU Manila",
    shortName: "Google Developers on Campus - NU Manila",
    role: "Creative Committee Member",
    period: "Aug 2023 - Jul 2024",
    description:
      "Created visual and promotional materials for Google Developers on Campus events and initiatives.",
    tags: ["Graphic Design", "Video", "Campaigns"],
    highlights: [
      "Produced six graphic posters and two videos for developer community events.",
      "Helped plan and execute visual campaigns for activities and initiatives.",
      "Designed layouts, presentations, and other digital assets for event preparation.",
    ],
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
