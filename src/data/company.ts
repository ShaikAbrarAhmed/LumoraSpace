/**
 * Shared facts for the redesigned pages (home, about, colleges, students, work).
 * Copy follows the V4 / V6 designs word for word. Bracketed values are placeholders
 * the team still has to supply.
 */

export type College = { name: string; place: string; logo: string }

export const COLLEGES: College[] = [
  { name: "VEMU Institute of Technology", place: "P. Kothakota", logo: "/colleges/vemu.png" },
  { name: "Mother Theresa Institutions", place: "Palamaner", logo: "/colleges/mother-theresa.png" },
]

export const LUMINIX_STATS = [
  { value: "630", label: "Participants" },
  { value: "210", label: "Teams" },
  { value: "100", label: "Teams in round two" },
  { value: "15", label: "Finalists" },
]

/** A team card: a photo under /public, or `null` for an initial-letter placeholder. */
export type TeamCard = { name: string; role: string; image: string | null }

export const LEADERSHIP: TeamCard[] = [
  { name: "Shaik Abrar Ahmed", role: "Founder and CEO · leads education and partnerships", image: "/team/abrar.png" },
  { name: "Surakarapu Mounika", role: "Co-founder and COO · runs operations", image: "/team/Mouni2.jpeg" },
  { name: "Dudukuru Yuvaraj", role: "CTO · leads technology and client delivery", image: "/team/Yuvi.jpeg" },
  { name: "Tabrez", role: "Sales and admissions", image: null },
  { name: "Amaan", role: "Marketing and community", image: null },
  { name: "Rajitha", role: "Outreach to colleges, communities and startups", image: "/team/Rajitha.jpeg" },
]

export const MENTORS: TeamCard[] = [
  { name: "Gokul", role: "Web development · Senior MERN developer, Cirakas Consultancy", image: "/mentors/Gokul.jpeg" },
  { name: "Sandeep", role: "Data analytics · Data science trainer, byteXL", image: "/mentors/sandeep.jpeg" },
  { name: "Purva Kabra", role: "Career guidance · Product manager, LumberFi", image: "/mentors/Purva.png" },
  { name: "Sanskrity Singh", role: "Career guidance · Marketing specialist, BOT Consulting", image: "/mentors/Sanskrity1.png" },
]

/** The short list on the home page. */
export const HOME_PEOPLE = [
  { name: "Shaik Abrar Ahmed", role: "Founder and CEO, leads education" },
  { name: "Surakarapu Mounika", role: "Co-founder and COO, runs operations" },
  { name: "Dudukuru Yuvaraj", role: "CTO, leads technology and client delivery" },
  { name: "Gokul", role: "Mentor, web development. Project manager, Cirakas Consultancy" },
  { name: "Sandeep", role: "Mentor, data analytics. Trainer, byteXL" },
]

/** How a cohort application goes, shared by the students page and every program page. */
export const JOIN_STEPS = [
  { title: "Apply", body: "Fill a short form with your details and the program you want." },
  { title: "We call you", body: "Our program coordinator calls to answer questions and confirm your plan." },
  { title: "Pay and enroll", body: "Choose full or split payment. Your seat is confirmed." },
  { title: "Join the cohort", body: "You get LMS access and join the cohort group before day one." },
]

export const FEE_ROWS = [
  { term: "Full payment", detail: "₹4,999 + GST, paid once" },
  { term: "Split payment", detail: "₹2,499.50 at enrollment, ₹2,499.50 after 25 days (+ GST)" },
]
