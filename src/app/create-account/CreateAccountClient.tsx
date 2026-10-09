"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { AlertCircle, ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/ui/password-input"
import { SectionHeading } from "@/components/ui/section-heading"
import { AuthDivider, GoogleSignInButton } from "@/components/auth/SignInButton"
import { getPostAuthRedirect } from "@/components/auth/MembershipContext"
import { PASSWORD_RULES, SignupSchema, type SignupField } from "@/lib/schemas/auth"
import { ARENA, CAREERS, EDU } from "@/lib/site"
import { cn } from "@/lib/utils"

type Field = SignupField | "confirmPassword"
type FieldErrors = Partial<Record<Field, string>>
type SignupResponse = { error?: string; code?: string; fields?: Partial<Record<SignupField, string[]>> }

const FIELD_ORDER: Field[] = ["name", "email", "password", "confirmPassword"]
const fieldId = (field: Field) => `create-account-${field}`
const errorId = (field: Field) => `${fieldId(field)}-error`

const labelClass = "block font-heading text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
const fieldClass =
  "block h-12 w-full rounded-xl border border-white/[0.1] bg-[#111214] px-4 text-base text-headings placeholder:text-[#808080] transition-colors duration-200 hover:border-white/20 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/15 aria-[invalid=true]:border-red-400/70 sm:text-sm"
const fieldErrorClass = "text-[13px] leading-snug text-red-300"
const textLinkClass =
  "text-headings underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/70"

const layoutClass =
  "container-page page-header grid gap-8 animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out sm:gap-12 lg:grid-cols-12 lg:gap-x-8"
const headingColClass = "lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
const mainColClass = "w-full max-w-lg lg:col-span-6 lg:col-start-7 lg:max-w-none xl:col-span-5 xl:col-start-8"

const NEXT_STEPS = [
  { title: "Programs", description: "See the current mentor-led programs and apply.", href: "/cohorts" },
  { title: EDU.name, description: "Live, guided courses with a certificate on completion.", href: EDU.home, host: EDU.host },
  { title: ARENA.name, description: "Team hackathons and seasonal solo challenges.", href: ARENA.home, host: ARENA.host },
  { title: CAREERS.name, description: "Verified internships with mentorship and real projects.", href: CAREERS.home, host: CAREERS.host },
]

function StatusLine({ children }: { children: ReactNode }) {
  return (
    <div className="container-page page-header flex min-h-[60dvh] items-center">
      <p role="status" className="flex items-center gap-3 text-[15px] text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {children}
      </p>
    </div>
  )
}

