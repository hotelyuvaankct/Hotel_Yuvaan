import { format, parseISO } from "date-fns";
import { formatRoomPrice } from "@/services/roomService";
import type { BookingConfig, BookingQuote } from "@/services/bookingService";

export type CartItem = {
  key: string;
  roomTypeId: number;
  roomTypeName: string;
  ratePlanCode: string;
  ratePlanLabel: string;
  quantity: number;
  pricePerNight: number;
  maxGuests: number;
  imageUrl?: string;
  totalNights: number;
};

interface BookingSidebarProps {
  checkIn: string;
  checkOut: string;
  cart: CartItem[];
  quote: BookingQuote | null;
  config: BookingConfig | null;
  onContinue: () => void;
  continueDisabled?: boolean;
  loading?: boolean;
}

const BookingSidebar = ({
  checkIn,
  checkOut,
  cart,
  quote,
  config,
  onContinue,
  continueDisabled,
  loading,
}: BookingSidebarProps) => {
  const nights =
    quote?.totalNights ??
    (checkIn && checkOut
      ? Math.max(
          1,
          Math.round(
            (parseISO(checkOut).getTime() - parseISO(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0);

  const subtotal =
    quote?.subtotalAmount ??
    cart.reduce(
      (sum, item) => sum + item.pricePerNight * item.quantity * item.totalNights,
      0
    );
  const tax = quote?.taxAmount ?? subtotal * 0.05;
  const total = quote?.totalAmount ?? subtotal + tax;

  return (
    <aside className="sticky top-28 bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
      <h2 className="font-playfair text-xl text-[#4b3621] mb-4">My booking</h2>

      <p className="text-sm text-neutral-600 mb-1">
        {nights} night{nights === 1 ? "" : "s"}
      </p>
      {checkIn && checkOut && (
        <p className="text-sm font-medium text-neutral-800 mb-1">
          {format(parseISO(checkIn), "d MMMM")} — {format(parseISO(checkOut), "d MMMM")}
        </p>
      )}
      {config && (
        <div className="text-xs text-neutral-500 mb-4 space-y-0.5">
          <p>Check-in from {config.checkInTime}</p>
          <p>Check-out till {config.checkOutTime}</p>
        </div>
      )}

      {cart.length === 0 ? (
        <p className="text-sm text-neutral-500 py-6">Select rooms to see your summary.</p>
      ) : (
        <ul className="space-y-3 mb-4 border-t border-neutral-100 pt-4">
          {cart.map((item, index) => (
            <li key={item.key} className="text-sm">
              <p className="font-medium text-neutral-800">
                Room {index + 1}: {item.roomTypeName}
              </p>
              <p className="text-neutral-500 text-xs">{item.ratePlanLabel}</p>
              <p className="text-neutral-700 mt-0.5">
                {formatRoomPrice(item.pricePerNight * item.quantity * item.totalNights)}
                {item.quantity > 1 ? ` (${item.quantity}×)` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      {cart.length > 0 && (
        <div className="border-t border-neutral-100 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Taxes</span>
            <span>{formatRoomPrice(tax)}</span>
          </div>
          <div className="flex justify-between font-semibold text-[#4b3621] text-base pt-2">
            <span>Total</span>
            <span>{formatRoomPrice(total)}</span>
          </div>
          <p className="text-xs text-neutral-500">Taxes included</p>
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled || cart.length === 0 || loading}
        className="mt-6 w-full py-3 text-sm font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-[#c9a227] to-[#4b3621] hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing…" : "Continue ›"}
      </button>
    </aside>
  );
};

export default BookingSidebar;
