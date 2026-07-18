"use client";

import { Suspense } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import BookingSearchBar from "./BookingSearchBar";
import { Button } from "@/components/ui/button";

const HERO_IMAGE = "/image/Gallery/Deluxe_Room_Suite.png";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 28,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : 0.15 + i * 0.12,
        duration: reduceMotion ? 0 : 0.7,
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
        initial={reduceMotion ? false : { scale: 1.08, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 2.2, ease }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Hotel Yuvaan deluxe room suite"
          fill
          priority
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

        <motion.div
          className="relative"
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute inset-0 bg-black/50 blur-[60px] rounded-full scale-150 pointer-events-none -z-10" />
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-light font-playfair text-white tracking-wide leading-tight mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
            HOTEL <span className="font-semibold text-primary">YUVAAN</span>
          </h1>
        </motion.div>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl font-light tracking-wide mb-12 px-4"
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          An oasis of modern elegance and unparalleled hospitality. Immerse
          yourself in a world where luxury meets exceptional comfort.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 mb-10"
          custom={3}
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
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 40 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduceMotion ? 0 : 0.55,
          duration: reduceMotion ? 0 : 0.8,
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
