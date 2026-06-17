import { getAvailabilityApiUrl, getHotelsApiUrl } from "@/lib/constants";

export interface HotelSummary {
  id: number;
  name: string;
  city?: string;
  state?: string;
}

export interface AvailableRoomType {
  roomTypeId: number;
  name: string;
  description: string | null;
  maxAdults: number;
  maxChildren: number;
  maxGuests: number;
  availableRooms: number;
  totalRooms: number;
  basePricePerNight: number;
  fromPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  totalNights: number;
  amenities: string[];
  badges?: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function fetchHotels(): Promise<HotelSummary[]> {
  const response = await fetch(getHotelsApiUrl());
  const body: ApiResponse<HotelSummary[]> = await response.json().catch(() => ({
    success: false,
    data: [],
  }));

  if (!response.ok || !body.success) {
    throw new Error(body.message ?? "Failed to load hotels");
  }

  return body.data ?? [];
}

export async function searchAvailability(params: {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}): Promise<AvailableRoomType[]> {
  const response = await fetch(getAvailabilityApiUrl(params));
  const body: ApiResponse<AvailableRoomType[]> = await response.json().catch(() => ({
    success: false,
    data: [],
  }));

  if (!response.ok || !body.success) {
    throw new Error(body.message ?? "Failed to search availability");
  }

  return body.data ?? [];
}

export async function resolveDefaultHotelId(): Promise<number> {
  const hotels = await fetchHotels();
  if (hotels.length === 0) {
    throw new Error("No active hotels found");
  }
  return hotels[0].id;
}
