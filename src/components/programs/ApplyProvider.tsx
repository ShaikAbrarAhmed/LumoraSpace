"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import type { ApplyProgram } from "./ApplicationForm"
import { JoinProgramModal } from "./JoinProgramModal"

const ApplyContext = createContext<(() => void) | null>(null)

/** Owns the single application dialog for a program page; any ApplyButton inside opens it. */
export function ApplyProvider({ program, children }: { program: ApplyProgram; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <ApplyContext.Provider value={open}>
      {children}
      <JoinProgramModal isOpen={isOpen} onClose={close} program={program} />
    </ApplyContext.Provider>
  )
}

export function ApplyButton({ className, children }: { className?: string; children: ReactNode }) {
  const open = useContext(ApplyContext)
  return (
    <button type="button" onClick={open ?? undefined} aria-haspopup="dialog" className={className}>
      {children}
    </button>
  )
}
