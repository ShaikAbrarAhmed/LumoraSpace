import { SITE_URL } from "@/lib/site"
import type { Program } from "@/data/programs"

const base = SITE_URL.replace(/\/+$/, "")

export const programUrl = (program: Program) => `${base}/programs/${program.slug}`

/** Decimal hours as an ISO 8601 duration: 1.5 -> "PT1H30M", 90 -> "PT90H". */
function isoHours(hours: number) {
  const totalMinutes = Math.round(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `PT${h ? `${h}H` : ""}${m || !h ? `${m}M` : ""}`
}

/**
 * schema.org Course built only from programs.ts, so it never claims more than the page does.
 * Render it with <JsonLd> from "@/lib/jsonld", which adds "@context" and escapes "<".
 */
export function courseJsonLd(program: Program) {
  const url = programUrl(program)
  const hoursPerWeek = program.daysPerWeek * program.hoursPerDay

  return {
    "@type": "Course",
    "@id": `${url}#course`,
    name: program.title,
    description: program.description,
    url,
    inLanguage: "en",
    ...(program.promotionalGraphic && { image: `${base}${program.promotionalGraphic}` }),
    provider: {
      "@type": "Organization",
      name: "LumoraSpace",
      url: base,
    },
    offers: {
      "@type": "Offer",
      category: "Paid",
      price: program.feeAmount,
      priceCurrency: "INR",
      url,
      availability:
        program.status === "Launching soon" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      // Weekly sessions (e.g. Mon to Fri, 1.5 hours a day = PT7H30M a week) for the program's weeks.
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: "Weekly",
        repeatCount: program.weeks,
        duration: isoHours(hoursPerWeek),
      },
      courseWorkload: isoHours(program.weeks * hoursPerWeek),
      instructor: program.mentors.map((mentor) => ({
        "@type": "Person",
        name: mentor.name,
        jobTitle: mentor.role,
        worksFor: { "@type": "Organization", name: mentor.company },
        image: `${base}${mentor.image}`,
        ...(mentor.linkedin && { sameAs: [mentor.linkedin] }),
      })),
    },
  }
}
