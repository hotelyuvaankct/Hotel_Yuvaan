import { format, parseISO, addDays, startOfToday } from "date-fns";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatCouponDiscount,
  formatCouponMinBooking,
  type PublicCoupon,
} from "@/services/couponService";
import { buildBookUrl } from "@/services/roomService";

interface CouponCardProps {
  coupon: PublicCoupon;
  index?: number;
}

const CouponCard = ({ coupon, index = 0 }: CouponCardProps) => {
  const today = startOfToday();
  const bookUrl = buildBookUrl({
    checkIn: format(addDays(today, 1), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 2), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    rooms: 1,
    promo: coupon.code,
  });

  const minBooking = formatCouponMinBooking(coupon.minBookingAmount);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8dfd0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-on-scroll"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="bg-gradient-to-r from-[#4b3621] to-[#8b7355] px-5 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 shrink-0 opacity-90" />
            <span className="font-mono text-sm font-semibold tracking-widest">
              {coupon.code}
            </span>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            {formatCouponDiscount(coupon)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-playfair text-xl font-semibold text-[#4b3621] mb-2">
          {coupon.title}
        </h3>
        {coupon.description ? (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-3 flex-1">
            {coupon.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="space-y-1 text-xs text-neutral-500 mb-5">
          <p>
            Valid till {format(parseISO(coupon.expiryDate), "d MMMM yyyy")}
          </p>
          {minBooking ? <p>{minBooking}</p> : null}
        </div>

        <Link
          to={bookUrl}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          BOOK WITH CODE
        </Link>
      </div>
    </article>
  );
};

export default CouponCard;
