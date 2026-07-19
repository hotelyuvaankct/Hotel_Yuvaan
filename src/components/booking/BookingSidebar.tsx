import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronRight, Loader2, Tag, X } from "lucide-react";
import { formatRoomPrice } from "@/services/roomService";
import { formatTime12h } from "@/lib/formatTime";
import type { BookingConfig, BookingQuote } from "@/services/bookingService";
import type { CouponValidation, PublicCoupon } from "@/services/couponService";
import BookingCouponList from "@/components/booking/BookingCouponList";
import { Button } from "@/components/ui/button";

export type CartItem = {
  key: string;
  roomTypeId: number;
  roomTypeName: string;
  ratePlanCode: string;
  ratePlanLabel: string;
  quantity: number;
  guestCount: number;
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
  quoteLoading?: boolean;
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
  onClearCouponError?: () => void;
  showCoupons?: boolean;
  showContinueButton?: boolean;
  continueLabel?: string;
  selectedCouponCode?: string | null;
  /** Stay nights/dates/check-in times */
  showStayDetails?: boolean;
  /** Selected room lines in the sidebar */
  showCartItems?: boolean;
  title?: string;
}

const BookingSidebar = ({
  checkIn,
  checkOut,
  cart,
  quote,
  quoteLoading = false,
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
  onClearCouponError,
  showCoupons = false,
  showContinueButton = true,
  continueLabel = "Continue",
  selectedCouponCode,
  showStayDetails = true,
  showCartItems = true,
  title = "My booking",
}: BookingSidebarProps) => {
  const [manualCode, setManualCode] = useState("");

  useEffect(() => {
    if (!couponError || !onClearCouponError) return;
    const clear = () => onClearCouponError();
    // Wait a tick so the Apply click that showed the error doesn't clear it
    const timer = window.setTimeout(() => {
      document.addEventListener("click", clear);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", clear);
    };
  }, [couponError, onClearCouponError]);

  const handleApplyManual = () => {
    const code = manualCode.trim().toUpperCase();
    if (!code || !onSelectCoupon) return;
    onSelectCoupon(code);
    setManualCode("");
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

  // Totals come only from backend checkout-summary — never computed here
  const discount = Number(quote?.discountAmount ?? 0);
  const tax = quote?.taxAmount;
  const cgst = quote?.cgstAmount;
  const sgst = quote?.sgstAmount;
  const roomTaxPercent = quote?.roomTaxPercent;
  const processingFee = quote?.processingFeeAmount;
  const processingFeeGst = quote?.processingFeeGstAmount;
  const total = quote?.totalAmount;
  const halfTaxLabel =
    roomTaxPercent != null ? (Number(roomTaxPercent) / 2).toFixed(Number(roomTaxPercent) % 1 === 0 ? 1 : 2) : null;
  const subtotalForEligibility = Number(
    quote?.subtotalAmount ??
      cart.reduce(
        (sum, item) => sum + item.pricePerNight * item.quantity * item.totalNights,
        0
      )
  );

  const couponCode =
    quote?.couponCode ??
    (appliedCoupon?.valid ? appliedCoupon.code : null) ??
    selectedCouponCode;

  const appliedCodeNormalized = couponCode?.trim().toUpperCase() ?? "";
  const isPublicListCoupon =
    Boolean(appliedCodeNormalized) &&
    availableCoupons.some(
      (coupon) => coupon.code.toUpperCase() === appliedCodeNormalized
    );
  /** Manually entered / backoffice code — not in the public offers list. */
  const isBackofficeCoupon = Boolean(appliedCodeNormalized) && !isPublicListCoupon;
  const showTopAppliedBanner =
    isBackofficeCoupon &&
    (Boolean(appliedCoupon?.valid) ||
      Boolean(quote?.couponCode && discount > 0) ||
      Boolean(selectedCouponCode));

  return (
    <aside className="w-full min-w-0 bg-white border border-neutral-200 rounded-xl shadow-sm p-3.5 min-[380px]:p-5 sm:p-7">
      <h2 className="text-base min-[380px]:text-lg sm:text-xl font-semibold text-[#4b3621] tracking-tight leading-tight mb-3 min-[380px]:mb-4">
        {title}
      </h2>

      {showStayDetails ? (
        <>
          <p className="text-sm text-neutral-600 mb-0.5">
            {nights} night{nights === 1 ? "" : "s"}
          </p>
          {checkIn && checkOut && (
            <p className="text-sm font-medium text-neutral-800 mb-0.5">
              {format(parseISO(checkIn), "d MMMM")} — {format(parseISO(checkOut), "d MMMM")}
            </p>
          )}
          {config && (
            <div className="text-xs text-neutral-500 space-y-0.5">
              <p>Check-in from {formatTime12h(config.checkInTime)}</p>
              <p>Check-out till {formatTime12h(config.checkOutTime)}</p>
            </div>
          )}
        </>
      ) : null}

      {showCartItems ? (
        cart.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4 mt-1">
            Select rooms to see your summary.
          </p>
        ) : (
          <ul className={`space-y-2.5 border-t border-neutral-100 pt-3 ${showStayDetails ? "mt-3" : "mt-0"}`}>
            {cart.map((item, index) => (
              <li key={item.key} className="text-sm flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-neutral-800 leading-snug">
                    Room {index + 1}: {item.roomTypeName}
                  </p>
                  <p className="text-neutral-500 text-xs leading-snug">{item.ratePlanLabel}</p>
                  {item.quantity > 1 ? (
                    <p className="text-neutral-500 text-xs mt-0.5">{item.quantity}×</p>
                  ) : null}
                </div>
                <p className="text-neutral-800 font-medium tabular-nums shrink-0 text-right leading-snug">
                  {formatRoomPrice(item.pricePerNight * item.quantity * item.totalNights)}
                </p>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {cart.length > 0 ? (
        <div className={`flex flex-col gap-2.5 ${(showStayDetails || showCartItems) ? "border-t border-neutral-100 mt-3 pt-3" : ""}`}>
          {showCoupons ? (
            <div className="flex flex-col gap-2.5">
              {showTopAppliedBanner &&
              (appliedCoupon?.valid || (quote?.couponCode && discount > 0)) ? (
                <div className="flex items-start justify-between gap-2 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm">
                  <div className="flex items-start gap-2 text-green-800">
                    <Tag className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">
                        {quote?.couponCode ?? appliedCoupon?.code}
                      </p>
                      {(quote?.couponTitle ?? appliedCoupon?.title) ? (
                        <p className="text-xs text-green-700">
                          {quote?.couponTitle ?? appliedCoupon?.title}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {onRemoveCoupon ? (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={onRemoveCoupon}
                      className="h-auto p-0 text-green-700 hover:text-green-900"
                      aria-label="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ) : showTopAppliedBanner && selectedCouponCode ? (
                <div className="flex items-start justify-between gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
                  <div className="flex items-start gap-2 text-amber-900">
                    <Tag className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{selectedCouponCode}</p>
                      <p className="text-xs text-amber-800">
                        {applyingCouponCode || quoteLoading
                          ? "Updating totals…"
                          : couponError
                            ? couponError
                            : "Saved for checkout"}
                      </p>
                    </div>
                  </div>
                  {onRemoveCoupon ? (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={onRemoveCoupon}
                      className="h-auto p-0 text-amber-800 hover:text-amber-950"
                      aria-label="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Have a coupon code?
                  </p>
                  <div className="flex gap-1.5 min-[380px]:gap-2">
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
                      aria-invalid={Boolean(couponError)}
                      className={`min-w-0 flex-1 rounded border px-2.5 py-1.5 min-[380px]:px-3 min-[380px]:py-2 text-xs min-[380px]:text-sm uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal focus:outline-none ${
                        couponError
                          ? "border-red-400 focus:border-red-500"
                          : "border-neutral-300 focus:border-[#4b3621]"
                      }`}
                    />
                    <Button
                      type="button"
                      variant="dark"
                      size="sm"
                      onClick={handleApplyManual}
                      disabled={!manualCode.trim() || isApplyingManual}
                      className="h-8 min-[380px]:h-9 shrink-0 px-2.5 min-[380px]:px-3 text-xs"
                    >
                      {isApplyingManual ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  {couponError ? (
                    <p className="text-xs text-red-600">{couponError}</p>
                  ) : null}
                </div>

              <BookingCouponList
                coupons={availableCoupons}
                loading={couponsLoading}
                applyingCode={applyingCouponCode}
                appliedCode={couponCode}
                cartSubtotal={subtotalForEligibility}
                onSelectCoupon={onSelectCoupon ?? (() => undefined)}
                onRemoveCoupon={onRemoveCoupon}
              />
            </div>
          ) : null}

          <div className="space-y-1 text-xs min-[380px]:text-sm border-t border-neutral-100 pt-3">
            {quoteLoading && !quote ? (
              <div className="flex items-center gap-2 text-neutral-500 py-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Calculating totals…</span>
              </div>
            ) : quote ? (
              <>
                <div className="flex justify-between gap-3 text-neutral-700">
                  <span>Room total</span>
                  <span className="tabular-nums shrink-0">
                    {formatRoomPrice(
                      Number(
                        quote.subtotalAmount ??
                          cart.reduce(
                            (sum, item) =>
                              sum +
                              item.pricePerNight * item.quantity * item.totalNights,
                            0
                          )
                      )
                    )}
                  </span>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-{formatRoomPrice(discount)}</span>
                  </div>
                ) : null}
                {(() => {
                  const cgstValue = Number(cgst ?? 0);
                  const sgstValue = Number(sgst ?? 0);
                  const hasCgstSgst = cgst != null || sgst != null;
                  const processFee = Number(processingFee ?? 0);
                  const processFeeGst = Number(processingFeeGst ?? 0);
                  const hasTaxFallback =
                    !hasCgstSgst && tax != null && Number(tax) > 0;

                  return (
                    <>
                      {hasCgstSgst ? (
                        <>
                          <div className="flex justify-between text-neutral-600">
                            <span>
                              CGST
                              {halfTaxLabel ? ` ${halfTaxLabel}%` : ""}
                            </span>
                            <span className="tabular-nums">
                              {formatRoomPrice(cgstValue)}
                            </span>
                          </div>
                          <div className="flex justify-between text-neutral-600">
                            <span>
                              SGST
                              {halfTaxLabel ? ` ${halfTaxLabel}%` : ""}
                            </span>
                            <span className="tabular-nums">
                              {formatRoomPrice(sgstValue)}
                            </span>
                          </div>
                        </>
                      ) : null}
                      {hasTaxFallback ? (
                        <div className="flex justify-between text-neutral-600">
                          <span>GST / Tax</span>
                          <span className="tabular-nums">
                            {formatRoomPrice(Number(tax))}
                          </span>
                        </div>
                      ) : null}
                      {processFee + processFeeGst > 0 ? (
                        <div className="flex items-start justify-between gap-2 min-[380px]:gap-3 text-neutral-600">
                          <span className="min-w-0 leading-snug">
                            <span className="min-[380px]:hidden">Processing fee</span>
                            <span className="hidden min-[380px]:inline">
                              Payment processing fee (incl. GST)
                            </span>
                          </span>
                          <span className="tabular-nums shrink-0">
                            {formatRoomPrice(processFee + processFeeGst)}
                          </span>
                        </div>
                      ) : null}
                    </>
                  );
                })()}
                <div className="flex justify-between gap-3 font-semibold text-[#4b3621] text-sm min-[380px]:text-base pt-1">
                  <span>Total</span>
                  <span className="font-sans tabular-nums shrink-0">
                    {total != null ? formatRoomPrice(total) : "—"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">Taxes & fees included</p>
              </>
            ) : (
              <p className="text-xs text-neutral-500 py-1">Totals will appear when available.</p>
            )}
          </div>
        </div>
      ) : null}

      {showContinueButton ? (
        <Button
          type="button"
          variant="solid"
          onClick={onContinue}
          disabled={continueDisabled || cart.length === 0 || loading || quoteLoading}
          className="mt-4 h-9 min-[380px]:h-10 w-full px-3 text-[11px] min-[380px]:text-xs tracking-wide uppercase"
        >
          {loading ? (
            "Processing…"
          ) : (
            <>
              {continueLabel}
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      ) : null}
    </aside>
  );
};

export default BookingSidebar;
