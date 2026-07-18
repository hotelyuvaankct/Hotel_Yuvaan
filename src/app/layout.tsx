import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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
  title: "Hotel Yuvaan | Best Hotel & Pure Veg Restaurant in Kuchaman City",
  description:
    "Book your stay at Hotel Yuvaan in Kuchaman City. Enjoy luxury AC rooms, 24-hour service, banquet hall, and our famous Pure Veg Restaurant. Get the best rates today!",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hotelyuvaan.com"
  ),
  keywords: [
    "HOTEL YUVAAN",
    "Kuchaman City hotel",
    "pure veg restaurant",
    "Rajasthan hotels",
  ],
  openGraph: {
    title: "HOTEL YUVAAN, Kuchaman, India - Photos, Room Rates & Reviews",
    description:
      "Compare hotel prices and book Hotel Yuvaan in Kuchaman, India. Enjoy full AC rooms, 24-Hour Housekeeping, Cook & Butler Service, and our Pure veg restaurant.",
    url: "https://hotelyuvaan.com/",
    siteName: "Hotel Yuvaan and Restaurant Kuchaman City",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://hotelyuvaan.com/image/Gallery/Hotel_Reception_Area.png",
        width: 1200,
        height: 630,
        alt: "Hotel Yuvaan Reception Area in Kuchaman City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HOTEL YUVAAN AND RESTAURANT (@hotelyuvaan) | Kuchaman, India",
    description:
      "Book Hotel Yuvaan in Kuchaman. Spacious and elegantly designed rooms, full AC Rooms with Pure veg restaurant, Banquet Hall, Cook & Butler Service, 24-Hour Housekeeping.",
    images: ["https://hotelyuvaan.com/image/Gallery/Hotel_Reception_Area.png"],
    site: "@hotelyuvaan",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://hotelyuvaan.com/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Hotel Yuvaan and Restaurant",
  image: "https://hotelyuvaan.com/image/Gallery/Hotel_Reception_Area.png",
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
  url: "https://hotelyuvaan.com/",
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
      <body className="font-sans antialiased overflow-x-clip max-w-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
