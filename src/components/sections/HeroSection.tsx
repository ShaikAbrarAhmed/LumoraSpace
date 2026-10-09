"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { preload } from "react-dom"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useSession } from "next-auth/react"

const WORDMARK = "LumoraSpace"

// Entrance runs on CSS keyframes so the hero animates straight from the server HTML,
// without waiting for hydration. `motion-safe:` keeps it off for reduced-motion users.
const RISE_KEYFRAMES =
  "@keyframes ls-hero-rise{from{opacity:0;transform:translate3d(0,var(--ls-rise,1.25rem),0)}}"

const rise = "motion-safe:animate-[ls-hero-rise_1.2s_cubic-bezier(0.16,1,0.3,1)_both]"

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }

const SLOW_NETWORKS = ["slow-2g", "2g", "3g"]

const POSTER = "/silk_flow_bg.jpg"

export default function HeroSection() {
  // The poster frame is the largest paint on first load, but the browser only finds it once the
  // video element is parsed. This hint puts it in the document head so it starts downloading early.
  preload(POSTER, { as: "image", fetchPriority: "high" })

  const { status } = useSession()
  const isSignedIn = status === "authenticated"

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()

  // Parallax values stay bound and flatten under reduced motion, so the DOM always ends up static.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const contentY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], reduceMotion ? [1, 1] : [1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.08])

  // Play the silk video only on tablet and desktop screens with a fast connection, when motion is welcome,
  // data isn't being saved and the hero is on screen. Everyone else keeps the poster frame, which is the
  // same look without the motion. With preload="none" nothing is fetched until play() is called, and the
  // first attempt waits for the page load and an idle moment so the video never competes with JS and fonts.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const smallScreenQuery = window.matchMedia("(max-width: 767px)")
    const connection = (navigator as NavigatorWithConnection).connection
    const saveData = Boolean(connection?.saveData)
    const slowNet = SLOW_NETWORKS.includes(connection?.effectiveType ?? "")
    let onScreen = true
    let ready = false

    const sync = () => {
      if (ready && onScreen && !saveData && !slowNet && !smallScreenQuery.matches && !motionQuery.matches) {
        video.muted = true
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    observer.observe(video)
    motionQuery.addEventListener("change", sync)
    smallScreenQuery.addEventListener("change", sync)

    let idleHandle: number | undefined
    let timeoutHandle: number | undefined
    const begin = () => {
      ready = true
      sync()
    }
    const scheduleStart = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(begin)
      } else {
        timeoutHandle = window.setTimeout(begin, 200)
      }
    }

    if (document.readyState === "complete") {
      scheduleStart()
    } else {
      window.addEventListener("load", scheduleStart, { once: true })
    }

    return () => {
      observer.disconnect()
      motionQuery.removeEventListener("change", sync)
      smallScreenQuery.removeEventListener("change", sync)
      window.removeEventListener("load", scheduleStart)
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle)
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#050505]"
    >
      <style>{RISE_KEYFRAMES}</style>

      {/* Silk video: the hero's background look. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#050505]">
        <motion.div style={{ scale: videoScale }} className="absolute inset-0 bg-[#050505]">
          <video
            ref={videoRef}
            src="/silk_flow_bg.mp4"
            poster={POSTER}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
          />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050505]" />
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-page flex flex-1 flex-col items-center justify-center pb-16 pt-24 text-center"
      >
        <h1
          id="hero-title"
          className="whitespace-nowrap font-fancy text-[clamp(3.25rem,15.5vw,9rem)] font-light leading-[0.95] tracking-[0.01em] text-headings [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]"
        >
          <span className="sr-only">{WORDMARK}</span>
          <span aria-hidden="true">
            {WORDMARK.split("").map((char, index) => (
              <span
                key={index}
                className={`inline-block [--ls-rise:0.35em] ${rise}`}
                style={delay(0.2 + index * 0.06)}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        <p
          className={`mt-5 flex items-center gap-3 font-heading text-[0.7rem] font-medium tracking-[0.22em] text-headings/90 sm:mt-7 sm:gap-5 sm:text-base ${rise}`}
          style={delay(0.85)}
        >
          <span aria-hidden="true" className="h-px w-6 bg-gradient-to-r from-transparent to-white/50 sm:w-14" />
          <span>From Confused to Confident.</span>
          <span aria-hidden="true" className="h-px w-6 bg-gradient-to-l from-transparent to-white/50 sm:w-14" />
        </p>

        <p
          className={`mt-8 font-fancy text-[1.75rem] font-light leading-[1.2] text-headings/95 sm:mt-10 sm:text-4xl ${rise}`}
          style={delay(0.95)}
        >
          Talent exists everywhere.{" "}
          <em className="block italic text-headings/75 sm:inline">{"Guidance doesn't."}</em>
        </p>

        <div
          className={`mt-10 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4 ${rise}`}
          style={delay(1.1)}
        >
          {isSignedIn ? (
            <Link href="/services" className="btn-primary">
              Explore services
            </Link>
          ) : (
            <>
              <Link href="/create-account" className="btn-primary">
                Join LumoraSpace
              </Link>
              <Link href="/services" className="btn-secondary">
                Explore services
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </section>
  )
}
