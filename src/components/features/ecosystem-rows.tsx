import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { ARENA, CAREERS, EDU, isExternal } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

type Destination = {
  id: string
  verb: string
  name: string
  href: string
  /** Visible link label: the host for sister sites, a short phrase for internal pages. */
  linkLabel: string
  summary: string
  detail: string
  extra?: { label: string; href: string }[]
}

const destinations: Destination[] = [
  {
    id: "academy",
    verb: "Learn",
    name: EDU.name,
    href: EDU.home,
    linkLabel: EDU.host,
    summary: "Structured, mentor-led programs, live and guided, with a certificate on completion.",
    detail:
      "Structured, mentor-led programs taught live and built around what you make, with a certificate on completion and registration in about two minutes.",
  },
  {
    id: "arena",
    verb: "Compete",
    name: ARENA.name,
    href: ARENA.home,
    linkLabel: ARENA.host,
    summary: "Team hackathons and global solo challenges across five seasons a year, with certificates.",
    detail:
      "Ticketed team hackathons with a personal QR ticket for every member, plus global solo challenges in five seasons a year, three per season, with certificates.",
    extra: [
      { label: "Verify a certificate", href: ARENA.verify },
      { label: "Host on Arena", href: ARENA.rent },
    ],
  },
  {
    id: "careers",
    verb: "Launch your career",
    name: CAREERS.name,
    href: CAREERS.home,
    linkLabel: CAREERS.host,
    summary: "Verified internships and real projects, with senior code review and mentorship.",
    detail:
      "Verified internships that state start date, weekly hours, compensation and mentorship up front, with real projects, senior code review and verified achievements for your portfolio.",
  },
  {
    id: "services",
    verb: "Build with us",
    name: "Services",
    href: "/services",
    linkLabel: "Explore services",
    summary: "For businesses: software, AI, cloud, design and marketing, from a first MVP to long-term support.",
    detail:
      "For businesses: AI and data, custom software, mobile apps, cloud and digital engineering, no-code, design and marketing, from a first MVP to long-term support.",
  },
]

function DestinationLink({ href, label, strong = false }: { href: string; label: string; strong?: boolean }) {
  const className = cn(
    "group/link inline-flex min-h-11 items-center gap-1.5 font-heading text-sm transition-colors",
    strong ? "text-headings" : "text-muted-foreground hover:text-headings",
  )

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span className="underline decoration-white/20 underline-offset-4 transition-colors group-hover/link:decoration-white/70">
          {label}
        </span>
        <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      <span className="underline decoration-white/20 underline-offset-4 transition-colors group-hover/link:decoration-white/70">
        {label}
      </span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    </Link>
  )
}

/** The four parts of LumoraSpace as editorial rows. `detailed` shows the longer copy and secondary links. */
export function EcosystemRows({ detailed = false, className }: { detailed?: boolean; className?: string }) {
  return (
    <ul className={cn("border-b border-white/[0.08]", className)}>
      {destinations.map((d) => (
        <li key={d.id} className="border-t border-white/[0.08]">
          <Reveal y={16} className="grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
            <div className="md:col-span-4">
              <p className="font-heading text-sm text-muted-foreground">{d.verb}</p>
              <h3 className="mt-2 text-xl font-medium text-headings sm:text-2xl">{d.name}</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base md:col-span-5">
              {detailed ? d.detail : d.summary}
            </p>
            <div className="flex flex-col items-start md:col-span-3 md:items-end">
              <DestinationLink href={d.href} label={d.linkLabel} strong />
              {detailed && d.extra?.map((x) => <DestinationLink key={x.href} href={x.href} label={x.label} />)}
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
