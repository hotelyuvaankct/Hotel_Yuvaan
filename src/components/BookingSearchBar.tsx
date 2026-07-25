"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar as CalendarIcon, Minus, Plus, Users } from "lucide-react";
import {
  format,
  addDays,
  parseISO,
  isBefore,
  isAfter,
  startOfToday,
  startOfDay,
} from "date-fns";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { buildBookUrl } from "@/services/roomService";
import {
  decodeRoomGuests,
  fetchBookingConfig,
  type BookingConfig,
} from "@/services/bookingService";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MAX_STAY_DAYS, MAX_TOTAL_GUESTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ActiveField = "checkin" | "checkout" | "guests" | "search" | null;

interface RoomGuests {
  adults: number;
  children: number;
}

function toTotalGuests(rooms: RoomGuests[]): RoomGuests {
  return rooms.reduce(
    (acc, room) => ({
      adults: acc.adults + room.adults,
      children: acc.children + room.children,
    }),
    { adults: 0, children: 0 }
  );
}

const toInputDate = (date: Date) => format(date, "yyyy-MM-dd");

const displayDate = (value: string) => {
  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return value;
  }
};

const BookingSearchBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const today = startOfToday();
  const defaultCheckIn = toInputDate(addDays(today, 1));
  const defaultCheckOut = toInputDate(addDays(today, 2));

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestRooms, setGuestRooms] = useState<RoomGuests[]>([
    { adults: 2, children: 0 },
  ]);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [bookingConfig, setBookingConfig] = useState<BookingConfig | null>(null);
  const findRoomRef = useRef<HTMLButtonElement>(null);
  /** When true, popover close is from a selection — don't clear activeField. */
  const advancingRef = useRef(false);

  useEffect(() => {
    fetchBookingConfig().then(setBookingConfig).catch(() => undefined);
  }, []);

  useEffect(() => {
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    const urlRoomGuests = decodeRoomGuests(searchParams.get("roomGuests"));
    const urlAdults = Number(searchParams.get("adults") ?? "0");
    const urlChildren = Number(searchParams.get("children") ?? "0");

    if (urlCheckIn) setCheckIn(urlCheckIn);
    if (urlCheckOut) {
      if (urlCheckIn) {
        const maxCheckOut = addDays(parseISO(urlCheckIn), MAX_STAY_DAYS);
        const requestedCheckOut = parseISO(urlCheckOut);
        setCheckOut(
          toInputDate(
            isAfter(requestedCheckOut, maxCheckOut) ? maxCheckOut : requestedCheckOut
          )
        );
      } else {
        setCheckOut(urlCheckOut);
      }
    }
    if (urlRoomGuests) {
      setGuestRooms([toTotalGuests(urlRoomGuests)]);
    } else if (urlAdults > 0 || urlChildren > 0) {
      setGuestRooms([
        {
          adults: Math.max(1, urlAdults || 2),
          children: Math.max(0, urlChildren),
        },
      ]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeField !== "search") return;
    findRoomRef.current?.focus({ preventScroll: true });
  }, [activeField]);

  const totals = useMemo(() => toTotalGuests(guestRooms), [guestRooms]);

  const guestSummary = `${totals.adults} adult${totals.adults === 1 ? "" : "s"}${
    totals.children > 0
      ? `, ${totals.children} child${totals.children === 1 ? "" : "ren"}`
      : ""
  }`;

  const minAdults = bookingConfig?.minAdultsPerRoom ?? 1;
  const maxAdultsPerRoom = bookingConfig?.maxAdultsPerRoom ?? 2;
  const maxChildrenPerRoom = bookingConfig?.maxChildrenPerRoom ?? 1;
  const maxRooms = bookingConfig?.maxRooms ?? 10;
  const maxAdults = Math.min(maxAdultsPerRoom * maxRooms, MAX_TOTAL_GUESTS);
  const maxChildren = Math.min(maxChildrenPerRoom * maxRooms, MAX_TOTAL_GUESTS);

  const buildGuestBookUrl = (
    rooms: RoomGuests[],
    nextCheckIn = checkIn,
    nextCheckOut = checkOut
  ) => {
    const nextTotals = toTotalGuests(rooms);
    const guests = [nextTotals];
    const promo = searchParams.get("promo")?.trim() || undefined;
    return buildBookUrl({
      checkIn: nextCheckIn,
      checkOut: nextCheckOut,
      adults: nextTotals.adults,
      children: nextTotals.children,
      rooms: 1,
      roomGuests: guests,
      promo,
    });
  };

  const syncGuestsToBookUrl = (rooms: RoomGuests[]) => {
    const next = [toTotalGuests(rooms)];
    setGuestRooms(next);
    if (!pathname.startsWith("/book") || !checkIn || !checkOut) return;
    const nextUrl = buildGuestBookUrl(next);
    const currentQuery = searchParams.toString();
    const nextQuery = nextUrl.split("?")[1] ?? "";
    if (currentQuery === nextQuery) return;
    router.replace(nextUrl);
  };

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    const nextCheckIn = parseISO(value);
    const checkOutDate = parseISO(checkOut);
    const maxCheckOut = addDays(nextCheckIn, MAX_STAY_DAYS);

    if (!isBefore(nextCheckIn, checkOutDate)) {
      setCheckOut(toInputDate(addDays(nextCheckIn, 1)));
    } else if (isAfter(checkOutDate, maxCheckOut)) {
      setCheckOut(toInputDate(maxCheckOut));
    }
  };

  const setGuestTotals = (patch: Partial<RoomGuests>) => {
    setGuestRooms((prev) => {
      const current = toTotalGuests(prev);
      const next = {
        adults: patch.adults ?? current.adults,
        children: patch.children ?? current.children,
      };
      if (next.adults + next.children > MAX_TOTAL_GUESTS) return prev;
      return [next];
    });
  };

  const handleFieldOpenChange = (field: Exclude<ActiveField, "search" | null>, open: boolean) => {
    if (open) {
      advancingRef.current = false;
      setActiveField(field);
      return;
    }
    // Closing: outside click / escape — do not auto-advance
    if (advancingRef.current) {
      advancingRef.current = false;
      return;
    }
    setActiveField((current) => (current === field ? null : current));
  };

  const advanceTo = (next: ActiveField) => {
    advancingRef.current = true;
    setActiveField(next);
  };

  const finishGuests = () => {
    syncGuestsToBookUrl(guestRooms);
    advanceTo("search");
  };

  const handleSearch = () => {
    setActiveField(null);
    router.push(buildGuestBookUrl(guestRooms));
  };

  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);
  const minCheckOut = addDays(checkInDate, 1);
  const maxCheckOut = addDays(checkInDate, MAX_STAY_DAYS);

  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(45,30,15,0.32)]">
      <div className="flex flex-col lg:flex-row lg:items-stretch lg:divide-x lg:divide-[#ebe3d6]">
        <div className="hidden lg:flex flex-col justify-center px-6 py-5 min-w-[170px] bg-[#faf8f5]">
          <p className="font-playfair text-xl font-semibold leading-tight text-[#4b3621]">
            Book Online
          </p>
          <p className="mt-1 text-xs text-[#8b7355]">Guaranteed accommodation</p>
        </div>

        <DatePickerField
          label="Check-in"
          displayValue={displayDate(checkIn)}
          open={activeField === "checkin"}
          onOpenChange={(open) => handleFieldOpenChange("checkin", open)}
          selected={checkInDate}
          active={activeField === "checkin"}
          disabled={(date) => startOfDay(date) < today}
          onSelect={(date) => {
            if (!date) return;
            handleCheckInChange(toInputDate(date));
            advanceTo("checkout");
          }}
        />

        <DatePickerField
          label="Check-out"
          displayValue={displayDate(checkOut)}
          open={activeField === "checkout"}
          onOpenChange={(open) => handleFieldOpenChange("checkout", open)}
          selected={checkOutDate}
          active={activeField === "checkout"}
          disabled={(date) => {
            const day = startOfDay(date);
            return day < minCheckOut || day > maxCheckOut;
          }}
          onSelect={(date) => {
            if (!date) return;
            setCheckOut(toInputDate(date));
            advanceTo("guests");
          }}
        />

        <Popover
          open={activeField === "guests"}
          onOpenChange={(open) => handleFieldOpenChange("guests", open)}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex min-w-[210px] flex-1 items-center gap-3 border-b border-[#ebe3d6] px-5 py-4 text-left transition-colors duration-200 hover:bg-[#faf8f5] lg:border-b-0",
                activeField === "guests" && "bg-[#faf8f5] ring-1 ring-inset ring-[#c9a227]/40"
              )}
              aria-label="Select guests"
              aria-expanded={activeField === "guests"}
            >
              <Users className="h-5 w-5 shrink-0 text-[#b8892f] stroke-[1.5]" />
              <div className="min-w-0">
                <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b5538]">
                  Guests
                </p>
                <p className="truncate text-[15px] font-semibold leading-snug text-[#4b3621]">
                  {guestSummary}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[min(100vw-2rem,22rem)] border-[#e8dfd0] p-0 shadow-xl rounded-lg overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
            align="start"
            sideOffset={8}
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="bg-[#faf8f5] px-5 pt-4 pb-2">
              <p className="font-playfair text-xl font-semibold text-[#4b3621]">Guests</p>
            </div>
            <div className="space-y-5 px-5 py-4">
              <CounterRow
                label="Adults"
                value={totals.adults}
                min={minAdults}
                max={Math.min(maxAdults, MAX_TOTAL_GUESTS - totals.children)}
                onChange={(adults) => setGuestTotals({ adults })}
              />
              <CounterRow
                label="Children under 12 years old"
                value={totals.children}
                min={0}
                max={Math.min(maxChildren, MAX_TOTAL_GUESTS - totals.adults)}
                onChange={(children) => setGuestTotals({ children })}
              />
            </div>
            <div className="flex justify-end border-t border-[#e8dfd0] bg-[#faf8f5] px-5 py-3">
              <Button type="button" variant="dark" onClick={finishGuests}>
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          ref={findRoomRef}
          type="button"
          variant="solid"
          onClick={handleSearch}
          className={cn(
            "h-14 shrink-0 !rounded-none bg-[#7a5514] px-10 text-[13px] font-semibold uppercase tracking-[0.16em] text-white shadow-none transition-shadow duration-300 hover:bg-[#6a4a12] hover:brightness-100 lg:h-auto lg:min-h-full lg:self-stretch",
            activeField === "search" && "find-room-pulse ring-2 ring-[#c9a227] ring-offset-2 ring-offset-white"
          )}
        >
          Find Room
        </Button>
      </div>
    </div>
  );
};

