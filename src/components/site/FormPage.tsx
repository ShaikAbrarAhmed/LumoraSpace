import type { ReactNode } from "react"
import { Breadcrumb, Eyebrow, Wave, type Crumb } from "@/components/site/ui"

type FormPageProps = {
  crumbs: Crumb[]
  eyebrow: string
  title: ReactNode
  lead: ReactNode
  /** Extra content under the lead, such as contact details. */
  aside?: ReactNode
  /** The form column. */
  children: ReactNode
}

/**
 * Two-column page for a form, from the V6 contact page: heading and details on the left,
 * the form on the right, the wave along the bottom. Used by contact, sign-in, create account
 * and the application page.
 */
export function FormPage({ crumbs, eyebrow, title, lead, aside, children }: FormPageProps) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-60 overflow-hidden opacity-90">
        <Wave animate className="object-[center_25%]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-60 bg-[linear-gradient(180deg,#0A0A0A_0%,rgba(10,10,10,0.4)_55%,rgba(10,10,10,0)_100%)]"
      />
      <div className="ls-container relative flex flex-wrap gap-12 pb-[220px] pt-[clamp(56px,8vw,104px)]">
        <div className="flex flex-[1_1_320px] flex-col gap-[22px]">
          <Breadcrumb crumbs={crumbs} />
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="m-0 text-[clamp(40px,5.2vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em] text-ls-fg">
            {title}
          </h1>
          <p className="m-0 max-w-[40ch] text-[19px]">{lead}</p>
          {aside}
        </div>
        <div className="flex min-w-0 flex-[1.4_1_480px] flex-col">{children}</div>
      </div>
    </section>
  )
}
