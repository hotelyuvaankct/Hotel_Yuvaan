/** Indian mobile: exactly 10 digits. */
export const MIN_PHONE_DIGITS = 10;
export const MAX_PHONE_DIGITS = 10;

export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 50;

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
  return (
    trimmed.length >= MIN_NAME_LENGTH &&
    trimmed.length <= MAX_NAME_LENGTH &&
    NAME_PATTERN.test(trimmed)
  );
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
  return digits.length === MAX_PHONE_DIGITS && /^[6-9]\d{9}$/.test(digits);
}

/** Digits only, max 10 — used while typing mobile numbers. */
export function sanitizePhoneInput(value: string): string {
  return phoneDigits(value).slice(0, MAX_PHONE_DIGITS);
}

/** Cap name length while typing (first / last name). */
export function sanitizeNameInput(value: string): string {
  return value.slice(0, MAX_NAME_LENGTH);
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
  } else if (guest.guestFirstName.trim().length > MAX_NAME_LENGTH) {
    errors.guestFirstName = `First name must be ${MAX_NAME_LENGTH} characters or fewer`;
  } else if (!isValidGuestName(guest.guestFirstName)) {
    errors.guestFirstName = `Enter a valid first name (letters only, ${MIN_NAME_LENGTH}–${MAX_NAME_LENGTH} characters)`;
  }

  // Last name is optional — validate only when provided
  if (guest.guestLastName.trim()) {
    if (guest.guestLastName.trim().length > MAX_NAME_LENGTH) {
      errors.guestLastName = `Last name must be ${MAX_NAME_LENGTH} characters or fewer`;
    } else if (!isValidGuestName(guest.guestLastName)) {
      errors.guestLastName = `Enter a valid last name (letters only, ${MIN_NAME_LENGTH}–${MAX_NAME_LENGTH} characters)`;
    }
  }

  if (!guest.guestEmail.trim()) {
    errors.guestEmail = "Email is required";
  } else if (!isValidEmail(guest.guestEmail)) {
    errors.guestEmail = "Enter a valid email address (e.g. name@example.com)";
  }

  if (!guest.guestPhone.trim()) {
    errors.guestPhone = "Phone number is required";
  } else if (!isValidPhone(guest.guestPhone)) {
    errors.guestPhone = "Enter a valid 10-digit mobile number";
  }

  return errors;
}
