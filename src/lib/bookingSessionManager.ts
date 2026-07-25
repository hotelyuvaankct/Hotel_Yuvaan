import type { CartItem } from "@/components/booking/BookingSidebar";
import type { AvailableRoomType } from "@/services/bookingService";
import type { CouponValidation } from "@/services/couponService";

export interface GuestDetails {
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
}

export interface BookingSession {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomGuests: { adults: number; children: number }[];
  cart: CartItem[];
  /** Snapshot from book page — used for upgrade offers on checkout */
  availableRooms?: AvailableRoomType[];
  pendingCouponCode?: string;
  guest?: GuestDetails;
  appliedCoupon?: CouponValidation | null;
  updatedAt: number;
}

const STORAGE_KEY = "hotel-yuvaan-booking-session";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Hard reload wipes the cart — user must re-select rooms. Soft SPA navigations keep it. */
function clearOnHardReload(): void {
  if (typeof window === "undefined") return;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

clearOnHardReload();

function isValidSession(value: unknown): value is BookingSession {
  if (!value || typeof value !== "object") return false;
  const session = value as BookingSession;
  return (
    typeof session.hotelId === "number" &&
    typeof session.checkIn === "string" &&
    typeof session.checkOut === "string" &&
    Array.isArray(session.cart) &&
    Array.isArray(session.roomGuests)
  );
}

function readRaw(): BookingSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidSession(parsed)) return null;
    if (Date.now() - (parsed.updatedAt ?? 0) > MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function write(session: BookingSession): void {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...session, updatedAt: Date.now() })
  );
}

export const bookingSession = {
  load(): BookingSession | null {
    return readRaw();
  },

  save(session: Omit<BookingSession, "updatedAt">): BookingSession {
    const next: BookingSession = { ...session, updatedAt: Date.now() };
    write(next);
    return next;
  },

  patch(partial: Partial<Omit<BookingSession, "updatedAt">>): BookingSession | null {
    const current = readRaw();
    if (!current) return null;
    const next: BookingSession = {
      ...current,
      ...partial,
      updatedAt: Date.now(),
    };
    write(next);
    return next;
  },

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  },

  hasActiveCart(): boolean {
    const session = readRaw();
    return Boolean(session?.cart?.length);
  },

  matchesStay(params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    roomGuestsKey: string;
  }): boolean {
    const session = readRaw();
    if (!session) return false;
    return (
      session.checkIn === params.checkIn &&
      session.checkOut === params.checkOut &&
      session.adults === params.adults &&
      session.children === params.children &&
      JSON.stringify(session.roomGuests) === params.roomGuestsKey
    );
  },

  saveRoomSelection(input: {
    hotelId: number;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    roomGuests: { adults: number; children: number }[];
    cart: CartItem[];
    availableRooms?: AvailableRoomType[];
    pendingCouponCode?: string;
  }): BookingSession {
    const existing = readRaw();
    const nextPending =
      "pendingCouponCode" in input
        ? input.pendingCouponCode?.trim().toUpperCase() || undefined
        : existing?.pendingCouponCode;
    return this.save({
      hotelId: input.hotelId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      adults: input.adults,
      children: input.children,
      roomGuests: input.roomGuests,
      cart: input.cart,
      availableRooms:
        input.availableRooms !== undefined
          ? input.availableRooms
          : existing?.availableRooms,
      pendingCouponCode: nextPending,
      guest: existing?.guest,
      appliedCoupon:
        nextPending &&
        existing?.appliedCoupon?.code?.toUpperCase() === nextPending
          ? existing.appliedCoupon
          : nextPending
            ? null
            : existing?.appliedCoupon ?? null,
    });
  },

  saveCheckoutDetails(input: {
    guest: GuestDetails;
    pendingCouponCode?: string;
    appliedCoupon?: CouponValidation | null;
  }): BookingSession | null {
    return this.patch({
      guest: input.guest,
      pendingCouponCode: input.pendingCouponCode,
      appliedCoupon: input.appliedCoupon ?? null,
    });
  },
};

/** @deprecated Use bookingSession */
export type BookCheckoutDraft = Omit<BookingSession, "updatedAt" | "guest" | "appliedCoupon">;

export function saveBookCheckoutDraft(draft: BookCheckoutDraft): void {
  bookingSession.saveRoomSelection(draft);
}

export function loadBookCheckoutDraft(): BookCheckoutDraft | null {
  const session = bookingSession.load();
  if (!session) return null;
  return {
    hotelId: session.hotelId,
    checkIn: session.checkIn,
    checkOut: session.checkOut,
    adults: session.adults,
    children: session.children,
    roomGuests: session.roomGuests,
    cart: session.cart,
    pendingCouponCode: session.pendingCouponCode,
  };
}

export function clearBookCheckoutDraft(): void {
  bookingSession.clear();
}
