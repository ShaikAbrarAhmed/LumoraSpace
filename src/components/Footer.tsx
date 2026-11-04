import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { FOOTER_COLUMNS } from "@/data/site-nav"
import { ButtonLink, Dots, SmartLink } from "@/components/site/ui"
import { COMPANY, CONTACT, REGISTRATION, SOCIAL } from "@/lib/site"

const iconProps = {
  "aria-hidden": true,
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

const COMMUNITY: { label: string; detail: string; href: string; icon: ReactNode }[] = [
  {
    label: "WhatsApp",
    detail: "Community group",
    href: SOCIAL.whatsapp,
    icon: (
      <svg {...iconProps}>
        <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
        <path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1.2-1.2 2 1-.4 1.7c-3.6.4-7.9-3.9-7.5-7.5L10.5 7l1 2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    detail: "@lumora.spacee",
    href: SOCIAL.instagram,
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.8" cy="7.2" r="0.6" />
      </svg>
    ),
  },
  {
    label: "Discord",
    detail: "Community server",
    href: SOCIAL.discord,
    icon: (
      <svg {...iconProps}>
        <path d="M8 7.5c2.6-.9 5.4-.9 8 0l1.5 9c-1.2.9-2.4 1.4-3.6 1.6l-.8-1.6M8 7.5 6.5 16.5c1.2.9 2.4 1.4 3.6 1.6l.8-1.6" />
        <circle cx="9.8" cy="12.5" r="0.9" />
        <circle cx="14.2" cy="12.5" r="0.9" />
      </svg>
    ),
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ls-ink">
      <Dots className="h-20" />
      <div className="ls-container relative flex flex-col gap-14 pb-10 pt-[clamp(64px,7vw,96px)]">
        <div className="flex flex-wrap gap-x-16 gap-y-12">
          <div className="flex flex-[1.2_1_300px] flex-col gap-[18px]">
            <Link href="/" aria-label="LumoraSpace home" className="inline-flex min-h-11 items-center gap-2.5 self-start no-underline">
              <Image src="/logo-mark.png" alt="" width={156} height={123} className="h-10 w-auto" />
              <Image src="/logo-wordmark.png" alt="" width={998} height={87} className="h-[17px] w-auto" />
            </Link>
            <p className="m-0 max-w-[30ch] text-lg text-ls-soft">Tech training for students. Software for businesses.</p>
            <a
              href={`mailto:${CONTACT.hello}`}
              className="inline-flex min-h-11 items-center self-start font-medium text-ls-amber underline-offset-4 hover:text-ls-amber-hover"
            >
              {CONTACT.hello}
            </a>
            <ButtonLink href="/cohorts" size="sm" className="min-h-11 self-start px-5">
              Registration opens {REGISTRATION.opensShort}
            </ButtonLink>
          </div>

          <div className="grid flex-[3_1_640px] gap-x-6 gap-y-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.heading} aria-label={column.heading} className="flex flex-col gap-2.5">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ls-fg">{column.heading}</span>
                <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <SmartLink
                        href={link.href}
                        className="inline-flex min-h-9 items-center text-ls-body no-underline transition-colors hover:text-ls-fg"
                      >
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-y border-white/10 py-4">
          <span className="text-[15px] text-ls-faint">Join the community</span>
          <ul className="m-0 flex list-none flex-wrap gap-x-8 p-0 text-[15px]">
            {COMMUNITY.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2.5 text-ls-soft no-underline transition-colors hover:text-white"
                >
                  {item.icon}
                  <span>
                    {item.label} <span className="text-ls-faint">· {item.detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Image src="/logo-wordmark.png" alt="" aria-hidden width={998} height={87} className="block h-auto w-full opacity-[0.07]" />

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 text-sm text-ls-faint">
          <span>
            © {year} {COMPANY.legalName} · LLPIN {COMPANY.llpin} · {COMPANY.office}
          </span>
          <span className="flex gap-6">
            <Link href="/privacy" className="no-underline hover:text-ls-fg">
              Privacy
            </Link>
            <Link href="/terms" className="no-underline hover:text-ls-fg">
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
