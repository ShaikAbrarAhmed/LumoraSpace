import { ARENA, CAREERS, EDU, REGISTRATION, SOCIAL } from "@/lib/site"

export type MenuLink = { title: string; tag?: string; description: string; href: string }
export type MenuColumn = { heading: string; links: MenuLink[] }
export type MenuPromo = { heading: string; body: string; cta: string; href: string }

export type Menu = {
  id: "platforms" | "solutions" | "resources"
  label: string
  columns: MenuColumn[]
  promo: MenuPromo
  /** Routes that mark this menu as the current section (amber underline). */
  sections: string[]
}

export const MERN_HREF = "/programs/web-development-with-genai"
export const DATA_HREF = "/programs/data-analyst"

export const MENUS: Menu[] = [
  {
    id: "platforms",
    label: "Platforms",
    columns: [
      {
        heading: "Our platforms",
        links: [
          { title: EDU.name, tag: EDU.host, description: "Live classes, projects and mentor reviews", href: EDU.home },
          {
            title: ARENA.name,
            tag: ARENA.host,
            description: "Hackathons and challenges, plus event hosting for colleges and clubs",
            href: ARENA.home,
          },
          { title: CAREERS.name, tag: CAREERS.host, description: "Verified internships for our learners", href: CAREERS.home },
        ],
      },
    ],
    promo: {
      heading: "Verify a certificate",
      body: "Every LumoraSpace certificate can be checked on Arena.",
      cta: "Verify now",
      href: ARENA.verify,
    },
    sections: [],
  },
  {
    id: "solutions",
    label: "Solutions",
    columns: [
      {
        heading: "For students",
        links: [
          { title: "All programs", description: "Compare tracks, fees and dates", href: "/cohorts" },
          { title: "MERN Stack with GenAI", description: "Full-stack web apps with AI features", href: MERN_HREF },
          { title: "Data Analytics", description: "Excel, SQL, Python and Tableau", href: DATA_HREF },
        ],
      },
      {
        heading: "For colleges",
        links: [{ title: "College partnerships", description: "Hackathons, programs and events on campus", href: "/colleges" }],
      },
      {
        heading: "For businesses",
        links: [
          { title: "Software and AI", description: "Web, mobile, AI, cloud and more", href: "/services" },
          { title: "Hiring support", description: "Candidates whose work you have seen", href: "/services#hiring" },
        ],
      },
    ],
    promo: {
      heading: "Next cohort",
      body: `Registration opens ${REGISTRATION.opens}. 15 weeks, ₹4,999 + GST.`,
      cta: "Explore programs",
      href: "/cohorts",
    },
    sections: ["/cohorts", "/programs", "/colleges", "/services"],
  },
  {
    id: "resources",
    label: "Resources",
    columns: [
      {
        heading: "Learn",
        links: [
          { title: "Roadmaps", tag: `in ${EDU.name}`, description: "Step-by-step paths for each track", href: EDU.home },
        ],
      },
      {
        heading: "Our work",
        links: [
          { title: "Case studies", description: "Projects we have shipped", href: "/work" },
          { title: "LUMINIX’26", description: "630 participants, 210 teams", href: "/work#luminix" },
        ],
      },
    ],
    promo: {
      heading: "Join the community",
      body: "WhatsApp group, Instagram and Discord for learners.",
      cta: "Join WhatsApp",
      href: SOCIAL.whatsapp,
    },
    sections: ["/work"],
  },
]

export type FooterColumn = { heading: string; links: { label: string; href: string }[] }

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "For students",
    links: [
      { label: "All programs", href: "/cohorts" },
      { label: "MERN Stack with GenAI", href: MERN_HREF },
      { label: "Data Analytics", href: DATA_HREF },
      { label: "Hackathons", href: ARENA.hackathons },
      { label: "Internships", href: CAREERS.home },
    ],
  },
  {
    heading: "For organisations",
    links: [
      { label: "Software and AI services", href: "/services" },
      { label: "Hiring support", href: "/services#hiring" },
      { label: "College partnerships", href: "/colleges" },
      { label: "Host an event on Arena", href: ARENA.rent },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { label: EDU.name, href: EDU.home },
      { label: ARENA.name, href: ARENA.home },
      { label: CAREERS.name, href: CAREERS.home },
      { label: "Verify a certificate", href: ARENA.verify },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/our-story" },
      { label: "Our work", href: "/work" },
      { label: "Mentors", href: "/our-story#mentors" },
      { label: "Contact", href: "/contact" },
    ],
  },
]
