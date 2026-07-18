import { notFound } from "next/navigation";
import SiteContentPage from "@/components/SiteContentPage";
import { getSitePage, SITE_PAGES } from "@/data/sitePages";

type SiteSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SITE_PAGES.map((page) => ({
    slug: page.path.replace(/^\//, ""),
  }));
}

export async function generateMetadata({ params }: SiteSlugPageProps) {
  const { slug } = await params;
  const page = getSitePage(`/${slug}`);
  if (!page) return { title: "Not Found | Hotel Yuvaan" };
  return {
    title: `${page.title} | Hotel Yuvaan`,
    description: page.subtitle,
  };
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
