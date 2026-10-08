import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LegalDocument, legalLinkClass, legalListClass, type LegalSection } from "@/components/story/legal-document"
import { CONTACT } from "@/lib/site"
import { pageMetadata } from "@/lib/metadata"

const description =
  "The terms that apply when you access or use the LumoraSpace website at lumoraspace.in and its services."

export const metadata = pageMetadata({ title: "Terms of service", description, path: "/terms" })

const sections: LegalSection[] = [
  {
    id: "agreement-to-terms",
    title: "Agreement to terms",
    content: (
      <p>
        By accessing or using LumoraSpace&apos;s website and services, you agree to be bound by these Terms of Service
        and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
        using or accessing this site.
      </p>
    ),
  },
  {
    id: "use-license",
    title: "Use license",
    content: (
      <>
        <p>
          Permission is granted to temporarily access the materials (information or software) on LumoraSpace&apos;s
          website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
          of title, and under this license you may not:
        </p>
        <ul className={legalListClass}>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on the website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or &ldquo;mirror&rdquo; the materials on any other server.</li>
        </ul>
      </>
    ),
  },
  {
    id: "user-accounts",
    title: "User accounts",
    content: (
      <p>
        If you create an account on the platform, you are responsible for maintaining the security of your account and
        you are fully responsible for all activities that occur under the account and any other actions taken in
        connection with it.
      </p>
    ),
  },
  {
    id: "limitations",
    title: "Limitations",
    content: (
      <p>
        In no event shall LumoraSpace or its suppliers be liable for any damages (including, without limitation,
        damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use
        the materials on LumoraSpace&apos;s website.
      </p>
    ),
  },
  {
    id: "revisions-and-errata",
    title: "Revisions and errata",
    content: (
      <p>
        The materials appearing on LumoraSpace&apos;s website could include technical, typographical, or photographic
        errors. LumoraSpace does not warrant that any of the materials on its website are accurate, complete, or
        current.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <p>
        These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and
        you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        Questions about the Terms of Service should be sent to us at{" "}
        <a href={`mailto:${CONTACT.support}`} className={legalLinkClass}>
          {CONTACT.support}
        </a>
        .
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-background">
        <LegalDocument title="Terms of service" updated="2026-08-14" sections={sections} />
      </main>
      <Footer />
    </>
  )
}
