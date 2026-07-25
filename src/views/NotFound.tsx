import Link from "next/link";
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
    <ellipse cx="210" cy="262" rx="130" ry="14" fill="hsl(var(--brand))" opacity="0.08" />
    <rect x="250" y="40" width="120" height="200" rx="8" fill="hsl(var(--brand))" />
    <rect x="260" y="50" width="100" height="180" rx="4" fill="hsl(var(--brand-muted))" />
    <rect x="268" y="58" width="84" height="164" rx="2" fill="hsl(var(--surface))" />
    <circle cx="332" cy="140" r="7" fill="hsl(var(--gold))" />
    <path d="M332 140h16" stroke="hsl(var(--gold))" strokeWidth="3" strokeLinecap="round" />
    <rect x="288" y="84" width="44" height="26" rx="4" fill="hsl(var(--brand))" />
    <text
      x="310"
      y="102"
      textAnchor="middle"
      fill="hsl(var(--gold-bright))"
      fontFamily="Georgia, serif"
      fontSize="13"
      fontWeight="700"
    >
      404
    </text>
    <path
      d="M70 170c20-40 70-55 110-30 25 15 35 40 30 65"
      stroke="hsl(var(--gold))"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    <circle cx="70" cy="170" r="28" fill="hsl(var(--surface))" stroke="hsl(var(--gold))" strokeWidth="8" />
    <circle cx="70" cy="170" r="10" fill="hsl(var(--brand))" />
    <rect x="95" y="160" width="55" height="18" rx="4" fill="hsl(var(--gold))" />
    <rect x="140" y="155" width="14" height="28" rx="3" fill="hsl(var(--brand))" />
    <rect x="158" y="155" width="14" height="22" rx="3" fill="hsl(var(--brand))" />
  </svg>
);

export default function NotFound() {
  return (
    <PageBackground className="relative min-h-0 h-dvh max-h-dvh overflow-hidden">
      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col items-center justify-center gap-5 px-5 text-center sm:gap-6">
        <Link href="/" className="font-playfair text-xl font-bold text-foreground">
          Hotel <span className="text-gradient">Yuvaan</span>
        </Link>

        <div className="w-full">
          <LostKeyIllustration />
        </div>

        <div className="space-y-2">
          <p className="text-6xl font-bold font-playfair tracking-tight text-primary sm:text-7xl">
            404
          </p>
          <h1 className="font-playfair text-2xl font-bold text-foreground sm:text-3xl">
            Room not found
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            This page doesn&apos;t exist or has moved. Head back to the lobby.
          </p>
        </div>

        <Button asChild variant="solid" className="tracking-wide">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </PageBackground>
  );
}
