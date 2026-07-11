# Booking payment UX — design

Date: 2026-07-12  
Status: Approved for planning

## Goal

Improve the Hotel Yuvaan booking checkout so payment feels clear and safe: coupons can be chosen earlier, payment is confirmed in a short modal, a processing overlay covers verification, and the guest only lands on the booking page after a successful verify.

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Razorpay public key | From `/payments/create-order` `keyId` only. Remove FE `VITE_RAZORPAY_KEY_ID` / `env.razorpayKeyId` fallback. Key stays on BE. |
| Pre-pay step | Short confirm modal: “You will be charged ₹X” + **Pay now** / Cancel |
| During verify | Full-screen reusable `ProcessingOverlay` until `verify-payment` finishes |
| After verify | Success → navigate to booking page. Failure / cancel → stay on checkout, show “Payment failed. Try again.” (or cancel toast) |
| Coupons on room select | Enabled; store pending code in session; prefill on checkout; validate when email is entered |

## User flow

```text
/book (rooms)
  ├─ Select rooms
  ├─ Optional: enter/select coupon → pendingCouponCode in session
  └─ Continue to checkout
        ↓
/book/checkout (guest details)
  ├─ Prefill pending coupon in sidebar
  ├─ Guest fills name / email / phone
  ├─ On valid email: validate pending/applied coupon against email
  ├─ No Pay button on the guest form
  ├─ CTA: Continue to payment
  └─ Opens confirm modal (amount from checkout-summary, includes coupon)
        ↓
Confirm modal
  ├─ Cancel → close modal
  └─ Pay now
        ↓
create-order (keyId from response) → Razorpay checkout
        ↓
ProcessingOverlay visible
        ↓
verify-payment
  ├─ success → clear session → /booking/:token
  └─ fail/cancel → hide overlay → error message, guest can retry
```

## Architecture

### 1. `ProcessingOverlay` (new)

- Path: `src/components/ProcessingOverlay.tsx` (or `src/components/booking/ProcessingOverlay.tsx`)
- Props: `open: boolean`, optional `message` (default: verifying / processing payment)
- Full-screen fixed overlay, blocks interaction, spinner + short copy
- Reusable anywhere payment (or similar) verification runs

### 2. Confirm-before-pay modal

- Use existing AlertDialog / Dialog primitives
- Shown after guest form validation passes
- Copy: short confirm with formatted amount from latest `fetchCheckoutSummary`
- Actions: Cancel | Pay now
- Pay now runs the existing Razorpay + verify pipeline

### 3. Guest form CTA change (`BookCheckout`)

- Remove inline **Pay & confirm booking** submit button from the form body
- Replace with **Continue to payment** that:
  1. Validates guest fields
  2. Fetches checkout summary (with coupon if applied)
  3. Opens confirm modal with that total
- Sidebar: keep coupons; `showContinueButton` may stay false on checkout (pay lives in modal) or show the same continue action — prefer one primary CTA on the form/footer area that opens the modal, not a duplicate sidebar pay button

### 4. Coupons on room selection (`Book`)

- Set `showCoupons={true}` on `BookingSidebar`
- Load public coupons via existing `fetchPublicCoupons`
- On apply: save `pendingCouponCode` (and optional optimistic display) via `bookingSession` — **do not** call validate without email
- On continue: persist `pendingCouponCode` (already partially supported)
- On checkout load: prefill sidebar from `pendingCouponCode` / `appliedCoupon`
- When guest email becomes valid: call `validatePublicCoupon` (existing effect / handler)

### 5. Payment service key source

- `openRazorpayCheckout` / `mapOrder`: require `order.keyId` from create-order
- Remove `env.razorpayKeyId` fallback and `VITE_RAZORPAY_KEY_ID` from env files / `env.ts` / `vite-env.d.ts`
- If `keyId` missing after create-order → throw clear error before opening Razorpay

### 6. Verify + redirect

- Keep `verifyRazorpayPayment` as the gate to navigation
- Show `ProcessingOverlay` from after Razorpay success handler resolves until verify completes (and optionally while create-order runs after Pay now — overlay from Pay now through verify is acceptable)
- Only navigate when verify returns success with booking
- On failure: hide overlay, toast/message: **Payment failed. Try again.**
- On user dismiss/cancel of Razorpay: hide overlay, non-error cancel message

## Data / session

Existing `bookingSession` fields remain the source of truth:

- `pendingCouponCode` — set on room page without validation
- `appliedCoupon` — set after successful validate on checkout
- `guest` — guest details
- Checkout / create-order / summary payloads include `couponCode` when applied coupon is valid

## Error handling

| Case | UX |
| --- | --- |
| Invalid guest fields | Inline form error; modal does not open |
| Coupon invalid after email | Sidebar error; clear applied; keep pending optional |
| create-order / summary fails | Toast error; modal can close or stay with retry |
| Missing `keyId` | Toast; do not open Razorpay |
| Razorpay cancelled | Soft message; stay on checkout |
| verify-payment fails | “Payment failed. Try again.”; stay on checkout |
| verify success | Success toast optional; navigate to booking view |

## Out of scope

- Backend changes (assumes create-order already returns `keyId` and verify creates booking)
- New third standalone Review page
- Card-add / saved-card flows from other products
- Changing tax calculation rules

## Testing checklist

- Apply coupon on `/book` → appears pending on `/book/checkout`
- Enter email → coupon validates; discount shows in summary
- Continue → modal shows correct ₹ amount with coupon
- Cancel modal → no payment started
- Pay now → overlay until verify → landing on booking page
- Fail / cancel payment → overlay gone, failed/cancel message, can retry
- No `VITE_RAZORPAY_KEY_ID` required for checkout to open when create-order returns `keyId`
