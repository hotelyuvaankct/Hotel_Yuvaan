import SectionPageShell from "@/components/SectionPageShell";
import RoomsSection from "@/components/RoomsSection";
import { fetchPublicRoomTypes } from "@/services/roomService";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";

export const revalidate = 60;

export const metadata = {
  title: "Rooms & Suites | Hotel Yuvaan",
  description:
    "Explore luxury rooms and suites at Hotel Yuvaan with premium amenities and comfortable stays.",
};

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
