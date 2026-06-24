import { apiUrl } from "@/config/env";

export interface PublicCoupon {
  id: number;
  code: string;
  title: string;
  description?: string;
  discountType: number;
  discountValue: number;
  maxDiscountAmount?: number;
  minBookingAmount?: number;
  startDate: string;
  expiryDate: string;
}

export interface CouponValidation {
  valid: boolean;
  message?: string;
  couponId?: number;
  code?: string;
  title?: string;
  discountAmount?: number;
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

export async function fetchPublicCoupons(): Promise<PublicCoupon[]> {
  const response = await fetch(apiUrl("/public/coupons"));
  return parseResponse<PublicCoupon[]>(response);
}

export async function validatePublicCoupon(payload: {
  code: string;
  hotelId: number;
  bookingAmount: number;
  guestEmail?: string;
}): Promise<CouponValidation> {
  const response = await fetch(apiUrl("/public/coupons/validate"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<CouponValidation>(response);
}

export function formatCouponDiscount(coupon: PublicCoupon): string {
  if (coupon.discountType === 1) {
    const cap = coupon.maxDiscountAmount
      ? ` (max ₹${Math.round(coupon.maxDiscountAmount)})`
      : "";
    return `${coupon.discountValue}% off${cap}`;
  }
  return `₹${Math.round(coupon.discountValue)} off`;
}

export function formatCouponMinBooking(amount?: number): string | null {
  if (amount == null || amount <= 0) return null;
  return `Min. booking ₹${Math.round(amount).toLocaleString("en-IN")}`;
}
