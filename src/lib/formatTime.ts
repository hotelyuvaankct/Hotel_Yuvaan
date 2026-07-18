/**
 * Formats a time value into a consistent 12-hour clock with uppercase AM/PM.
 *
 * Accepts common backend and content formats:
 *   "14:00"    -> "2:00 PM"
 *   "14:00:00" -> "2:00 PM"
 *   "07:00"    -> "7:00 AM"
 *   "7AM"      -> "7:00 AM"
 *   "7:30 am"  -> "7:30 AM"
 *   "12:00"    -> "12:00 PM"
 *   "00:00"    -> "12:00 AM"
 *
 * Unrecognized non-empty values are returned unchanged so unexpected backend
 * data stays visible. Empty/nullish values return an empty string.
 */
export function formatTime12h(value: string | null | undefined): string {
  if (value == null) return "";
  const raw = String(value).trim();
  if (raw === "") return "";

  // Matches "7", "7:30", "07:00:00" optionally followed by am/pm (any casing/spacing/dots).
  const match = raw.match(
    /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*([aApP]\.?[mM]\.?)?$/
  );
  if (!match) return raw;

  let hours = Number(match[1]);
  const minutes = match[2] != null ? Number(match[2]) : 0;
  const meridiemRaw = match[4];

  if (Number.isNaN(hours) || minutes < 0 || minutes > 59) return raw;

  if (meridiemRaw) {
    // 12-hour input with explicit AM/PM
    const isPM = /p/i.test(meridiemRaw);
    if (hours < 1 || hours > 12) return raw;
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  } else {
    // 24-hour input
    if (hours > 23) return raw;
  }

  const meridiem = hours >= 12 ? "PM" : "AM";
  let displayHour = hours % 12;
  if (displayHour === 0) displayHour = 12;

  const paddedMinutes = String(minutes).padStart(2, "0");
  return `${displayHour}:${paddedMinutes} ${meridiem}`;
}

/**
 * Formats a time range, e.g. formatTimeRange("07:00", "23:00") -> "7:00 AM - 11:00 PM".
 * Falls back gracefully if either value is missing.
 */
export function formatTimeRange(
  start: string | null | undefined,
  end: string | null | undefined,
  separator = " - "
): string {
  const from = formatTime12h(start);
  const to = formatTime12h(end);
  if (from && to) return `${from}${separator}${to}`;
  return from || to;
}
