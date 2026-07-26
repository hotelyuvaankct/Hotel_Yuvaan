import { apiUrl } from "@/config/env";

export interface HotelSummary {
  id: number;
  name: string;
  city?: string;
  state?: string;
}

export interface BookingConfig {
  maxRooms: number;
  minAdultsPerRoom: number;
  maxAdultsPerRoom: number;
  maxChildrenPerRoom: number;
  checkInTime: string;
  checkOutTime: string;
  hotelNotifyEmail?: string;
}

export interface RoomGuestConfig {
  adults: number;
  children: number;
}

export interface AvailableRoomType {
  roomTypeId: number;
  name: string;
  description: string | null;
  maxGuests: number;
  availableRooms: number;
  sortOrder?: number | null;
  primaryImageUrl?: string;
  amenities: string[];
  soldOut?: boolean;
  ratePlans?: RatePlan[];
  /** @deprecated stay payload no longer includes these; kept optional for older caches */
  maxAdults?: number;
  maxChildren?: number;
  totalRooms?: number;
  basePricePerNight?: number;
  fromPrice?: number;
  totalNights?: number;
  images?: string[];
  badges?: string[];
  canAccommodateSingleRoom?: boolean;
}

export interface StayResult {
  hotelId: number;
  hotelName?: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  config: BookingConfig;
  rooms: AvailableRoomType[];
}

export interface RatePlan {
  code: string;
  label: string;
  features: string[];
  pricePerNight: number;
  sortOrder?: number | null;
  totalPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  totalNights?: number;
}

export interface BookingRoomLine {
  id?: number;
  roomTypeId: number;
  roomTypeName: string;
  ratePlanCode?: string;
  quantity: number;
  pricePerNight: number;
  totalNights: number;
  lineTotal?: number;
}

export interface BookingQuote {
  hotelId: number;
  hotelName?: string;
  checkIn: string;
  checkOut: string;
  totalNights?: number;
  adults?: number;
  children?: number;
  rooms?: number;
  subtotalAmount?: number;
  discountAmount?: number;
  couponCode?: string;
  couponTitle?: string;
  taxAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  roomTaxPercent?: number;
  processingFeePercent?: number;
  processingFeeAmount?: number;
  processingFeeGstPercent?: number;
  processingFeeGstAmount?: number;
  totalAmount?: number;
  roomLines?: BookingRoomLine[];
}

export interface CheckoutRoomSelection {
  roomTypeId: number;
  ratePlanCode: string;
  quantity: number;
  guestCount: number;
}

export function buildOccupancySelections(
  cart: Array<{
    roomTypeId: number;
    ratePlanCode: string;
    quantity: number;
    maxGuests?: number;
  }>,
  roomGuests: RoomGuestConfig[]
): CheckoutRoomSelection[] {
  const physicalRooms: Array<{ roomTypeId: number; ratePlanCode: string; maxGuests: number }> =
    [];
  for (const item of cart) {
    const maxGuests = Math.max(1, item.maxGuests ?? 2);
    for (let i = 0; i < item.quantity; i += 1) {
      physicalRooms.push({
        roomTypeId: item.roomTypeId,
        ratePlanCode: item.ratePlanCode,
        maxGuests,
      });
    }
  }

  let remainingGuests = roomGuests.reduce(
    (sum, room) => sum + Math.max(room.adults + room.children, 0),
    0
  );
  if (remainingGuests < 1) remainingGuests = 1;

  const grouped = new Map<string, CheckoutRoomSelection>();
  for (let index = 0; index < physicalRooms.length; index += 1) {
    const room = physicalRooms[index];
    const roomsLeft = physicalRooms.length - index;
    const maxForThisRoom = room.maxGuests;
    // Leave at least 1 guest slot for each remaining room when possible.
    const minForThisRoom = Math.min(
      maxForThisRoom,
      Math.max(1, remainingGuests - (roomsLeft - 1) * maxForThisRoom)
    );
    const ideal = Math.ceil(remainingGuests / roomsLeft);
    const guestCount = Math.min(
      maxForThisRoom,
      Math.max(minForThisRoom, Math.min(ideal, remainingGuests))
    );
    remainingGuests = Math.max(0, remainingGuests - guestCount);

    const key = `${room.roomTypeId}:${room.ratePlanCode}:${guestCount}`;
    const current = grouped.get(key);
    if (current) {
      current.quantity += 1;
    } else {
      grouped.set(key, {
        roomTypeId: room.roomTypeId,
        ratePlanCode: room.ratePlanCode,
        quantity: 1,
        guestCount,
      });
    }
  }
  return Array.from(grouped.values());
}

export interface CheckoutPayload {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  selections: CheckoutRoomSelection[];
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
  couponCode?: string;
}

