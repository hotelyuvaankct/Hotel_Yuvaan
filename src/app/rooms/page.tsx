import type { Metadata } from "next";
import SectionPageShell from "@/components/SectionPageShell";
import RoomsSection from "@/components/RoomsSection";
import { fetchPublicRoomTypes } from "@/services/roomService";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Rooms & Suites",
  description:
    "Explore AC rooms and suites at Hotel Yuvaan, Kuchaman City — premium amenities, comfortable beds, and great value for families and business travellers.",
  path: "/rooms",
  image: OG_IMAGES.rooms,
  imageAlt: "Deluxe room suite at Hotel Yuvaan",
});

export default async function RoomsPage() {
  const [rooms, config] = await Promise.all([
    fetchPublicRoomTypes().catch(() => []),
    fetchAppConfig().catch(() => DEFAULT_APP_CONFIG),
  ]);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <RoomsSection rooms={rooms} />
    </SectionPageShell>
  );
}
