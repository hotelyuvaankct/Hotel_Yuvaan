import Link from "next/link";
import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

export type SitePageSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type SiteContentPageProps = {
  title: string;
  subtitle: string;
  lastUpdated?: string;
  sections: SitePageSection[];
};

export default function SiteContentPage({
  title,
  subtitle,
  lastUpdated = "12 July 2026",
  sections,
}: SiteContentPageProps) {
  return (
    <PageBackground className="flex flex-col">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <section className="relative overflow-hidden bg-[#4b3621] pt-40 sm:pt-44 md:pt-48 pb-20 md:pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fff 0.8px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 0.8px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div className="container relative mx-auto px-4 sm:px-6 max-w-3xl">
          <p className="text-white/60 text-[11px] sm:text-xs tracking-[0.22em] uppercase mb-4">
            Hotel Yuvaan
          </p>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-[2.75rem] text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          <p className="text-white/45 text-xs mt-6 tracking-wide">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <main className="flex-1 relative z-10 -mt-10 md:-mt-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl pb-14 md:pb-20">
          <article className="bg-white border border-[#e8e0d4] rounded-xl shadow-[0_12px_40px_-12px_rgba(75,54,33,0.18)] p-6 sm:p-8 md:p-11">
            <div className="space-y-9 md:space-y-10">
              {sections.map((section, index) => (
                <section
                  key={section.heading}
                  className={
                    index === 0
                      ? "space-y-3.5"
                      : "space-y-3.5 pt-9 md:pt-10 border-t border-[#efe8de]"
                  }
                >
                  <h2 className="font-playfair text-xl md:text-[1.35rem] text-[#4b3621] leading-snug">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((text) => (
                    <p
                      key={text.slice(0, 48)}
                      className="text-sm md:text-[0.9375rem] text-neutral-700 leading-relaxed"
                    >
                      {text}
                    </p>
                  ))}
                  {section.bullets && section.bullets.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2 text-sm md:text-[0.9375rem] text-neutral-700 leading-relaxed marker:text-[#4b3621]/80">
                      {section.bullets.map((item) => (
                        <li key={item} className="pl-1">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-10 md:mt-12 pt-7 border-t border-[#efe8de]">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Questions?{" "}
                <Link
                  href="/#contact"
                  className="text-[#4b3621] font-medium underline underline-offset-2 hover:text-[#3a2918]"
                >
                  Contact us
                </Link>{" "}
                or email{" "}
                <a
                  href="mailto:support@hotelyuvaan.com"
                  className="text-[#4b3621] font-medium underline underline-offset-2 hover:text-[#3a2918]"
                >
                  support@hotelyuvaan.com
                </a>
                .
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
