/**
 * Production host, no trailing slash. Deliberately not read from an env var: a stale
 * NEXT_PUBLIC_APP_URL pointed canonicals, og:url, the sitemap and JSON-LD at a dead domain.
 * Preview and local builds keep the production canonical on purpose.
 */
export const SITE_URL = "https://www.lumoraspace.in"

export const CONTACT = {
  hello: "support@lumoraspace.in",
  support: "support.lumoraspace@gmail.com",
}

export const SOCIAL = {
  discord: "https://discord.gg/xWVsJWv8N",
  whatsapp: "https://chat.whatsapp.com/GgKs2Hnh8Os1XOL0pYPZMN",
  instagram: "https://www.instagram.com/lumora.spacee",
}

export const EDU = {
  name: "LumoraSpace Academy",
  host: "edu.lumoraspace.in",
  home: "https://edu.lumoraspace.in",
  courses: "https://edu.lumoraspace.in/courses",
}

export const ARENA = {
  name: "Lumora Arena",
  host: "arena.lumoraspace.in",
  home: "https://arena.lumoraspace.in",
  hackathons: "https://arena.lumoraspace.in/hackathons",
  challenges: "https://arena.lumoraspace.in/challenges",
  winners: "https://arena.lumoraspace.in/winners",
  leaderboard: "https://arena.lumoraspace.in/leaderboard",
  verify: "https://arena.lumoraspace.in/verify",
  rent: "https://arena.lumoraspace.in/rent",
}

export const CAREERS = {
  name: "Lumora Careers",
  host: "careers.lumoraspace.in",
  home: "https://careers.lumoraspace.in",
}

export type NavItem = { label: string; href: string }

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/cohorts" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Services", href: "/services" },
  { label: "Community", href: "/community" },
  { label: "Mentors", href: "/mentors" },
]

export const isExternal = (href: string) => /^(https?:|mailto:)/.test(href)
