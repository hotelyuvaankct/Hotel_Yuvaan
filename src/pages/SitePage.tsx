import { useParams } from "react-router-dom";
import SiteContentPage from "@/components/SiteContentPage";
import NotFound from "@/pages/NotFound";
import { getSitePage } from "@/data/sitePages";

const SitePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getSitePage(`/${slug}`) : undefined;
  if (!page) {
    return <NotFound />;
  }

  return (
    <SiteContentPage
      title={page.title}
      subtitle={page.subtitle}
      sections={page.sections}
    />
  );
};

export default SitePage;
