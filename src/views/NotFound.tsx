"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import PageBackground from "@/components/PageBackground";
import { Button } from "@/components/ui/button";

const LostKeyIllustration = () => (
  <svg
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto w-full max-w-sm sm:max-w-md"
    aria-hidden="true"
  >
    <ellipse cx="210" cy="262" rx="130" ry="14" fill="#4b3621" opacity="0.08" />

    {/* Door */}
    <rect x="250" y="40" width="120" height="200" rx="8" fill="#4b3621" />
    <rect x="260" y="50" width="100" height="180" rx="4" fill="#6b4f33" />
    <rect x="268" y="58" width="84" height="164" rx="2" fill="#fff8ee" />
    <circle cx="332" cy="140" r="7" fill="#c9a227" />
    <path d="M332 140h16" stroke="#c9a227" strokeWidth="3" strokeLinecap="round" />

    {/* Room number */}
    <rect x="288" y="84" width="44" height="26" rx="4" fill="#4b3621" />
    <text
      x="310"
      y="102"
      textAnchor="middle"
      fill="#f2a944"
      fontFamily="Georgia, serif"
      fontSize="13"
      fontWeight="700"
    >
      404
    </text>

    {/* Suitcase */}
    <motion.g
      animate={{ y: [0, -6, 0], rotate: [0, -1.5, 0, 1.5, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "130px 180px" }}
    >
      <rect x="48" y="130" width="140" height="100" rx="14" fill="#c9a227" />
      <rect x="56" y="138" width="124" height="84" rx="10" fill="#e0b84a" />
      <rect x="100" y="130" width="36" height="100" fill="#4b3621" opacity="0.2" />
      <path
        d="M90 130V112c0-10 9-18 28-18s28 8 28 18v18"
        stroke="#4b3621"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M94 130V114c0-7 7-14 24-14s24 7 24 14v16"
        stroke="#f2a944"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lock on suitcase */}
      <rect x="108" y="168" width="24" height="26" rx="4" fill="#4b3621" />
      <circle cx="120" cy="178" r="3.5" fill="#f2a944" />
      <path
        d="M112 168v-6a8 8 0 0116 0v6"
        stroke="#4b3621"
        strokeWidth="3"
        fill="none"
      />
      {/* ? sticker */}
      <circle cx="82" cy="178" r="14" fill="#fff8ee" />
      <text
        x="82"
        y="184"
        textAnchor="middle"
        fill="#4b3621"
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui,sans-serif"
      >
        ?
      </text>
    </motion.g>

    {/* Floating key */}
    <motion.g
      animate={{ y: [0, -10, 0], rotate: [8, 16, 8] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "70px 70px" }}
    >
      <circle cx="70" cy="70" r="20" fill="#f2a944" />
      <circle cx="70" cy="70" r="9" fill="#fff8ee" />
      <rect x="86" y="64" width="44" height="12" rx="3" fill="#f2a944" />
      <rect x="116" y="64" width="7" height="18" rx="2" fill="#f2a944" />
      <rect x="126" y="64" width="7" height="14" rx="2" fill="#f2a944" />
    </motion.g>

    {/* Dotted path to door */}
    <path
      d="M150 230c30 8 55 8 85 0"
      stroke="#c9a227"
      strokeWidth="2.5"
      strokeDasharray="5 8"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <PageBackground className="relative min-h-0 h-dvh max-h-dvh overflow-hidden">
      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col items-center justify-center gap-5 px-5 text-center sm:gap-6">
        <Link href="/" className="font-playfair text-xl font-bold text-foreground">
          Hotel <span className="text-gradient">Yuvaan</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full"
        >
          <LostKeyIllustration />
        </motion.div>

        <div className="space-y-3">
          <p className="text-6xl font-bold font-playfair tracking-tight text-primary sm:text-7xl">
            404
          </p>
          <h1 className="font-playfair text-2xl font-bold text-foreground sm:text-3xl">
            Wrong key for this door
          </h1>
          <p className="text-muted-foreground">
            This room isn’t on our floor plan — and the suitcase isn’t talking.
          </p>
        </div>

        <Button asChild variant="solid">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to the lobby
          </Link>
        </Button>
      </div>
    </PageBackground>
  );
};

export default NotFound;
