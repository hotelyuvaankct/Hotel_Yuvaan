import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cancelPublicBooking,
  fetchPublicBooking,
  requestCancelOtp,
} from "@/services/bookingService";
import { formatRoomPrice } from "@/services/roomService";
import { toast } from "sonner";

const BOOKING_STATUS: Record<number, string> = {
  1: "Pending",
  2: "On hold",
  3: "Confirmed",
  4: "Checked in",
  5: "Checked out",
  6: "Cancelled",
};

const BookingView = () => {
  const { token } = useParams<{ token: string }>();
  const [cancelEmail, setCancelEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const bookingQuery = useQuery({
    queryKey: ["publicBooking", token],
    queryFn: () => fetchPublicBooking(token!),
    enabled: Boolean(token),
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
      bookingQuery.refetch();
    },
    onError: (error: Error) => {
      if (error.message.toLowerCase().includes("email")) {
        setEmailError(error.message);
      }
      toast.error(error.message);
    },
  });

  const booking = bookingQuery.data;
  const isCancelled = booking?.bookingStatus === 6;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-32 max-w-2xl">
        {bookingQuery.isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {bookingQuery.isError && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{(bookingQuery.error as Error).message}</p>
            <Link to="/book" className="text-primary underline">
              Make a new booking
            </Link>
          </div>
        )}

        {booking && (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  Booking
                </p>
                <h1 className="font-playfair text-2xl text-[#4b3621]">{booking.bookingCode}</h1>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isCancelled
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {BOOKING_STATUS[booking.bookingStatus] ?? "Unknown"}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <dt className="text-neutral-500">Guest</dt>
                <dd className="font-medium">
                  {booking.guestName}
                  {booking.guestLastName ? ` ${booking.guestLastName}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Hotel</dt>
                <dd className="font-medium">{booking.hotelName}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Check-in</dt>
                <dd className="font-medium">
                  {format(parseISO(booking.checkIn), "d MMMM yyyy")}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Check-out</dt>
                <dd className="font-medium">
                  {format(parseISO(booking.checkOut), "d MMMM yyyy")}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Rooms</dt>
                <dd className="font-medium">{booking.totalRooms}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Guests</dt>
                <dd className="font-medium">{booking.totalGuests}</dd>
              </div>
            </dl>

            {booking.rooms && booking.rooms.length > 0 && (
              <ul className="border-t border-neutral-100 pt-4 mb-6 space-y-2">
                {booking.rooms.map((line, index) => (
                  <li key={line.id ?? index} className="flex justify-between text-sm">
                    <span>
                      {line.roomTypeName} × {line.quantity}
                    </span>
                    <span>{formatRoomPrice(line.pricePerNight * line.quantity * line.totalNights)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-between font-semibold text-[#4b3621] border-t border-neutral-100 pt-4 mb-6">
              <span>Total (taxes included)</span>
              <span>{formatRoomPrice(booking.totalAmount)}</span>
            </div>

            {booking.receiptDownloadUrl && (
              <a
                href={booking.receiptDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-8 text-sm font-semibold text-[#4b3621] underline underline-offset-2"
              >
                Download receipt (PDF)
              </a>
            )}

            {!isCancelled && (
              <div className="border-t border-neutral-100 pt-6">
                <h2 className="font-playfair text-lg text-[#4b3621] mb-4">Cancel booking</h2>
                <p className="text-sm text-neutral-600 mb-4">
                  We will send a one-time code to the email you used when booking. Enter it below
                  to confirm cancellation.
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
                      className="rounded-none"
                    />
                    {emailError ? (
                      <p className="text-sm text-destructive mt-1">{emailError}</p>
                    ) : null}
                  </div>
                  {!otpSent ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none"
                      onClick={() => {
                        if (!cancelEmail.trim() || !cancelEmail.includes("@")) {
                          setEmailError("Enter the email address used when booking");
                          return;
                        }
                        otpMutation.mutate();
                      }}
                      disabled={!cancelEmail.trim() || otpMutation.isPending}
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
                          className="rounded-none"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reason">Reason (optional)</Label>
                        <Input
                          id="reason"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="rounded-none"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-none"
                        onClick={() => cancelMutation.mutate()}
                        disabled={!otpCode || cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? "Cancelling…" : "Confirm cancellation"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {isCancelled && booking.cancellationReason && (
              <p className="text-sm text-neutral-600 border-t border-neutral-100 pt-4">
                Cancellation reason: {booking.cancellationReason}
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BookingView;
