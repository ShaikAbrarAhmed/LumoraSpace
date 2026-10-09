"use client"

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"

interface MembershipContextType {
  /** Opens the "Sign in to continue" dialog and remembers `action` to replay after sign-in. */
  showModal: (action: string) => void
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined)

export function useMembership() {
  const context = useContext(MembershipContext)
  if (!context) {
    throw new Error("useMembership must be used within a MembershipProvider")
  }
  return context
}

const PENDING_ACTION_KEY = "pending_action"

/** The action a visitor started before being asked to sign in (e.g. "apply_cohort"), or null. */
export function readPendingAction(): string | null {
  try {
    return window.localStorage.getItem(PENDING_ACTION_KEY)
  } catch {
    return null
  }
}

/** Where to send someone once they are signed in: back to the program application if they started one. */
export function getPostAuthRedirect(fallback = "/"): string {
  return readPendingAction() === "apply_cohort" ? "/cohorts/join" : fallback
}

const MODAL_COPY: Record<string, string> = {
  apply_cohort: "Sign in or create a free account to continue your application.",
}
const DEFAULT_MODAL_COPY = "Sign in or create a free LumoraSpace account to continue."

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  const showModal = useCallback((action: string) => {
    setPendingAction(action)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setPendingAction(null)
  }, [])

  // After sign-in, replay the action the visitor started before being sent to /signin or /create-account.
  useEffect(() => {
    if (status !== "authenticated") return

    let storedAction: string | null
    try {
      storedAction = localStorage.getItem(PENDING_ACTION_KEY)
      if (!storedAction) return
      localStorage.removeItem(PENDING_ACTION_KEY)
    } catch {
      return
    }

    // /signin redirects to the same place by itself, so only navigate from elsewhere.
    if (storedAction === "apply_cohort" && pathname !== "/cohorts/join" && pathname !== "/signin") {
      router.push("/cohorts/join")
    }
  }, [status, pathname, router])

  // Remember the pending action, then let the link navigate to the auth page.
  const rememberPendingAction = () => {
    if (pendingAction) {
      try {
        localStorage.setItem(PENDING_ACTION_KEY, pendingAction)
      } catch {
        // Storage can be unavailable (private mode); sign-in still works without the replay.
      }
    }
    setIsOpen(false)
  }

  // Dialog basics: focus moves in, Tab stays inside, Escape closes, the page behind doesn't scroll,
  // and focus returns to where it was.
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"

    const frame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true })
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeModal()
        return
      }
      const dialog = dialogRef.current
      if (event.key !== "Tab" || !dialog) return
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement
      const outside = !dialog.contains(current)
      if (event.shiftKey && (current === first || outside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (current === last || outside)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      root.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true })
    }
  }, [isOpen, closeModal])

  const value = useMemo(() => ({ showModal }), [showModal])

  return (
    <MembershipContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-white/[0.08] bg-[#0B0B0C] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] sm:p-8"
            >
              <h2 id={titleId} className="font-fancy text-3xl font-light leading-tight text-headings sm:text-4xl">
                Sign in to continue
              </h2>
              <p id={descriptionId} className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {(pendingAction && MODAL_COPY[pendingAction]) || DEFAULT_MODAL_COPY}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/create-account"
                  onClick={rememberPendingAction}
                  className="flex h-12 items-center justify-center rounded-full bg-primary px-6 font-heading text-sm font-semibold text-[#050505] transition-colors duration-200 hover:bg-secondary"
                >
                  Join LumoraSpace
                </Link>
                <Link
                  href="/signin"
                  onClick={rememberPendingAction}
                  className="flex h-12 items-center justify-center rounded-full border border-white/15 px-6 font-heading text-sm font-semibold text-headings transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.04]"
                >
                  Sign in
                </Link>
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 rounded-full font-heading text-sm font-medium text-muted-foreground transition-colors hover:text-headings"
                >
                  Not now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MembershipContext.Provider>
  )
}
