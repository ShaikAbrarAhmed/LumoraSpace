"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { MENUS, type Menu } from "@/data/site-nav"
import { buttonClass, SmartLink } from "@/components/site/ui"
import { CONTACT } from "@/lib/site"
import { cn } from "@/lib/utils"

// Below this width the menus collapse into one full-screen sheet. Keep in sync with the lg: classes.
const DESKTOP_QUERY = "(min-width: 64rem)"

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Non-content siblings left alone when the open sheet makes the rest of the page inert.
// The route announcer must stay live so the page change after a menu link is still announced.
const SKIP_INERT = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "LINK", "META", "NEXT-ROUTE-ANNOUNCER"])

const matches = (pathname: string, route: string) => pathname === route || pathname.startsWith(`${route}/`)
const isCurrent = (menu: Menu, pathname: string) => menu.sections.some((route) => matches(pathname, route))

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
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:inline-flex focus:h-11 focus:items-center focus:rounded-[6px] focus:bg-ls-amber focus:px-5 focus:text-sm focus:font-semibold focus:text-ls-ink"
    >
      Skip to content
    </a>
  )
}

function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={cn("flex-none transition-transform duration-150", open && "rotate-180", className)}
    >
      <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="LumoraSpace home"
      className="inline-flex min-h-11 shrink-0 items-center gap-3 no-underline"
    >
      {/* White cut-outs of the brand mark and wordmark. */}
      <Image src="/logo-mark.png" alt="" width={156} height={123} loading="eager" className="h-[26px] w-auto lg:h-[30px]" />
      <Image src="/logo-wordmark.png" alt="" width={998} height={87} loading="eager" className="h-[11px] w-auto lg:h-[13px]" />
    </Link>
  )
}

/** Amber bar under the menu item for the section the visitor is in. */
function CurrentMark() {
  return <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-0.5 bg-ls-amber" />
}

function MenuLinkItem({ link, onNavigate }: { link: Menu["columns"][number]["links"][number]; onNavigate: () => void }) {
  return (
    <SmartLink
      href={link.href}
      onClick={onNavigate}
      className="group flex flex-col gap-0.5 border-t border-white/[0.08] py-2.5 no-underline"
    >
      <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="text-base font-medium text-ls-fg group-hover:text-white">{link.title}</span>
        {link.tag && <span className="text-[13px] text-ls-faint">{link.tag}</span>}
      </span>
      <span className="text-sm text-ls-body">{link.description}</span>
    </SmartLink>
  )
}

