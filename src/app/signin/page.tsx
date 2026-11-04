import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FormPage } from "@/components/site/FormPage"
import { pageMetadata } from "@/lib/metadata"
import SignInForm from "./SignInClient"

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to your LumoraSpace account.",
  path: "/signin",
  noindex: true,
})

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  // NextAuth sends OAuth and credential errors back here as ?error=Code.
  const { error } = await searchParams
  const errorCode = typeof error === "string" ? error : undefined

  return (
    <>
      <Navbar />
      <main id="main" className="bg-ls-ink">
        <FormPage
          crumbs={[{ label: "Home", href: "/" }, { label: "Sign in" }]}
          eyebrow="Account"
          title="Welcome back."
          lead="Sign in to your LumoraSpace account to apply for programs and follow your applications."
        >
          <SignInForm errorCode={errorCode} />
        </FormPage>
      </main>
      <Footer />
    </>
  )
}
