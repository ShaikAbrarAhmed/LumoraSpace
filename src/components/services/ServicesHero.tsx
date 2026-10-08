import type { CSSProperties } from "react"
import { serviceCategories } from "@/data/services"
import { cn } from "@/lib/utils"
import { PROJECT_MAILTO } from "./shared"

// The entrance runs on CSS keyframes, so it plays straight from the server HTML with no
// hydration step to get wrong. `motion-safe:` leaves every element in its resting state for
// reduced-motion users.
const KEYFRAMES =
  "@keyframes ls-services-rise{from{opacity:0;transform:translate3d(0,1.25rem,0)}}" +
  "@keyframes ls-services-draw{from{transform:scaleX(0)}}"

const rise = "motion-safe:animate-[ls-services-rise_1s_cubic-bezier(0.16,1,0.3,1)_both]"
const draw = "motion-safe:animate-[ls-services-draw_0.8s_cubic-bezier(0.16,1,0.3,1)_both]"

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

/** When the first category appears, and the gap before each next one. */
const CATEGORY_START = 0.55
const CATEGORY_STEP = 0.07

export function ServicesHero() {
  return (
    <section
      aria-labelledby="services-hero-title"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden border-b border-white/[0.06]"
    >
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="container-page flex flex-1 flex-col gap-8 pb-12 pt-24 sm:gap-14 sm:pb-16">
        <div className="max-w-4xl">
          <p className={cn("eyebrow", rise)} style={delay(0.05)}>
            Services
          </p>
          <h1
            id="services-hero-title"
            className={cn(
              "mt-6 font-fancy text-[3.25rem] font-light leading-[0.95] tracking-tight text-headings text-balance sm:text-7xl lg:text-[5.75rem]",
              rise,
            )}
            style={delay(0.15)}
          >
            Technology solutions, end to end.
          </h1>
          <p
            className={cn("mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-lg", rise)}
            style={delay(0.28)}
          >
            AI, cloud, web, mobile and design. We plan, build and support the products your business runs on.
          </p>
          <div className={cn("mt-10 flex flex-col gap-3 sm:flex-row", rise)} style={delay(0.4)}>
            <a href={PROJECT_MAILTO} className="btn-primary w-full whitespace-nowrap sm:w-auto">
              Start a project
            </a>
            <a href="#capabilities" className="btn-secondary w-full whitespace-nowrap sm:w-auto">
              See what we do
            </a>
          </div>
        </div>

        <CategoryIndex />
      </div>
    </section>
  )
}

/**
 * The service categories: the hero's picture of what the page covers, and a shortcut to each
 * one in the catalog below. From lg up they sit in three columns, each on a hairline that draws in
 * on load. Below lg they wrap, so all of them are visible at once.
 */
function CategoryIndex() {
  return (
    <ol
      aria-label="Service categories"
      className="mt-auto flex flex-wrap gap-x-5 border-t border-white/[0.08] pt-3 sm:gap-x-8 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:border-t-0 lg:pt-0"
    >
      {serviceCategories.map((category, i) => {
        const at = CATEGORY_START + i * CATEGORY_STEP
        return (
          <li key={category.id} className="relative">
            <span aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-white/[0.08] lg:block" />
            <span
              aria-hidden
              className={cn("absolute inset-x-0 top-0 hidden h-px origin-left bg-white/40 lg:block", draw)}
              style={delay(at)}
            />
            <a
              href={`#${category.id}`}
              className={cn(
                "inline-flex min-h-11 items-center font-fancy text-lg font-light leading-tight text-[#D9D9D9] transition-colors duration-300 hover:text-headings sm:text-2xl lg:flex lg:py-4 xl:text-3xl",
                rise,
              )}
              style={delay(at)}
            >
              {category.title}
            </a>
          </li>
        )
      })}
    </ol>
  )
}
