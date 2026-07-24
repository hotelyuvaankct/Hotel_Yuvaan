import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteContentPage from "@/components/SiteContentPage";
import { getSitePage, SITE_PAGES } from "@/data/sitePages";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

type SiteSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SITE_PAGES.map((page) => ({
    slug: page.path.replace(/^\//, ""),
  }));
}

export async function generateMetadata({
  params,
}: SiteSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSitePage(`/${slug}`);
  if (!page) {
    return createPageMetadata({
      title: "Page Not Found",
      description: "The page you are looking for is not available on Hotel Yuvaan.",
      path: `/${slug}`,
      noIndex: true,
    });
  }
  return createPageMetadata({
    title: page.title,
    description: page.subtitle,
    path: page.path,
    image: OG_IMAGES.home,
    imageAlt: `${page.title} — Hotel Yuvaan`,
  });
}

export default async function SiteSlugPage({ params }: SiteSlugPageProps) {
  const { slug } = await params;
  const page = getSitePage(`/${slug}`);
  if (!page) notFound();

  return (
    <SiteContentPage
      title={page.title}
      subtitle={page.subtitle}
      sections={page.sections}
    />
  );
}
