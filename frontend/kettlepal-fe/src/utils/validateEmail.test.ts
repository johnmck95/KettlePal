import {
  isValidEmail,
  normalizeEmail,
  validateAndNormalizeEmail,
} from "./validateEmail";

describe("isValidEmail", () => {
  it("accepts a simple address", () => {
    expect(isValidEmail("foo@bar.com")).toBe(true);
  });

  it("accepts an address with dots in the local part", () => {
    expect(isValidEmail("first.last@example.co.uk")).toBe(true);
  });

  it("accepts an address with mixed case", () => {
    expect(isValidEmail("Foo@Bar.COM")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects whitespace-only string", () => {
    expect(isValidEmail("   ")).toBe(false);
  });

  it("rejects missing local part", () => {
    expect(isValidEmail("@bar.com")).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(isValidEmail("foo@")).toBe(false);
  });

  it("rejects missing TLD", () => {
    expect(isValidEmail("foo@bar")).toBe(false);
  });

  it("rejects internal whitespace", () => {
    expect(isValidEmail("foo @bar.com")).toBe(false);
    expect(isValidEmail("foo@bar .com")).toBe(false);
  });

  it("rejects multiple @", () => {
    expect(isValidEmail("foo@bar@baz.com")).toBe(false);
  });
});

describe("normalizeEmail", () => {
  it("lowercases both local and domain", () => {
    expect(normalizeEmail("Foo@X.COM")).toBe("foo@x.com");
  });

  it("lowercases only the local part when domain is fine", () => {
    expect(normalizeEmail("ALICE@example.com")).toBe("alice@example.com");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeEmail("  foo@bar.com  ")).toBe("foo@bar.com");
  });

  it("preserves dot.case in the local part", () => {
    // RFC-5321 says local-part is technically case-sensitive, but every
    // provider treats it as case-insensitive. We lowercase but don't
    // otherwise munge valid local-part characters.
    expect(normalizeEmail("First.Last@Example.com")).toBe(
      "first.last@example.com"
    );
  });

  it("returns the input as-is (lowercased) when no @ is present", () => {
    // Defensive — the regex rejects this, but normalizeEmail shouldn't
    // throw on garbage input.
    expect(normalizeEmail("not-an-email")).toBe("not-an-email");
  });
});

describe("validateAndNormalizeEmail", () => {
  it("returns the normalized form for a valid email", () => {
    expect(validateAndNormalizeEmail("Foo@Bar.COM")).toBe("foo@bar.com");
  });

  it("trims and validates", () => {
    expect(validateAndNormalizeEmail("  Foo@Bar.COM  ")).toBe("foo@bar.com");
  });

  it("treats mixed-case variants as the same account", () => {
    // The whole point of the lowercase pass — these should collide.
    const a = validateAndNormalizeEmail("User@Example.com");
    const b = validateAndNormalizeEmail("user@EXAMPLE.COM");
    const c = validateAndNormalizeEmail("USER@example.com");
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it("throws 'Email is required.' for empty string", () => {
    expect(() => validateAndNormalizeEmail("")).toThrow("Email is required.");
  });

  it("throws 'Email is required.' for whitespace-only string", () => {
    expect(() => validateAndNormalizeEmail("   ")).toThrow(
      "Email is required."
    );
  });

  it("throws 'Email is required.' for non-string input", () => {
    expect(() => validateAndNormalizeEmail(undefined)).toThrow(
      "Email is required."
    );
    expect(() => validateAndNormalizeEmail(null)).toThrow(
      "Email is required."
    );
    expect(() => validateAndNormalizeEmail(42)).toThrow("Email is required.");
  });

  it("throws 'Email is invalid.' for malformed input", () => {
    expect(() => validateAndNormalizeEmail("foo@bar")).toThrow(
      "Email is invalid."
    );
    expect(() => validateAndNormalizeEmail("foo.bar.com")).toThrow(
      "Email is invalid."
    );
    expect(() => validateAndNormalizeEmail("foo bar@baz.com")).toThrow(
      "Email is invalid."
    );
  });
});
