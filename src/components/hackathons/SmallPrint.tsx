import { ARENA, CONTACT } from "@/lib/site"

export function SmallPrint() {
  return (
    <section aria-labelledby="small-print-title" className="border-t border-white/[0.06]">
      <div className="container-page py-12 sm:py-14">
        <div className="grid gap-3 sm:grid-cols-[12rem_1fr] sm:gap-10">
          <h2 id="small-print-title" className="font-heading text-sm font-medium text-headings">
            Tickets and payments
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Tickets and payments for Arena events are handled on {ARENA.name} ({ARENA.host}). Payments made there
            are final and are not refunded. For help with a ticket, check-in or a certificate, email{" "}
            <a
              href={`mailto:${CONTACT.support}`}
              className="break-words text-headings underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
            >
              {CONTACT.support}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