function MenuPanel({ menu, id, onNavigate }: { menu: Menu; id: string; onNavigate: () => void }) {
  return (
    <div
      id={id}
      className="absolute inset-x-0 top-full border-b border-white/10 bg-ls-ink-2 shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
    >
      <div
        className="ls-container grid gap-x-10 gap-y-7 pb-9 pt-8"
        style={{ gridTemplateColumns: `repeat(${menu.columns.length}, minmax(0, 1fr)) 300px` }}
      >
        {menu.columns.map((column) => (
          <div key={column.heading} className="flex flex-col gap-1.5">
            <span className="pb-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-ls-amber">{column.heading}</span>
            {column.links.map((link) => (
              <MenuLinkItem key={link.title} link={link} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-2.5 border-l border-white/10 pl-8">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ls-faint">{menu.promo.heading}</span>
          <p className="m-0 text-base text-ls-soft">{menu.promo.body}</p>
          <SmartLink href={menu.promo.href} onClick={onNavigate} className={buttonClass("amber", "sm", "self-start text-sm")}>
            {menu.promo.cta}
          </SmartLink>
        </div>
      </div>
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const user = session?.user

  // Desktop mega menu: which panel is open, remembered with the route it was opened on so navigation closes it.
  const [menuState, setMenuState] = useState<{ id: Menu["id"]; on: string } | null>(null)
  const openMenu = menuState && menuState.on === pathname ? menuState.id : null

  // Mobile sheet, same idea; plus which accordion group is expanded inside it.
  const [sheetOn, setSheetOn] = useState<string | null>(null)
  const sheetOpen = sheetOn !== null && sheetOn === pathname
  const [expanded, setExpanded] = useState<Menu["id"] | null>(null)

  const [scrolled, setScrolled] = useState(false)

  const uid = useId()
  const navRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setMenuState(null), [])
  const closeSheet = useCallback(() => setSheetOn(null), [])

  // Solid with blur once the page leaves the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Desktop panel: Esc closes and returns focus to its trigger; a click outside the header closes.
  useEffect(() => {
    if (!openMenu) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      closeMenu()
      navRef.current?.querySelector<HTMLElement>(`[data-menu="${openMenu}"]`)?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) closeMenu()
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [openMenu, closeMenu])

  // Mobile sheet: Escape closes, Tab stays inside the toggle + sheet, page scroll is locked,
  // and everything behind the sheet leaves the accessibility tree.
  useEffect(() => {
    if (!sheetOpen) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"

    // The Close toggle lives in the header, so the sheet cannot be aria-modal (VoiceOver would
    // hide the toggle). Instead make every other branch of the page inert while the sheet is open.
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

    sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeSheet()
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
    const onDesktop = (event: MediaQueryListEvent) => event.matches && closeSheet()

    document.addEventListener("keydown", onKeyDown)
    desktop.addEventListener("change", onDesktop)
    return () => {
      root.style.overflow = previousOverflow
      for (const element of madeInert) element.inert = false
      document.removeEventListener("keydown", onKeyDown)
      desktop.removeEventListener("change", onDesktop)
    }
  }, [sheetOpen, closeSheet])

  const solid = scrolled || openMenu !== null || sheetOpen
  const aboutCurrent = matches(pathname, "/our-story")
  const desktopItem =
    "relative inline-flex min-h-11 items-center gap-1.5 rounded-[6px] px-3 text-[15px] no-underline transition-colors"

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color] duration-200",
          solid ? "border-white/10 bg-[rgba(10,10,10,0.82)] backdrop-blur-xl" : "border-transparent bg-transparent",
          sheetOpen && "bg-ls-ink backdrop-blur-none",
        )}
      >
        <div ref={navRef}>
          <div className="ls-container flex min-h-[60px] items-center justify-between gap-8 lg:min-h-[68px]">
            <Brand onClick={closeSheet} />

            <nav aria-label="Main" className="hidden items-center gap-x-2 lg:flex">
              {MENUS.map((menu) => {
                const open = openMenu === menu.id
                const current = isCurrent(menu, pathname)
                return (
                  <button
                    key={menu.id}
                    type="button"
                    data-menu={menu.id}
                    aria-expanded={open}
                    aria-controls={`${uid}-${menu.id}`}
                    onClick={() => setMenuState(open ? null : { id: menu.id, on: pathname })}
                    className={cn(
                      desktopItem,
                      "cursor-pointer border-none font-[inherit]",
                      open ? "bg-white/[0.08] text-ls-fg" : current ? "bg-transparent text-ls-fg" : "bg-transparent text-ls-body hover:text-ls-fg",
                    )}
                  >
                    {menu.label}
                    <Chevron open={open} />
                    {current && !open && <CurrentMark />}
                  </button>
                )
              })}
              <Link
                href="/our-story"
                aria-current={aboutCurrent ? "page" : undefined}
                className={cn(desktopItem, aboutCurrent ? "text-ls-fg" : "text-ls-body hover:text-ls-fg")}
              >
                About
                {aboutCurrent && <CurrentMark />}
              </Link>

              {status === "loading" ? (
                <span aria-hidden className="mx-3 h-5 w-14 rounded bg-white/[0.04]" />
              ) : user ? (
                <span className="ml-1 flex items-center gap-2">
                  {user.image && (
                    <Image src={user.image} alt="" width={28} height={28} className="h-7 w-7 rounded-full border border-white/10" />
                  )}
                  <span className="sr-only">Signed in as {user.name}</span>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={cn(desktopItem, "cursor-pointer border-none bg-transparent font-[inherit] text-ls-body hover:text-ls-fg")}
                  >
                    Log out
                  </button>
                </span>
              ) : (
                <Link
                  href="/signin"
                  aria-current={matches(pathname, "/signin") ? "page" : undefined}
                  className={cn(desktopItem, "text-ls-body hover:text-ls-fg")}
                >
                  Sign in
                </Link>
              )}

              <Link href="/contact" className={buttonClass("light", "sm", "ml-2 min-h-10")}>
                Contact
              </Link>
            </nav>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => {
                setExpanded(null)
                setSheetOn(sheetOpen ? null : pathname)
              }}
              aria-expanded={sheetOpen}
              aria-controls={`${uid}-sheet`}
              aria-label={sheetOpen ? "Close menu" : "Open menu"}
              className={cn(
                "-mr-2.5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-[6px] border-none text-ls-fg lg:hidden",
                sheetOpen ? "bg-white/[0.08]" : "bg-transparent",
              )}
            >
              <span aria-hidden className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300", sheetOpen && "translate-y-1.5 rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300", sheetOpen && "-translate-y-1.5 -rotate-45")} />
              </span>
            </button>
          </div>

          {/* Desktop mega panels. Only the open one is rendered. */}
          <div className="hidden lg:block">
            {MENUS.map((menu) =>
              openMenu === menu.id ? (
                <MenuPanel key={menu.id} menu={menu} id={`${uid}-${menu.id}`} onNavigate={closeMenu} />
              ) : null,
            )}
          </div>
        </div>
      </header>

      {/* Mobile sheet: one accordion per menu, then the main actions. */}
      <div
        id={`${uid}-sheet`}
        ref={sheetRef}
        inert={!sheetOpen}
        className={cn(
          "fixed inset-x-0 bottom-0 top-[60px] z-40 overflow-y-auto overscroll-contain bg-ls-ink duration-200 lg:hidden",
          sheetOpen ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]",
        )}
      >
        <div className="ls-container flex flex-col pb-6 pt-2">
          <nav aria-label="Menu">
            <ul className="m-0 list-none p-0">
              {MENUS.map((menu) => {
                const open = expanded === menu.id
                return (
                  <li key={menu.id} className="border-b border-white/10">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`${uid}-m-${menu.id}`}
                      onClick={() => setExpanded(open ? null : menu.id)}
                      className="flex min-h-14 w-full cursor-pointer items-center justify-between border-none bg-transparent p-0 font-[inherit] text-lg font-medium text-ls-fg"
                    >
                      {menu.label}
                      <Chevron open={open} className="h-3.5 w-3.5 text-ls-faint" />
                    </button>
                    {open && (
                      <div id={`${uid}-m-${menu.id}`} className="flex flex-col gap-5 pb-5">
                        {menu.columns.map((column) => (
                          <div key={column.heading} className="flex flex-col gap-1">
                            <span className="pb-1 text-xs font-semibold uppercase tracking-[0.08em] text-ls-amber">{column.heading}</span>
                            {column.links.map((link) => (
                              <MenuLinkItem key={link.title} link={link} onNavigate={closeSheet} />
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
              <li className="border-b border-white/10">
                <Link
                  href="/our-story"
                  onClick={closeSheet}
                  aria-current={aboutCurrent ? "page" : undefined}
                  className="flex min-h-14 items-center text-lg font-medium text-ls-fg no-underline"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>

          <Link href="/cohorts" onClick={closeSheet} className={buttonClass("amber", "lg", "mt-6 w-full")}>
            Explore programs
          </Link>
          <Link href="/contact" onClick={closeSheet} className={buttonClass("outline", "lg", "mt-3 w-full")}>
            Contact
          </Link>

          <div className="mt-3">
            {status === "loading" ? (
              <span aria-hidden className="block h-[52px] rounded-[6px] bg-white/[0.04]" />
            ) : user ? (
              <div className="flex items-center justify-between gap-4 rounded-[6px] border border-white/10 p-2 pl-3">
                <span className="flex min-w-0 items-center gap-3">
                  {user.image && (
                    <Image src={user.image} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full border border-white/10" />
                  )}
                  <span className="truncate text-[15px] font-medium text-ls-fg">{user.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeSheet()
                    signOut({ callbackUrl: "/" })
                  }}
                  className={buttonClass("outline", "sm", "shrink-0 bg-transparent font-[inherit]")}
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link href="/signin" onClick={closeSheet} className={buttonClass("outline", "lg", "w-full")}>
                Sign in
              </Link>
            )}
          </div>

          <a
            href={`mailto:${CONTACT.hello}`}
            className="mt-5 self-center text-sm text-ls-faint no-underline hover:text-ls-fg"
          >
            {CONTACT.hello}
          </a>
        </div>
      </div>
    </>
  )
}
