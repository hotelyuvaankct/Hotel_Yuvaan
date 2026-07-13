/** Minimum / maximum digit count for phone numbers (after stripping non-digits). */
export const MIN_PHONE_DIGITS = 10;
export const MAX_PHONE_DIGITS = 15;

export type GuestFieldErrors = {
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
  guestPhone?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}\s'.-]+$/u;

export function isValidGuestName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && NAME_PATTERN.test(trimmed);
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/** Digits only, for length / format checks. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isValidPhone(phone: string): boolean {
  const digits = phoneDigits(phone);
  if (digits.length < MIN_PHONE_DIGITS || digits.length > MAX_PHONE_DIGITS) {
    return false;
  }
  // Indian mobile (10 digits starting 6–9), or +91 + 10-digit mobile
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith("91")) {
    return /^91[6-9]\d{9}$/.test(digits);
  }
  // Other international numbers: digits only, within length bounds
  return true;
}

/** Allow digits and common phone formatting characters while typing. */
export function sanitizePhoneInput(value: string): string {
  return value.replace(/[^\d+\s()-]/g, "").slice(0, 20);
}

export function validateGuestFields(guest: {
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
}): GuestFieldErrors {
  const errors: GuestFieldErrors = {};

  if (!guest.guestFirstName.trim()) {
    errors.guestFirstName = "First name is required";
  } else if (!isValidGuestName(guest.guestFirstName)) {
    errors.guestFirstName = "Enter a valid first name (letters only, min 2 characters)";
  }

  if (!guest.guestLastName.trim()) {
    errors.guestLastName = "Last name is required";
  } else if (!isValidGuestName(guest.guestLastName)) {
    errors.guestLastName = "Enter a valid last name (letters only, min 2 characters)";
  }

  if (!guest.guestEmail.trim()) {
    errors.guestEmail = "Email is required";
  } else if (!isValidEmail(guest.guestEmail)) {
    errors.guestEmail = "Enter a valid email address (e.g. name@example.com)";
  }

  if (!guest.guestPhone.trim()) {
    errors.guestPhone = "Phone number is required";
  } else if (!isValidPhone(guest.guestPhone)) {
    errors.guestPhone = `Enter a valid phone number (${MIN_PHONE_DIGITS}–${MAX_PHONE_DIGITS} digits)`;
  }

  return errors;
}
