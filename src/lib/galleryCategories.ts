export enum GalleryCategory {
  RECEPTION = "Reception",
  RESTAURANT = "Restaurant",
  ROOMS = "Rooms",
  EVENTS = "Events",
  EXTERIOR = "Exterior",
  GENERAL = "General",
}

export const GALLERY_CATEGORIES = Object.values(GalleryCategory);

export const GALLERY_CATEGORY_FILTER_ALL = "All";

export const GALLERY_CATEGORY_FILTERS = [
  GALLERY_CATEGORY_FILTER_ALL,
  ...GALLERY_CATEGORIES,
] as const;

export type GalleryCategoryFilter = (typeof GALLERY_CATEGORY_FILTERS)[number];

export function isGalleryCategory(value: string): value is GalleryCategory {
  return GALLERY_CATEGORIES.includes(value as GalleryCategory);
}
