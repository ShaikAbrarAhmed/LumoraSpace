import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { ARENA, CAREERS } from "@/lib/site"
import { cn } from "@/lib/utils"

const panelClass =
  "group flex h-full min-h-[18rem] flex-col rounded-2xl border border-white/[0.08] p-7 transition-colors duration-300 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] sm:min-h-[20rem] sm:p-10"

function PanelBody({
  platform,
  title,
  body,
  destination,
  external,
}: {
  platform: string
  title: string
  body: ReactNode
  destination: string
  external?: boolean
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight
  return (
    <>
      <p className="font-heading text-sm text-muted-foreground">{platform}</p>
      <h3 className="mt-4 font-fancy text-4xl font-light leading-[1.1] tracking-tight text-headings sm:text-5xl">
        {title}
      </h3>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">{body}</p>
      <span className="mt-auto flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5 font-heading text-sm font-medium text-headings">
        {destination}
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 transition-[transform,border-color] duration-300 group-hover:translate-x-1 group-hover:border-white/40">
          <Arrow aria-hidden className="size-4" />
        </span>
      </span>
    </>
  )
}

export function MoreWaysIn() {
  return (
    <section id="more-ways-in" className="section-y border-t border-white/[0.06] bg-[#050505]">
      <div className="container-page">
        <SectionHeading title="Compete, or join the team." />

        <div className="mt-12 grid gap-3 sm:mt-16 lg:grid-cols-12 lg:gap-4">
          <Reveal y={16} className="lg:col-span-7">
            <Link
              href="/hackathons"
              className={cn(
                panelClass,
                "bg-[#0B0B0C] bg-[radial-gradient(ellipse_70%_80%_at_100%_0%,rgba(255,255,255,0.06),transparent_70%)]",
              )}
            >
              <PanelBody
                platform={ARENA.name}
                title="Competitions"
                body="Ticketed team hackathons, and global solo challenges across five seasons a year, with certificates."
                destination="Explore hackathons"
              />
            </Link>
          </Reveal>
          <Reveal y={16} delay={0.06} className="lg:col-span-5">
            <a href={CAREERS.home} target="_blank" rel="noopener noreferrer" className={cn(panelClass, "bg-[#0B0B0C]")}>
              <PanelBody
                platform={CAREERS.name}
                title="Work at LumoraSpace"
                body={`Join the remote LumoraSpace team. Roles are listed on ${CAREERS.name}.`}
                destination={CAREERS.host}
                external
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
