import { z } from "zod";

// Every string is trimmed first, so " a@b.co " passes and a whitespace-only value counts as empty.
export const CohortSubmitSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: z.string()
    .trim()
    .toLowerCase()
    .max(100, "Email must not exceed 100 characters")
    .pipe(z.email("Invalid email address format")),
  // Optional on the server; an empty (or whitespace-only) value is stored as empty.
  college: z.string()
    .trim()
    .max(100, "College name is too long")
    .refine((value) => value === "" || value.length >= 2, "College name must be at least 2 characters")
    .optional(),
  // Digits, spaces, hyphens and an optional leading +; 10 to 15 digits in total.
  phone: z.string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(/^\+?[0-9 -]+$/, "Use digits, spaces and an optional leading +")
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 15;
    }, "Phone number must have 10 to 15 digits"),
  message: z.string()
    .trim()
    .max(500, "Message must not exceed 500 characters")
    .optional(),
  year: z.string()
    .trim()
    .max(50, "Year is too long")
    .optional(),
  status: z.string()
    .trim()
    .max(50, "Status is too long")
    .optional(),
  paymentPlan: z.enum(["FULL PAYMENT", "SPLIT PAYMENT"]).optional(),
  programSlug: z.string().trim().min(1, "Program slug is required"),
});

export type CohortSubmitInput = z.infer<typeof CohortSubmitSchema>;
