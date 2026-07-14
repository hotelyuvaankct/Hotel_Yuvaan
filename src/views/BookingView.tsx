"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Loader2,
  Moon,
  BedDouble,
  Users,
  XCircle,
  Copy,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  cancelPublicBooking,
  fetchPublicBooking,
  requestCancelOtp,
  type BookingResult,
} from "@/services/bookingService";
import { formatRoomPrice } from "@/services/roomService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BOOKING_STATUS: Record<number, string> = {
  1: "Pending",
  2: "On hold",
  3: "Confirmed",
  4: "Checked in",
  5: "Checked out",
  6: "Cancelled",
};

const BookingView = ({
  initialBooking,
}: {
  initialBooking?: BookingResult | null;
}) => {
  const params = useParams<{ token: string }>();
  const token = params?.token;
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelEmail, setCancelEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [justCancelled, setJustCancelled] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const cancelBannerRef = useRef<HTMLElement>(null);

  const bookingQuery = useQuery({
    queryKey: ["publicBooking", token],
    queryFn: () => fetchPublicBooking(token!),
    enabled: Boolean(token),
    initialData: initialBooking ?? undefined,
    staleTime: 30_000,
  });

  const otpMutation = useMutation({
    mutationFn: () => requestCancelOtp(token!, cancelEmail.trim()),
    onSuccess: () => {
      setOtpSent(true);
      setEmailError(null);
      toast.success("OTP sent to your booking email");
    },
    onError: (error: Error) => {
      setOtpSent(false);
      setEmailError(error.message);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () =>
      cancelPublicBooking(token!, {
        email: cancelEmail,
        otpCode,
        reason: cancelReason || undefined,
      }),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      setShowCancelForm(false);
      setShowCancelConfirm(false);
      setJustCancelled(true);
      bookingQuery.refetch();
    },
    onError: (error: Error) => {
      if (error.message.toLowerCase().includes("email")) {
        setEmailError(error.message);
      }
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!justCancelled) return;
    const id = window.setTimeout(() => {
      cancelBannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
    return () => window.clearTimeout(id);
  }, [justCancelled]);

  const booking = bookingQuery.data;
  const isCancelled = booking?.bookingStatus === 6 || justCancelled;
  const nights = booking
    ? Math.max(
        1,
        differenceInCalendarDays(
          parseISO(booking.checkOut),
          parseISO(booking.checkIn)
        )
      )
    : 0;
  const guestFullName = booking
    ? `${booking.guestName}${booking.guestLastName ? ` ${booking.guestLastName}` : ""}`
    : "";

  return (
    <PageBackground className="flex flex-col">
      <Navigation />

      <section
        ref={cancelBannerRef}
        className="relative overflow-hidden pt-32 md:pt-36 pb-16 md:pb-20 bg-[#4b3621] scroll-mt-4"
      >
        <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(ellipse_at_top_right,_#c9a227,_transparent_55%)]" />
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(135deg,transparent_40%,#000_100%)]" />

        <div className="relative container mx-auto px-4 max-w-3xl">
          {bookingQuery.isLoading ? (
            <div className="flex items-center gap-3 text-white/80 py-6">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm tracking-wide">Loading your booking…</span>
            </div>
          ) : bookingQuery.isError ? (
            <div className="pt-4 pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8d5a3] mb-3">
                Booking
              </p>
              <h1 className="font-playfair text-3xl md:text-4xl text-white mb-2">
                Booking not found
              </h1>
              <p className="text-white/75 text-sm max-w-lg">
                {(bookingQuery.error as Error).message}
              </p>
            </div>
          ) : booking ? (
            <div className="pt-4 pb-2">
              {isCancelled ? (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8d5a3]">
                      Booking cancellation
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-100 ring-1 ring-red-300/35">
                      <XCircle className="h-3.5 w-3.5" />
                      Cancelled
                    </span>
                  </div>

                  <h1 className="font-playfair text-3xl sm:text-4xl md:text-[2.75rem] text-white tracking-wide leading-tight">
                    {justCancelled
                      ? "Cancelled successfully"
                      : "Booking cancelled"}
                  </h1>

                  <p className="mt-3 text-white/80 text-sm sm:text-base max-w-xl">
                    {justCancelled
                      ? "Your reservation has been cancelled successfully. A confirmation email will be sent shortly."
                      : "This reservation has already been cancelled."}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <p className="text-sm text-white/70">
                      Booking ID{" "}
                      <span className="font-playfair text-lg text-white tracking-wide select-all">
                        {booking.bookingCode}
                      </span>
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="border border-white/30 text-white hover:bg-white/10 hover:text-white"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            booking.bookingCode
                          );
                          toast.success("Booking ID copied");
                        } catch {
                          toast.error("Could not copy booking ID");
                        }
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8d5a3]">
                      Booking confirmation
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-50 ring-1 ring-emerald-200/35">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {BOOKING_STATUS[booking.bookingStatus] ?? "Unknown"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-playfair text-3xl sm:text-4xl md:text-[2.75rem] text-white tracking-wide leading-none select-all">
                      {booking.bookingCode}
                    </h1>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="border border-white/30 text-white hover:bg-white/10 hover:text-white"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            booking.bookingCode
                          );
                          toast.success("Booking ID copied");
                        } catch {
                          toast.error("Could not copy booking ID");
                        }
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>

                  <p className="mt-3 text-white/80 text-sm sm:text-base">
                    Thank you — your stay at Hotel Yuvaan is confirmed.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#f5e6c8]/90">
                    <span className="inline-flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 opacity-80" />
                      {nights} night{nights === 1 ? "" : "s"}
                    </span>
                    <span className="text-white/30">|</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 opacity-80" />
                      {booking.totalGuests} guest
                      {booking.totalGuests === 1 ? "" : "s"}
                    </span>
                    <span className="text-white/30">|</span>
                    <span className="inline-flex items-center gap-1.5">
                      <BedDouble className="h-3.5 w-3.5 opacity-80" />
                      {booking.totalRooms} room
                      {booking.totalRooms === 1 ? "" : "s"}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <main className="relative flex-1 z-10">
        <div className="container mx-auto px-4 max-w-3xl -mt-10 md:-mt-12 pb-10 md:pb-12">
          {bookingQuery.isError && (
            <div className="rounded-2xl border border-neutral-200/80 bg-white px-6 py-8 shadow-lg text-center">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 text-[#4b3621] font-semibold hover:underline underline-offset-2"
              >
                Make a new booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {booking && (
            <article className="rounded-2xl border border-[#4b3621]/10 bg-white shadow-[0_18px_50px_-28px_rgba(75,54,33,0.45)] overflow-hidden">
              {isCancelled ? (
                <div className="px-6 sm:px-8 py-4 border-b bg-red-100 border-red-300">
                  <p className="text-sm font-semibold text-red-800">
                    {justCancelled
                      ? "Booking cancelled successfully."
                      : "This booking is cancelled."}
                  </p>
                </div>
              ) : null}
              <div className="p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-[#faf7f2] to-[#f3ebe0] px-4 py-4 border border-[#4b3621]/15">
                    <div className="flex items-center gap-2 text-[#8b7355] text-[11px] uppercase tracking-[0.16em] font-semibold mb-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Check-in
                    </div>
                    <p className="font-playfair text-xl sm:text-2xl text-[#4b3621] leading-tight">
                      {format(parseISO(booking.checkIn), "d MMMM yyyy")}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1.5">
                      {format(parseISO(booking.checkIn), "EEEE")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-[#faf7f2] to-[#f3ebe0] px-4 py-4 border border-[#4b3621]/15">
                    <div className="flex items-center gap-2 text-[#8b7355] text-[11px] uppercase tracking-[0.16em] font-semibold mb-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Check-out
                    </div>
                    <p className="font-playfair text-xl sm:text-2xl text-[#4b3621] leading-tight">
                      {format(parseISO(booking.checkOut), "d MMMM yyyy")}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1.5">
                      {format(parseISO(booking.checkOut), "EEEE")}
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 font-semibold mb-1.5">
                      Guest
                    </p>
                    <p className="text-base font-medium text-[#4b3621]">
                      {guestFullName}
                    </p>
                    {booking.guestEmail ? (
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {booking.guestEmail}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 font-semibold mb-1.5">
                      Hotel
                    </p>
                    <p className="text-base font-medium text-[#4b3621]">
                      {booking.hotelName}
                    </p>
                  </div>
                </div>

                {booking.rooms && booking.rooms.length > 0 ? (
                  <div className="mt-7 pt-6 border-t border-[#4b3621]/8">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 font-semibold mb-3">
                      Stay details
                    </p>
                    <ul className="space-y-3">
                      {booking.rooms.map((line, index) => (
                        <li
                          key={line.id ?? index}
                          className="flex items-start justify-between gap-4 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-[#4b3621]">
                              {line.roomTypeName}
                            </p>
                            <p className="text-neutral-500 text-xs mt-0.5">
                              {line.quantity} room
                              {line.quantity === 1 ? "" : "s"} · {line.totalNights}{" "}
                              night
                              {line.totalNights === 1 ? "" : "s"}
                            </p>
                          </div>
                          <p className="tabular-nums font-medium text-[#4b3621] shrink-0">
                            {formatRoomPrice(
                              line.pricePerNight *
                                line.quantity *
                                line.totalNights
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-6 space-y-2 border-t border-[#4b3621]/10 pt-5 text-sm">
                  <div className="flex justify-between gap-3 text-neutral-700">
                    <span>Room total</span>
                    <span className="tabular-nums font-medium text-[#4b3621]">
                      {formatRoomPrice(booking.subtotalAmount)}
                    </span>
                  </div>

                  {Number(booking.discountAmount ?? 0) > 0 ? (
                    <div className="flex justify-between gap-3 text-green-700">
                      <span>
                        Discount
                        {booking.couponCode ? ` (${booking.couponCode})` : ""}
                      </span>
                      <span className="tabular-nums font-medium">
                        -{formatRoomPrice(Number(booking.discountAmount))}
                      </span>
                    </div>
                  ) : null}

                  {booking.cgstAmount != null || booking.sgstAmount != null ? (
                    <>
                      {booking.cgstAmount != null ? (
                        <div className="flex justify-between gap-3 text-neutral-600">
                          <span>
                            CGST
                            {booking.roomTaxPercent != null
                              ? ` (${(Number(booking.roomTaxPercent) / 2).toFixed(
                                  Number(booking.roomTaxPercent) % 1 === 0 ? 1 : 2
                                )}%)`
                              : ""}
                          </span>
                          <span className="tabular-nums">
                            {formatRoomPrice(Number(booking.cgstAmount))}
                          </span>
                        </div>
                      ) : null}
                      {booking.sgstAmount != null ? (
                        <div className="flex justify-between gap-3 text-neutral-600">
                          <span>
                            SGST
                            {booking.roomTaxPercent != null
                              ? ` (${(Number(booking.roomTaxPercent) / 2).toFixed(
                                  Number(booking.roomTaxPercent) % 1 === 0 ? 1 : 2
                                )}%)`
                              : ""}
                          </span>
                          <span className="tabular-nums">
                            {formatRoomPrice(Number(booking.sgstAmount))}
                          </span>
                        </div>
                      ) : null}
                    </>
                  ) : Number(booking.taxAmount ?? 0) > 0 ? (
                    <div className="flex justify-between gap-3 text-neutral-600">
                      <span>GST / Tax</span>
                      <span className="tabular-nums">
                        {formatRoomPrice(Number(booking.taxAmount))}
                      </span>
                    </div>
                  ) : null}

                  {Number(booking.processingFeeAmount ?? 0) +
                  Number(booking.processingFeeGstAmount ?? 0) >
                  0 ? (
                    <div className="flex justify-between gap-3 text-neutral-600">
                      <span>Payment processing fee (incl. GST)</span>
                      <span className="tabular-nums">
                        {formatRoomPrice(
                          Number(booking.processingFeeAmount ?? 0) +
                            Number(booking.processingFeeGstAmount ?? 0)
                        )}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex items-end justify-between gap-3 border-t border-[#4b3621]/10 pt-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Total paid
                      </p>
                      <p className="text-xs text-neutral-500">Including taxes & fees</p>
                    </div>
                    <p className="font-sans text-2xl font-semibold tabular-nums leading-none text-[#4b3621] sm:text-3xl">
                      {formatRoomPrice(booking.totalAmount)}
                    </p>
                  </div>
                </div>

                {booking.receiptDownloadUrl ? (
                  <Button asChild variant="dark" className="mt-6 w-full sm:w-auto">
                    <a
                      href={booking.receiptDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Download receipt (PDF)
                    </a>
                  </Button>
                ) : null}

                {isCancelled && booking.cancellationReason ? (
                  <p className="mt-6 text-sm text-neutral-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    Cancellation reason: {booking.cancellationReason}
                  </p>
                ) : null}
              </div>

              {!isCancelled ? (
                <div className="border-t border-[#4b3621]/8 bg-[#faf8f5] px-6 sm:px-8 py-4">
                  {!showCancelForm ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-neutral-600">
                        Need to change plans?{" "}
                        <Link
                          href="/cancellation"
                          className="font-medium text-[#4b3621] underline underline-offset-2"
                        >
                          View policy
                        </Link>
                      </p>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowCancelForm(true)}
                        className="text-neutral-500 hover:text-red-700"
                      >
                        Cancel booking
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h2 className="font-playfair text-xl text-[#4b3621]">
                          Cancel booking
                        </h2>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            setShowCancelForm(false);
                            setOtpSent(false);
                            setOtpCode("");
                            setEmailError(null);
                          }}
                          className="text-neutral-500 hover:text-[#4b3621]"
                        >
                          Close
                        </Button>
                      </div>
                      <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                        We will send a one-time code to the email you used when
                        booking. Enter it below to confirm cancellation.
                        {booking.guestEmail ? (
                          <span className="block mt-1 text-neutral-500">
                            Booking email on file: {booking.guestEmail}
                          </span>
                        ) : null}
                      </p>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cancelEmail">Booking email</Label>
                          <Input
                            id="cancelEmail"
                            type="email"
                            value={cancelEmail}
                            onChange={(e) => {
                              setCancelEmail(e.target.value);
                              setEmailError(null);
                              setOtpSent(false);
                              setOtpCode("");
                            }}
                            className="rounded-sm mt-1 bg-white"
                          />
                          {emailError ? (
                            <p className="text-sm text-destructive mt-1">
                              {emailError}
                            </p>
                          ) : null}
                        </div>
                        {!otpSent ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              if (
                                !cancelEmail.trim() ||
                                !cancelEmail.includes("@")
                              ) {
                                setEmailError(
                                  "Enter the email address used when booking"
                                );
                                return;
                              }
                              otpMutation.mutate();
                            }}
                            disabled={
                              !cancelEmail.trim() || otpMutation.isPending
                            }
                          >
                            {otpMutation.isPending ? "Sending…" : "Send OTP"}
                          </Button>
                        ) : (
                          <>
                            <div>
                              <Label htmlFor="otp">Verification code</Label>
                              <Input
                                id="otp"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder="6-digit code"
                                className="rounded-sm mt-1 bg-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reason">Reason (optional)</Label>
                              <Input
                                id="reason"
                                value={cancelReason}
                                onChange={(e) =>
                                  setCancelReason(e.target.value)
                                }
                                className="rounded-sm mt-1 bg-white"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => setShowCancelConfirm(true)}
                              disabled={!otpCode || cancelMutation.isPending}
                            >
                              Confirm cancellation
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </article>
          )}
        </div>
      </main>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="border-red-300 bg-red-50 sm:rounded-xl">
          <AlertDialogHeader>
            <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 ring-1 ring-red-300">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-red-900">
              Cancel this booking?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-800/80">
              This action cannot be undone. Your reservation
              {booking ? (
                <>
                  {" "}
                  <span className="font-semibold text-red-900">
                    {booking.bookingCode}
                  </span>
                </>
              ) : null}{" "}
              will be cancelled permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-red-200 bg-white text-red-900 hover:bg-red-50 hover:text-red-900">
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "bg-red-600 hover:bg-red-700"
              )}
              disabled={cancelMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                cancelMutation.mutate();
              }}
            >
              {cancelMutation.isPending
                ? "Cancelling…"
                : "Yes, cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </PageBackground>
  );
};

export default BookingView;
