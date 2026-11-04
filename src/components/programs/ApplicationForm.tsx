"use client"

import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { formAlert, formError, formField, formHint, formLabel } from "@/components/site/form-styles"
import { buttonClass } from "@/components/site/ui"
import { CONTACT } from "@/lib/site"
import { cn } from "@/lib/utils"
import type { ApplyProgram } from "./apply-program"
import { Money } from "./money"

export type { ApplyProgram }

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated", "Other"]
const STATUSES = ["Student", "Working Professional", "Looking for Job", "Freelancer"]
const MESSAGE_MAX = 500

type Values = {
  programSlug: string
  name: string
  email: string
  phone: string
  college: string
  year: string
  currentStatus: string
  paymentPlan: string
  message: string
}

type FieldName = keyof Values

// API (zod) field names -> form field names
const API_FIELD: Record<string, FieldName> = {
  name: "name",
  email: "email",
  phone: "phone",
  college: "college",
  year: "year",
  status: "currentStatus",
  paymentPlan: "paymentPlan",
  message: "message",
  programSlug: "programSlug",
}

const inputClass = `min-w-0 ${formField}`

type ApplicationFormProps = {
  /** One program = fixed; several = the applicant chooses. */
  programs: ApplyProgram[]
  initialSlug?: string
  initialName?: string
  initialEmail?: string
  onSuccess: (program: ApplyProgram) => void
  className?: string
}

