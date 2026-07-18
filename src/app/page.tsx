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

export default async function HomePage() {
  const [rooms, gallery, coupons, config] = await Promise.all([
    fetchPublicRoomTypes().catch(() => []),
    fetchGalleryPreview(6).catch(() => []),
    fetchPublicCoupons().catch(() => []),
    fetchAppConfig().catch(() => DEFAULT_APP_CONFIG),
  ]);

  const contact = buildContactDisplay(config);

  return (
    <PageBackground>
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      <HomeScrollSpy />
      <HeroSection />
      <AboutSection contact={contact} />
      <RoomsSection rooms={rooms} />
      <RestaurantSection />
      <FacilitiesSection />
      <GallerySection images={gallery} />
      <CouponsSection coupons={coupons} />
      <ContactSection contact={contact} />
      <Footer contact={contact} />
    </PageBackground>
  );
}
