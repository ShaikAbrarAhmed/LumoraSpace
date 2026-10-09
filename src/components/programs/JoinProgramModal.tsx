"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { ApplicationForm, type ApplyProgram } from "./ApplicationForm"
import { Money } from "./money"

type JoinProgramModalProps = {
  isOpen: boolean
  onClose: () => void
  program: ApplyProgram
}

const subscribe = () => () => {}
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

export function JoinProgramModal({ isOpen, onClose, program }: JoinProgramModalProps) {
  const isClient = useIsClient()
  if (!isClient) return null

  return createPortal(
    <AnimatePresence>{isOpen && <Dialog key="dialog" onClose={onClose} program={program} />}</AnimatePresence>,
    document.body,
  )
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Mounted only while open, so its state (form values, success view) resets on every open. */
function Dialog({ onClose, program }: { onClose: () => void; program: ApplyProgram }) {
  const titleId = useId()
  const descId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)

  // Scroll lock + focus in / focus back
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const { body, documentElement } = document
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - documentElement.clientWidth
    body.style.overflow = "hidden"
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    panelRef.current?.focus({ preventScroll: true })

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [])

  // Escape closes, Tab stays inside the dialog
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab" || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      } else if (!panelRef.current.contains(active)) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#08080A] shadow-2xl outline-none sm:max-h-[calc(100dvh-3rem)] sm:max-w-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:px-8">
          <div className="min-w-0">
            <p className="eyebrow">{submitted ? "Application sent" : "Apply"}</p>
            <h2
              id={titleId}
              className="mt-2 font-fancy text-2xl font-light leading-tight text-headings text-balance sm:text-3xl"
            >
              {program.title}
            </h2>
            <p id={descId} className="mt-1 text-sm text-muted-foreground">
              {program.duration} · <Money>{program.fee}</Money>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-headings"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
          {submitted ? (
            <div role="status" className="py-6">
              <p className="font-fancy text-3xl font-light text-headings">Application received.</p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Thank you. A program coordinator will contact you shortly to confirm your payment plan and complete
                your enrollment.
              </p>
              <button type="button" onClick={onClose} className="btn-secondary mt-8 h-12 w-full sm:w-auto">
                Close
              </button>
            </div>
          ) : (
            <ApplicationForm
              programs={[program]}
              onSuccess={() => {
                setSubmitted(true)
                // the submit button unmounts; keep focus inside the dialog
                requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }))
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}
