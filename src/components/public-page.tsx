import { LandingMotionProvider } from "@/components/landing/motion-provider";
import { PublicPageTemplate } from "@/components/public-page-template";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import type { PageRecord } from "@/lib/content/repository";

export function PublicPage({ page, preview = false }: { page: PageRecord; preview?: boolean }) {
  const isHome = page.id === "home";
  const isComplaints = page.id === "complaints";
  const isDarkService = ["microsoft-365", "microsoft-azure"].includes(page.id);
  const content = <PublicPageTemplate page={page} />;
  return (
    <div className={isHome ? "public-home" : isComplaints ? "complaints-page-shell" : `public-inner ${isDarkService ? "theme-dark-page" : ""} ${page.id === "cyber" || page.id === "cybersecurity" ? "page-cybersecurity" : ""}`}>
      {preview && <div className="preview-bar" role="status">Vista previa · contenido no indexable</div>}
      <SiteHeader page={page} />
      <main id="content" tabIndex={-1}>{isHome || page.id === "microsoft-365" ? <LandingMotionProvider>{content}</LandingMotionProvider> : content}</main>
      <SiteFooter locale={page.locale} />
    </div>
  );
}
