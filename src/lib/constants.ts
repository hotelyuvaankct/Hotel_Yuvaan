import { apiUrl } from "@/config/env";
import {
  GALLERY_CATEGORY_FILTER_ALL,
  type GalleryCategoryFilter,
} from "@/lib/galleryCategories";

export { apiUrl, env, getBackendBaseUrl } from "@/config/env";

export function getReviewsApiUrl(): string {
  return apiUrl("/reviews");
}

export function getContactApiUrl(): string {
  return apiUrl("/contact");
}

export function getConfigApiUrl(): string {
  return apiUrl("/config");
}

export function getPublicRoomTypesApiUrl(hotelId?: number): string {
  const query = hotelId != null ? `?hotelId=${hotelId}` : "";
  return apiUrl(`/public/room-types${query}`);
}

export function getPublicGalleryCategoriesApiUrl(): string {
  return apiUrl("/public/gallery/categories");
}

export function getPublicGalleryApiUrl(params?: {
  page?: number;
  size?: number;
  category?: GalleryCategoryFilter;
}): string {
  const search = new URLSearchParams();
  if (params?.page != null) search.set("page", String(params.page));
  if (params?.size != null) search.set("size", String(params.size));
  if (params?.category && params.category !== GALLERY_CATEGORY_FILTER_ALL) {
    search.set("category", params.category);
  }
  const query = search.toString();
  return apiUrl(`/public/gallery${query ? `?${query}` : ""}`);
}

export function getHotelsApiUrl(): string {
  return apiUrl("/rooms/hotels");
}

export function getAvailabilityApiUrl(params: {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}): string {
  const search = new URLSearchParams({
    hotelId: String(params.hotelId),
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    adults: String(params.adults),
    children: String(params.children),
    rooms: String(params.rooms),
  });
  return apiUrl(`/bookings/availability?${search.toString()}`);
}
