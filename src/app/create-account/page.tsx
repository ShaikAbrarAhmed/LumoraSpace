import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { pageMetadata } from "@/lib/metadata"
import CreateAccountClient from "./CreateAccountClient"

export const metadata = pageMetadata({
  title: "Create account",
  description: "Create a free LumoraSpace account.",
  path: "/create-account",
  noindex: true,
})

type CreateAccountPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CreateAccountPage({ searchParams }: CreateAccountPageProps) {
  // Google sign-ups land on ?mode=welcome, which shows the "You're in" step once the session exists.
  const { mode } = await searchParams

  return (
    <>
      <Navbar />
      <main id="main" className="relative isolate overflow-hidden bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
        />
        <CreateAccountClient welcome={mode === "welcome"} />
      </main>
      <Footer />
    </>
  )
}
