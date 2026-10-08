"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowRight } from "lucide-react"
import { useMembership } from "@/components/auth/MembershipContext"
import { ApplicationForm } from "@/components/programs/ApplicationForm"
import type { ApplyProgram } from "@/components/programs/apply-program"
import { HEADING_SIZE } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

type JoinClientProps = {
  programs: ApplyProgram[]
  initialSlug?: string
}

export default function JoinClient({ programs, initialSlug }: JoinClientProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showModal } = useMembership()
  const [sent, setSent] = useState<ApplyProgram | null>(null)

  // Signed-out visitors go back to /cohorts and get the sign-in prompt (unchanged behaviour).
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/cohorts")
      showModal("apply_cohort")
    }
  }, [status, router, showModal])

  return (
    <section className="container-page page-header">
      {/* pb adds to page-header's bottom padding: a longer close above the footer for this form page */}
      <div className="grid gap-12 pb-8 sm:pb-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h1
              className={cn(
                HEADING_SIZE.page,
                "font-fancy font-light leading-[1.05] tracking-tight text-headings text-balance",
              )}
            >
              Apply for a program
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
              Choose a program and tell us a little about yourself. No payment is needed to apply.
            </p>
            <Link
              href="/cohorts"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 font-heading text-sm font-medium text-headings"
            >
              Explore programs
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0B0C] p-5 sm:p-8 lg:p-10">
            {status !== "authenticated" ? (
              <div aria-busy="true" aria-live="polite" className="space-y-4">
                <p className="text-sm text-muted-foreground">Checking your account…</p>
                <div className="h-12 rounded-xl bg-white/[0.04]" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-12 rounded-xl bg-white/[0.04]" />
                  <div className="h-12 rounded-xl bg-white/[0.04]" />
                </div>
                <div className="h-24 rounded-xl bg-white/[0.04]" />
              </div>
            ) : sent ? (
              <div role="status" className="py-4">
                <h2 className="font-fancy text-4xl font-light text-headings">Application received.</h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  Thank you. A program coordinator will contact you shortly about {sent.title} to confirm your payment
                  plan and complete your enrollment.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/programs/${sent.slug}`} className="btn-secondary min-h-12">
                    Back to the program
                  </Link>
                  <Link href="/" className="btn-secondary min-h-12">
                    Home
                  </Link>
                </div>
              </div>
            ) : (
              <ApplicationForm
                programs={programs}
                initialSlug={initialSlug}
                initialName={session?.user?.name ?? ""}
                initialEmail={session?.user?.email ?? ""}
                onSuccess={setSent}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
