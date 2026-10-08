"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

/** "Join LumoraSpace" sign-up link, hidden once the viewer is signed in (/create-account would only send them home). */
export function JoinLink({ className }: { className?: string }) {
  const { status } = useSession()
  if (status === "authenticated") return null

  return (
    <Link href="/create-account" className={className}>
      Join LumoraSpace
    </Link>
  )
}
