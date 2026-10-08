import Image from "next/image"
import type { Person } from "@/data/people"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import { ParallaxMedia } from "./ParallaxMedia"
import { ExpertiseTags, LinkedInLink, PersonQuote, photoFrame } from "./PersonParts"

type PersonRowProps = {
  person: Person
  company?: string
  expertise?: string[]
  as?: "h2" | "h3"
  /**
   * "profile" (mentors): role, quote, expertise and link.
   * "statement" (founders): narrower portrait so the person's own line carries the row.
   */
  variant?: "profile" | "statement"
  /** Load the first portrait on the page eagerly and at high priority (it sits in the first viewport on desktop). */
  eager?: boolean
}

// Photo column: full width on phones (capped), 5/12 of the container from sm.
const ROW_SIZES = "(min-width: 1280px) 460px, (min-width: 640px) 38vw, 90vw"
// Statement rows narrow the portrait to 4/12 from lg.
const STATEMENT_SIZES = "(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 38vw, 90vw"

/** Editorial row: portrait on the left; name and role at its top, their words and links at its foot. */
export function PersonRow({ person, company, expertise, as: Heading = "h2", eager = false, variant = "profile" }: PersonRowProps) {
  const statement = variant === "statement"
  return (
    <article id={person.slug} className="grid scroll-mt-28 gap-8 sm:grid-cols-12 sm:gap-10 lg:gap-16">
      <div className={statement ? "sm:col-span-5 lg:col-span-4" : "sm:col-span-5"}>
        <ParallaxMedia className={`${photoFrame} max-w-md sm:max-w-none`}>
          <Image
            src={person.image}
            alt={person.name}
            fill
            loading={eager ? "eager" : undefined}
            fetchPriority={eager ? "high" : undefined}
            sizes={statement ? STATEMENT_SIZES : ROW_SIZES}
            className="object-cover"
            style={{ objectPosition: person.imagePosition }}
          />
        </ParallaxMedia>
      </div>

      <Reveal
        className={cn(
          "flex flex-col sm:border-t sm:border-white/[0.08] sm:pt-6",
          statement ? "sm:col-span-7 lg:col-span-8" : "sm:col-span-7"
        )}
      >
        <div>
          <Heading className="font-heading text-2xl font-medium tracking-tight text-headings sm:text-3xl lg:text-4xl">
            {person.name}
          </Heading>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {person.role}
            {company && (
              <>
                {" at "}
                <span className="text-headings/85">{company}</span>
              </>
            )}
          </p>
        </div>

        <div className="lg:mt-auto lg:pt-12">
          {person.quote && (
            <PersonQuote
              quote={person.quote}
              name={person.name}
              size={statement ? "xl" : "lg"}
              className="mt-8 lg:mt-0"
            />
          )}

          {expertise && expertise.length > 0 && <ExpertiseTags items={expertise} className="mt-8 max-w-2xl" />}

          <LinkedInLink name={person.name} href={person.linkedin} className="mt-6" />
        </div>
      </Reveal>
    </article>
  )
}
