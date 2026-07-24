import type { Metadata } from "next";
import SectionPageShell from "@/components/SectionPageShell";
import FacilitiesSection from "@/components/FacilitiesSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Facilities & Amenities",
  description:
    "Hotel Yuvaan facilities in Kuchaman City — WiFi, breakfast, parking, room service, banquet hall, and more for a comfortable stay.",
  path: "/facilities",
  image: OG_IMAGES.facilities,
  imageAlt: "Hotel Yuvaan interior facilities",
});

export default async function FacilitiesPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <FacilitiesSection />
    </SectionPageShell>
  );
}
