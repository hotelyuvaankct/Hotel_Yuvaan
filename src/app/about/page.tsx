import type { Metadata } from "next";
import SectionPageShell from "@/components/SectionPageShell";
import AboutSection from "@/components/AboutSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Discover Hotel Yuvaan in Kuchaman City — warm hospitality, well-appointed AC rooms, and a memorable stay experience in Rajasthan.",
  path: "/about",
  image: OG_IMAGES.about,
  imageAlt: "About Hotel Yuvaan in Kuchaman City",
});

export default async function AboutPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <AboutSection contact={contact} />
    </SectionPageShell>
  );
}
