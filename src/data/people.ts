/**
 * Single source of truth for the people shown on /mentors, /team and the
 * home page mentors preview (and their JSON-LD).
 *
 * Facts are copied verbatim from the previous MentorsSection / TeamSection /
 * page JSON-LD. Quotes are the person's own words: never rewrite them. Keep
 * them exactly or remove the `quote` field.
 *
 * Note: src/data/programs.ts still keeps its own mentor records for the
 * program pages (Gokul on MERN Stack Development with GenAI, Sandeep on
 * Data Analyst). Their program-page wording is mirrored in `programProfile`
 * below so the two can be reconciled later.
 */

export type Person = {
  /** Used for anchors (/mentors#gokul) and JSON-LD ids. */
  slug: string
  name: string
  /** Role as displayed on the site. */
  role: string
  /** Photo under /public. */
  image: string
  /** CSS object-position for the portrait crop. */
  imagePosition: string
  linkedin: string
  /** Verbatim quote / personal line. */
  quote?: string
}

export type Mentor = Person & {
  company: string
  /** jobTitle used in the Person JSON-LD (as the owner had it). */
  jobTitle: string
  expertise: string[]
  /** How the same mentor is described on a program page in src/data/programs.ts. */
  programProfile?: {
    programSlug: string
    role: string
    company: string
    /** Bio line exactly as it appears on the program page. */
    expertise: string
  }
}

export type TeamMember = Person & {
  group: "founder" | "core"
  /** false = kept on record but not rendered (owner decision pending). */
  active: boolean
}

export const mentors: Mentor[] = [
  {
    slug: "gokul",
    name: "Gokul",
    role: "Project Manager",
    company: "Cirakas Consultancy",
    jobTitle: "Project Manager & Mentor",
    quote: "Students don't need more information. They need better direction.",
    expertise: ["Leadership", "Product Management", "Software Development", "Career Growth"],
    image: "/mentors/Gokul.jpeg",
    imagePosition: "50% 40%",
    linkedin: "https://www.linkedin.com/in/gokul-dev1/",
    programProfile: {
      programSlug: "web-development-with-genai",
      role: "Sr. MERN Stack & Polymath Developer",
      company: "Cirakas Consultancy",
      expertise: "800+ Students Trained · 5+ Years of Industry Experience",
    },
  },
  {
    slug: "purva-kabra",
    name: "Purva Kabra",
    role: "Product Manager",
    company: "LumberFi",
    jobTitle: "Product Manager & Mentor",
    quote: "Success isn't about having all the answers. It's about asking better questions.",
    expertise: [
      "Product Management",
      "Design Thinking",
      "Structured Thinking",
      "Marketing & Sales",
      "Operations & Processes",
      "Founder Mindset",
      "Career Guidance",
      "Decision Making",
    ],
    image: "/mentors/Purva.png",
    imagePosition: "55% center",
    linkedin: "https://www.linkedin.com/in/purva-kabra-pk",
  },
  {
    slug: "sanskrity-singh",
    name: "Sanskrity Singh",
    role: "Marketing Specialist",
    company: "BOT Consulting",
    jobTitle: "Marketing Specialist & Mentor",
    quote: "Your skills get you noticed. Your personal brand gets you remembered.",
    expertise: ["Personal Branding", "Marketing Strategy", "Business Growth", "AI Marketing"],
    image: "/mentors/Sanskrity1.png",
    imagePosition: "center top",
    linkedin: "https://www.linkedin.com/in/sanskritysingh",
  },
  {
    slug: "sandeep",
    name: "Sandeep",
    role: "Data Science Trainer & Mentor",
    company: "byteXL",
    jobTitle: "Data Science Trainer & Mentor",
    quote: "Technology keeps evolving. Your ability to learn should too.",
    expertise: [
      "Python",
      "Data Science",
      "Machine Learning",
      "SQL",
      "Power BI",
      "Statistics",
      "Data Analytics",
    ],
    image: "/mentors/sandeep.jpeg",
    imagePosition: "center 30%",
    linkedin: "https://www.linkedin.com/in/sandeepgivari",
    programProfile: {
      programSlug: "data-analyst",
      role: "Data Science Trainer & Mentor",
      company: "byteXL",
      expertise: "Python · SQL · Power BI · Data Science · Machine Learning",
    },
  },
]

export const team: TeamMember[] = [
  // Founders
  {
    slug: "shaik-abrar-ahmed",
    group: "founder",
    active: true,
    name: "Shaik Abrar Ahmed",
    role: "Founder",
    image: "/team/abrar.png",
    imagePosition: "center top",
    quote: "Building the ecosystem I wish I had as a student.",
    linkedin: "https://www.linkedin.com/in/shaikabrarahmed/",
  },
  {
    slug: "mounika",
    group: "founder",
    active: true,
    name: "Mounika",
    role: "Co-Founder · R&D & Research Lead",
    image: "/team/Mouni2.jpeg",
    imagePosition: "center top",
    quote: "Making sure no builder has to work in isolation.",
    linkedin: "https://www.linkedin.com/in/surakarapu-mounika-62b84a2a4",
  },
  {
    slug: "ashwini",
    group: "founder",
    active: true,
    name: "Ashwini",
    role: "Co-Founder · Growth & Partnerships Lead",
    image: "/team/Ashwini2.jpeg",
    imagePosition: "center top",
    quote: "Bridging the gap between theory and execution.",
    linkedin: "https://www.linkedin.com/in/ashwini-ravirala-133058377/",
  },

  // Core team
  {
    slug: "yuvraj",
    group: "core",
    active: true,
    name: "Yuvraj",
    role: "Tech Lead",
    image: "/team/Yuvi.jpeg",
    imagePosition: "center top",
    quote: "Building systems that turn ideas into execution.",
    linkedin: "https://www.linkedin.com/in/yuvaraj-dudukuru/",
  },
  {
    // Commented out on the live site by the owner. Kept on record, not rendered,
    // until the owner confirms whether Sruthi should be listed again.
    slug: "sruthi",
    group: "core",
    active: false,
    name: "Sruthi",
    role: "Design & Experience",
    image: "/team/Sruthi.jpeg",
    imagePosition: "center top",
    quote: "Crafting experiences that feel as good as they function.",
    linkedin: "https://www.linkedin.com/in/sruthi-kakarla-380b2235b",
  },
  {
    slug: "jasmeeth-singh",
    group: "core",
    active: true,
    name: "Jasmeeth Singh",
    role: "Community & Operations Lead",
    image: "/team/Jasmeetg.jpeg",
    imagePosition: "center top",
    quote: "Turning stories into movements.",
    linkedin: "https://www.linkedin.com/in/sardar-jasmeeth-singh-raj/",
  },
  {
    slug: "rajitha",
    group: "core",
    active: true,
    name: "Rajitha",
    role: "Product & Innovation Research",
    image: "/team/Rajitha.jpeg",
    imagePosition: "center top",
    quote: "Connecting ideas, research, and possibilities.",
    linkedin: "https://www.linkedin.com/in/rajitha-reddemoni-a24a8533a",
  },
]

export const founders = team.filter((p) => p.active && p.group === "founder")
export const coreTeam = team.filter((p) => p.active && p.group === "core")

/** "Cirakas Consultancy, LumberFi, BOT Consulting and byteXL" */
export const mentorCompanies = new Intl.ListFormat("en-GB", { type: "conjunction" }).format(
  mentors.map((m) => m.company)
)
