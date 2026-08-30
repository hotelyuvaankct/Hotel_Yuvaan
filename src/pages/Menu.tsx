import React from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const MENU_DRIVE_ID = "1o3e9A316SvHd_okVKtFU9J4hAEHLK-xH";
const MENU_PREVIEW_URL = `https://drive.google.com/file/d/${MENU_DRIVE_ID}/preview`;

const Menu = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 animate-on-scroll">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
              CULINARY DELIGHTS
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              Our <span className="text-gradient">Menu</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete multi-cuisine menu featuring Indian favourites,
              snacks, beverages, and chef specials.
            </p>
          </div>

          <div className="animate-on-scroll rounded-2xl overflow-hidden border border-muted shadow-lg bg-card">
            <iframe
              src={MENU_PREVIEW_URL}
              title="Hotel Yuvaan Menu"
              allow="autoplay"
              className="w-full h-[75vh] min-h-[500px]"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
