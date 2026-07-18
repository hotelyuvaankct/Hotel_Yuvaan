import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-background flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <Link href="/" className="font-playfair text-xl font-bold text-foreground">
        Hotel <span className="text-gradient">Yuvaan</span>
      </Link>
      <p className="font-playfair text-6xl font-bold text-primary">404</p>
      <h1 className="font-playfair text-2xl font-bold text-foreground">
        Room not found
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        This page doesn&apos;t exist or has moved. Head back to the lobby.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Back to home
      </Link>
    </div>
  );
}
