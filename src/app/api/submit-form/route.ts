import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { addDoc, firestoreConfigured } from "@/lib/firestore";
import { CohortSubmitSchema } from "@/lib/schemas/cohort";
import { RateLimiter } from "@/lib/rate-limit";
import { programs } from "@/data/programs";
// Every user-supplied value goes through escapeHtml (email body) or plainText (subject).
import { escapeHtml, plainText, adminRecipients } from "@/lib/email";

const submitFormLimiter = new RateLimiter({
  limit: 10,
  route: "/api/submit-form",
});

export async function POST(req: Request) {
  try {
    // Rate limit check
    const limitResult = await submitFormLimiter.check(req);
    if (!limitResult.success && limitResult.response) {
      return limitResult.response;
    }

    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Zod validation boundary
    const validationResult = CohortSubmitSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation Error", details: z.flattenError(validationResult.error) },
        { status: 400 }
      );
    }

    const { 
      name, email, college, phone, message,
      year, status, paymentPlan, programSlug 
    } = validationResult.data;

    // Validate program on the server
    const program = programSlug && Object.hasOwn(programs, programSlug) ? programs[programSlug] : undefined;
    if (!program) {
      return NextResponse.json(
        { error: "Invalid or missing program" },
        { status: 400 }
      );
    }

    const cohort = program.title;
    const programDuration = program.duration;
    const programFee = program.fee;

    // 1. Save to Firebase Firestore. Without it nothing is stored, so say so (503), never fake a success.
    if (!firestoreConfigured()) {
      console.error("Firestore db is not available.");
      return NextResponse.json(
        { error: "Applications cannot be saved right now", code: "not_saved" },
        { status: 503 }
      );
    }

    try {
      await addDoc(
        "cohort_applications",
        {
        name,
        email,
        cohort,
        // Optional fields: Firestore rejects undefined, so a missing value is stored as "".
        college: college ?? "",
        phone,
        message: message ?? "",
        year: year || null,
        status: status || null,
        paymentPlan: paymentPlan || null,
        programSlug: programSlug || null,
        programDuration: programDuration || null,
        programFee: programFee || null,
        },
        ["createdAt"]
      );
    } catch (dbError: unknown) {
      console.error("Error saving to Firestore:", dbError);
      return NextResponse.json(
        { error: "The application could not be saved", code: "not_saved" },
        { status: 500 }
      );
    }

    // 2. Notify the team via Resend. The application is already saved at this point, so a failed
    // notification is logged for the team but the applicant still gets an honest success.
    const apiKey = process.env.RESEND_API_KEY?.trim();
    let notified = true;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: "LumoraSpace <support@lumoraspace.in>",
          to: adminRecipients(),
          subject: `New Cohort Application: ${plainText(name)} for ${plainText(cohort)}`,
          html: `
            <h2>New Cohort Application Received</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
            <p><strong>College/University:</strong> ${escapeHtml(college || "N/A")}</p>
            <p><strong>Current Year:</strong> ${escapeHtml(year || "N/A")}</p>
            <p><strong>Current Status:</strong> ${escapeHtml(status || "N/A")}</p>
            <p><strong>Cohort/Program:</strong> ${escapeHtml(cohort)}</p>
            <p><strong>Program Slug:</strong> ${escapeHtml(programSlug || "N/A")}</p>
            <p><strong>Program Duration:</strong> ${escapeHtml(programDuration || "N/A")}</p>
            <p><strong>Program Fee:</strong> ${escapeHtml(programFee || "N/A")}</p>
            <p><strong>Selected Payment Plan:</strong> ${escapeHtml(paymentPlan || "N/A")}</p>
            <p><strong>Message/Interest:</strong></p>
            <p style="white-space:pre-wrap">${escapeHtml(message || "None provided")}</p>
          `,
        });

        if (error) {
          console.error("Resend API returned an error (application saved):", error);
          notified = false;
        }
      } catch (emailError: unknown) {
        console.error("Error sending email (application saved):", emailError);
        notified = false;
      }
    } else {
      console.warn("RESEND_API_KEY is not defined. Application saved, email dispatch skipped.");
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