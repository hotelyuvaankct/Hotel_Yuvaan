"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Calendar as CalendarIcon, Minus, Plus, Trash2, Users } from "lucide-react";
import {
  format,
  addDays,
  parseISO,
  isBefore,
  isAfter,
  startOfToday,
  startOfDay,
} from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { buildBookUrl } from "@/services/roomService";
import {
  decodeRoomGuests,
  fetchBookingConfig,
  type BookingConfig,
} from "@/services/bookingService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MAX_STAY_DAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RoomGuests {
  adults: number;
  children: number;
}

interface GuestSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: RoomGuests[];
  onChange: (rooms: RoomGuests[]) => void;
  config: BookingConfig | null;
}

export const GuestSelectorModal: React.FC<GuestSelectorModalProps> = ({
  open,
  onOpenChange,
  rooms,
  onChange,
  config,
}) => {
  const minAdults = config?.minAdultsPerRoom ?? 1;
  const maxAdults = config?.maxAdultsPerRoom ?? 4;
  const maxChildren = config?.maxChildrenPerRoom ?? 2;

  const updateRoom = (index: number, patch: Partial<RoomGuests>) => {
    onChange(
      rooms.map((room, i) => (i === index ? { ...room, ...patch } : room))
    );
  };

  const removeRoom = (index: number) => {
    if (rooms.length <= 1) return;
    onChange(rooms.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-lg border-[#e8dfd0] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 bg-[#faf8f5]">
          <DialogTitle className="font-playfair text-2xl font-semibold text-[#4b3621]">
            Guests
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="space-y-4 border-b border-[#e8dfd0] pb-4 last:border-0"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#8b7355] uppercase">
                  Room {index + 1}
                </p>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => removeRoom(index)}
                    className="h-auto p-0 text-neutral-400 hover:text-red-600"
                    aria-label={`Remove room ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <CounterRow
                label="Adults"
                value={room.adults}
                min={minAdults}
                max={maxAdults}
                onChange={(adults) => updateRoom(index, { adults })}
              />

              <CounterRow
                label="Children under 12 years old"
                value={room.children}
                min={0}
                max={maxChildren}
                onChange={(children) => updateRoom(index, { children })}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#e8dfd0] px-6 py-4 bg-[#faf8f5]">
          <Button
            type="button"
            variant="dark"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
    <p className="text-sm text-[#6b5a45] mb-2">{label}</p>
    <div className="inline-flex items-center border border-[#d4c4a8] rounded-full overflow-hidden">
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
      <span className="h-10 min-w-[3rem] px-3 flex items-center justify-center border-x border-[#d4c4a8] text-sm font-medium text-[#4b3621]">
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
  const searchParams = useSearchParams();
  const today = startOfToday();
  const defaultCheckIn = toInputDate(addDays(today, 1));
  const defaultCheckOut = toInputDate(addDays(today, 2));

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestRooms, setGuestRooms] = useState<RoomGuests[]>([
    { adults: 2, children: 0 },
  ]);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [bookingConfig, setBookingConfig] = useState<BookingConfig | null>(null);

  useEffect(() => {
    fetchBookingConfig().then(setBookingConfig).catch(() => undefined);
  }, []);

  useEffect(() => {
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    const urlRoomGuests = decodeRoomGuests(searchParams.get("roomGuests"));

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
    if (urlRoomGuests) setGuestRooms(urlRoomGuests);
  }, [searchParams]);

  const totals = useMemo(() => {
    return guestRooms.reduce(
      (acc, room) => ({
        adults: acc.adults + room.adults,
        children: acc.children + room.children,
      }),
      { adults: 0, children: 0 }
    );
  }, [guestRooms]);

  const guestSummary = `${totals.adults} adult${totals.adults === 1 ? "" : "s"}, ${guestRooms.length} room${guestRooms.length === 1 ? "" : "s"}`;

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

  const handleSearch = () => {
    const promo = searchParams.get("promo")?.trim() || undefined;
    router.push(
      buildBookUrl({
        checkIn,
        checkOut,
        adults: totals.adults,
        children: totals.children,
        rooms: guestRooms.length,
        roomGuests: guestRooms,
        promo,
      })
    );
  };

  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);
  const minCheckOut = addDays(checkInDate, 1);
  const maxCheckOut = addDays(checkInDate, MAX_STAY_DAYS);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(45,30,15,0.32)]">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="hidden lg:flex flex-col justify-center px-6 py-5 min-w-[170px] border-b lg:border-b-0 lg:border-r border-[#ebe3d6] bg-[#faf8f5]">
            <p className="font-playfair text-xl font-semibold leading-tight text-[#4b3621]">
              Book Online
            </p>
            <p className="mt-1 text-xs text-[#8b7355]">Guaranteed accommodation</p>
          </div>

          <DatePickerField
            label="Check-in"
            value={checkIn}
            displayValue={displayDate(checkIn)}
            open={checkInOpen}
            onOpenChange={setCheckInOpen}
            selected={checkInDate}
            disabled={(date) => startOfDay(date) < today}
            onSelect={(date) => {
              if (!date) return;
              handleCheckInChange(toInputDate(date));
              setCheckInOpen(false);
            }}
          />

          <DatePickerField
            label="Check-out"
            value={checkOut}
            displayValue={displayDate(checkOut)}
            open={checkOutOpen}
            onOpenChange={setCheckOutOpen}
            selected={checkOutDate}
            disabled={(date) => {
              const day = startOfDay(date);
              return day < minCheckOut || day > maxCheckOut;
            }}
            onSelect={(date) => {
              if (!date) return;
              setCheckOut(toInputDate(date));
              setCheckOutOpen(false);
            }}
          />

          <button
            type="button"
            onClick={() => setGuestModalOpen(true)}
            className="flex min-w-[210px] flex-1 items-center gap-3 border-b border-[#ebe3d6] px-5 py-4 text-left transition-colors hover:bg-[#faf8f5] lg:border-b-0 lg:border-r"
          >
            <Users className="h-5 w-5 shrink-0 text-[#b8892f] stroke-[1.5]" />
            <div className="min-w-0">
              <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#a89070]">
                Guests
              </p>
              <p className="truncate text-[15px] font-semibold leading-snug text-[#4b3621]">
                {guestSummary}
              </p>
            </div>
          </button>

          <Button
            type="button"
            variant="solid"
            onClick={handleSearch}
            className="h-14 shrink-0 !rounded-none bg-[#c1862d] px-10 text-[13px] font-semibold uppercase tracking-[0.16em] text-white shadow-none hover:bg-[#b07828] hover:brightness-100 lg:h-auto lg:min-h-full lg:self-stretch"
          >
            Find Room
          </Button>
        </div>
      </div>

      <GuestSelectorModal
        open={guestModalOpen}
        onOpenChange={setGuestModalOpen}
        rooms={guestRooms}
        onChange={setGuestRooms}
        config={bookingConfig}
      />
    </>
  );
};

interface DatePickerFieldProps {
  label: string;
  value: string;
  displayValue: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Date;
  disabled: (date: Date) => boolean;
  onSelect: (date: Date | undefined) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  displayValue,
  open,
  onOpenChange,
  selected,
  disabled,
  onSelect,
}) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <button
        type="button"
        className={cn(
          "flex w-full min-w-[180px] items-center gap-3 border-b border-[#ebe3d6] px-5 py-4 text-left transition-colors hover:bg-[#faf8f5] lg:border-b-0 lg:border-r",
          open && "bg-[#faf8f5] ring-1 ring-inset ring-[#c9a227]/40"
        )}
        aria-label={`Select ${label}`}
      >
        <CalendarIcon className="h-5 w-5 shrink-0 text-[#b8892f] stroke-[1.5]" />
        <div className="min-w-0">
          <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#a89070]">
            {label}
          </p>
          <p className="truncate text-[15px] font-semibold leading-snug text-[#4b3621]">
            {displayValue}
          </p>
        </div>
      </button>
    </PopoverTrigger>
    <PopoverContent
      className="w-auto p-0 border-[#e8dfd0] shadow-xl rounded-lg overflow-hidden"
      align="start"
      sideOffset={8}
    >
      <Calendar
        key={selected.toISOString()}
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
