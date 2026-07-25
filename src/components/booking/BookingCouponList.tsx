import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Tag, X } from "lucide-react";
import {
  formatCouponDiscount,
  formatCouponMinBooking,
  type PublicCoupon,
} from "@/services/couponService";
import { Button } from "@/components/ui/button";

interface BookingCouponListProps {
  coupons: PublicCoupon[];
  loading?: boolean;
  applyingCode?: string | null;
  appliedCode?: string | null;
  cartSubtotal: number;
  onSelectCoupon: (code: string) => void;
  onRemoveCoupon?: () => void;
}

function isCouponEligible(coupon: PublicCoupon, cartSubtotal: number): boolean {
  if (coupon.minBookingAmount == null || coupon.minBookingAmount <= 0) return true;
  return cartSubtotal >= coupon.minBookingAmount;
}

const BookingCouponList = ({
  coupons,
  loading,
  applyingCode,
  appliedCode,
  cartSubtotal,
  onSelectCoupon,
  onRemoveCoupon,
}: BookingCouponListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [ineligibleAttemptCode, setIneligibleAttemptCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIneligibleAttemptCode(null);
  }, [cartSubtotal]);

  useEffect(() => {
    if (!ineligibleAttemptCode) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || !listRef.current?.contains(target)) {
        setIneligibleAttemptCode(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ineligibleAttemptCode]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-neutral-500 py-1">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading offers…
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <p className="text-xs text-neutral-500">
        No active offers at the moment.
      </p>
    );
  }

  return (
    <div ref={listRef} className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Available offers
      </p>
      <ul className={`space-y-2 ${coupons.length > 4 ? "max-h-64 overflow-y-auto pr-0.5" : ""}`}>
        {coupons.map((coupon) => {
          const eligible = isCouponEligible(coupon, cartSubtotal);
          const isApplied = appliedCode?.toUpperCase() === coupon.code.toUpperCase();
          const isApplying = applyingCode?.toUpperCase() === coupon.code.toUpperCase();
          const minBooking = formatCouponMinBooking(coupon.minBookingAmount);
          const showIneligibleMsg =
            ineligibleAttemptCode?.toUpperCase() === coupon.code.toUpperCase() &&
            !eligible;

          return (
            <li key={coupon.id}>
              <div
                className={`w-full rounded-lg border px-3 py-2.5 transition-colors ${
                  isApplied
                    ? "border-green-300 bg-green-50"
                    : "border-neutral-200 bg-neutral-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 shrink-0 text-brand" />
                      <span className="font-mono text-xs font-semibold tracking-wider text-brand">
                        {coupon.code}
                      </span>
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                        {formatCouponDiscount(coupon)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-neutral-800">
                      {coupon.title}
                    </p>
                    {minBooking ? (
                      <p className="mt-0.5 text-[10px] text-neutral-500">{minBooking}</p>
                    ) : null}
                    {showIneligibleMsg ? (
                      <p className="mt-1 text-[10px] text-amber-700">
                        Add more to your booking to use this offer
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isApplying ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand" />
                    ) : isApplied ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onRemoveCoupon?.()}
                        className="border-green-300 bg-white text-green-700 hover:bg-green-100 hover:text-green-900 h-8 w-8"
                        aria-label={`Remove ${coupon.code}`}
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!eligible) {
                            setIneligibleAttemptCode(coupon.code);
                            return;
                          }
                          setIneligibleAttemptCode(null);
                          onSelectCoupon(coupon.code);
                        }}
                        className="h-8 px-2.5 text-[11px] uppercase tracking-wide"
                        aria-label={`Apply ${coupon.code}`}
                        title="Apply"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BookingCouponList;
