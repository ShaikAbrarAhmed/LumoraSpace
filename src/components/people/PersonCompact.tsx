import Image from "next/image"
import type { Person } from "@/data/people"
import { LinkedInLink, PersonQuote, photoFrame } from "./PersonParts"

// Small portrait: 88px on phones, 112px from sm, 2/12 of the container from lg.
const COMPACT_SIZES = "(min-width: 1280px) 180px, (min-width: 1024px) 15vw, (min-width: 640px) 112px, 88px"

/**
 * Roster row for a list of people: small portrait, name and role, then their
 * words and LinkedIn. One line per person on desktop, a stacked pair on phones.
 */
export function PersonCompact({ person }: { person: Person }) {
  return (
    <article
      id={person.slug}
      className="grid scroll-mt-28 grid-cols-[5.5rem_1fr] gap-x-5 gap-y-6 sm:grid-cols-[7rem_1fr] sm:gap-x-8 lg:grid-cols-12 lg:items-center lg:gap-x-10"
    >
      <div className={`${photoFrame} lg:col-span-2`}>
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes={COMPACT_SIZES}
          className="object-cover"
          style={{ objectPosition: person.imagePosition }}
        />
      </div>

      <div className="self-center lg:col-span-3">
        <h3 className="font-heading text-xl font-medium tracking-tight text-headings sm:text-2xl">{person.name}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">{person.role}</p>
      </div>

      <div className="col-span-2 flex flex-col gap-3 sm:col-span-1 sm:col-start-2 lg:col-span-7 lg:col-start-auto lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        {person.quote && <PersonQuote quote={person.quote} name={person.name} size="md" />}
        <LinkedInLink name={person.name} href={person.linkedin} className="self-start lg:self-center lg:shrink-0" />
      </div>
    </article>
  )
}
