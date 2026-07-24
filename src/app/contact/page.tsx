import type { Metadata } from "next";
import SectionPageShell from "@/components/SectionPageShell";
import ContactSection from "@/components/ContactSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Contact Hotel Yuvaan for reservations, inquiries, and directions. Station Road, Marudar Vihar, Kuchaman City, Rajasthan.",
  path: "/contact",
  image: OG_IMAGES.contact,
  imageAlt: "Contact Hotel Yuvaan reception",
});

export default async function ContactPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <ContactSection contact={contact} />
    </SectionPageShell>
  );
}
