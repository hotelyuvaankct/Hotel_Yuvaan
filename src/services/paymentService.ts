import { apiUrl, env } from "@/config/env";
import type { BookingResult, CheckoutPayload } from "@/services/bookingService";

export interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  totalAmount?: number;
  subtotalAmount?: number;
  discountAmount?: number;
  taxAmount?: number;
  couponCode?: string;
}

export interface CheckoutSummary {
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
  totalAmount: number;
  amountPaise: number;
  currency: string;
  roomLines?: BookingResult["rooms"];
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  booking: BookingResult;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
    };
  }
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

function mapOrder(raw: Record<string, unknown>): CreateOrderResult {
  return {
    orderId: String(raw.orderId ?? raw.order_id ?? ""),
    amount: Number(raw.amount),
    currency: String(raw.currency ?? "INR"),
    keyId: String(raw.keyId ?? raw.key_id ?? env.razorpayKeyId ?? ""),
    totalAmount: raw.totalAmount != null ? Number(raw.totalAmount) : undefined,
    subtotalAmount: raw.subtotalAmount != null ? Number(raw.subtotalAmount) : undefined,
    discountAmount: raw.discountAmount != null ? Number(raw.discountAmount) : undefined,
    taxAmount: raw.taxAmount != null ? Number(raw.taxAmount) : undefined,
    couponCode: raw.couponCode != null ? String(raw.couponCode) : undefined,
  };
}

/** Preview payable totals — call before create-order. Amount is server-calculated. */
export async function fetchCheckoutSummary(payload: CheckoutPayload): Promise<CheckoutSummary> {
  const response = await fetch(apiUrl("/payments/checkout-summary"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<CheckoutSummary>(response);
}

/** Backend quotes amount from booking + coupon — never send amount from the client. */
export async function createRazorpayOrder(payload: CheckoutPayload): Promise<CreateOrderResult> {
  const response = await fetch(apiUrl("/payments/create-order"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<Record<string, unknown>>(response);
  return mapOrder(data);
}

export async function verifyRazorpayPayment(
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResult> {
  const response = await fetch(apiUrl("/payments/verify-payment"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<VerifyPaymentResult>(response);
}

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser"));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay checkout")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export type OpenCheckoutOptions = {
  order: CreateOrderResult;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onDismiss?: () => void;
};

export function openRazorpayCheckout(
  options: OpenCheckoutOptions
): Promise<RazorpaySuccessResponse> {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay checkout is not loaded"));
      return;
    }

    const key = options.order.keyId || env.razorpayKeyId;
    if (!key) {
      reject(new Error("Missing Razorpay key id"));
      return;
    }

    let settled = false;
    const rzp = new window.Razorpay({
      key,
      amount: options.order.amount,
      currency: options.order.currency,
      name: options.name ?? "Hotel Yuvaan",
      description: options.description ?? "Booking payment",
      order_id: options.order.orderId,
      prefill: options.prefill ?? {},
      theme: { color: "#4b3621" },
      modal: {
        ondismiss: () => {
          if (!settled) {
            settled = true;
            options.onDismiss?.();
            reject(new Error("Payment cancelled"));
          }
        },
      },
      handler: (response: RazorpaySuccessResponse) => {
        settled = true;
        resolve(response);
      },
    });

    rzp.on("payment.failed", (response) => {
      if (!settled) {
        settled = true;
        reject(new Error(response.error?.description ?? "Payment failed"));
      }
    });

    rzp.open();
  });
}
