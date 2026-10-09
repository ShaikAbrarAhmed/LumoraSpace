import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/Logo"
import { CONTACT, SOCIAL } from "@/lib/site"

const PLATFORM = [
  { label: "Programs", href: "/cohorts" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Community", href: "/community" },
]

const COMPANY = [
  { label: "Services", href: "/services" },
  { label: "Mentors", href: "/mentors" },
  { label: "Our story", href: "/our-story" },
  { label: "How it works", href: "/features" },
]

const EMAILS = [
  { label: "General and partnerships", address: CONTACT.hello },
  { label: "Accounts, tickets and programs", address: CONTACT.support },
]

const SOCIALS = [
  { label: "Discord", href: SOCIAL.discord },
  { label: "WhatsApp", href: SOCIAL.whatsapp },
  { label: "Instagram", href: SOCIAL.instagram },
]

const linkClass =
  "inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors duration-200 hover:text-headings lg:min-h-9"

function ColumnHeading({ children }: { children: string }) {
  return (
    <h2 className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-headings">{children}</h2>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] bg-[#050505]">
      <div className="container-page pb-10 pt-16 md:pt-24">
        <div className="max-w-xl">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="LumoraSpace home">
            <Logo variant="icon" size="md" flat alt="" />
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.28em] text-headings">
              LumoraSpace
            </span>
          </Link>
          <p className="mt-8 text-balance font-fancy text-4xl font-light leading-[1.05] text-headings sm:text-5xl">
            From Confused to Confident
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            LumoraSpace is a technology company. Today our focus is mentor-led programs, hackathons and
            opportunities for students.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-white/[0.06] pt-12 md:mt-20 lg:grid-cols-[1fr_1fr_1.5fr] lg:gap-x-10">
          <nav aria-label="Platform">
            <ColumnHeading>Platform</ColumnHeading>
            <ul>
              {PLATFORM.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <ColumnHeading>Company</ColumnHeading>
            <ul>
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-1">
            <ColumnHeading>Contact</ColumnHeading>
            <ul>
              {EMAILS.map((email) => (
                <li key={email.address}>
                  <a href={`mailto:${email.address}`} className="group block py-2">
                    <span className="block text-xs text-muted-foreground/80">{email.label}</span>
                    <span className="block break-words text-[15px] text-headings/90 underline decoration-white/20 underline-offset-4 transition-colors duration-200 group-hover:decoration-white/70">
                      {email.address}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-x-6">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center gap-1 text-[15px] text-muted-foreground transition-colors duration-200 hover:text-headings"
                  >
                    {social.label}
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">&copy; {year} LumoraSpace. All rights reserved.</p>
          <ul className="-ml-3 flex sm:ml-0 sm:-mr-3">
            <li>
              <Link href="/privacy" className="inline-flex min-h-11 items-center px-3 text-xs text-muted-foreground transition-colors hover:text-headings">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="inline-flex min-h-11 items-center px-3 text-xs text-muted-foreground transition-colors hover:text-headings">
                Terms of service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
