"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.29 1.905 15.42 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.302-.177-1.854H12.24z"
      />
    </svg>
  )
}

/**
 * "Continue with Google" for the sign-in and create-account pages.
 * `getCallbackUrl` runs on click so it can read the pending membership action at that moment.
 */
export function GoogleSignInButton({ getCallbackUrl, disabled }: { getCallbackUrl: () => string; disabled?: boolean }) {
  const [redirecting, setRedirecting] = useState(false)

  // Coming back with the browser's back button restores this page from cache; re-enable the button.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => event.persisted && setRedirecting(false)
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [])

  return (
    <button
      type="button"
      disabled={disabled || redirecting}
      onClick={() => {
        setRedirecting(true)
        signIn("google", { callbackUrl: getCallbackUrl() }).catch(() => setRedirecting(false))
      }}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/15 font-heading text-sm font-semibold text-headings transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {redirecting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <GoogleMark className="h-4 w-4 shrink-0" />}
      Continue with Google
    </button>
  )
}

/** Hairline divider with a centred "or" between the credentials form and Google sign-in. */
export function AuthDivider() {
  return (
    <div className="flex items-center gap-4" aria-hidden>
      <span className="h-px flex-1 bg-white/[0.08]" />
      <span className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">or</span>
      <span className="h-px flex-1 bg-white/[0.08]" />
    </div>
  )
}
