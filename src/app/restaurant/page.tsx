import type { Metadata } from "next";
import SectionPageShell from "@/components/SectionPageShell";
import RestaurantSection from "@/components/RestaurantSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Pure Veg Restaurant",
  description:
    "Dine at Hotel Yuvaan’s pure veg restaurant in Kuchaman City — multi-cuisine menus, booth seating, and all-day dining from morning till late night.",
  path: "/restaurant",
  image: OG_IMAGES.restaurant,
  imageAlt: "Main dining area at Hotel Yuvaan restaurant",
});

export default async function RestaurantPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <RestaurantSection />
    </SectionPageShell>
  );
}
