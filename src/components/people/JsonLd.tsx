import { SITE_URL } from "@/lib/site"
import type { Mentor, TeamMember } from "@/data/people"

// Data builders only. Pages render them with <JsonLd> from "@/lib/jsonld".

const abs = (path: string) => new URL(path, SITE_URL).toString()

export function mentorsJsonLd(list: Mentor[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "LumoraSpace mentors",
    url: abs("/mentors"),
    itemListElement: list.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        "@id": abs(`/mentors#${m.slug}`),
        url: abs(`/mentors#${m.slug}`),
        name: m.name,
        jobTitle: m.jobTitle,
        image: abs(m.image),
        sameAs: [m.linkedin],
        knowsAbout: m.expertise,
        worksFor: { "@type": "Organization", name: m.company },
      },
    })),
  }
}

export function teamJsonLd(list: TeamMember[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "LumoraSpace team",
    url: abs("/team"),
    itemListElement: list.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        "@id": abs(`/team#${p.slug}`),
        url: abs(`/team#${p.slug}`),
        name: p.name,
        jobTitle: p.role,
        image: abs(p.image),
        sameAs: [p.linkedin],
        worksFor: { "@type": "Organization", name: "LumoraSpace", url: SITE_URL },
      },
    })),
  }
}

