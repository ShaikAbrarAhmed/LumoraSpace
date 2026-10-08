import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { programList, splitLabel } from "@/data/programs"
import { Money } from "@/components/programs/money"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"

const IMAGE_SIZES = "(min-width: 1280px) 584px, (min-width: 768px) 46vw, 100vw"

export function ProgramsPreviewSection() {
  return (
    <section
      id="programs"
      aria-labelledby="programs-title"
      className="section-y border-t border-white/[0.06] bg-[#08080A]"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={<span id="programs-title">Programs built around real projects.</span>}
            lead="Live, mentor-led sessions, a capstone project you can show, and a certificate on completion."
          />
        </Reveal>

        <ul className="mt-12 grid gap-14 sm:mt-16 md:grid-cols-2 md:gap-8">
          {programList.map((program, index) => {
            const split = splitLabel(program)
            return (
              <li key={program.slug}>
                <Reveal delay={index * 0.08} className="h-full">
                  <Link
                    href={`/programs/${program.slug}`}
                    aria-labelledby={`program-${program.slug}-title program-${program.slug}-cta`}
                    className="group flex h-full flex-col rounded-2xl"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111214] transition-colors duration-300 group-hover:border-white/20">
                      {program.promotionalGraphic && (
                        <Image
                          src={program.promotionalGraphic}
                          alt=""
                          fill
                          sizes={IMAGE_SIZES}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                      )}
                    </div>

                    <div className="mt-7 flex flex-1 flex-col">
                      {program.status && (
                        <p className="font-heading text-sm font-medium text-headings/80">{program.status}</p>
                      )}
                      <h3
                        id={`program-${program.slug}-title`}
                        className="mt-2 text-balance pb-1 font-fancy text-[2rem] font-light leading-[1.1] tracking-normal text-headings sm:text-4xl"
                      >
                        {program.title}
                      </h3>
                      <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                        {program.description}
                      </p>

                      <div className="mt-auto pt-8">
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-6 xl:grid-cols-3">
                          <div>
                            <dt className="text-xs text-muted-foreground">Duration</dt>
                            <dd className="mt-1 font-heading text-[15px] text-headings">{program.duration}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">Fee</dt>
                            <dd className="mt-1 font-heading text-[15px] text-headings">
                              <Money>{program.fee}</Money>
                              {split && (
                                <span className="block whitespace-nowrap text-xs text-muted-foreground">
                                  <Money>{split}</Money>
                                </span>
                              )}
                            </dd>
                          </div>
                          {program.level && (
                            <div className="col-span-2 xl:col-span-1">
                              <dt className="text-xs text-muted-foreground">Level</dt>
                              <dd className="mt-1 font-heading text-[15px] text-headings">{program.level}</dd>
                            </div>
                          )}
                        </dl>
                        <span className="mt-7 inline-flex items-center gap-1.5 font-heading text-sm font-medium text-headings/80 transition-colors duration-300 group-hover:text-headings">
                          <span id={`program-${program.slug}-cta`}>View program</span>
                          <ArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>

        <Reveal className="mt-14 flex flex-col items-stretch gap-3 sm:mt-16 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/cohorts" className="btn-secondary">
            Explore programs
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
