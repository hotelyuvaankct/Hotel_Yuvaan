import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroBookingBar from "./HeroBookingBar";

const HERO_IMAGE = "/image/Gallery/Deluxe_Room_Suite.png";

/** Server-rendered hero — paints immediately for FCP/LCP (no Framer on critical path). */
export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Hotel Yuvaan deluxe room suite"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="relative z-10 container mx-auto flex flex-1 flex-col items-center justify-center px-4 pb-40 pt-36 text-center sm:pt-40 md:pb-48 md:pt-44 lg:pt-48">
        <div className="mb-6 flex w-full items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/40 sm:w-24" />
          <span className="whitespace-nowrap text-xs font-light uppercase tracking-[0.3em] text-white/90 sm:text-sm sm:tracking-[0.5em]">
            Welcome To
          </span>
          <div className="h-px w-12 bg-white/40 sm:w-24" />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full bg-black/50 blur-[60px]" />
          <h1 className="mb-8 font-playfair text-5xl font-normal leading-tight tracking-wide text-white drop-shadow-[0_10px_20px_hsl(var(--overlay)/0.9)] sm:text-6xl md:text-8xl lg:text-[7.5rem]">
            HOTEL <span className="font-semibold text-primary">YUVAAN</span>
          </h1>
        </div>

        <p className="mb-12 max-w-2xl px-4 text-sm font-light tracking-wide text-white/80 sm:text-base md:text-lg">
          An oasis of modern elegance and unparalleled hospitality. Immerse
          yourself in a world where luxury meets exceptional comfort.
        </p>

        <div className="mb-10 flex w-full flex-col gap-4 px-4 sm:w-auto sm:flex-row sm:gap-6">
          <Button
            asChild
            variant="dark"
            className="w-full text-xs uppercase tracking-[0.2em] sm:w-auto sm:text-sm"
          >
            <Link href="/book" className="group">
              <span>Book Your Stay</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full text-xs uppercase tracking-[0.2em] backdrop-blur-sm sm:w-auto sm:text-sm"
          >
            <Link href="/restaurant">
              <span>Discover Dining</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative z-20 container mx-auto -mt-6 px-4 pb-8 md:-mt-10 md:pb-12">
        <Suspense
          fallback={
            <div
              className="mx-auto h-14 w-full max-w-6xl rounded-2xl bg-white/90 shadow-lg"
              aria-hidden
            />
          }
        >
          <HeroBookingBar />
        </Suspense>
      </div>
    </section>
  );
}
