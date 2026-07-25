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
  fromRoomLabel,
  nights,
  onUpgrade,
  upgrading = false,
}: RoomUpgradeCardProps) {
  const imageUrl =
    upgrade.primaryImageUrl ||
    upgrade.images?.[0] ||
    "/image/Gallery/Hotel_Reception_Area.png";
  const amenities = upgrade.amenities ?? [];
  const visible = amenities.slice(0, 5);
  const extra = Math.max(0, amenities.length - visible.length);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#5c3d2e] text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-[#4b3621]">Room upgrade</h3>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e8d5a3] bg-white shadow-sm">
        <div className="border-b border-[#e8d5a3]/60 bg-[#fffaf0] px-3 py-2.5 min-[480px]:px-4">
          <p className="text-xs text-neutral-600">
            Replaces{" "}
            <span className="font-semibold text-[#4b3621]">
              {fromRoomLabel ? `${fromRoomLabel}: ` : ""}
              {fromRoomName}
            </span>
            {" → "}
            <span className="font-semibold text-[#4b3621]">{upgrade.name}</span>
          </p>
        </div>

        <div className="grid gap-3 p-3 min-[480px]:grid-cols-[140px_1fr] min-[480px]:gap-4 min-[480px]:p-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 min-[480px]:aspect-auto min-[480px]:h-full min-[480px]:min-h-[120px]">
            <Image
              src={imageUrl}
              alt={upgrade.name}
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 140px"
            />
          </div>

          <div className="min-w-0 space-y-2.5">
            <div>
              <p className="font-semibold text-[#4b3621]">{upgrade.name}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-neutral-600">
                <Users className="h-3.5 w-3.5 shrink-0" />
                up to {upgrade.maxGuests} guests
              </p>
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
                      <Icon className="h-3 w-3 shrink-0 text-[#b8892f]" />
                      {getAmenityLabel(amenity)}
                    </span>
                  );
                })}
                {extra > 0 ? (
                  <span className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-600">
                    + {extra}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-neutral-100 px-3 py-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between min-[480px]:px-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#4b3621]">
              Upgrade for {formatRoomPrice(Math.round(Number(upgrade.upgradePrice ?? 0)))} extra
            </p>
            <p className="text-xs text-neutral-600">
              Total for your stay
              {nights > 1 ? ` · ${nights} nights` : ""}
            </p>
          </div>
          <Button
            type="button"
            className="h-9 rounded-md bg-[#5c3d2e] px-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#4b3621]"
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
