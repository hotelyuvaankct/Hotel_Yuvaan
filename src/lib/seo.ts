import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hotelyuvaan.com";

export const SITE_NAME = "Hotel Yuvaan";
export const SITE_NAME_FULL = "Hotel Yuvaan and Restaurant, Kuchaman City";
export const DEFAULT_OG_IMAGE = "/image/Gallery/Hotel_Reception_Area.png";

export const OG_IMAGES = {
  home: "/image/Gallery/Hotel_Reception_Area.png",
  rooms: "/image/Gallery/Deluxe_Room_Suite.png",
  restaurant: "/image/Gallery/Main_Restaurant_Dining_Area.png",
  gallery: "/image/Gallery/Night_View.png",
  about: "/image/Gallery/Hotel_Reception_Area.png",
  facilities: "/image/Gallery/Interior.png",
  contact: "/image/Gallery/Hotel_Reception_Area.png",
  book: "/image/Gallery/Standard_Room.png",
  offers: "/image/Gallery/Deluxe_Room_Suite.png",
  events: "/image/Gallery/Birthday_Event_Decoration.png",
} as const;

type CreatePageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  keywords?: string[];
};

function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Builds consistent title, Open Graph, Twitter, and canonical metadata
 * for every public page.
 */
export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  noIndex = false,
  type = "website",
  keywords,
}: CreatePageMetadataInput): Metadata {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const alt =
    imageAlt ?? `${title} — ${SITE_NAME}, Kuchaman City, Rajasthan`;

  return {
    title: fullTitle,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME_FULL,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      site: "@hotelyuvaan",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export { SITE_URL };
