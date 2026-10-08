import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;
// bcrypt only uses the first 72 bytes of a password, so the limit is checked in UTF-8 bytes
// (accented letters take 2 bytes, many other scripts 3, emoji 4).
export const PASSWORD_MAX_LENGTH = 72;

const utf8Length = (value: string) => new TextEncoder().encode(value).length;

const PASSWORD_PATTERNS = [
  { id: "upper", label: "An uppercase letter", pattern: /[A-Z]/, message: "Password must contain at least one uppercase letter" },
  { id: "lower", label: "A lowercase letter", pattern: /[a-z]/, message: "Password must contain at least one lowercase letter" },
  { id: "number", label: "A number", pattern: /[0-9]/, message: "Password must contain at least one number" },
  { id: "special", label: "A special character", pattern: /[^A-Za-z0-9]/, message: "Password must contain at least one special character" },
] as const;

export type PasswordRule = { id: string; label: string; test: (value: string) => boolean };

/** The password policy enforced by SignupSchema, listed for the live checklist on /create-account. */
export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: `${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters`,
    test: (value) => value.length >= PASSWORD_MIN_LENGTH && utf8Length(value) <= PASSWORD_MAX_LENGTH,
  },
  ...PASSWORD_PATTERNS.map(({ id, label, pattern }) => ({ id, label, test: (value: string) => pattern.test(value) })),
];

const passwordSchema = PASSWORD_PATTERNS.reduce(
  (schema, rule) => schema.regex(rule.pattern, rule.message),
  z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`)
    // Only adds an issue for non-ASCII passwords: anything over 72 characters has already failed .max().
    .refine(
      (value) => value.length > PASSWORD_MAX_LENGTH || utf8Length(value) <= PASSWORD_MAX_LENGTH,
      "Password is too long. Accented letters and emoji count as more than one character.",
    ),
);

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    // Letters in any script, plus spaces, full stops, hyphens and apostrophes ("K. Charan Raj", "O'Neil").
    // A literal space rather than \s, so line breaks and tabs can't get into the name (it goes into an email subject).
    .regex(/^[\p{L}\p{M} .'-]+$/u, "Name can only contain letters, spaces, full stops, hyphens and apostrophes"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(100, "Email must not exceed 100 characters")
    .regex(z.regexes.email, "Enter a valid email address"),
  password: passwordSchema,
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type SignupField = keyof SignupInput;
