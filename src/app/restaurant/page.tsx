import SectionPageShell from "@/components/SectionPageShell";
import RestaurantSection from "@/components/RestaurantSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";

export const revalidate = 60;

export const metadata = {
  title: "Restaurant | Hotel Yuvaan",
  description:
    "Dine at Hotel Yuvaan’s restaurant — multi-cuisine menus, booth seating, and all-day dining.",
};

export default async function RestaurantPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <RestaurantSection />
    </SectionPageShell>
  );
}
