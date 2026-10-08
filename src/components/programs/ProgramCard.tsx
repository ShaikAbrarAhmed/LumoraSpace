import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { splitLabel, type Program, type ProgramStatus } from "@/data/programs"
import { cn } from "@/lib/utils"
import { Money } from "./money"

/** Plain text status ("Enrollment open"), read from programs.ts so every page agrees. */
export function ProgramStatusLabel({ status, className }: { status?: ProgramStatus; className?: string }) {
  if (!status) return null
  return (
    <span
      className={cn(
        "font-heading text-sm font-medium",
        status === "Enrollment open" ? "text-headings" : "text-muted-foreground",
        className,
      )}
    >
      {status}
    </span>
  )
}

function ProgramImage({ program, sizes, className }: { program: Program; sizes: string; className?: string }) {
  if (!program.promotionalGraphic) return null
  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C] transition-colors duration-500 group-hover:border-white/20",
        className,
      )}
    >
      <Image
        src={program.promotionalGraphic}
        alt={`${program.title} program poster`}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.015]"
      />
    </div>
  )
}

function Fact({ term, children, className }: { term: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd className="mt-1 text-[15px] leading-snug text-headings">{children}</dd>
    </div>
  )
}

/** Full editorial row used on /cohorts. The whole row is one link to the program page. */
export function ProgramRow({ program }: { program: Program }) {
  const split = splitLabel(program)
  const mentor = program.mentors[0]
  const href = `/programs/${program.slug}`

  return (
    <article className="group relative grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-16">
      <ProgramImage
        program={program}
        sizes="(min-width: 1280px) 680px, (min-width: 768px) 55vw, 100vw"
        className="md:col-span-7"
      />

      <div className="flex min-w-0 flex-col md:col-span-5">
        <ProgramStatusLabel status={program.status} />
        <h3 className="mt-3 font-fancy text-3xl font-light leading-[1.1] text-headings text-balance sm:text-4xl">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-white/60 focus-visible:after:ring-offset-8 focus-visible:after:ring-offset-background"
          >
            {program.title}
          </Link>
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">
          {program.description}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-6">
          <Fact term="Duration">{program.duration}</Fact>
          <Fact term="Schedule">{program.schedule}</Fact>
          <Fact term="Format" className={program.level ? undefined : "col-span-2"}>
            {program.mode}
          </Fact>
          {program.level && <Fact term="Level">{program.level}</Fact>}
          <Fact term="Fee">
            <Money>{program.fee}</Money>
            {split && (
              <span className="block text-sm text-muted-foreground">
                <Money>{split}</Money>
              </span>
            )}
          </Fact>
          {mentor && (
            <Fact term="Mentor">
              {mentor.name}
              <span className="block text-sm text-muted-foreground">{mentor.company}</span>
            </Fact>
          )}
        </dl>

        <span className="mt-auto inline-flex items-center gap-2 pt-8 font-heading text-sm font-medium text-headings">
          View program
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  )
}
