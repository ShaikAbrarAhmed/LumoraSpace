"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMembership } from "@/components/auth/MembershipContext"
import { ApplicationForm } from "@/components/programs/ApplicationForm"
import type { ApplyProgram } from "@/components/programs/apply-program"
import { FormPage } from "@/components/site/FormPage"
import { formFrame } from "@/components/site/form-styles"
import { ButtonLink, TextLink } from "@/components/site/ui"

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
    <FormPage
      crumbs={[{ label: "Home", href: "/" }, { label: "For students", href: "/cohorts" }, { label: "Apply" }]}
      eyebrow="Cohort programs"
      title="Apply for a program."
      lead="Choose a program and tell us a little about yourself. No payment is needed to apply."
      aside={<TextLink href="/cohorts">Explore programs</TextLink>}
    >
      <div className={formFrame}>
        {status !== "authenticated" ? (
          <div aria-busy="true" aria-live="polite" className="space-y-4">
            <p className="m-0 text-sm text-ls-faint">Checking your account…</p>
            <div className="h-12 rounded-[6px] bg-white/[0.04]" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-12 rounded-[6px] bg-white/[0.04]" />
              <div className="h-12 rounded-[6px] bg-white/[0.04]" />
            </div>
            <div className="h-24 rounded-[6px] bg-white/[0.04]" />
          </div>
        ) : sent ? (
          <div role="status">
            <h2 className="m-0 text-[28px] font-semibold tracking-[-0.025em] text-ls-fg">Application received.</h2>
            <p className="m-0 mt-4 max-w-lg text-base">
              Thank you. A program coordinator will contact you shortly about {sent.title} to confirm your payment
              plan and complete your enrollment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/programs/${sent.slug}`} variant="outline">
                Back to the program
              </ButtonLink>
              <ButtonLink href="/" variant="outline">
                Home
              </ButtonLink>
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
    </FormPage>
  )
}
