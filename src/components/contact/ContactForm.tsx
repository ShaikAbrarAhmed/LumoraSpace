"use client"

import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { formAlert, formError, formField, formLabel } from "@/components/site/form-styles"
import { buttonClass } from "@/components/site/ui"
import { CONTACT_TOPICS, isContactTopic, type ContactTopic } from "@/lib/schemas/contact"
import { CONTACT } from "@/lib/site"
import { cn } from "@/lib/utils"

type FieldName = "topic" | "name" | "email" | "phone" | "organisation" | "message"

const fieldClass = formField

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: ReactNode
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={formLabel}>
        {label}
        {optional && <span className="text-ls-faint"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={formError}>
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm({ initialTopic }: { initialTopic: ContactTopic }) {
  const uid = useId()
  const id = (name: FieldName) => `${uid}-${name}`

  const [values, setValues] = useState({
    topic: initialTopic as ContactTopic,
    name: "",
    email: "",
    phone: "",
    organisation: "",
    message: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const topic = CONTACT_TOPICS[values.topic]

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    if (name === "topic" && !isContactTopic(value)) return
    setValues((current) => ({ ...current, [name]: value }))
  }

  const errorProps = (name: FieldName) => ({
    "aria-invalid": fieldErrors[name] ? true : undefined,
    "aria-describedby": fieldErrors[name] ? `${id(name)}-error` : undefined,
  })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setFormError("")
    setFieldErrors({})

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: values.topic,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          organisation: values.organisation.trim(),
          message: values.message.trim(),
        }),
      })

      if (res.ok) {
        setSent(true)
        return
      }

      const body = (await res.json().catch(() => ({}))) as {
        details?: { fieldErrors?: Record<string, string[] | undefined> }
      }

      if (res.status === 400 && body.details?.fieldErrors) {
        const next: Partial<Record<FieldName, string>> = {}
        for (const [key, messages] of Object.entries(body.details.fieldErrors)) {
          if (key in values && messages?.[0]) next[key as FieldName] = messages[0]
        }
        setFieldErrors(next)
        setFormError("Please check the highlighted fields.")
      } else if (res.status === 429) {
        setFormError("Too many attempts. Please wait a minute and try again.")
      } else {
        // 503/500: the server could not store the message. Say so plainly; nothing reached us.
        setFormError(`Your message could not be saved, so it has not reached us. Please try again later, or email ${CONTACT.hello}.`)
      }
    } catch {
      setFormError(`Your message could not be sent. Check your connection and try again, or email ${CONTACT.hello}.`)
    } finally {
      setSubmitting(false)
    }
  }

  const frame = "flex flex-col gap-5 border-t-2 border-ls-amber pt-2"

  if (sent) {
    return (
      <div className={cn(frame, "pt-6")} role="status">
        <h2 className="m-0 text-[28px] font-semibold tracking-[-0.025em] text-ls-fg">Thanks, {values.name.trim().split(" ")[0]}. We have your message.</h2>
        <p className="m-0 max-w-[48ch]">
          A person from our team will reply to {values.email.trim()}. If it is urgent, write to{" "}
          <a href={`mailto:${CONTACT.hello}`} className="text-ls-fg underline-offset-4">
            {CONTACT.hello}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Contact form" className={frame}>
      <Field id={id("topic")} label="I’m interested in" error={fieldErrors.topic}>
        <select id={id("topic")} name="topic" value={values.topic} onChange={onChange} className={fieldClass} {...errorProps("topic")}>
          {Object.entries(CONTACT_TOPICS).map(([key, option]) => (
            <option key={key} value={key}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))" }}>
        <Field id={id("name")} label="Full name" error={fieldErrors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={onChange}
            className={fieldClass}
            {...errorProps("name")}
          />
        </Field>
        <Field id={id("email")} label="Email" error={fieldErrors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={onChange}
            className={fieldClass}
            {...errorProps("email")}
          />
        </Field>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))" }}>
        <Field id={id("phone")} label="Phone" optional error={fieldErrors.phone}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={onChange}
            className={fieldClass}
            {...errorProps("phone")}
          />
        </Field>
        <Field id={id("organisation")} label={topic.org} optional error={fieldErrors.organisation}>
          <input
            id={id("organisation")}
            name="organisation"
            type="text"
            autoComplete="organization"
            value={values.organisation}
            onChange={onChange}
            className={fieldClass}
            {...errorProps("organisation")}
          />
        </Field>
      </div>

      <Field id={id("message")} label="Message" error={fieldErrors.message}>
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          required
          placeholder={topic.hint}
          value={values.message}
          onChange={onChange}
          className={cn(fieldClass, "resize-y py-3")}
          {...errorProps("message")}
        />
      </Field>

      <div aria-live="polite">
        {formError && (
          <p className={formAlert}>
            {formError}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" disabled={submitting} className={buttonClass("amber", "lg", "border-none font-[inherit] disabled:cursor-wait disabled:opacity-70")}>
          {submitting ? "Sending…" : "Send message"}
        </button>
        <span className="text-sm text-ls-faint">We use your details only to reply to you.</span>
      </div>
    </form>
  )
}
