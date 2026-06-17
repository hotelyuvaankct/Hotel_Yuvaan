import { getPublicGalleryApiUrl } from "@/lib/constants";
import { normalizeStorageUrl } from "@/services/roomService";
import type { GalleryCategoryFilter } from "@/lib/galleryCategories";

export interface GalleryImage {
  id: number;
  title: string;
  category: string;
  publicUrl: string;
  displayOrder: number;
  status?: number;
}

export interface GalleryPageResult {
  content: GalleryImage[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function mapGalleryImage(image: GalleryImage): GalleryImage {
  return {
    ...image,
    publicUrl: normalizeStorageUrl(image.publicUrl),
  };
}

export async function fetchGalleryImages(params?: {
  page?: number;
  size?: number;
  category?: GalleryCategoryFilter;
}): Promise<GalleryPageResult> {
  const response = await fetch(getPublicGalleryApiUrl(params));
  const body: ApiResponse<GalleryPageResult> = await response.json().catch(() => ({
    success: false,
    data: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: params?.size ?? 12,
    },
  }));

  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.message ?? "Failed to load gallery");
  }

  return {
    ...body.data,
    content: (body.data.content ?? []).map(mapGalleryImage),
  };
}

export async function fetchGalleryPreview(
  size = 6
): Promise<GalleryImage[]> {
  const page = await fetchGalleryImages({ page: 0, size });
  return page.content;
}
