import { z } from "zod";

/** What the visitor is writing about. Keys are stored; labels are what the form shows. */
export const CONTACT_TOPICS = {
  programs: { label: "Joining a program", org: "College and year", hint: "Which program are you interested in?" },
  project: { label: "A software or AI project", org: "Company", hint: "What are you trying to build, and by when?" },
  college: { label: "A college partnership", org: "College", hint: "What would you like to run with your students?" },
  arena: { label: "Hosting an event on Arena", org: "College, club or company", hint: "What event, and roughly how many people?" },
  hiring: { label: "Hiring our students", org: "Company", hint: "Which roles are you hiring for?" },
} as const;

export type ContactTopic = keyof typeof CONTACT_TOPICS;

const TOPIC_KEYS = Object.keys(CONTACT_TOPICS) as [ContactTopic, ...ContactTopic[]];

export const isContactTopic = (value: unknown): value is ContactTopic =>
  typeof value === "string" && Object.hasOwn(CONTACT_TOPICS, value);

// Every string is trimmed first, so a whitespace-only value counts as empty. Same limits as the cohort form.
export const ContactSubmitSchema = z.object({
  topic: z.enum(TOPIC_KEYS, "Choose what you are interested in"),
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: z.string()
    .trim()
    .toLowerCase()
    .max(100, "Email must not exceed 100 characters")
    .pipe(z.email("Invalid email address format")),
  // Optional. When given: digits, spaces, hyphens and an optional leading +; 10 to 15 digits in total.
  phone: z.string()
    .trim()
    .max(20, "Phone number is too long")
    .refine(
      (value) => value === "" || (/^\+?[0-9 -]+$/.test(value) && value.replace(/\D/g, "").length >= 10 && value.replace(/\D/g, "").length <= 15),
      "Use 10 to 15 digits, with an optional leading +",
    )
    .optional(),
  organisation: z.string()
    .trim()
    .max(100, "This is too long")
    .optional(),
  message: z.string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(1000, "Message must not exceed 1000 characters"),
});

export type ContactSubmitInput = z.infer<typeof ContactSubmitSchema>;
