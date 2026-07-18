import SectionPageShell from "@/components/SectionPageShell";
import ContactSection from "@/components/ContactSection";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";

export const revalidate = 60;

export const metadata = {
  title: "Contact | Hotel Yuvaan",
  description:
    "Contact Hotel Yuvaan for reservations, inquiries, and directions in Kuchaman City.",
};

export default async function ContactPage() {
  const config = await fetchAppConfig().catch(() => DEFAULT_APP_CONFIG);
  const contact = buildContactDisplay(config);

  return (
    <SectionPageShell contact={contact}>
      <ContactSection contact={contact} />
    </SectionPageShell>
  );
}
