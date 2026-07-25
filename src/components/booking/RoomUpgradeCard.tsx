"use client";

import Image from "next/image";
import { ArrowUpRight, Users } from "lucide-react";
import { formatRoomPrice } from "@/services/roomService";
import { getAmenityIcon, getAmenityLabel } from "@/lib/amenities";
import { Button } from "@/components/ui/button";

export type CheckoutRoomUpgrade = {
  roomTypeId: number;
  name: string;
  description?: string | null;
  maxGuests: number;
  availableRooms: number;
  sortOrder?: number | null;
  upgradePrice: number;
  primaryImageUrl?: string;
  images?: string[];
  amenities: string[];
  ratePlanCode: string;
  ratePlanLabel: string;
  pricePerNight: number;
  totalNights: number;
};

type RoomUpgradeCardProps = {
  upgrade: CheckoutRoomUpgrade;
  fromRoomName: string;
  fromRoomLabel?: string;
  nights: number;
  onUpgrade: () => void;
  upgrading?: boolean;
};

export default function RoomUpgradeCard({
  upgrade,
  fromRoomName,
  fromRoomLabel: _fromRoomLabel,
  nights: _nights,
  onUpgrade,
  upgrading = false,
}: RoomUpgradeCardProps) {
  const imageUrl =
    upgrade.primaryImageUrl ||
    upgrade.images?.[0] ||
    "/image/Gallery/Hotel_Reception_Area.png";
  const amenities = upgrade.amenities ?? [];
  const visible = amenities.slice(0, 4);
  const extra = Math.max(0, amenities.length - visible.length);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-hover text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-brand">Room upgrade</h3>
      </div>

      <div className="overflow-hidden rounded-xl border border-gold-border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        {/* Replacement banner */}
        <div className="border-b border-gold-border/60 bg-surface px-3 py-2.5 sm:px-4">
          <p className="text-xs leading-snug text-neutral-600">
            Replaces{" "}
            <span className="font-semibold text-brand">
              {fromRoomName}
            </span>
            {" → "}
            <span className="font-semibold text-brand">{upgrade.name}</span>
          </p>
        </div>

        {/* Image + details */}
        <div className="grid gap-3 p-3 sm:grid-cols-[minmax(0,140px)_1fr] sm:gap-4 sm:p-4">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-100 sm:aspect-square sm:h-full sm:min-h-[120px]">
            <Image
              src={imageUrl}
              alt={upgrade.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 140px"
            />
          </div>

          <div className="min-w-0 space-y-2.5">
            <div className="min-w-0">
              <p className="truncate font-semibold text-brand">
                {upgrade.name}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-neutral-600">
                <Users className="h-3.5 w-3.5 shrink-0" />
                up to {upgrade.maxGuests} guests
              </p>
              {upgrade.description ? (
                <p className="mt-1.5 line-clamp-2 text-xs text-neutral-500">
                  {upgrade.description}
                </p>
              ) : null}
            </div>

            {visible.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {visible.map((amenity) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-700"
                    >
                      <Icon className="h-3 w-3 shrink-0 text-gold-strong" />
                      <span className="truncate max-w-[7rem]">
                        {getAmenityLabel(amenity)}
                      </span>
                    </span>
                  );
                })}
                {extra > 0 ? (
                  <span className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                    +{extra}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col gap-3 border-t border-neutral-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4">
          <p className="min-w-0 text-sm text-brand-muted">
            Upgrade for{" "}
            <span className="font-semibold tabular-nums text-success">
              {formatRoomPrice(Math.round(Number(upgrade.upgradePrice ?? 0)))}
            </span>{" "}
            <span className="font-medium text-success">extra</span>
          </p>
          <Button
            type="button"
            className="h-9 w-full rounded-md bg-brand-hover px-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            onClick={onUpgrade}
            disabled={upgrading}
          >
            {upgrading ? "Upgrading…" : "Upgrade room"}
          </Button>
        </div>
      </div>
    </section>
  );
}