function Welcome({ email }: { email?: string | null }) {
  return (
    <div className={layoutClass}>
      <SectionHeading
        as="h1"
        title="You're in"
        lead={
          <>
            Your LumoraSpace account is ready.
            {email && (
              <>
                {" "}
                Signed in as <span className="text-headings [overflow-wrap:anywhere]">{email}</span>.
              </>
            )}
          </>
        }
        className={headingColClass}
      />

      <div className={mainColClass}>
        <h2 className="font-heading text-lg font-medium text-headings">Where to next</h2>
        <ul className="mt-4 border-t border-white/[0.08]">
          {NEXT_STEPS.map((step) => {
            const external = Boolean(step.host)
            const content = (
              <>
                <span className="min-w-0">
                  <span className="block font-heading text-lg font-medium text-headings">{step.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{step.description}</span>
                  {step.host && <span className="mt-2 block text-xs text-muted-foreground">{step.host}</span>}
                </span>
                {external ? (
                  <ArrowUpRight
                    aria-hidden
                    className="mt-1 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-headings"
                  />
                ) : (
                  <ArrowRight
                    aria-hidden
                    className="mt-1 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-headings"
                  />
                )}
              </>
            )
            const rowClass = "group grid grid-cols-[1fr_auto] items-start gap-x-6 py-6"
            return (
              <li key={step.href} className="border-b border-white/[0.08]">
                {external ? (
                  <a href={step.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                    {content}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link href={step.href} className={rowClass}>
                    {content}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>

        <Link href="/" className="btn-secondary mt-10 h-12 w-full sm:w-auto">
          Go to the homepage
        </Link>
      </div>
    </div>
  )
}

export default function CreateAccountClient({ welcome }: { welcome: boolean }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [formError, setFormError] = useState("")
  const [formErrorLink, setFormErrorLink] = useState<"signin" | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [justSignedUp, setJustSignedUp] = useState(false)

  const showWelcome = status === "authenticated" && (welcome || justSignedUp)
  const alreadySignedIn = status === "authenticated" && !showWelcome && !submitting

  // Signed-in visitors who didn't just sign up have nothing to do here.
  useEffect(() => {
    if (alreadySignedIn) router.replace("/")
  }, [alreadySignedIn, router])

  const setValue = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const mismatch =
    confirmTouched && values.confirmPassword.length > 0 && values.confirmPassword !== values.password
      ? "Passwords do not match."
      : undefined
  const errorFor = (field: Field) => errors[field] ?? (field === "confirmPassword" ? mismatch : undefined)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError("")
    setFormErrorLink(null)

    // Same rules as the server, so most mistakes are caught before a round trip.
    const next: FieldErrors = {}
    const parsed = SignupSchema.safeParse({ name: values.name, email: values.email, password: values.password })
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as SignupField
        if (!next[key]) next[key] = issue.message
      }
    }
    if (!values.confirmPassword) next.confirmPassword = "Re-enter your password."
    else if (values.confirmPassword !== values.password) next.confirmPassword = "Passwords do not match."

    setErrors(next)
    const firstInvalid = FIELD_ORDER.find((field) => next[field])
    if (firstInvalid) {
      // Focus after the re-render, so the field already carries aria-invalid and aria-describedby and its error is read out.
      requestAnimationFrame(() => document.getElementById(fieldId(firstInvalid))?.focus())
      return
    }

    const email = values.email.trim().toLowerCase()
    setSubmitting(true)

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name.trim(), email, password: values.password }),
      })
      const data: SignupResponse = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 429) {
          setFormError("Too many attempts. Wait a minute and try again.")
        } else {
          setFormError(data.error || "We couldn't create your account. Please try again.")
        }
        if (data.fields) {
          setErrors({
            name: data.fields.name?.[0],
            email: data.fields.email?.[0],
            password: data.fields.password?.[0],
          })
        }
        if (data.code === "EMAIL_TAKEN") setFormErrorLink("signin")
        setSubmitting(false)
        return
      }

      const result = await signIn("credentials", { email, password: values.password, redirect: false })
      if (!result || result.error) {
        setFormError("Your account was created, but we couldn't sign you in automatically.")
        setFormErrorLink("signin")
        setSubmitting(false)
        return
      }

      setJustSignedUp(true)
      setSubmitting(false)
    } catch (err) {
      console.error(err)
      setFormError("We couldn't reach the server. Check your connection and try again.")
      setSubmitting(false)
    }
  }

  if (showWelcome) return <Welcome email={session?.user?.email} />
  if (welcome && status === "loading") return <StatusLine>Loading your account…</StatusLine>
  if (alreadySignedIn) return <StatusLine>You&apos;re already signed in. Taking you home…</StatusLine>

  const describedBy = (field: Field, extra?: string) =>
    [extra, errorFor(field) ? errorId(field) : undefined].filter(Boolean).join(" ") || undefined

  const renderError = (field: Field) =>
    errorFor(field) ? (
      <p id={errorId(field)} className={fieldErrorClass}>
        {errorFor(field)}
      </p>
    ) : null

  return (
    <div className={layoutClass}>
      <SectionHeading
        as="h1"
        title="Create your account"
        lead="Accounts are free. You don't need one to apply for a program."
        className={headingColClass}
      />

      <div className={mainColClass}>
        <div className="sm:rounded-2xl sm:border sm:border-white/[0.08] sm:bg-[#0B0B0C] sm:p-10">
          {formError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-500/[0.06] p-4 text-sm leading-relaxed text-red-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" aria-hidden />
              <span>
                {formError}
                {formErrorLink === "signin" && (
                  <>
                    {" "}
                    <Link href="/signin" className={textLinkClass}>
                      Sign in instead
                    </Link>
                  </>
                )}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2.5">
              <label htmlFor={fieldId("name")} className={labelClass}>
                Full name
              </label>
              <input
                id={fieldId("name")}
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your full name"
                value={values.name}
                onChange={(e) => setValue("name", e.target.value)}
                aria-invalid={errorFor("name") ? true : undefined}
                aria-describedby={describedBy("name")}
                className={fieldClass}
              />
              {renderError("name")}
            </div>

            <div className="space-y-2.5">
              <label htmlFor={fieldId("email")} className={labelClass}>
                Email
              </label>
              <input
                id={fieldId("email")}
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => setValue("email", e.target.value)}
                aria-invalid={errorFor("email") ? true : undefined}
                aria-describedby={describedBy("email")}
                className={fieldClass}
              />
              {renderError("email")}
            </div>

            <div className="space-y-2.5">
              <label htmlFor={fieldId("password")} className={labelClass}>
                Password
              </label>
              <PasswordInput
                id={fieldId("password")}
                name="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
                value={values.password}
                onChange={(e) => setValue("password", e.target.value)}
                aria-invalid={errorFor("password") ? true : undefined}
                aria-describedby={describedBy("password", "create-account-password-rules")}
                className={fieldClass}
              />
              <ul id="create-account-password-rules" className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1.5">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(values.password)
                  return (
                    <li
                      key={rule.id}
                      className={cn(
                        "flex items-center gap-2.5 text-[13px] transition-colors duration-200",
                        met ? "text-headings" : "text-muted-foreground"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                          met ? "border-white bg-white text-[#050505]" : "border-white/25"
                        )}
                      >
                        {met && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}
                      </span>
                      {rule.label}
                      <span className="sr-only">{met ? " (done)" : " (missing)"}</span>
                    </li>
                  )
                })}
              </ul>
              {renderError("password")}
            </div>

            <div className="space-y-2.5">
              <label htmlFor={fieldId("confirmPassword")} className={labelClass}>
                Confirm password
              </label>
              <PasswordInput
                id={fieldId("confirmPassword")}
                name="confirmPassword"
                autoComplete="new-password"
                required
                placeholder="Re-enter your password"
                value={values.confirmPassword}
                onChange={(e) => setValue("confirmPassword", e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                aria-invalid={errorFor("confirmPassword") ? true : undefined}
                aria-describedby={describedBy("confirmPassword")}
                className={fieldClass}
              />
              {renderError("confirmPassword")}
            </div>

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary h-12 w-full gap-2 text-[#050505] disabled:pointer-events-none disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {submitting ? "Creating your account…" : "Create account"}
              </button>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                By creating an account you agree to the{" "}
                <Link href="/terms" className={textLinkClass}>
                  Terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className={textLinkClass}>
                  Privacy policy
                </Link>
                .
              </p>
            </div>
          </form>

          <div className="my-8">
            <AuthDivider />
          </div>

          <GoogleSignInButton
            disabled={submitting}
            getCallbackUrl={() => getPostAuthRedirect("/create-account?mode=welcome")}
          />
        </div>

        <p className="mt-8 text-[15px] text-muted-foreground sm:text-center">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="inline-flex min-h-11 items-center font-medium text-headings underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/70"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
