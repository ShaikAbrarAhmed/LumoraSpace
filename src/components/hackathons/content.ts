import { ARENA } from "@/lib/site"

/** Copy for /hackathons. Facts only from the Lumora Arena brief in SPEC.md. */

export const SEASONS = ["Winter", "Spring", "Summer", "Monsoon", "Autumn"] as const

export const FORMATS = [
  {
    id: "team",
    title: "Team hackathons",
    summary: "Ticketed events you enter as a team.",
    facts: [
      { label: "Tickets", value: "The team leader buys tickets for the whole team." },
      { label: "Entry", value: "Every member gets a personal, single-use QR ticket by email." },
      { label: "Check-in", value: "Organisers scan you in at the door." },
    ],
  },
  {
    id: "global",
    title: "Global challenges",
    summary: "Solo challenges that run in seasons across the year.",
    facts: [
      { label: "Format", value: "Solo. You compete on your own." },
      { label: "Calendar", value: "Five seasons a year, three challenges per season." },
      { label: "Certificates", value: "Awarded on Arena, and anyone can verify them." },
    ],
  },
] as const

export const STEPS = [
  {
    title: "Pick a hackathon",
    body: "Browse the hackathons open on Lumora Arena. You don't need an account to look around.",
  },
  {
    title: "Register your team",
    body: "The team leader registers the team and buys a ticket for every member.",
  },
  {
    title: "Pay securely",
    body: "Once payment goes through, every member receives a personal, single-use QR ticket by email.",
  },
  {
    title: "Scan in and build",
    body: "Show your QR ticket at the venue. Organisers scan you in and your team starts building.",
  },
] as const

export const TRACKS = [
  "Python",
  "Java",
  "C/C++",
  "JavaScript",
  "Web Development",
  "React",
  "Node.js",
  "AI/ML",
] as const

export const RECORDS = [
  {
    title: "Winners",
    body: "Results from Arena hackathons and challenges.",
    href: ARENA.winners,
    path: "/winners",
  },
  {
    title: "Leaderboard",
    body: "Standings across Lumora Arena.",
    href: ARENA.leaderboard,
    path: "/leaderboard",
  },
  {
    title: "Verify a certificate",
    body: "Check that a Lumora Arena certificate is genuine.",
    href: ARENA.verify,
    path: "/verify",
  },
] as const

/** The ARENA.rent feature list, grouped by when an organiser needs it. */
export const HOST_GROUPS = [
  {
    title: "Before the event",
    items: ["Publish your own events", "Ticket sales and team registration", "Payments straight to your own UPI"],
  },
  {
    title: "On the day",
    items: ["Digital QR passes and scanner check-in", "Attendance and live analytics"],
  },
  {
    title: "For your organisers",
    items: ["A dashboard for registrations and payments", "A private workspace", "Temporary admin accounts"],
  },
] as const
