import assetCatalog from "../../data/content/assets.json";
import { assetPath } from "@/lib/public-path";
import aboutUs from "../../data/content/pages/about-us.json";
import complaints from "../../data/content/pages/complaints.json";
import compliance from "../../data/content/pages/compliance.json";
import contact from "../../data/content/pages/contact.json";
import cookiePolicy from "../../data/content/pages/cookie-policy.json";
import cybersecurity from "../../data/content/pages/cybersecurity.json";
import home from "../../data/content/pages/home.json";
import itInfrastructure from "../../data/content/pages/it-infrastructure.json";
import joinTeam from "../../data/content/pages/join-team.json";
import legalNotice from "../../data/content/pages/legal-notice.json";
import microsoft365 from "../../data/content/pages/microsoft-365.json";
import microsoft365Products from "../../data/content/pages/microsoft-365-products.json";
import microsoft365Solutions from "../../data/content/pages/microsoft-365-solutions.json";
import microsoftAzure from "../../data/content/pages/microsoft-azure.json";
import privacyPolicy from "../../data/content/pages/privacy-policy.json";
import successStories from "../../data/content/pages/success-stories.json";

export type ContentLocale = "es" | "en";
export type EditorialStatus = "machine_draft" | "in_review" | "approved" | "published";
export type AssetLicenseStatus = "pending" | "approved" | "blocked";
export type ContentAction = { label: string; routeId?: string; href?: string };
export type CuratedAssetRef = { assetId: string; role: string; alt: string; licenseStatus: AssetLicenseStatus };

export type CuratedBlock = {
  id: string;
  type: "outcome_grid" | "capability_grid" | "process_steps" | "timeline" | "split_media" | "proof_grid" | "logo_grid" | "stats" | "form" | "locations" | "rich_text" | "cta";
  eyebrow?: string;
  title?: string;
  intro?: string;
  assetId?: string;
  items?: Array<Record<string, unknown>>;
  action?: ContentAction;
  approvalStatus?: EditorialStatus;
  sourceNote?: string;
  verifiedAt?: string;
}

export type CuratedPageLocale = {
  path: string;
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string; assetId?: string; cta: ContentAction };
  blocks: CuratedBlock[];
  cta?: { eyebrow: string; title: string; text: string; action: ContentAction };
};

export type CuratedPageDocument = {
  schemaVersion: 2;
  pageId: string;
  family: string;
  templateVariant: string;
  editorialStatus: EditorialStatus;
  assets: CuratedAssetRef[];
  locales: Record<ContentLocale, CuratedPageLocale>;
};

const documents: CuratedPageDocument[] = [
  aboutUs,
  complaints,
  compliance,
  contact,
  cookiePolicy,
  cybersecurity,
  home,
  itInfrastructure,
  joinTeam,
  legalNotice,
  microsoft365,
  microsoft365Products,
  microsoft365Solutions,
  microsoftAzure,
  privacyPolicy,
  successStories,
] as CuratedPageDocument[];

export const pageContentById = Object.fromEntries(documents.map((document) => [document.pageId, document]));

const pageAliases: Record<string, string> = {
  m365: "microsoft-365",
  products: "microsoft-365-products",
  solutions: "microsoft-365-solutions",
  cyber: "cybersecurity",
  azure: "microsoft-azure",
  infra: "it-infrastructure",
  cases: "success-stories",
  company: "about-us",
  jobs: "join-team",
  privacy: "privacy-policy",
  cookies: "cookie-policy",
  legal: "legal-notice",
};

const routePaths: Record<string, Record<ContentLocale, string>> = {
  home: { es: "/", en: "/en/" },
  contact: { es: "/contacto", en: "/en/contact" },
  services: { es: "/ciberseguridad", en: "/en/cybersecurity" },
  microsoft365: { es: "/microsoft-365", en: "/en/microsoft-365" },
  products: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" },
  solutions: { es: "/microsoft-365/soluciones", en: "/en/microsoft-365/microsoft-365-solutions" },
  azure: { es: "/microsoft-azure", en: "/en/microsoft-azure" },
  infrastructure: { es: "/infraestructuras-it", en: "/en/it-infrastructure" },
  compliance: { es: "/compliance-y-certificaciones", en: "/en/compliance-and-certifications" },
  cases: { es: "/casos-de-exito", en: "/en/success-stories" },
  company: { es: "/sobre-nosotros", en: "/en/about-us" },
  jobs: { es: "/unete-al-equipo", en: "/en/join-the-team" },
  privacy: { es: "/politica-de-privacidad", en: "/en/privacy-policy" },
  cookies: { es: "/politica-de-cookies", en: "/en/cookie-policy" },
  legal: { es: "/aviso-legal", en: "/en/legal-notice" },
  complaints: { es: "/denuncias", en: "/en/complaints" },
};

export function getPageContent(pageId: string, locale: ContentLocale): CuratedPageLocale | null {
  const canonicalId = pageAliases[pageId] ?? pageId;
  return pageContentById[canonicalId]?.locales[locale] ?? null;
}

export function getPageDocument(pageId: string): CuratedPageDocument | null {
  const canonicalId = pageAliases[pageId] ?? pageId;
  return pageContentById[canonicalId] ?? null;
}

export function getAsset(assetId: string) {
  const asset = assetCatalog.assets.find((candidate) => candidate.id === assetId);
  return asset ? { ...asset, path: assetPath(asset.path) } : null;
}

export function resolveAction(action: ContentAction, locale: ContentLocale) {
  if (action.href) return { label: action.label, href: action.href };
  if (action.routeId && routePaths[action.routeId]?.[locale]) return { label: action.label, href: routePaths[action.routeId][locale] };
  return null;
}