export interface BookingResult {
  id: number;
  bookingCode: string;
  accessToken?: string;
  hotelId: number;
  hotelName?: string;
  bookingStatus: number;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestLastName?: string;
  guestEmail?: string;
  guestPhone?: string;
  totalRooms: number;
  totalGuests: number;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  couponTitle?: string;
  cgstAmount?: number;
  sgstAmount?: number;
  roomTaxPercent?: number;
  processingFeePercent?: number;
  processingFeeAmount?: number;
  processingFeeGstPercent?: number;
  processingFeeGstAmount?: number;
  rooms?: BookingRoomLine[];
  cancellationReason?: string;
  receiptDownloadUrl?: string;
  refund?: BookingRefund;
}

export interface BookingRefund {
  id?: number;
  amount?: number;
  percent?: number;
  status?: string;
  channel?: string;
  cancelledBy?: string;
  hoursBeforeCheckIn?: number;
  initiatedAt?: string;
  completedAt?: string;
  note?: string;
  failureReason?: string;
  paymentRefunded?: boolean;
}

export interface CancellationQuote {
  bookingId: number;
  bookingCode: string;
  paidAmount?: number;
  refundPercent?: number;
  refundAmount?: number;
  hoursBeforeCheckIn?: number;
  matchedMinHoursBeforeCheckIn?: number;
  cancelledBy?: string;
  note?: string;
  refundable?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    data: {} as T,
  }));
  if (!response.ok || !body.success) {
    throw new Error(body.message ?? "Request failed");
  }
  return body.data;
}

export async function fetchBookingConfig(): Promise<BookingConfig> {
  const response = await fetch(apiUrl("/bookings/config"));
  return parseResponse<BookingConfig>(response);
}

export async function fetchStay(params: {
  hotelId?: number;
  checkIn: string;
  checkOut: string;
  roomGuests: RoomGuestConfig[];
}): Promise<StayResult> {
  const response = await fetch(apiUrl("/bookings/stay"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      ...(params.hotelId != null ? { hotelId: params.hotelId } : {}),
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      roomGuests: params.roomGuests.map((room) => ({
        adults: room.adults,
        children: room.children,
      })),
    }),
  });
  return parseResponse<StayResult>(response);
}

export async function fetchHotels(): Promise<HotelSummary[]> {
  const response = await fetch(apiUrl("/rooms/hotels"));
  return parseResponse<HotelSummary[]>(response);
}

export async function quoteCheckout(payload: CheckoutPayload): Promise<BookingQuote> {
  const response = await fetch(apiUrl("/bookings/quote"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<BookingQuote>(response);
}

export async function checkoutBooking(payload: CheckoutPayload): Promise<BookingResult> {
  const response = await fetch(apiUrl("/bookings/checkout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body: ApiResponse<BookingResult> = await response.json().catch(() => ({
    success: false,
    data: {} as BookingResult,
  }));
  if (!response.ok || !body.success) {
    throw new Error(body.message ?? "Checkout failed");
  }
  return body.data;
}

export async function fetchPublicBooking(accessToken: string): Promise<BookingResult> {
  const response = await fetch(apiUrl(`/public/bookings/${accessToken}`), {
    cache: "no-store",
  });
  return parseResponse<BookingResult>(response);
}

export async function fetchCancellationQuote(accessToken: string): Promise<CancellationQuote> {
  const response = await fetch(apiUrl(`/public/bookings/${accessToken}/cancellation-quote`), {
    cache: "no-store",
  });
  return parseResponse<CancellationQuote>(response);
}

export async function requestCancelOtp(accessToken: string, email: string): Promise<void> {
  const response = await fetch(apiUrl(`/public/bookings/${accessToken}/cancel/request-otp`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });
  await parseResponse<null>(response);
}

export async function cancelPublicBooking(
  accessToken: string,
  payload: { email: string; otpCode: string; reason?: string }
): Promise<BookingResult> {
  const response = await fetch(apiUrl(`/public/bookings/${accessToken}/cancel`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<BookingResult>(response);
}

export async function resolveDefaultHotelId(): Promise<number> {
  const hotels = await fetchHotels();
  if (hotels.length === 0) {
    throw new Error("No active hotels found");
  }
  return hotels[0].id;
}

export function encodeRoomGuests(rooms: RoomGuestConfig[]): string {
  return rooms.map((room) => `${room.adults}-${room.children}`).join(",");
}

export function decodeRoomGuests(raw: string | null): RoomGuestConfig[] | null {
  if (!raw) return null;
  const parsed = raw.split(",").map((part) => {
    const [adults, children] = part.split("-").map(Number);
    return {
      adults: Number.isFinite(adults) && adults > 0 ? adults : 2,
      children: Number.isFinite(children) && children >= 0 ? children : 0,
    };
  });
  return parsed.length > 0 ? parsed : null;
}

export function computeGuestCapacity(selectedRooms: {
  quantity: number;
  maxGuests: number;
}[]): number {
  return selectedRooms.reduce(
    (total, room) => total + room.maxGuests * room.quantity,
    0
  );
}
