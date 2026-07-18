"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BookingSearchBar = dynamic(() => import("./BookingSearchBar"), {
  ssr: true,
  loading: () => (
    <div
      className="mx-auto h-14 w-full max-w-6xl rounded-2xl bg-white/90 shadow-lg"
      aria-hidden
    />
  ),
});

const HERO_IMAGE = "/image/Gallery/Deluxe_Room_Suite.png";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  /** Secondary copy only — never hide the LCP brand title with opacity. */
  const fadeUp = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : 0.08 + i * 0.08,
        duration: reduceMotion ? 0 : 0.55,
        ease,
      },
    }),
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.8, ease }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Hotel Yuvaan deluxe room suite"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center flex-1 text-center pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-40 md:pb-48">
        <motion.div
          className="mb-6 flex items-center justify-center gap-4 w-full"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="w-12 sm:w-24 h-[1px] bg-white/40" />
          <span className="text-white/90 uppercase tracking-[0.3em] sm:tracking-[0.5em] text-xs sm:text-sm font-light whitespace-nowrap">
            Welcome To
          </span>
          <div className="w-12 sm:w-24 h-[1px] bg-white/40" />
        </motion.div>

        {/* LCP: paint immediately — no opacity animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-black/50 blur-[60px] rounded-full scale-150 pointer-events-none -z-10" />
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-normal font-playfair text-white tracking-wide leading-tight mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
            HOTEL <span className="font-semibold text-primary">YUVAAN</span>
          </h1>
        </div>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl font-light tracking-wide mb-12 px-4"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          An oasis of modern elegance and unparalleled hospitality. Immerse
          yourself in a world where luxury meets exceptional comfort.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 mb-10"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Button asChild variant="dark" className="w-full sm:w-auto tracking-[0.2em] uppercase text-xs sm:text-sm">
            <Link href="/book" className="group">
              <span>Book Your Stay</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full sm:w-auto tracking-[0.2em] uppercase text-xs sm:text-sm backdrop-blur-sm">
            <Link href="/restaurant">
              <span>Discover Dining</span>
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="relative z-20 container mx-auto px-4 pb-8 md:pb-12 -mt-6 md:-mt-10"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduceMotion ? 0 : 0.2,
          duration: reduceMotion ? 0 : 0.55,
          ease,
        }}
      >
        <Suspense fallback={null}>
          <BookingSearchBar />
        </Suspense>
      </motion.div>
    </section>
  );
}
