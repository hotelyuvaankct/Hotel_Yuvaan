import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RoomsSection from "@/components/RoomsSection";
import RestaurantSection from "@/components/RestaurantSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import GallerySection from "@/components/GallerySection";
import CouponsSection from "@/components/CouponsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import HomeScrollSpy from "@/components/HomeScrollSpy";
import { fetchPublicRoomTypes } from "@/services/roomService";
import { fetchGalleryPreview } from "@/services/galleryService";
import { fetchPublicCoupons } from "@/services/couponService";
import {
  buildContactDisplay,
  fetchAppConfig,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";

export const revalidate = 60;

/** Below-the-fold content — streamed after hero so APIs don't block FCP/LCP. */
async function HomeSections() {
  const [rooms, gallery, coupons, config] = await Promise.all([
    fetchPublicRoomTypes().catch(() => []),
    fetchGalleryPreview(6).catch(() => []),
    fetchPublicCoupons().catch(() => []),
    fetchAppConfig().catch(() => DEFAULT_APP_CONFIG),
  ]);

  const contact = buildContactDisplay(config);

  return (
    <>
      <HomeScrollSpy />
      <AboutSection contact={contact} />
      <RoomsSection rooms={rooms} />
      <RestaurantSection />
      <FacilitiesSection />
      <GallerySection images={gallery} />
      <CouponsSection coupons={coupons} />
      <ContactSection contact={contact} />
      <Footer contact={contact} />
    </>
  );
}

function HomeSectionsFallback() {
  return (
    <div
      className="min-h-[40vh] bg-[hsl(var(--page-bg))]"
      aria-hidden
    />
  );
}

export default function HomePage() {
  return (
    <PageBackground className="bg-black">
      <Suspense fallback={null}>
        <Navigation overlayHero />
      </Suspense>
      <HeroSection />
      <div className="bg-[hsl(var(--page-bg))] text-foreground">
        <Suspense fallback={<HomeSectionsFallback />}>
          <HomeSections />
        </Suspense>
      </div>
    </PageBackground>
  );
}
