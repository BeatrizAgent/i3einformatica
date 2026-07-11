import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/public-page";
import { getRuntimePage, type Locale } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Vista previa", robots: { index: false, follow: false, nocache: true } };

export default async function PreviewPage({ params }: { params: Promise<{ locale: Locale; segments?: string[] }> }) {
  const { locale, segments = [] } = await params;
  const page = await getRuntimePage(locale, segments.join("/"));
  if (!page) notFound();
  return <PublicPage page={page} preview />;
}
