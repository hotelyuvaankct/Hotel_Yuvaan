
import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import RoomsSection from '../components/RoomsSection';
import RestaurantSection from '../components/RestaurantSection';
import FacilitiesSection from '../components/FacilitiesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import EventsSection from '../components/EventsSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Index = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <RoomsSection />
      <RestaurantSection />
      <FacilitiesSection />
      {/* <TestimonialsSection /> */}
      {/* <EventsSection /> */}
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
