import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { HEADING_SIZE } from "@/components/ui/section-heading"
import { pageMetadata } from "@/lib/metadata"
import { CONTACT } from "@/lib/site"

// No path: a 404 has no canonical URL of its own.
export const metadata = pageMetadata({
  title: "Page not found",
  description: "This page does not exist on LumoraSpace.",
  noindex: true,
})

const DESTINATIONS = [
  { label: "Home", note: "Back to the start", href: "/" },
  { label: "Programs", note: "Our mentor-led programs", href: "/cohorts" },
  { label: "Contact", note: CONTACT.hello, href: `mailto:${CONTACT.hello}` },
]

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]"
        />
        <div className="container-page page-header relative">
          <p className="eyebrow">Error 404</p>
          <h1 className={`mt-5 max-w-3xl text-balance font-fancy ${HEADING_SIZE.page} font-light leading-[1.05] tracking-tight text-headings`}>
            This page doesn&apos;t exist.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
            The link may be out of date, or the page has moved. Pick up from one of these instead.
          </p>

          <ul className="mt-14 max-w-3xl border-t border-white/[0.08]">
            {DESTINATIONS.map((item) => {
              const external = item.href.startsWith("mailto:")
              const content = (
                <>
                  <span className="min-w-0">
                    <span className="block font-fancy text-3xl font-light leading-[1.1] text-headings/80 transition-colors duration-200 group-hover:text-headings sm:text-4xl">
                      {item.label}
                    </span>
                    <span className="mt-1 block break-words text-[15px] text-muted-foreground">{item.note}</span>
                  </span>
                  {/* Mail links get no arrow (site-wide arrow rule). */}
                  {!external && (
                    <ArrowRight
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-headings"
                    />
                  )}
                </>
              )
              const className =
                "group flex min-h-20 items-center justify-between gap-6 border-b border-white/[0.08] py-5"
              return (
                <li key={item.href}>
                  {external ? (
                    <a href={item.href} className={className}>
                      {content}
                    </a>
                  ) : (
                    <Link href={item.href} className={className}>
                      {content}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
