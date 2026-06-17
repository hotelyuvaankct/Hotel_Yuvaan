import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BookingSearchBar from "./BookingSearchBar";

const getImageUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`;
};

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${getImageUrl("image/Gallery/Deluxe_Room_Suite.png")}')`,
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="absolute inset-0 bg-black/40 transition-colors duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center flex-1 text-center pt-24 pb-40 md:pb-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 flex items-center justify-center gap-4 w-full"
        >
          <div className="w-12 sm:w-24 h-[1px] bg-white/40"></div>
          <span className="text-white/90 uppercase tracking-[0.3em] sm:tracking-[0.5em] text-xs sm:text-sm font-light whitespace-nowrap">
            Welcome To
          </span>
          <div className="w-12 sm:w-24 h-[1px] bg-white/40"></div>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 bg-black/50 blur-[60px] rounded-full scale-150 pointer-events-none -z-10" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-light font-playfair text-white tracking-wide leading-tight mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
          >
            HOTEL <span className="font-semibold text-primary">YUVAAN</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl font-light tracking-wide mb-12 px-4"
        >
          An oasis of modern elegance and unparalleled hospitality. Immerse
          yourself in a world where luxury meets exceptional comfort.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 mb-10"
        >
          <Link
            to="/book"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#4b3621] text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold hover:bg-[#3d2b1a] transition-colors w-full sm:w-auto rounded-sm shadow-lg"
          >
            <span>Book Your Stay</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/#restaurant"
            className="group flex items-center justify-center gap-3 px-8 py-4 border border-white/30 text-white hover:border-white hover:bg-white/10 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold transition-all backdrop-blur-sm w-full sm:w-auto rounded-sm"
          >
            <span>Discover Dining</span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-20 container mx-auto px-4 pb-8 md:pb-12 -mt-6 md:-mt-10"
      >
        <BookingSearchBar />
      </motion.div>
    </section>
  );
};

export default HeroSection;
