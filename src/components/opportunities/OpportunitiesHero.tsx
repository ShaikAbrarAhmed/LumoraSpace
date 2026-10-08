import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { ARENA, CAREERS } from "@/lib/site"
import { cn } from "@/lib/utils"

// The entrance runs on CSS keyframes, so it plays straight from the server HTML
// with no hydration step to get wrong. `motion-safe:` leaves every element in its
// resting state for reduced-motion users.
const KEYFRAMES = "@keyframes ls-opp-rise{from{opacity:0;transform:translate3d(0,1.25rem,0)}}"

const rise = "motion-safe:animate-[ls-opp-rise_1s_cubic-bezier(0.16,1,0.3,1)_both]"

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

export function OpportunitiesHero() {
  return (
    <section
      aria-labelledby="opportunities-hero-title"
      className="relative isolate flex min-h-[80dvh] flex-col overflow-hidden border-b border-white/[0.06]"
    >
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_85%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="container-page flex flex-1 flex-col justify-center pb-16 pt-28 sm:pb-20">
        <div className="max-w-4xl">
          <h1
            id="opportunities-hero-title"
            className={cn(
              "font-fancy text-[3.25rem] font-light leading-none tracking-tight text-headings text-balance sm:text-7xl lg:text-8xl xl:text-[7rem]",
              rise,
            )}
            style={delay(0.1)}
          >
            Find what&apos;s next.
          </h1>
          <p
            className={cn(
              "mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground text-pretty sm:mt-8 sm:text-lg",
              rise,
            )}
            style={delay(0.22)}
          >
            Verified internships, real projects and 1:1 mentorship on {CAREERS.name}, and competitions on {ARENA.name}.
          </p>

          <div className={cn("mt-10 flex flex-col gap-3 sm:flex-row sm:items-center", rise)} style={delay(0.34)}>
            <a
              href={CAREERS.home}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary min-h-12 w-full gap-2 whitespace-nowrap sm:w-auto"
            >
              Visit Careers
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href="#how-it-works" className="btn-secondary min-h-12 w-full whitespace-nowrap sm:w-auto">
              How it works
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
