"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { AlertCircle, Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/ui/password-input"
import { AuthDivider, GoogleSignInButton } from "@/components/auth/SignInButton"
import { getPostAuthRedirect } from "@/components/auth/MembershipContext"
import { formError, formField, formFrame, formLabel } from "@/components/site/form-styles"
import { buttonClass } from "@/components/site/ui"
import { CONTACT } from "@/lib/site"

const labelClass = `block ${formLabel}`
const fieldClass = formField
const fieldErrorClass = formError

const SIGN_IN_ERRORS: Record<string, string> = {
  CredentialsSignin: "That email and password don't match an account. Check them and try again.",
  RateLimited: "Too many sign-in attempts. Wait a minute and try again.",
  OAuthSignin: "Google sign-in couldn't start. Try again, or use your email and password.",
  OAuthCallback: "Google sign-in didn't finish. Try again, or use your email and password.",
  OAuthCreateAccount: "We couldn't set up your account with Google. Try again, or create an account with your email.",
  OAuthAccountNotLinked: "This email is already registered with a password. Sign in with your email and password instead.",
  Callback: "Google sign-in didn't finish. Try again, or use your email and password.",
  AccessDenied: "Access was denied. If you think this is a mistake, contact support.",
  SessionRequired: "Please sign in to continue.",
  Configuration: "Sign-in is temporarily unavailable. Please try again later.",
}
const GENERIC_ERROR = "Something went wrong while signing you in. Please try again."

// Own keys only: ?error= comes from the URL, and codes like "constructor" or "__proto__" must not reach Object.prototype.
const messageFor = (code: string) =>
  Object.prototype.hasOwnProperty.call(SIGN_IN_ERRORS, code) ? SIGN_IN_ERRORS[code] : GENERIC_ERROR

const resetMailto = `mailto:${CONTACT.support}?subject=${encodeURIComponent("Password reset")}`

export default function SignInForm({ errorCode }: { errorCode?: string }) {
  const { status } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(() => (errorCode ? messageFor(errorCode) : ""))
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const redirectedRef = useRef(false)

  // Already signed in (or just signed in): leave the page.
  useEffect(() => {
    if (status === "authenticated" && !redirectedRef.current) {
      redirectedRef.current = true
      router.replace(getPostAuthRedirect())
    }
  }, [status, router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const trimmedEmail = email.trim()
    const missing = {
      email: trimmedEmail ? undefined : "Enter your email address.",
      password: password ? undefined : "Enter your password.",
    }
    setFieldErrors(missing)
    const firstInvalid = missing.email ? "signin-email" : missing.password ? "signin-password" : null
    if (firstInvalid) {
      // Focus after the re-render, so the field already carries aria-invalid and aria-describedby and its error is read out.
      requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus())
      return
    }

    // Read before signing in: the membership provider clears it once the session exists.
    const destination = getPostAuthRedirect()
    setSubmitting(true)

    try {
      const result = await signIn("credentials", {
        email: trimmedEmail.toLowerCase(),
        password,
        redirect: false,
      })

      if (!result || result.error) {
        setError(messageFor(result?.error ?? ""))
        setSubmitting(false)
        return
      }

      if (!redirectedRef.current) {
        redirectedRef.current = true
        router.replace(destination)
      }
    } catch (err) {
      console.error(err)
      setError("We couldn't reach the server. Check your connection and try again.")
      setSubmitting(false)
    }
  }

  if (status === "authenticated") {
    return (
      <p role="status" className={`${formFrame} m-0 flex items-center gap-3 text-[15px]`}>
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        You&apos;re signed in. Taking you back…
      </p>
    )
  }

  return (
    <div>
      <div className={formFrame}>
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-[6px] border border-red-400/20 bg-red-500/[0.06] p-4 text-sm leading-relaxed text-red-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" aria-hidden />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="signin-email" className={labelClass}>
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
              }}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "signin-email-error" : undefined}
              className={fieldClass}
            />
            {fieldErrors.email && (
              <p id="signin-email-error" className={fieldErrorClass}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="signin-password" className={labelClass}>
                Password
              </label>
              <a
                href={resetMailto}
                className="-my-3 inline-block py-3 text-sm text-ls-faint underline decoration-white/20 underline-offset-4 transition-colors hover:text-ls-fg hover:decoration-white/60"
              >
                Forgot password?
              </a>
            </div>
            <PasswordInput
              id="signin-password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
              }}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? "signin-password-error" : undefined}
              className={fieldClass}
            />
            {fieldErrors.password && (
              <p id="signin-password-error" className={fieldErrorClass}>
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={buttonClass("amber", "lg", "w-full border-none font-[inherit] disabled:pointer-events-none disabled:opacity-70")}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="my-8">
          <AuthDivider />
        </div>

        <GoogleSignInButton
          disabled={submitting}
          getCallbackUrl={() => getPostAuthRedirect()}
        />
      </div>

      <p className="m-0 mt-6 text-[15px]">
        No account yet?{" "}
        <Link
          href="/create-account"
          className="inline-flex min-h-11 items-center font-medium text-ls-fg underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
        >
          Join LumoraSpace
        </Link>
      </p>
    </div>
  )
}
