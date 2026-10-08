import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { ARENA } from "@/lib/site"
import { cn } from "@/lib/utils"
import { ExternalLink } from "./ExternalLink"
import { SEASONS } from "./content"

// The entrance runs on CSS keyframes, so it plays straight from the server HTML
// with no hydration step to get wrong. `motion-safe:` leaves every element in its
// resting state for reduced-motion users.
const KEYFRAMES =
  "@keyframes ls-arena-rise{from{opacity:0;transform:translate3d(0,1.25rem,0)}}" +
  "@keyframes ls-arena-fill{from{transform:scaleY(0)}}" +
  "@keyframes ls-arena-lit{from{opacity:0}}"

const rise = "motion-safe:animate-[ls-arena-rise_1s_cubic-bezier(0.16,1,0.3,1)_both]"
const fill = "motion-safe:animate-[ls-arena-fill_0.25s_linear_both]"
const lit = "motion-safe:animate-[ls-arena-lit_0.3s_ease-out_both]"

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

/** When the first season appears, and the gap before each next one. */
const SEASON_START = 0.6
const SEASON_STEP = 0.25

export function HackathonsHero() {
  return (
    <section aria-labelledby="hackathons-hero-title" className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="container-page flex flex-1 flex-col gap-14 pb-12 pt-24 sm:pb-16 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
        <div className="lg:col-span-8 lg:self-start">
          <p className={cn("eyebrow", rise)} style={delay(0.05)}>
            {ARENA.name}
          </p>
          <h1
            id="hackathons-hero-title"
            className={cn(
              "mt-6 font-fancy text-[3.25rem] font-light leading-[0.95] tracking-tight text-headings text-balance sm:text-7xl lg:text-[5.75rem]",
              rise,
            )}
            style={delay(0.15)}
          >
            Compete in the Arena.
          </h1>
          <p
            className={cn("mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-lg", rise)}
            style={delay(0.28)}
          >
            Ticketed team hackathons and seasonal global challenges, all run on {ARENA.name}.
          </p>
          <div className={cn("mt-10 flex flex-col gap-3 sm:flex-row", rise)} style={delay(0.4)}>
            <ExternalLink href={ARENA.hackathons} className="btn-primary w-full gap-2 whitespace-nowrap sm:w-auto">
              Browse hackathons
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </ExternalLink>
          </div>
        </div>

        <SeasonCalendar />
      </div>
    </section>
  )
}

/**
 * The five global-challenge seasons in calendar order: the hero's picture of a
 * year on Arena. From lg up they stand in a column on a rail that fills season
 * by season on load. Below lg they wrap, so all five are visible at once.
 */
function SeasonCalendar() {
  return (
    <ol
      aria-label="Global challenge seasons"
      className="mt-auto flex flex-wrap gap-x-6 gap-y-1 border-t border-white/[0.08] pt-6 sm:gap-x-10 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:block lg:self-end lg:border-t-0 lg:pt-0"
    >
      {SEASONS.map((season, i) => {
        const at = SEASON_START + i * SEASON_STEP
        return (
          <li key={season} className="relative lg:pl-10">
            {i < SEASONS.length - 1 && (
              <>
                <span aria-hidden className="absolute left-0 top-1/2 hidden h-full w-px bg-white/[0.1] lg:block" />
                <span
                  aria-hidden
                  className={cn("absolute left-0 top-1/2 hidden h-full w-px origin-top bg-white/60 lg:block", fill)}
                  style={delay(at)}
                />
              </>
            )}
            <span aria-hidden className="absolute left-0 top-1/2 hidden h-px w-5 bg-white/30 lg:block" />
            <span
              aria-hidden
              className={cn("absolute left-0 top-1/2 hidden h-px w-5 bg-white lg:block", lit)}
              style={delay(at)}
            />
            <span
              className={cn(
                "block font-fancy text-4xl font-light leading-[1.15] text-headings sm:text-5xl lg:text-6xl xl:text-7xl",
                rise,
              )}
              style={delay(at - 0.1)}
            >
              {season}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
