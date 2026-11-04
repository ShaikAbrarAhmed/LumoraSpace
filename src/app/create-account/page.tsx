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
      <main id="main" className="bg-ls-ink">
        <CreateAccountClient welcome={mode === "welcome"} />
      </main>
      <Footer />
    </>
  )
}
