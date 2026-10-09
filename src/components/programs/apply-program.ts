import type { Program } from "@/data/programs"

/** The slice of a program the application form needs. Keeps client payloads small. */
export type ApplyProgram = Pick<Program, "slug" | "title" | "duration" | "fee" | "paymentPlans">

export const toApplyProgram = ({ slug, title, duration, fee, paymentPlans }: Program): ApplyProgram => ({
  slug,
  title,
  duration,
  fee,
  paymentPlans,
})