export function ApplicationForm({
  programs,
  initialSlug,
  initialName = "",
  initialEmail = "",
  onSuccess,
  className,
}: ApplicationFormProps) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const selectable = programs.length > 1
  const startSlug = programs.some((p) => p.slug === initialSlug)
    ? (initialSlug as string)
    : selectable
      ? ""
      : programs[0]?.slug ?? ""

  const [values, setValues] = useState<Values>({
    programSlug: startSlug,
    name: initialName,
    email: initialEmail,
    phone: "",
    college: "",
    year: "",
    currentStatus: "",
    paymentPlan: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({})

  const program = programs.find((p) => p.slug === values.programSlug)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as FieldName
    const value = e.target.value
    setValues((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!program) {
      setFieldErrors({ programSlug: "Choose a program." })
      return
    }
    if (!values.paymentPlan) {
      setFieldErrors({ paymentPlan: "Choose a payment plan." })
      return
    }

    setSubmitting(true)
    setFormError("")
    setFieldErrors({})

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          college: values.college.trim(),
          year: values.year,
          status: values.currentStatus,
          paymentPlan: values.paymentPlan,
          programSlug: program.slug,
          message: values.message.trim(),
        }),
      })

      if (res.ok) {
        onSuccess(program)
        return
      }

      const body = (await res.json().catch(() => ({}))) as {
        error?: string
        details?: { fieldErrors?: Record<string, string[] | undefined> }
      }

      if (res.status === 400 && body.details?.fieldErrors) {
        const next: Partial<Record<FieldName, string>> = {}
        for (const [key, messages] of Object.entries(body.details.fieldErrors)) {
          const field = API_FIELD[key]
          if (field && messages?.[0]) next[field] = messages[0]
        }
        setFieldErrors(next)
        setFormError("Please check the highlighted fields.")
      } else if (res.status === 400) {
        setFormError("Please choose one of the programs listed and try again.")
      } else if (res.status === 429) {
        setFormError("Too many attempts. Please wait a minute and try again.")
      } else {
        // 503/500: the server could not store the application. Say so plainly; nothing was sent.
        setFormError(
          `Your application could not be saved, so it has not reached us. Please try again later, or email ${CONTACT.support} with the program name and your phone number.`,
        )
      }
    } catch {
      setFormError(
        `Your application could not be sent. Check your connection and try again, or email ${CONTACT.support}.`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  /** Invalid state plus aria-describedby for the field's hint (when it has one) and its error. */
  const errorProps = (name: FieldName, hasHint = false) => {
    const error = Boolean(fieldErrors[name])
    const describedBy = [hasHint ? id(`${name}-hint`) : "", error ? id(`${name}-error`) : ""].filter(Boolean).join(" ")
    return {
      ...(error ? { "aria-invalid": true as const } : {}),
      ...(describedBy ? { "aria-describedby": describedBy } : {}),
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
      <p className="m-0 text-sm text-ls-faint">All fields are required unless marked optional.</p>

      {selectable && (
        <Field id={id("programSlug")} label="Program" error={fieldErrors.programSlug}>
          <SelectWrap>
            <select
              id={id("programSlug")}
              name="programSlug"
              required
              value={values.programSlug}
              onChange={onChange}
              className={cn(inputClass, "h-12 appearance-none pr-11 [&_option]:bg-ls-field [&_option]:text-ls-fg")}
              {...errorProps("programSlug")}
            >
              <option value="" disabled>
                Choose a program
              </option>
              {programs.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </SelectWrap>
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Full name" error={fieldErrors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={50}
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            className={cn(inputClass, "h-12")}
            {...errorProps("name")}
          />
        </Field>
        <Field id={id("email")} label="Email" error={fieldErrors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            required
            maxLength={100}
            autoComplete="email"
            value={values.email}
            onChange={onChange}
            className={cn(inputClass, "h-12")}
            {...errorProps("email")}
          />
        </Field>
        <Field id={id("phone")} label="Phone" hint="With country code, e.g. +91 98765 43210" error={fieldErrors.phone}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            required
            minLength={10}
            maxLength={20}
            pattern="\+?[0-9 \-]+"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={onChange}
            className={cn(inputClass, "h-12")}
            {...errorProps("phone", true)}
          />
        </Field>
        <Field id={id("college")} label="College or university" error={fieldErrors.college}>
          <input
            id={id("college")}
            name="college"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="organization"
            value={values.college}
            onChange={onChange}
            className={cn(inputClass, "h-12")}
            {...errorProps("college")}
          />
        </Field>
        <Field id={id("year")} label="Current year" error={fieldErrors.year}>
          <SelectWrap>
            <select
              id={id("year")}
              name="year"
              required
              value={values.year}
              onChange={onChange}
              className={cn(inputClass, "h-12 appearance-none pr-11 [&_option]:bg-ls-field [&_option]:text-ls-fg")}
              {...errorProps("year")}
            >
              <option value="" disabled>
                Select
              </option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </SelectWrap>
        </Field>
        <Field id={id("currentStatus")} label="Current status" error={fieldErrors.currentStatus}>
          <SelectWrap>
            <select
              id={id("currentStatus")}
              name="currentStatus"
              required
              value={values.currentStatus}
              onChange={onChange}
              className={cn(inputClass, "h-12 appearance-none pr-11 [&_option]:bg-ls-field [&_option]:text-ls-fg")}
              {...errorProps("currentStatus")}
            >
              <option value="" disabled>
                Select
              </option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </SelectWrap>
        </Field>
      </div>

      <fieldset aria-describedby={fieldErrors.paymentPlan ? id("paymentPlan-error") : undefined}>
        <legend className={cn("mb-2", formLabel)}>Payment plan</legend>
        {program ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {program.paymentPlans.map((plan, index) => {
              const split = plan.type === "SPLIT PAYMENT"
              return (
                <label
                  key={plan.type}
                  className="group relative flex cursor-pointer flex-col gap-1 rounded-[6px] border border-white/[0.18] bg-ls-field p-4 transition-colors hover:border-white/30 has-[:checked]:border-ls-amber has-[:checked]:bg-ls-amber/[0.06] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ls-fg"
                >
                  <input
                    type="radio"
                    name="paymentPlan"
                    value={plan.type}
                    required={index === 0}
                    checked={values.paymentPlan === plan.type}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-base font-medium text-ls-fg">
                      {split ? "Pay in instalments" : "Pay in full"}
                    </span>
                    <span
                      aria-hidden
                      className="flex size-4 shrink-0 items-center justify-center rounded-full border border-white/30 group-has-[:checked]:border-ls-amber"
                    >
                      <span className="size-2 rounded-full bg-ls-amber opacity-0 transition-opacity group-has-[:checked]:opacity-100" />
                    </span>
                  </span>
                  {split && plan.schedule?.length ? (
                    <>
                      {plan.schedule.map((line) => (
                        <span key={line} className="text-[15px] text-ls-fg">
                          <Money>{line}</Money>
                        </span>
                      ))}
                      <span className="text-sm text-ls-faint">
                        <Money>{plan.amount}</Money> in total
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[15px] text-ls-fg">
                        <Money>{plan.amount}</Money>
                      </span>
                      <span className="text-sm text-ls-faint">{plan.description}</span>
                    </>
                  )}
                </label>
              )
            })}
          </div>
        ) : (
          <p className="m-0 rounded-[6px] border border-dashed border-white/[0.18] p-4 text-sm text-ls-faint">
            Choose a program to see its payment plans.
          </p>
        )}
        {fieldErrors.paymentPlan && (
          <p id={id("paymentPlan-error")} className={cn("mt-2", formError)}>
            {fieldErrors.paymentPlan}
          </p>
        )}
      </fieldset>

      <Field
        id={id("message")}
        label="Questions for the coordinator (optional)"
        error={fieldErrors.message}
        aside={
          <span className="text-xs tabular-nums text-ls-faint">
            {values.message.length}/{MESSAGE_MAX}
          </span>
        }
      >
        <textarea
          id={id("message")}
          name="message"
          rows={3}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={onChange}
          className={cn(inputClass, "resize-y py-3")}
          {...errorProps("message")}
        />
      </Field>

      <div aria-live="polite">
        {formError && (
          <p className={formAlert}>
            {formError.split(CONTACT.support).map((part, i) =>
              i === 0 ? (
                part
              ) : (
                <span key={i}>
                  <a
                    href={`mailto:${CONTACT.support}`}
                    className="wrap-anywhere underline decoration-red-200/40 underline-offset-2 hover:decoration-red-200"
                  >
                    {CONTACT.support}
                  </a>
                  {part}
                </span>
              ),
            )}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className={buttonClass("amber", "lg", "w-full border-none font-[inherit] disabled:cursor-not-allowed disabled:opacity-60")}
        >
          {submitting ? "Sending…" : "Send application"}
        </button>
        <p className="m-0 mt-3 text-sm text-ls-faint">
          No payment is needed to apply. A program coordinator will contact you with the next steps.
        </p>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  aside,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={formLabel}>
          {label}
        </label>
        {aside}
      </div>
      {children}
      {hint && (
        <p id={`${id}-hint`} className={cn("m-0", formHint)}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={formError}>
          {error}
        </p>
      )}
    </div>
  )
}

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ls-faint"
      />
    </div>
  )
}
