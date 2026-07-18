import { Suspense, type ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import type { ContactDisplay } from "@/services/configService";

type SectionPageShellProps = {
  children: ReactNode;
  contact?: ContactDisplay;
};

/** Shared layout for dedicated section routes (/rooms, /facilities, …). */
export default function SectionPageShell({
  children,
  contact,
}: SectionPageShellProps) {
  return (
    <PageBackground className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      <main className="relative z-10 flex-1 pt-28 sm:pt-32 md:pt-36">
        {children}
      </main>
      <Footer contact={contact} />
    </PageBackground>
  );
}
