"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Logo } from "@/components/Logo"

const STORAGE_KEY = "lumora_intro_shown"
const INTRO_ID = "lumora-intro"

// Holds, then fades out and hides itself. Pure CSS, so it finishes even if JS never loads.
// Total runtime is 1.35s and the layer never takes pointer events.
const INTRO_CSS =
  "@keyframes ls-intro-out{0%,55%{opacity:1}100%{opacity:0;visibility:hidden}}" +
  "@keyframes ls-intro-in{from{opacity:0;transform:translate3d(0,6px,0) scale(.97)}}"

// Parsed right after the overlay, before first paint: returning visitors in this tab never see it.
const SKIP_SCRIPT = `(function(){try{if(sessionStorage.getItem("${STORAGE_KEY}")){var el=document.getElementById("${INTRO_ID}");if(el)el.style.display="none"}}catch(e){}})()`

const subscribe = () => () => {}

export function IntroScreen() {
  // True only while hydrating the server HTML. A client-side navigation back to home
  // mounts with `false`, so the intro only ever plays on a real page load.
  const isHydrating = useSyncExternalStore(subscribe, () => false, () => true)
  const [isPageLoad] = useState(isHydrating)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // Storage can be unavailable (private mode); the intro simply plays again next load.
    }
  }, [])

  if (!isPageLoad || finished) return null

  return (
    <>
      <style>{INTRO_CSS}</style>
      <div
        id={INTRO_ID}
        aria-hidden="true"
        suppressHydrationWarning
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setFinished(true)
        }}
        className="pointer-events-none fixed inset-0 z-[100] flex select-none flex-col items-center justify-center bg-[#050505] animate-[ls-intro-out_1.35s_ease-in-out_forwards] motion-reduce:hidden"
      >
        <div className="animate-[ls-intro-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          <Logo size="xl" flat />
        </div>
        <p className="mt-6 font-heading text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground animate-[ls-intro-in_0.6s_cubic-bezier(0.16,1,0.3,1)_0.15s_both]">
          Learn &bull; Build &bull; Grow &bull; Belong
        </p>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SKIP_SCRIPT }} />
    </>
  )
}
