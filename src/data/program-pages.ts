import type { RuleItem } from "@/components/site/ui"

/**
 * Copy for the redesigned (V6) program pages, keyed by the slug in src/data/programs.ts.
 * programs.ts stays the source for the title, duration, application form, metadata and Course JSON-LD.
 */
export type ProgramPage = {
  /** Short name used in breadcrumbs and on the students page. */
  shortName: string
  lead: string
  level: string
  language: string
  skills: RuleItem[]
  projects: RuleItem[]
  stack: string[]
  aiTools: string[]
  mentor: { name: string; role: string; meta: string; quote: string; image: string }
  feeNote: string
  faqs: { question: string; answer: string }[]
}

const SHARED_FAQS = [
  {
    question: "How long is it, and when are classes?",
    answer:
      "15 weeks. Live classes Monday to Friday, about 1.5 hours a day. Classes that fall on festival or public holidays are recorded, not skipped.",
  },
  {
    question: "What are the payment options?",
    answer: "Full payment of ₹4,999 + GST, or two instalments of ₹2,499.50 (at enrollment and after 25 days), plus GST.",
  },
  {
    question: "What happens after I apply?",
    answer: "Our program coordinator calls you to answer questions, confirm your payment plan and complete enrollment.",
  },
  {
    question: "Is there a certificate?",
    answer: "Yes. You receive a certificate of completion after finishing the program and your major project.",
  },
]

const FEE_NOTE = "Top performers can be selected through an assessment for paid internships on our client projects."

export const CAREER_PREP: RuleItem[] = [
  { title: "Resume", body: "A resume that shows what you built, not generic duties." },
  { title: "GitHub portfolio", body: "Clean repositories with clear READMEs." },
  { title: "LinkedIn", body: "A profile recruiters can find." },
  { title: "Interview practice", body: "Technical rounds and how to explain your thinking." },
  { title: "Mock interviews", body: "Practice with industry mentors." },
]

export const programPages: Record<string, ProgramPage> = {
  "web-development-with-genai": {
    shortName: "MERN Stack with GenAI",
    lead: "Build and deploy full-stack web apps with MongoDB, Express, React, Node.js and Next.js, and ship AI features into them.",
    level: "Beginner to intermediate",
    language: "English",
    skills: [
      { title: "Frontend architecture", body: "Responsive, accessible, fast interfaces with React and modern CSS." },
      { title: "Backend engineering", body: "REST APIs with Node.js and Express, with proper error handling." },
      { title: "Database design", body: "MongoDB schemas, relationships between data, efficient queries." },
      { title: "Authentication", body: "Sign-in with JWT and secure password hashing." },
      { title: "Full-stack integration", body: "Connecting React frontends to Node backends and managing state." },
      { title: "AI features", body: "Calling LLM APIs from your own apps." },
      { title: "Testing and quality", body: "Tests and code checks before you ship." },
      { title: "Deployment", body: "Shipping full-stack apps through CI/CD pipelines." },
    ],
    projects: [
      { title: "Interactive components", body: "DOM, state and UI logic in plain JavaScript and Tailwind." },
      { title: "Full-stack dashboard", body: "Authentication, CRUD and charts with React, Node, Express and MongoDB." },
      { title: "Real-time application", body: "Live updates over WebSockets with Next.js and TypeScript." },
      { title: "Major project: AI-powered product", body: "A working product with a GenAI feature that solves one real user problem." },
    ],
    stack: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Socket.io"],
    aiTools: ["ChatGPT", "Claude", "Cursor", "GitHub Copilot", "Gemini"],
    mentor: {
      name: "Gokul",
      role: "Senior MERN stack developer, Cirakas Consultancy",
      meta: "800+ students trained · 5+ years in industry · Teaches in English",
      quote: "Students don’t need more information. They need better direction.",
      image: "/mentors/Gokul.jpeg",
    },
    feeNote: FEE_NOTE,
    faqs: [
      {
        question: "Who is this program for?",
        answer:
          "Beginners and intermediate developers who want structured guidance and real project experience instead of more tutorials.",
      },
      {
        question: "Do I need to know coding already?",
        answer: "Basic familiarity helps. We start from HTML, CSS and JavaScript foundations and build up from there.",
      },
      ...SHARED_FAQS,
    ],
  },
  "data-analyst": {
    shortName: "Data Analytics",
    lead: "Turn raw data into business decisions with Excel, SQL, Python and Tableau, using AI to work faster.",
    level: "No coding experience needed",
    language: "Telugu",
    skills: [
      { title: "Excel analytics", body: "Pivot tables, lookups, advanced formulas and data modeling." },
      { title: "SQL", body: "Joins, aggregations, CTEs and window functions on real databases." },
      { title: "Python for data", body: "Cleaning and transforming data with Pandas and NumPy." },
      { title: "Dashboards with Tableau", body: "Interactive business dashboards and visual reports." },
      { title: "Exploratory analysis", body: "Finding patterns, anomalies and trends in raw data." },
      { title: "Business problem solving", body: "Turning a business question into an analysis and a recommendation." },
      { title: "AI-assisted analytics", body: "Using GenAI to write queries, clean data and draft reports, and checking the results." },
      { title: "Statistics", body: "Descriptive statistics, hypothesis testing and regression on real scenarios." },
    ],
    projects: [
      { title: "Sales dashboard in Excel", body: "Multi-channel sales analysis with pivot tables and slicers." },
      { title: "Customer cohort SQL audit", body: "Retention and customer value from relational tables." },
      { title: "Exploratory analysis in Python", body: "Cleaning a messy real dataset and charting what you find." },
      {
        title: "Major project: AI-assisted business report",
        body: "Raw company data to a full report with SQL, Python, Tableau and an AI feature.",
      },
    ],
    stack: ["Excel", "SQL", "Python", "Pandas", "NumPy", "Tableau"],
    aiTools: ["ChatGPT", "Claude", "Cursor", "Gemini"],
    mentor: {
      name: "Sandeep",
      role: "Data science trainer and mentor, byteXL",
      meta: "Python · SQL · Data science · Machine learning · Teaches in Telugu",
      quote: "Technology keeps evolving. Your ability to learn should too.",
      image: "/mentors/sandeep.jpeg",
    },
    feeNote: FEE_NOTE,
    faqs: [
      {
        question: "Who is this program for?",
        answer: "Beginners, graduates and working professionals who want practical data skills.",
      },
      {
        question: "Do I need a programming background?",
        answer: "No. We start from data foundations and build up step by step.",
      },
      ...SHARED_FAQS,
    ],
  },
}
