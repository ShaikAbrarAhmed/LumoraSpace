"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion"
import type { Mentor } from "@/data/people"
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"
import { ExpertiseTags, LinkedInLink, PersonQuote, photoFrame } from "./PersonParts"

// Portrait column: a thumbnail beside the name below lg, 42% of the card from lg.
const CARD_SIZES = "(min-width: 1024px) 22vw, (min-width: 640px) 160px, 112px"

/**
 * Mentors side by side in one row. The row pins to the screen and slides sideways as the page
 * scrolls, so each mentor comes into view in turn. Under reduced motion nothing pins: the row
 * becomes an ordinary horizontal scroller.
 */
export function MentorsScroller({ mentors, lead }: { mentors: Mentor[]; lead: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const reduce = usePrefersReducedMotion()
  // How far the row has to travel for the last card to reach the right edge.
  const [travel, setTravel] = useState(0)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const x = useMotionValue(0)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const measure = () => setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  const slide = useCallback(
    (progress: number) => x.set(reduce ? 0 : -progress * travel),
    [reduce, travel, x],
  )

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    slide(progress)
    setActive(Math.round(progress * (mentors.length - 1)))
  })
  // Re-place the row when its travel changes (first measure, resize) without waiting for a scroll.
  useEffect(() => slide(scrollYProgress.get()), [slide, scrollYProgress])

  /** Scrolls the page to the point where the given mentor's card is in view. */
  const goTo = useCallback(
    (slug: string, behavior: ScrollBehavior) => {
      const section = sectionRef.current
      const track = trackRef.current
      const card = document.getElementById(slug)
      if (!section || !track || !card) return false
      if (reduce) {
        card.scrollIntoView({ behavior, block: "nearest", inline: "start" })
        return true
      }
      const offset = Math.min(travel, card.offsetLeft - (track.firstElementChild as HTMLElement).offsetLeft)
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY + offset, behavior })
      return true
    },
    [reduce, travel],
  )

  // A link such as /mentors#sandeep lands on that mentor once the row has been measured.
  useEffect(() => {
    if (!travel) return
    const land = () => {
      const slug = window.location.hash.slice(1)
      if (mentors.some((m) => m.slug === slug)) goTo(slug, "instant")
    }
    land()
    window.addEventListener("hashchange", land)
    return () => window.removeEventListener("hashchange", land)
  }, [goTo, mentors, travel])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="mentors-title"
      className="relative"
      style={reduce ? undefined : { height: `calc(100dvh + ${travel}px)` }}
    >
      <div
        className={cn(
          "flex flex-col justify-center gap-5 pb-5 pt-20 sm:gap-6 sm:pt-24",
          !reduce && "sticky top-0 h-[100dvh] overflow-hidden",
        )}
      >
        <header className="container-page">
          <p className="eyebrow">Mentors</p>
          <h1
            id="mentors-title"
            className="mt-3 font-fancy text-[2rem] font-light leading-[1.05] tracking-tight text-headings text-balance sm:text-5xl"
          >
            Learn from people who do the work.
          </h1>
          <p className="mt-4 hidden max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty [@media(min-height:900px)]:block">
            {lead}
          </p>
        </header>

        <div ref={viewportRef} className={cn("min-h-0", reduce && "overflow-x-auto")}>
          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="flex w-max items-stretch gap-4 px-5 sm:gap-6 sm:px-8 lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))]"
          >
            {mentors.map((m, i) => (
              <li key={m.slug} className="flex w-[82vw] shrink-0 sm:w-[60vw] lg:w-[56vw] lg:max-w-[46rem]">
                <article
                  id={m.slug}
                  className={cn(
                    "grid w-full grid-cols-[6rem_minmax(0,1fr)] content-start gap-x-4 gap-y-4 rounded-2xl border bg-[#0B0B0C] p-5 transition-[border-color,opacity] duration-500 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:content-stretch lg:gap-x-8 lg:gap-y-0 lg:p-7",
                    i === active || reduce ? "border-white/20 opacity-100" : "border-white/[0.08] opacity-60",
                  )}
                >
                  {/* The portrait keeps its 4:5 frame at every size, so the whole face stays in view. From lg its
                      height follows the screen height, so the card always fits on one screen. */}
                  <div className={cn(photoFrame, "self-start rounded-xl lg:row-span-2 lg:h-[clamp(13rem,calc(100dvh-25rem),23rem)]")}>
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      loading={i === 0 ? "eager" : undefined}
                      fetchPriority={i === 0 ? "high" : undefined}
                      sizes={CARD_SIZES}
                      className="object-cover"
                      style={{ objectPosition: m.imagePosition }}
                    />
                  </div>

                  <div className="self-center lg:self-start">
                    <h2 className="font-heading text-2xl font-medium tracking-tight text-headings sm:text-3xl">
                      {m.name}
                    </h2>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                      {m.role}
                      {" at "}
                      <span className="text-headings/85">{m.company}</span>
                    </p>
                  </div>

                  <div className="col-span-2 lg:col-span-1 lg:col-start-2 lg:self-end lg:pt-6">
                    {m.quote && <PersonQuote quote={m.quote} name={m.name} size="md" />}
                    <ExpertiseTags items={m.expertise} className="mt-4 hidden [@media(min-width:640px)_and_(min-height:760px)]:flex" />
                    <LinkedInLink name={m.name} href={m.linkedin} className="mt-2 sm:mt-3" />
                  </div>
                </article>
              </li>
            ))}
          </motion.ol>
        </div>

        {/* Who is in view, and a way to jump to anyone in the row */}
        <nav aria-label="Mentors" className="container-page hidden sm:block">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 border-t border-white/[0.08] pt-3">
            {mentors.map((m, i) => (
              <li key={m.slug}>
                <a
                  href={`#${m.slug}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={(event) => {
                    if (!goTo(m.slug, reduce ? "instant" : "smooth")) return
                    event.preventDefault()
                    window.history.replaceState(window.history.state, "", `#${m.slug}`)
                  }}
                  className={cn(
                    "inline-flex min-h-11 items-center font-heading text-sm transition-colors duration-300",
                    i === active ? "text-headings" : "text-muted-foreground hover:text-headings",
                  )}
                >
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