interface CounterRowProps {
  label: string;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
}

const CounterRow: React.FC<CounterRowProps> = ({
  label,
  value,
  min,
  max,
  onChange,
}) => (
  <div>
    <p className="mb-2 text-sm text-[#6b5a45]">{label}</p>
    <div className="inline-flex items-center overflow-hidden rounded-full border border-[#d4c4a8]">
      <Button
        type="button"
        variant="subtle"
        size="icon-sm"
        className="rounded-none text-[#4b3621] hover:bg-[#f5efe6]"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="flex h-10 min-w-[3rem] items-center justify-center border-x border-[#d4c4a8] px-3 text-sm font-medium text-[#4b3621]">
        {value}
      </span>
      <Button
        type="button"
        variant="subtle"
        size="icon-sm"
        className="rounded-none text-[#4b3621] hover:bg-[#f5efe6]"
        onClick={() => onChange(max != null ? Math.min(max, value + 1) : value + 1)}
        disabled={max != null && value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

interface DatePickerFieldProps {
  label: string;
  displayValue: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Date;
  active: boolean;
  disabled: (date: Date) => boolean;
  onSelect: (date: Date | undefined) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  displayValue,
  open,
  onOpenChange,
  selected,
  active,
  disabled,
  onSelect,
}) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <button
        type="button"
        className={cn(
          "flex w-full min-w-[180px] items-center gap-3 border-b border-[#ebe3d6] px-5 py-4 text-left transition-colors duration-200 hover:bg-[#faf8f5] lg:border-b-0",
          active && "bg-[#faf8f5] ring-1 ring-inset ring-[#c9a227]/40"
        )}
        aria-label={`Select ${label}`}
        aria-expanded={open}
      >
        <CalendarIcon className="h-5 w-5 shrink-0 text-[#b8892f] stroke-[1.5]" />
        <div className="min-w-0">
          <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b5538]">
            {label}
          </p>
          <p className="truncate text-[15px] font-semibold leading-snug text-[#4b3621]">
            {displayValue}
          </p>
        </div>
      </button>
    </PopoverTrigger>
    <PopoverContent
      className="w-auto overflow-hidden rounded-lg border-[#e8dfd0] p-0 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
      align="start"
      sideOffset={8}
    >
      <Calendar
        key={`${label}-${selected.toISOString()}`}
        mode="single"
        selected={selected}
        defaultMonth={selected}
        onSelect={onSelect}
        disabled={disabled}
        initialFocus
        className="rounded-lg bg-white"
      />
    </PopoverContent>
  </Popover>
);

export default BookingSearchBar;
