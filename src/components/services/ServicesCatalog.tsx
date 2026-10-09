"use client"

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { serviceCategories } from "@/data/services"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion"

/**
 * Where a category lands after a click on desktop; matches the index's `lg:top-32`.
 * Native hash jumps land in the same places: html's `scroll-padding-top: 6rem` (96px) plus each
 * category's scroll margin gives 96 + 32 = 128 on desktop and 96 + 53 = 149 on small screens
 * (header 64 + chip bar 69 + 16).
 */
const DESKTOP_OFFSET = 128
/** Height of the fixed site header (Navbar `h-16`); the mobile chip bar sits right under it. */
const HEADER_HEIGHT = 64
/** Input that means the reader has taken over, so a pending hash correction must not move the page. */
const USER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const

export function ServicesCatalog() {
  const listRef = useRef<HTMLDivElement>(null)
  const chipBarRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // While a clicked category is scrolling into place, the highlight stays on it instead of
  // flickering through every category the page passes.
  const lockRef = useRef<{ id: string; timer: number } | null>(null)
  const [active, setActive] = useState(serviceCategories[0].id)
  const reduce = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 40%", "end 60%"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })
  // Under reduced motion the lines stay static (full) and only the highlighted item changes.
  const progress = useTransform(smooth, [0, 1], reduce ? [1, 1] : [0, 1])

  const releaseLock = useCallback(() => {
    if (lockRef.current) window.clearTimeout(lockRef.current.timer)
    lockRef.current = null
  }, [])

  // Scrollspy: when a category crosses a band just above the middle of the viewport, the current
  // category is the last one whose top has passed the 40% line (so fast jumps still resolve).
  useEffect(() => {
    const sections = serviceCategories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      () => {
        const line = window.innerHeight * 0.4
        let current = sections[0]
        for (const el of sections) {
          if (el.getBoundingClientRect().top <= line) current = el
        }
        const lock = lockRef.current
        if (lock) {
          if (lock.id !== current.id) return
          releaseLock()
        }
        setActive(current.id)
      },
      { rootMargin: "-35% 0px -55% 0px" },
    )
    for (const el of sections) observer.observe(el)
    return () => {
      observer.disconnect()
      releaseLock()
    }
  }, [releaseLock])

  // Keep the active chip in view inside the horizontal track (mobile only; the bar is hidden on desktop).
  useEffect(() => {
    const track = trackRef.current
    if (!track || track.offsetParent === null) return
    const chip = track.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!chip) return
    track.scrollTo({
      left: chip.offsetLeft - (track.clientWidth - chip.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    })
  }, [active, reduce])

  /** Puts a category just under the header (and the chip bar on small screens) and highlights it. */
  const scrollToCategory = useCallback(
    (id: string, behavior: ScrollBehavior) => {
      const target = document.getElementById(id)
      if (!target) return false

      const isDesktop = window.matchMedia("(min-width: 64rem)").matches
      const offset = isDesktop ? DESKTOP_OFFSET : HEADER_HEIGHT + (chipBarRef.current?.offsetHeight ?? 0) + 16
      const top = target.getBoundingClientRect().top + window.scrollY - offset

      releaseLock()
      setActive(id)
      lockRef.current = { id, timer: window.setTimeout(releaseLock, 1500) }

      window.scrollTo({ top, behavior })
      return true
    },
    [releaseLock],
  )

  // A category link from another page (or a pasted URL) lands where an in-page click would. The
  // browser or the router has already jumped to the hash, but a jump made mid-scroll or before the
  // page settles can leave the heading under the header and the highlight on the wrong category, so
  // the position is corrected now and once more after layout settles. A target far from the top
  // means the position was restored (back, forward, reload) and is left alone.
  useEffect(() => {
    const ids = new Set(serviceCategories.map((c) => c.id))
    let frame = 0
    let timer = 0
    const stop = () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      for (const type of USER_INPUT) window.removeEventListener(type, stop)
    }
    const correct = (id: string) => {
      const top = document.getElementById(id)?.getBoundingClientRect().top
      if (top === undefined || Math.abs(top) > window.innerHeight / 2) return false
      return scrollToCategory(id, "instant")
    }
    const land = () => {
      stop()
      const id = window.location.hash.slice(1)
      if (!ids.has(id)) return
      for (const type of USER_INPUT) window.addEventListener(type, stop, { passive: true })
      frame = window.requestAnimationFrame(() => {
        if (!correct(id)) return stop()
        timer = window.setTimeout(() => {
          correct(id)
          stop()
        }, 300)
      })
    }

    land()
    window.addEventListener("hashchange", land)
    return () => {
      stop()
      window.removeEventListener("hashchange", land)
    }
  }, [scrollToCategory])

  const goTo = useCallback(
    (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!scrollToCategory(id, reduce ? "instant" : "smooth")) return
      event.preventDefault()
      window.history.replaceState(window.history.state, "", `#${id}`)
    },
    [reduce, scrollToCategory],
  )

  return (
    <div className="relative">
      {/* Mobile and tablet: sticky, horizontally scrollable category bar under the fixed header */}
      <div
        ref={chipBarRef}
        className="sticky top-16 z-30 -mx-5 border-b border-white/[0.06] bg-[#050505]/95 backdrop-blur-md sm:-mx-8 lg:hidden"
      >
        <nav aria-label="Service categories">
          <div
            ref={trackRef}
            data-allow-overflow
            className="relative flex gap-2 overflow-x-auto overscroll-x-contain px-5 py-3 [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
          >
            {serviceCategories.map((c) => {
              const on = c.id === active
              return (
                <a
                  key={c.id}
                  data-id={c.id}
                  href={`#${c.id}`}
                  onClick={goTo(c.id)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 font-heading text-sm transition-colors duration-300",
                    on
                      ? "border-white bg-white text-[#050505]"
                      : "border-white/[0.12] text-muted-foreground hover:border-white/30 hover:text-headings",
                  )}
                >
                  {c.title}
                </a>
              )
            })}
            <span aria-hidden className="w-3 shrink-0" />
          </div>
        </nav>
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-white/70"
        />
      </div>

      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-24">
        {/* Desktop: sticky index; the line beside it fills as you read through the categories */}
        <aside className="hidden lg:block">
          <nav aria-label="Service categories" className="sticky top-32">
            <div className="relative pl-6">
              <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-white/[0.08]" />
              <motion.span
                aria-hidden
                style={{ scaleY: progress }}
                className="absolute inset-y-0 left-0 w-px origin-top bg-white/70"
              />
              <ol>
                {serviceCategories.map((c) => {
                  const on = c.id === active
                  return (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        onClick={goTo(c.id)}
                        aria-current={on ? "true" : undefined}
                        className={cn(
                          "block py-2 font-heading text-[15px] leading-snug transition-colors duration-300",
                          on ? "text-headings" : "text-muted-foreground hover:text-headings",
                        )}
                      >
                        <span className={cn("inline-block transition-transform duration-300", on && "translate-x-1")}>
                          {c.title}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ol>
            </div>
          </nav>
        </aside>

        {/* Categories */}
        <div ref={listRef}>
          {serviceCategories.map((c) => (
            <article
              key={c.id}
              id={c.id}
              aria-labelledby={`${c.id}-title`}
              className="scroll-mt-[53px] border-t border-white/[0.08] py-14 first:border-t-0 first:pt-10 sm:py-16 lg:scroll-mt-8 lg:first:pt-0"
            >
              <Reveal y={20}>
                <h3
                  id={`${c.id}-title`}
                  className="font-fancy text-[2rem] font-light leading-[1.1] tracking-tight text-headings text-balance sm:text-4xl lg:text-[2.75rem]"
                >
                  {c.title}
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">
                  {c.summary}
                </p>
                <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                  {c.services.map((s) => (
                    <li key={s} className="text-[15px] leading-snug text-[#D9D9D9] sm:text-base">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
