import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ContactForm } from "@/components/contact/ContactForm"
import { FormPage } from "@/components/site/FormPage"
import { pageMetadata } from "@/lib/metadata"
import { isContactTopic } from "@/lib/schemas/contact"
import { COMPANY, CONTACT } from "@/lib/site"

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Students, colleges and businesses all reach the same LumoraSpace team. Tell us about a program, a software project, a campus event or hiring.",
  path: "/contact",
})

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function ContactPage({ searchParams }: Props) {
  // Links elsewhere on the site preselect the topic, e.g. /contact?topic=project.
  const { topic } = await searchParams
  const initialTopic = isContactTopic(topic) ? topic : "programs"

  return (
    <>
      <Navbar />
      <main id="main" className="bg-ls-ink">
        <FormPage
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          eyebrow="Contact"
          title="Tell us what you need."
          lead="Students, colleges and businesses all reach the same team. A person reads every message."
          aside={
            <dl className="m-0 mt-3 border-t border-white/10">
              <div className="border-b border-white/10 py-3.5">
                <dt className="text-sm text-ls-faint">Email</dt>
                <dd className="m-0">
                  <a href={`mailto:${CONTACT.hello}`} className="text-ls-fg underline-offset-4 hover:text-white">
                    {CONTACT.hello}
                  </a>
                </dd>
              </div>
              <div className="border-b border-white/10 py-3.5">
                <dt className="text-sm text-ls-faint">Phone</dt>
                <dd className="m-0 text-ls-fg">[+91 number]</dd>
              </div>
              <div className="border-b border-white/10 py-3.5">
                <dt className="text-sm text-ls-faint">Registered office</dt>
                <dd className="m-0 text-ls-fg">{COMPANY.office}</dd>
              </div>
            </dl>
          }
        >
          <ContactForm key={initialTopic} initialTopic={initialTopic} />
        </FormPage>
      </main>
      <Footer />
    </>
  )
}
