import { SOCIAL } from "@/lib/site"

export type Channel = {
  id: "discord" | "whatsapp" | "instagram"
  name: string
  href: string
  /** What the visitor sees as the destination: a host or an @handle. */
  handle: string
  /** One line on what the channel is for (full /community page). */
  purpose: string
  /** A few words for the compact home preview. */
  summary: string
  cta: string
}

const host = (url: string) => new URL(url).host.replace(/^www\./, "")
const instagramHandle = `@${new URL(SOCIAL.instagram).pathname.replace(/\//g, "")}`

// Every URL comes from SOCIAL in @/lib/site. Change an invite there, not here.
export const CHANNELS: Channel[] = [
  {
    id: "discord",
    name: "Discord",
    href: SOCIAL.discord,
    handle: host(SOCIAL.discord),
    purpose: "The home base. Ask questions, share progress, get feedback on your work and find people to build with.",
    summary: "Questions, feedback and teammates",
    cta: "Join Discord",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    href: SOCIAL.whatsapp,
    handle: host(SOCIAL.whatsapp),
    purpose: "Important updates, reminders and announcements, straight to your phone.",
    summary: "Updates and reminders",
    cta: "Join WhatsApp",
  },
  {
    id: "instagram",
    name: "Instagram",
    href: SOCIAL.instagram,
    handle: instagramHandle,
    purpose: "Mentor spotlights, student achievements and highlights from events.",
    summary: "Spotlights and highlights",
    cta: "Follow on Instagram",
  },
]
