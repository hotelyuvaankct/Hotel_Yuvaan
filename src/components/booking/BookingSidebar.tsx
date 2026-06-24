import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Loader2, Tag, X } from "lucide-react";
import { formatRoomPrice } from "@/services/roomService";
import type { BookingConfig, BookingQuote } from "@/services/bookingService";
import type { CouponValidation, PublicCoupon } from "@/services/couponService";
import BookingCouponList from "@/components/booking/BookingCouponList";

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
  availableCoupons?: PublicCoupon[];
  couponsLoading?: boolean;
  appliedCoupon?: CouponValidation | null;
  applyingCouponCode?: string | null;
  couponError?: string | null;
  onSelectCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
  showCoupons?: boolean;
  showContinueButton?: boolean;
  continueLabel?: string;
  selectedCouponCode?: string | null;
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
  availableCoupons = [],
  couponsLoading,
  appliedCoupon = null,
  applyingCouponCode,
  couponError,
  onSelectCoupon,
  onRemoveCoupon,
  showCoupons = false,
  showContinueButton = true,
  continueLabel = "Continue ›",
  selectedCouponCode,
}: BookingSidebarProps) => {
  const [manualCode, setManualCode] = useState("");

  const handleApplyManual = () => {
    const code = manualCode.trim().toUpperCase();
    if (!code || !onSelectCoupon) return;
    onSelectCoupon(code);
  };

  const isApplyingManual =
    applyingCouponCode != null &&
    applyingCouponCode === manualCode.trim().toUpperCase();

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
  const discount =
    quote?.discountAmount ?? (appliedCoupon?.valid ? appliedCoupon.discountAmount ?? 0 : 0);
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const tax = quote?.taxAmount ?? taxableSubtotal * 0.05;
  const total = quote?.totalAmount ?? taxableSubtotal + tax;

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
        <div className="border-t border-neutral-100 pt-4 space-y-3">
          {showCoupons ? (
            <>
              {appliedCoupon?.valid ? (
                <div className="flex items-start justify-between gap-2 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm">
                  <div className="flex items-start gap-2 text-green-800">
                    <Tag className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{appliedCoupon.code}</p>
                      {appliedCoupon.title ? (
                        <p className="text-xs text-green-700">{appliedCoupon.title}</p>
                      ) : null}
                    </div>
                  </div>
                  {onRemoveCoupon ? (
                    <button
                      type="button"
                      onClick={onRemoveCoupon}
                      className="text-green-700 hover:text-green-900"
                      aria-label="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ) : null}

              {!appliedCoupon?.valid ? (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Have a coupon code?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyManual();
                        }
                      }}
                      placeholder="Enter code"
                      className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:border-[#4b3621] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyManual}
                      disabled={!manualCode.trim() || isApplyingManual}
                      className="shrink-0 rounded bg-[#4b3621] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApplyingManual ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              <BookingCouponList
                coupons={availableCoupons}
                loading={couponsLoading}
                applyingCode={applyingCouponCode}
                appliedCode={appliedCoupon?.code ?? selectedCouponCode ?? null}
                cartSubtotal={subtotal}
                error={couponError}
                onSelectCoupon={onSelectCoupon ?? (() => undefined)}
              />
            </>
          ) : null}

          <div className="space-y-1 text-sm pt-1">
            {discount > 0 ? (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-{formatRoomPrice(discount)}</span>
              </div>
            ) : null}
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
        </div>
      )}

      {showContinueButton ? (
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled || cart.length === 0 || loading}
          className="mt-6 w-full py-3 text-sm font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-[#c9a227] to-[#4b3621] hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing…" : continueLabel}
        </button>
      ) : null}
    </aside>
  );
};

export default BookingSidebar;
