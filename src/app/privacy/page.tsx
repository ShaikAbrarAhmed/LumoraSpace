import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LegalDocument, legalLinkClass, legalListClass, type LegalSection } from "@/components/story/legal-document"
import { CONTACT } from "@/lib/site"
import { pageMetadata } from "@/lib/metadata"

const description =
  "How LumoraSpace collects, uses and protects your personal data when you use lumoraspace.in, and how to contact us about your privacy."

export const metadata = pageMetadata({ title: "Privacy policy", description, path: "/privacy" })

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <p>
        Welcome to LumoraSpace (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We respect your privacy and
        are committed to protecting your personal data. This privacy policy will inform you as to how we look after your
        personal data when you visit our website and tell you about your privacy rights and how the law protects you.
      </p>
    ),
  },
  {
    id: "data-we-collect",
    title: "Data we collect",
    content: (
      <>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped
          together as follows:
        </p>
        <ul className={legalListClass}>
          <li>
            <strong>Identity Data</strong> includes first name, last name, username or similar identifier.
          </li>
          <li>
            <strong>Contact Data</strong> includes email address and telephone numbers.
          </li>
          <li>
            <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and
            version, time zone setting and location.
          </li>
          <li>
            <strong>Usage Data</strong> includes information about how you use our website, products and services.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-your-data",
    title: "How we use your data",
    content: (
      <>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
          in the following circumstances:
        </p>
        <ul className={legalListClass}>
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>
            Where it is necessary for our legitimate interests (or those of a third party) and your interests and
            fundamental rights do not override those interests.
          </li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data security",
    content: (
      <p>
        We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
        used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal
        data to those employees, agents, contractors and other third parties who have a business need to know.
      </p>
    ),
  },
  {
    id: "contact-us",
    title: "Contact us",
    content: (
      <p>
        If you have any questions about this privacy policy or our privacy practices, please contact us at{" "}
        <a href={`mailto:${CONTACT.support}`} className={legalLinkClass}>
          {CONTACT.support}
        </a>
        .
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-background">
        <LegalDocument title="Privacy policy" updated="2026-08-14" sections={sections} />
      </main>
      <Footer />
    </>
  )
}
