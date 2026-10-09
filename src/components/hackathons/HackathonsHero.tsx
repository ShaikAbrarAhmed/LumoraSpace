import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { ARENA } from "@/lib/site"
import { cn } from "@/lib/utils"
import { ExternalLink } from "./ExternalLink"

// The entrance runs on CSS keyframes, so it plays straight from the server HTML
// with no hydration step to get wrong. `motion-safe:` leaves every element in its
// resting state for reduced-motion users.
const KEYFRAMES = "@keyframes ls-arena-rise{from{opacity:0;transform:translate3d(0,1.25rem,0)}}"

const rise = "motion-safe:animate-[ls-arena-rise_1s_cubic-bezier(0.16,1,0.3,1)_both]"

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

export function HackathonsHero() {
  return (
    <section aria-labelledby="hackathons-hero-title" className="relative isolate flex min-h-[80dvh] flex-col overflow-hidden">
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="container-page flex flex-1 flex-col justify-center pb-16 pt-28 sm:pb-20">
        <div className="max-w-4xl">
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
      </div>
    </section>
  )
}
