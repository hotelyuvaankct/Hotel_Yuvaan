import SectionPageShell from "@/components/SectionPageShell";
import AboutSection from "@/components/AboutSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";

export const revalidate = 60;

export const metadata = {
  title: "About | Hotel Yuvaan",
  description:
    "Discover Hotel Yuvaan in Kuchaman City — luxury rooms, hospitality, and a memorable stay experience.",
};

export default async function AboutPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <AboutSection contact={contact} />
    </SectionPageShell>
  );
}
