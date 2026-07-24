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
    title: "Hotel Yuvaan | Best Hotel & Pure Veg Restaurant in Kuchaman City",
    description:
      "Book your stay at Hotel Yuvaan in Kuchaman City. Enjoy luxury AC rooms, 24-hour service, banquet hall, and our famous Pure Veg Restaurant. Best rates for a comfortable Rajasthan stay.",
    path: "/",
    image: OG_IMAGES.home,
    imageAlt: "Hotel Yuvaan reception area in Kuchaman City",
    keywords: [
      "Hotel Yuvaan",
      "Kuchaman City hotel",
      "pure veg restaurant Kuchaman",
      "Rajasthan hotels",
      "AC rooms Kuchaman",
      "banquet hall Kuchaman City",
    ],
  }),
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black font-sans antialiased overflow-x-clip max-w-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
