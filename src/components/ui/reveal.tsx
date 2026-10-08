"use client"

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number }

/**
 * Fades content up into place the first time it scrolls into view.
 * With reduced motion the content simply appears (no fade, no slide).
 */
export function Reveal({ delay = 0, y = 24, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
