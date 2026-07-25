/**
 * JS/inline color helpers — values come from CSS variables in globals.css.
 * Change :root / .dark there; the whole site (including dark mode) updates.
 */

/** HSL CSS values for use in style={{ color: colors.brand }} etc. */
export const colors = {
  brand: "hsl(var(--brand))",
  brandForeground: "hsl(var(--brand-foreground))",
  brandHover: "hsl(var(--brand-hover))",
  brandMuted: "hsl(var(--brand-muted))",
  gold: "hsl(var(--gold))",
  goldStrong: "hsl(var(--gold-strong))",
  goldBright: "hsl(var(--gold-bright))",
  goldDeep: "hsl(var(--gold-deep))",
  goldBorder: "hsl(var(--gold-border))",
  goldMuted: "hsl(var(--gold-muted))",
  surface: "hsl(var(--surface))",
  surfaceElevated: "hsl(var(--surface-elevated))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  overlay: "hsl(var(--overlay))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: "hsl(var(--primary))",
  destructive: "hsl(var(--destructive))",
  border: "hsl(var(--border))",
  muted: "hsl(var(--muted))",
  white: "hsl(var(--white))",
  black: "hsl(var(--black))",
} as const;

export type ThemeColor = keyof typeof colors;

/**
 * Resolve a CSS variable to a computed color string (browser only).
 * Useful for third-party SDKs (e.g. Razorpay) that need a hex/rgb value.
 */
export function getCssColor(varName: string, fallback = "#4b3621"): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
}

/** Brand hex for payment SDKs — reads --brand-hex from the active theme. */
export function getBrandHex(): string {
  return getCssColor("--brand-hex", "#4b3621");
}

export function getGoldHex(): string {
  return getCssColor("--gold-hex", "#c9a227");
}
