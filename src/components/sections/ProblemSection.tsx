"use client"

import { useRef, useSyncExternalStore } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "@/components/ui/reveal"

const questions = [
  "What stack should I even learn?",
  "How do I structure a real application?",
  "Am I ready for a hackathon?",
]

// Staggered left edge on larger screens gives the questions an editorial rhythm.
const indents = ["", "sm:pl-[8%] lg:pl-[14%]", "sm:pl-[16%] lg:pl-[28%]"]

const pillars = [
  {
    title: "Direction",
    text: "Structured programs that set what to learn next, and in what order.",
  },
  {
    title: "Community",
    text: "Students learning the same things, ready to help when you get stuck.",
  },
  {
    title: "Accountability",
    text: "Scheduled live sessions and a capstone project keep you moving every week.",
  },
  {
    title: "Mentorship",
    text: "Industry mentors teach the programs and give feedback on your actual work.",
  },
  {
    title: "Opportunities",
    text: "Hackathons on Lumora Arena and internships on Lumora Careers when you're ready.",
  },
]

export function ProblemSection() {
  const reduceMotion = useStaticMotion()

  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="section-y border-t border-white/[0.06] bg-[#08080A]"
    >
      <div className="container-page">
        <Reveal>
          <h2
            id="problem-title"
            className="max-w-5xl text-balance font-fancy text-[2.75rem] font-light leading-[1.05] tracking-tight text-headings sm:text-6xl lg:text-[5.25rem]"
          >
            {"Most students don't lack talent."}{" "}
            <span className="text-muted-foreground">They lack direction.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {
              "The internet has endless resources. Most beginners stall because they don't know what to learn, where to start, or how to stay consistent."
            }
          </p>
        </Reveal>

        <ul aria-label="Questions students ask us" className="mt-20 space-y-8 sm:mt-28 sm:space-y-12">
          {questions.map((question, index) => (
            <Question key={question} text={question} className={indents[index]} animate={!reduceMotion} />
          ))}
        </ul>

        <div id="features" className="mt-24 scroll-mt-28 border-t border-white/[0.08] pt-12 sm:mt-32 sm:pt-16">
          <h3 className="font-heading text-lg font-medium text-headings">What changes with LumoraSpace</h3>
          <dl className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} y={16} delay={index * 0.05}>
                <dt className="font-fancy text-[2rem] font-light leading-[1.1] text-headings">{pillar.title}</dt>
                <dd className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground">{pillar.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

const noopSubscribe = () => () => {}

// Framer already knows the reduced-motion preference on the first client render, which would make that
// render differ from the server HTML. Flattening only once hydration is done keeps the two identical.
function useStaticMotion() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)
  return Boolean(useReducedMotion()) && hydrated
}

// Each question brightens and settles as it moves up into the reading zone.
// The motion values stay bound and flatten to the resting state under reduced motion, so the
// DOM is corrected even when the server HTML was rendered with the animated starting style.
function Question({ text, className, animate }: { text: string; className: string; animate: boolean }) {
  const ref = useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.55"] })
  const opacity = useTransform(scrollYProgress, [0, 1], animate ? [0.15, 1] : [1, 1])
  const y = useTransform(scrollYProgress, [0, 1], animate ? [28, 0] : [0, 0])

  return (
    <li ref={ref} className={className}>
      <motion.p
        style={{ opacity, y }}
        className="text-balance pb-1 font-fancy text-[2rem] font-light italic leading-[1.15] text-headings sm:text-5xl lg:text-6xl"
      >
        {`“${text}”`}
      </motion.p>
    </li>
  )
}
