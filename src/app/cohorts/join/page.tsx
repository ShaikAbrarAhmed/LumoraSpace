import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { programList } from "@/data/programs"
import { toApplyProgram } from "@/components/programs/apply-program"
import { pageMetadata } from "@/lib/metadata"
import JoinClient from "./JoinClient"

export const metadata = pageMetadata({
  title: "Apply for a program",
  description: "Apply for a live, mentor-led LumoraSpace program. No payment is needed to apply.",
  path: "/cohorts/join",
  noindex: true,
})

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string | string[] }>
}) {
  const { program } = await searchParams
  const initialSlug = typeof program === "string" ? program : undefined

  return (
    <>
      <Navbar />
      <main id="main" className="bg-background">
        <JoinClient programs={programList.map(toApplyProgram)} initialSlug={initialSlug} />
      </main>
      <Footer />
    </>
  )
}
