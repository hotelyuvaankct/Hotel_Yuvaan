import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import RoomsSection from '../components/RoomsSection';
import RestaurantSection from '../components/RestaurantSection';
import FacilitiesSection from '../components/FacilitiesSection';
import GallerySection from '../components/GallerySection';
import CouponsSection from '../components/CouponsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import PageBackground from '../components/PageBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Index = () => {
  useScrollAnimation();

  return (
    <PageBackground>
      <Navigation />
      <HeroSection />
      <AboutSection />
      <RoomsSection />
      <RestaurantSection />
      <FacilitiesSection />
      {/* <TestimonialsSection /> */}
      {/* <EventsSection /> */}
      <GallerySection />
      <CouponsSection />
      <ContactSection />
      <Footer />
    </PageBackground>
  );
};

export default Index;
