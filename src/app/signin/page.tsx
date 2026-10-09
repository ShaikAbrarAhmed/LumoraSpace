import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SectionHeading } from "@/components/ui/section-heading"
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
      <main id="main" className="relative isolate overflow-hidden bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
        />
        <div className="container-page page-header grid gap-8 animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out sm:gap-12 lg:grid-cols-12 lg:gap-x-8">
          <SectionHeading
            as="h1"
            title="Welcome back"
            lead="Sign in to your LumoraSpace account."
            className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
          />

          <div className="w-full max-w-lg lg:col-span-6 lg:col-start-7 lg:max-w-none xl:col-span-5 xl:col-start-8">
            <SignInForm errorCode={errorCode} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
