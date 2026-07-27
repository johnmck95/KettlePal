// Email validation + normalization. Mirrors the regex used on the frontend
// so the two ends agree on what "valid" means.
//
// Refuse obviously-junk input ("not an email", "  ", "foo@", "foo@bar", etc.)
// and normalize whitespace/capitalization so "Foo@bar.com " and "foo@BAR.com"
// resolve to the same account.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function normalizeEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    // Regex won't accept these, but defensively still produce a string.
    return trimmed.toLowerCase();
  }
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  return `${local.toLowerCase()}@${domain.toLowerCase()}`;
}

export function validateAndNormalizeEmail(email: unknown): string {
  if (typeof email !== "string") {
    throw new Error("Email is required.");
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    throw new Error("Email is required.");
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    throw new Error("Email is invalid.");
  }
  return normalizeEmail(trimmed);
}
