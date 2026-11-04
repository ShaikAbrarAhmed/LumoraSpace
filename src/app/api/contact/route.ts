import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { addDoc, firestoreConfigured } from "@/lib/firestore";
import { CONTACT_TOPICS, ContactSubmitSchema } from "@/lib/schemas/contact";
import { RateLimiter } from "@/lib/rate-limit";
// Every user-supplied value goes through escapeHtml (email body) or plainText (subject).
import { escapeHtml, plainText, adminRecipients } from "@/lib/email";

const contactLimiter = new RateLimiter({
  limit: 10,
  route: "/api/contact",
});

/** General enquiries from the contact page: students, colleges, businesses, Arena hosts and hiring teams. */
export async function POST(req: Request) {
  try {
    const limitResult = await contactLimiter.check(req);
    if (!limitResult.success && limitResult.response) {
      return limitResult.response;
    }

    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const validationResult = ContactSubmitSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation Error", details: z.flattenError(validationResult.error) },
        { status: 400 }
      );
    }

    const { topic, name, email, phone, organisation, message } = validationResult.data;
    const topicLabel = CONTACT_TOPICS[topic].label;

    // 1. Save to Firestore. Without it nothing is stored, so say so (503), never fake a success.
    if (!firestoreConfigured()) {
      console.error("Firestore db is not available.");
      return NextResponse.json(
        { error: "Messages cannot be saved right now", code: "not_saved" },
        { status: 503 }
      );
    }

    try {
      await addDoc(
        "contact_messages",
        {
          topic,
          name,
          email,
          // Optional fields: Firestore rejects undefined, so a missing value is stored as "".
          phone: phone ?? "",
          organisation: organisation ?? "",
          message,
        },
        ["createdAt"]
      );
    } catch (dbError: unknown) {
      console.error("Error saving contact message to Firestore:", dbError);
      return NextResponse.json(
        { error: "The message could not be saved", code: "not_saved" },
        { status: 500 }
      );
    }

    // 2. Notify the team via Resend. The message is already saved, so a failed notification
    // is logged for the team but the visitor still gets an honest success.
    const apiKey = process.env.RESEND_API_KEY?.trim();
    let notified = true;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: "LumoraSpace <support@lumoraspace.in>",
          to: adminRecipients(),
          replyTo: email,
          subject: `New enquiry: ${plainText(topicLabel)} from ${plainText(name)}`,
          html: `
            <h2>New enquiry from the contact page</h2>
            <p><strong>Interested in:</strong> ${escapeHtml(topicLabel)}</p>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone || "N/A")}</p>
            <p><strong>${escapeHtml(CONTACT_TOPICS[topic].org)}:</strong> ${escapeHtml(organisation || "N/A")}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          `,
        });

        if (error) {
          console.error("Resend API returned an error (contact message saved):", error);
          notified = false;
        }
      } catch (emailError: unknown) {
        console.error("Error sending email (contact message saved):", emailError);
        notified = false;
      }
    } else {
      console.warn("RESEND_API_KEY is not defined. Contact message saved, email dispatch skipped.");
      notified = false;
    }

    return NextResponse.json({ success: true, notified }, { status: 200 });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
