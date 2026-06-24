import { Check, Loader2, Tag } from "lucide-react";
import {
  formatCouponDiscount,
  formatCouponMinBooking,
  type PublicCoupon,
} from "@/services/couponService";

interface BookingCouponListProps {
  coupons: PublicCoupon[];
  loading?: boolean;
  applyingCode?: string | null;
  appliedCode?: string | null;
  cartSubtotal: number;
  error?: string | null;
  onSelectCoupon: (code: string) => void;
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
  error,
  onSelectCoupon,
}: BookingCouponListProps) => {
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
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Available offers
      </p>
      <ul className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
        {coupons.map((coupon) => {
          const eligible = isCouponEligible(coupon, cartSubtotal);
          const isApplied = appliedCode === coupon.code;
          const isApplying = applyingCode === coupon.code;
          const minBooking = formatCouponMinBooking(coupon.minBookingAmount);

          return (
            <li key={coupon.id}>
              <button
                type="button"
                onClick={() => onSelectCoupon(coupon.code)}
                disabled={!eligible || isApplying}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-not-allowed ${
                  isApplied
                    ? "border-green-300 bg-green-50"
                    : eligible
                      ? "border-neutral-200 bg-neutral-50 hover:border-[#4b3621] hover:bg-white"
                      : "border-neutral-100 bg-neutral-50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 shrink-0 text-[#4b3621]" />
                      <span className="font-mono text-xs font-semibold tracking-wider text-[#4b3621]">
                        {coupon.code}
                      </span>
                      <span className="rounded-full bg-[#4b3621]/10 px-2 py-0.5 text-[10px] font-medium text-[#4b3621]">
                        {formatCouponDiscount(coupon)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-neutral-800 line-clamp-1">
                      {coupon.title}
                    </p>
                    {minBooking ? (
                      <p className="mt-0.5 text-[10px] text-neutral-500">{minBooking}</p>
                    ) : null}
                    {!eligible && minBooking ? (
                      <p className="mt-1 text-[10px] text-amber-700">
                        Add more to your booking to use this offer
                      </p>
                    ) : null}
                  </div>
                  {isApplying ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#4b3621]" />
                  ) : isApplied ? (
                    <Check className="h-4 w-4 shrink-0 text-green-700" />
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
};

export default BookingCouponList;
