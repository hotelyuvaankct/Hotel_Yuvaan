import { getPublicRoomTypesApiUrl } from "@/lib/constants";

export interface PublicRoomType {
  id: number;
  hotelId: number;
  hotelName: string;
  name: string;
  description: string | null;
  maxAdults: number;
  maxChildren: number;
  basePrice: number;
  amenities: string[];
  images?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function fetchPublicRoomTypes(
  hotelId?: number
): Promise<PublicRoomType[]> {
  const response = await fetch(getPublicRoomTypesApiUrl(hotelId));
  const body: ApiResponse<PublicRoomType[]> = await response.json().catch(() => ({
    success: false,
    data: [],
  }));

  if (!response.ok || !body.success) {
    throw new Error(body.message ?? "Failed to load room types");
  }

  return body.data ?? [];
}

/** Fixes legacy Supabase URLs saved as /storage/v1object/public/ */
export function normalizeStorageUrl(url: string): string {
  return url.replace("/storage/v1object/public/", "/storage/v1/object/public/");
}

export function formatRoomPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildBookUrl(params: {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  roomGuests?: { adults: number; children: number }[];
  promo?: string;
}): string {
  const search = new URLSearchParams({
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    adults: String(params.adults),
    children: String(params.children),
    rooms: String(params.rooms),
  });
  if (params.roomGuests?.length) {
    search.set(
      "roomGuests",
      params.roomGuests.map((r) => `${r.adults}-${r.children}`).join(",")
    );
  }
  if (params.promo?.trim()) {
    search.set("promo", params.promo.trim());
  }
  return `/book?${search.toString()}`;
}
