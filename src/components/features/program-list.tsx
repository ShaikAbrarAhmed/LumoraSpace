import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { programList, splitLabel } from "@/data/programs"
import { Reveal } from "@/components/ui/reveal"
import { ProgramStatusLabel } from "@/components/programs/ProgramCard"
import { Money } from "@/components/programs/money"

/** Program data writes day ranges with an en dash (e.g. Mon, en dash, Fri); show them in words instead. */
const DASHES = [0x2013, 0x2014].map((code) => String.fromCharCode(code))
const readable = (text: string) =>
  DASHES.reduce((out, dash) => out.split(dash).join(" to "), text).replace(/\s+/g, " ")

export function ProgramList() {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:gap-8">
      {programList.map((program, i) => {
        const split = splitLabel(program)
        const mentors = program.mentors.map((m) => m.name).join(", ")
        const href = `/programs/${program.slug}`

        return (
          <li key={program.slug}>
            <Reveal delay={i * 0.08} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C] transition-colors duration-300 focus-within:border-white/30 hover:border-white/20">
                {program.promotionalGraphic && (
                  <div className="relative aspect-video border-b border-white/[0.08] bg-[#111214]">
                    <Image
                      src={program.promotionalGraphic}
                      alt={`${program.title} program poster`}
                      fill
                      sizes="(min-width: 1280px) 600px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <ProgramStatusLabel status={program.status} />
                  <h3 className="mt-3 text-2xl font-medium leading-snug text-headings text-balance">
                    <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl after:content-['']">
                      {program.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">
                    {program.description}
                  </p>

                  <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-6">
                    <div>
                      <dt className="text-sm text-muted-foreground">Duration</dt>
                      <dd className="mt-1 text-[15px] text-headings">{program.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Schedule</dt>
                      <dd className="mt-1 text-[15px] text-headings">{readable(program.schedule)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Fee</dt>
                      <dd className="mt-1 text-[15px] text-headings">
                        <Money>{program.fee}</Money>
                        {split && (
                          <span className="block text-sm text-muted-foreground">
                            <Money>{split}</Money>
                          </span>
                        )}
                      </dd>
                    </div>
                    {mentors && (
                      <div>
                        <dt className="text-sm text-muted-foreground">{program.mentors.length > 1 ? "Mentors" : "Mentor"}</dt>
                        <dd className="mt-1 text-[15px] text-headings">{mentors}</dd>
                      </div>
                    )}
                  </dl>

                  <span
                    aria-hidden="true"
                    className="mt-auto inline-flex items-center gap-2 pt-8 font-heading text-sm text-headings"
                  >
                    View program
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
