import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import {
  createPageMetadata,
  OG_IMAGES,
  SITE_NAME_FULL,
  SITE_URL,
} from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  // Don't compete with Playfair (LCP) on the critical path
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME_FULL,
  ...createPageMetadata({
    title: "Hotel Yuvaan | Luxury & Best Hotel with Pure Veg Restaurant in Kuchaman City",
    description:
      "Book your stay at Hotel Yuvaan — a luxury hotel experience in Kuchaman City. Enjoy premium AC rooms, banquet hall, and our pure veg restaurant serving Jain food, Rajasthani cuisine, and Chinese dishes. Best rates today!",
    path: "/",
    image: OG_IMAGES.home,
    imageAlt: "Hotel Yuvaan reception area in Kuchaman City",
    keywords: [
      "Hotel Yuvaan",
      "Hotel Yuvaan Kuchaman",
      "Hotel Yuvaan and Restaurant",
      "Hotel Yuvaan Kuchaman City",
      "luxury hotel Kuchaman",
      "luxury hotel Kuchaman City",
      "luxury hotel Rajasthan",
      "best hotel in Kuchaman",
      "best hotel in Kuchaman City",
      "best hotel near me Kuchaman",
      "top hotel Kuchaman City",
      "premium hotel Kuchaman",
      "3 star hotel Kuchaman",
      "4 star hotel Kuchaman",
      "5 star hotel Kuchaman",
      "cheap hotel in Kuchaman",
      "cheap hotel Kuchaman City",
      "cheapest hotel in Kuchaman",
      "affordable hotel Kuchaman",
      "budget hotel Kuchaman",
      "low budget hotel Kuchaman City",
      "low price hotel Kuchaman",
      "hotel under 2000 Kuchaman",
      "best price hotel Kuchaman",
      "hotels in Kuchaman City",
      "hotels in Kuchaman Rajasthan",
      "hotel near Station Road Kuchaman",
      "hotel near bus stand Kuchaman",
      "hotel near railway station Kuchaman",
      "hotel in Marudar Vihar",
      "AC rooms Kuchaman",
      "deluxe room Kuchaman",
      "twin room Kuchaman",
      "family hotel Kuchaman",
      "wedding hotel Kuchaman",
      "banquet hall Kuchaman",
      "banquet hall Kuchaman City",
      "party hall Kuchaman",
      "conference hall Kuchaman",
      "pure veg restaurant Kuchaman",
      "pure vegetarian restaurant Kuchaman",
      "pure veg hotel Kuchaman",
      "Jain food Kuchaman",
      "pure Jain food Kuchaman",
      "Jain restaurant Kuchaman",
      "Jain hotel Kuchaman City",
      "Rajasthani food Kuchaman",
      "Rajasthani cuisine Kuchaman",
      "Rajasthani restaurant Kuchaman",
      "Chinese food Kuchaman",
      "Chinese restaurant Kuchaman",
      "veg Chinese food Kuchaman",
      "pure veg Chinese Kuchaman",
      "multi cuisine restaurant Kuchaman",
      "best restaurant Kuchaman City",
      "veg hotel Kuchaman",
      "hotel with restaurant Kuchaman",
      "hotel with parking Kuchaman",
      "hotel with WiFi Kuchaman",
      "24 hour room service Kuchaman",
      "book hotel Kuchaman online",
      "hotel booking Kuchaman City",
      "hotel price Kuchaman",
      "hotel room rates Kuchaman",
      "hotel reviews Kuchaman",
      "Hotel Yuvaan reviews",
      "Hotel Yuvaan contact number",
      "Hotel Yuvaan address",
      "Rajasthan hotels",
    ],
  }),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Hotel Yuvaan",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Hotel Yuvaan and Restaurant",
  image: `${SITE_URL}${OG_IMAGES.home}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Station Road, Marudar Vihar, Ward No. 12",
    addressLocality: "Kuchaman City",
    addressRegion: "Rajasthan",
    postalCode: "341508",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 27.1475,
    longitude: 74.8567,
  },
  url: `${SITE_URL}/`,
  priceRange: "INR 1600 - 2500",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="dns-prefetch" href="https://tnsgutyphkdfcfonujvf.storage.supabase.co" />
        <link
          rel="preconnect"
          href="https://tnsgutyphkdfcfonujvf.storage.supabase.co"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background font-sans antialiased overflow-x-clip max-w-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
