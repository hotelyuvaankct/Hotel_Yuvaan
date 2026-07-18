import SectionPageShell from "@/components/SectionPageShell";
import FacilitiesSection from "@/components/FacilitiesSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";

export const revalidate = 60;

export const metadata = {
  title: "Facilities | Hotel Yuvaan",
  description:
    "Hotel Yuvaan facilities — WiFi, breakfast, parking, pool, room service, and more.",
};

export default async function FacilitiesPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <FacilitiesSection />
    </SectionPageShell>
  );
}
