"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { ARENA, CAREERS, CONTACT, EDU, NAV_ITEMS } from "@/lib/site"

const ECOSYSTEM = [
  { label: EDU.name, host: EDU.host, href: EDU.home },
  { label: ARENA.name, host: ARENA.host, href: ARENA.home },
  { label: CAREERS.name, host: CAREERS.host, href: CAREERS.home },
]

// On desktop the logo is the way home, which keeps the inline nav on one line from 1280px up.
const DESKTOP_ITEMS = NAV_ITEMS.filter((item) => item.href !== "/")

// Below this width the menu button takes over. Keep in sync with the min-[80rem] classes.
const DESKTOP_QUERY = "(min-width: 80rem)"

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Non-content siblings left alone when the open menu makes the rest of the page inert.
// The route announcer must stay live so the page change after a menu link is still announced.
const SKIP_INERT = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "LINK", "META", "NEXT-ROUTE-ANNOUNCER"])

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/"
  if (href === "/cohorts" && pathname.startsWith("/programs")) return true
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Rendered first in <body> by the root layout. Pages own their <main>, so the link
 * targets #main when a page sets it and otherwise moves focus to the first <main>.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        const target = document.getElementById("main") ?? document.querySelector("main")
        if (!target) return
        event.preventDefault()
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1")
        target.focus()
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:bg-primary focus:px-5 focus:font-heading focus:text-sm focus:font-semibold focus:text-primary-foreground"
    >
      Skip to content
    </a>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const user = session?.user

  // Remember the route the menu was opened on, so any navigation closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn !== null && openOn === pathname

  // The header only needs to know whether the page has left the top, not every scroll value.
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 12))

  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpenOn(null), [])

  // Escape closes, Tab stays inside the toggle + sheet, page scroll is locked,
  // and everything behind the sheet leaves the accessibility tree.
  useEffect(() => {
    if (!open) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"

    // The Close toggle lives in the header, so the sheet cannot be aria-modal (VoiceOver would
    // hide the toggle). Instead make every other branch of the page inert while the menu is open.
    const header = toggleRef.current?.closest("header") ?? null
    const madeInert: HTMLElement[] = []
    for (let node: HTMLElement | null = sheetRef.current; node && node !== document.body; node = node.parentElement) {
      const parent: HTMLElement | null = node.parentElement
      if (!parent) break
      for (const sibling of Array.from(parent.children)) {
        if (!(sibling instanceof HTMLElement) || sibling === node || sibling === header || sibling.inert) continue
        if (SKIP_INERT.has(sibling.tagName) || (header && sibling.contains(header))) continue
        sibling.inert = true
        madeInert.push(sibling)
      }
    }

    const firstLink = sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    firstLink?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
        toggleRef.current?.focus()
        return
      }
      if (event.key !== "Tab" || !sheetRef.current || !toggleRef.current) return
      const items = [toggleRef.current, ...sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement as HTMLElement | null
      if (event.shiftKey && (current === first || !items.includes(current as HTMLElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (current === last || !items.includes(current as HTMLElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onDesktop = (event: MediaQueryListEvent) => event.matches && close()

    document.addEventListener("keydown", onKeyDown)
    desktop.addEventListener("change", onDesktop)
    return () => {
      root.style.overflow = previousOverflow
      for (const element of madeInert) element.inert = false
      document.removeEventListener("keydown", onKeyDown)
      desktop.removeEventListener("change", onDesktop)
    }
  }, [open, close])

  const solid = scrolled || open

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Backdrop fades in once the page scrolls, so links stay legible over content. */}
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl transition-opacity duration-300 ${
            solid ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="LumoraSpace home">
            {/* White cut-outs of the brand mark and wordmark (public/logo-mark.png, public/logo-wordmark.png). */}
            <Image src="/logo-mark.png" alt="" width={156} height={123} loading="eager" className="h-8 w-auto" />
            <Image
              src="/logo-wordmark.png"
              alt="LumoraSpace"
              width={998}
              height={87}
              loading="eager"
              className="h-3 w-auto sm:h-3.5"
            />
          </Link>

          <nav aria-label="Main" className="hidden min-[80rem]:block">
            <ul className="flex items-center gap-6">
              {DESKTOP_ITEMS.map((item) => {
                const active = isActive(item.href, pathname)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block whitespace-nowrap py-2 font-heading text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
                        active ? "text-headings" : "text-muted-foreground hover:text-headings"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 bottom-0.5 h-px origin-left bg-headings transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {status === "loading" ? (
              <span aria-hidden className="hidden h-11 w-44 rounded-full bg-white/[0.04] min-[80rem]:block" />
            ) : user ? (
              <div className="hidden items-center gap-4 min-[80rem]:flex">
                <span className="flex items-center gap-2.5">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 shrink-0 rounded-full border border-white/10"
                    />
                  )}
                  <span className="hidden max-w-[9rem] truncate text-[13px] font-medium text-headings min-[90rem]:block">
                    {user.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="whitespace-nowrap py-2 font-heading text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-headings"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hidden whitespace-nowrap py-2 font-heading text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-headings min-[80rem]:block"
                >
                  Sign in
                </Link>
                <Link
                  href="/create-account"
                  className={`hidden h-11 items-center whitespace-nowrap rounded-full bg-primary px-5 font-heading text-[13px] font-semibold text-primary-foreground transition-[background-color,transform] duration-200 hover:bg-secondary active:scale-[0.98] ${
                    open ? "" : "sm:inline-flex"
                  }`}
                >
                  Join LumoraSpace
                </Link>
              </>
            )}

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpenOn(open ? null : pathname)}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded-full text-headings transition-colors hover:bg-white/[0.06] min-[80rem]:hidden"
            >
              <span aria-hidden className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300 ${
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Opening shows the sheet at once so focus can move into it; closing keeps it visible until the fade ends. */}
      <div
        id={menuId}
        ref={sheetRef}
        inert={!open}
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain bg-[#050505] duration-300 min-[80rem]:hidden ${
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
      >
        <div
          className={`container-page grid content-start gap-x-16 gap-y-12 pb-12 pt-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:pt-12 ${
            open ? "translate-y-0" : "-translate-y-3"
          }`}
        >
          <nav aria-label="Menu">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href, pathname)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-12 items-center gap-4 font-fancy text-[2rem] font-light leading-[1.15] transition-colors ${
                        active ? "text-headings" : "text-headings/60 hover:text-headings"
                      }`}
                    >
                      {item.label}
                      {active && <span aria-hidden className="h-px w-8 bg-headings/70" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex flex-col gap-12">
            <div>
              {status === "loading" ? (
                <span aria-hidden className="block h-12 rounded-full bg-white/[0.04]" />
              ) : user ? (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0B0B0C] p-3 pl-4">
                  <span className="flex min-w-0 items-center gap-3">
                    {user.image && (
                      <Image
                        src={user.image}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 shrink-0 rounded-full border border-white/10"
                      />
                    )}
                    <span className="truncate text-[15px] font-medium text-headings">{user.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      close()
                      signOut({ callbackUrl: "/" })
                    }}
                    className="min-h-11 shrink-0 rounded-full border border-white/15 px-4 font-heading text-xs font-medium uppercase tracking-[0.14em] text-headings transition-colors hover:bg-white/[0.06]"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/create-account" onClick={close} className="btn-primary min-h-12 w-full">
                    Join LumoraSpace
                  </Link>
                  <Link href="/signin" onClick={close} className="btn-secondary min-h-12 w-full">
                    Sign in
                  </Link>
                </div>
              )}
            </div>

            <div>
              <p className="eyebrow">LumoraSpace sites</p>
              <ul className="mt-3">
                {ECOSYSTEM.map((site) => (
                  <li key={site.href}>
                    <a
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="group flex min-h-14 items-center justify-between gap-4 py-2"
                    >
                      <span className="min-w-0">
                        <span className="block font-heading text-base font-medium text-headings">{site.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{site.host}</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-headings"
                      />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow">Contact</p>
              <a
                href={`mailto:${CONTACT.hello}`}
                className="mt-2 inline-flex min-h-11 items-center text-[15px] text-headings underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/70"
              >
                {CONTACT.hello}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
