import { NextResponse } from "next/server";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { addDoc, findOneByField, firestoreConfigured } from "@/lib/firestore";
import { SignupSchema } from "@/lib/schemas/auth";
import { RateLimiter } from "@/lib/rate-limit";
import { escapeHtml, plainText, adminRecipients } from "@/lib/email";

const signupLimiter = new RateLimiter({
  limit: 5,
  route: "/api/signup",
});

export async function POST(req: Request) {
  try {
    const limitResult = await signupLimiter.check(req);
    if (!limitResult.success && limitResult.response) {
      return limitResult.response;
    }

    let data: unknown;
    try {
      data = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request. Please try again." }, { status: 400 });
    }

    const validationResult = SignupSchema.safeParse(data);
    if (!validationResult.success) {
      const { fieldErrors } = z.flattenError(validationResult.error);
      return NextResponse.json(
        {
          error: validationResult.error.issues[0]?.message ?? "Please check the form and try again.",
          fields: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    if (!firestoreConfigured()) {
      console.error("Signup unavailable: Firestore is not configured.");
      return NextResponse.json(
        { error: "Account creation is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    try {
      const existingUser = await findOneByField("users", "email", email);
      if (existingUser) {
        const message = "An account with this email already exists";
        return NextResponse.json(
          { error: message, code: "EMAIL_TAKEN", fields: { email: [message] } },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await addDoc("users", { name, email, password: hashedPassword }, ["createdAt"]);
    } catch (dbError) {
      console.error("Error saving user to Firestore:", dbError);
      return NextResponse.json(
        { error: "We couldn't create your account right now. Please try again in a few minutes." },
        { status: 500 }
      );
    }

    // Only notify the team once the account has actually been saved.
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "LumoraSpace <support@lumoraspace.in>",
          to: adminRecipients(),
          subject: `New LumoraSpace account: ${plainText(name)}`,
          html: `
            <h2>New LumoraSpace account</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          `,
        });
      } catch (emailError) {
        console.error("Error sending signup alert email:", emailError);
      }
    }

    return NextResponse.json({ success: true, user: { name, email } }, { status: 200 });
  } catch (error) {
    console.error("Signup API Route Error:", error);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again later." },
      { status: 500 }
    );
  }
}
