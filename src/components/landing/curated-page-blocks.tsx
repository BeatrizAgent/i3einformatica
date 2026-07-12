import Image from "next/image";
import Link from "next/link";

import { SubmissionForm } from "@/components/submission-form";
import type { PageRecord } from "@/lib/content/repository";
import { getAsset, getPageDocument, resolveAction, type ContentAction, type ContentLocale, type CuratedBlock, type CuratedPageLocale } from "@/lib/page-content";

function value(item: Record<string, unknown>, key: string) {
  return typeof item[key] === "string" ? item[key] as string : "";
}

function values(item: Record<string, unknown>, key: string) {
  return Array.isArray(item[key]) ? item[key].filter((entry): entry is string => typeof entry === "string") : [];
}

function blockItems(block: CuratedBlock) {
  return block.items ?? [];
}

function ActionLink({ action, locale, className = "text-link" }: { action?: ContentAction; locale: ContentLocale; className?: string }) {
  if (!action) return null;
  const resolved = resolveAction(action, locale);
  if (!resolved) return null;
  return <Link className={className} href={resolved.href}>{resolved.label} <span aria-hidden="true">-&gt;</span></Link>;
}

function CuratedImage({ pageId, assetId, alt, sizes = "(max-width: 760px) 100vw, 33vw" }: { pageId: string; assetId?: string; alt?: string; sizes?: string }) {
  if (!assetId) return null;
  const asset = getAsset(assetId);
  if (!asset) return null;
  const document = getPageDocument(pageId);
  const pageAsset = document?.assets.find((candidate) => candidate.assetId === assetId);
  return <div className="curated-media"><Image src={asset.path} alt={alt ?? pageAsset?.alt ?? assetId} fill sizes={sizes} /></div>;
}

function Heading({ block }: { block: CuratedBlock }) {
  return <div className="curated-heading">
    {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
    {block.title && <h2>{block.title}</h2>}
    {block.intro && <p>{block.intro}</p>}
  </div>;
}

function CardGrid({ pageId, locale, block }: { pageId: string; locale: ContentLocale; block: CuratedBlock }) {
  return <section className="section curated-section" aria-labelledby={`${block.id}-title`}>
    <div className="shell">
      <div id={`${block.id}-title`}><Heading block={block} /></div>
      <div className="curated-card-grid">
        {blockItems(block).map((item, index) => <article className="curated-card" key={`${block.id}-${index}`}>
          {value(item, "assetId") && <CuratedImage pageId={pageId} assetId={value(item, "assetId")} alt={value(item, "alt") || value(item, "title")} />}
          <div className="curated-card-copy">
            <span className="curated-card-index" aria-hidden="true">0{index + 1}</span>
            <h3>{value(item, "title")}</h3>
            <p>{value(item, "summary")}</p>
            {values(item, "details").length > 0 && <ul className="curated-card-list">{values(item, "details").map((detail) => <li key={detail}>{detail}</li>)}</ul>}
            <ActionLink action={item.action as ContentAction | undefined} locale={locale} />
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

function ProcessSteps({ block }: { block: CuratedBlock }) {
  return <section className="section section-muted curated-section" aria-labelledby={`${block.id}-title`}>
    <div className="shell">
      <div id={`${block.id}-title`}><Heading block={block} /></div>
      <ol className="curated-process-grid">
        {blockItems(block).map((item, index) => <li className="curated-process-step" key={`${block.id}-${index}`}>
          <span aria-hidden="true">0{index + 1}</span>
          <div><h3>{value(item, "title")}</h3><p>{value(item, "summary")}</p></div>
        </li>)}
      </ol>
    </div>
  </section>;
}

function Timeline({ block }: { block: CuratedBlock }) {
  return <section className="section curated-section curated-timeline-section" aria-labelledby={`${block.id}-title`}>
    <div className="shell">
      <div id={`${block.id}-title`}><Heading block={block} /></div>
      <ol className="curated-timeline" aria-label={block.title}>
        {blockItems(block).map((item, index) => <li className="curated-timeline-item" key={`${block.id}-${index}`}>
          <div className="curated-timeline-year"><span>0{index + 1}</span><time dateTime={value(item, "year")}>{value(item, "year")}</time></div>
          <div className="curated-timeline-node" aria-hidden="true" />
          <article className="curated-timeline-card">
            <p className="curated-timeline-kicker">Hito {String(index + 1).padStart(2, "0")}</p>
            <h3>{value(item, "title")}</h3>
            <p>{value(item, "summary")}</p>
          </article>
        </li>)}
      </ol>
    </div>
  </section>;
}

function SplitMedia({ pageId, locale, block }: { pageId: string; locale: ContentLocale; block: CuratedBlock }) {
  return <section className="section curated-section" aria-labelledby={`${block.id}-title`}>
    <div className="shell">
      <article className="curated-split-card">
        <CuratedImage pageId={pageId} assetId={block.assetId} alt={block.title} sizes="(max-width: 900px) 100vw, 48vw" />
        <div className="curated-split-copy" id={`${block.id}-title`}><Heading block={block} /><ActionLink action={block.action} locale={locale} className="button" /></div>
      </article>
    </div>
  </section>;
}

function ProofGrid({ pageId, block, locale }: { pageId: string; block: CuratedBlock; locale: ContentLocale }) {
  const isApproved = block.approvalStatus === "approved";
  return <section className="section curated-section" aria-labelledby={`${block.id}-title`}>
    <div className="shell">
      <div id={`${block.id}-title`}><Heading block={block} /></div>
      {isApproved ? (
        <div className="curated-card-grid">
          {blockItems(block).map((item, index) => <article className="curated-card curated-proof-card" key={`${block.id}-${index}`}>
            <CuratedImage pageId={pageId} assetId={value(item, "assetId")} alt={value(item, "title")} />
            <div className="curated-card-copy"><p className="eyebrow">{value(item, "sector")}</p><h3>{value(item, "title")}</h3><dl><div><dt>Reto</dt><dd>{value(item, "challenge")}</dd></div><div><dt>Intervención</dt><dd>{value(item, "approach")}</dd></div><div><dt>Resultado</dt><dd>{value(item, "result")}</dd></div></dl></div>
          </article>)}
        </div>
      ) : (
        <div className="curated-pending-notice" style={{ padding: "3rem 2rem", border: "1px dashed #dfe4ea", borderRadius: "8px", textAlign: "center", background: "#fff", marginTop: "2rem" }}>
          <p style={{ margin: 0, color: "#59606b", fontSize: "1.05rem" }}>
            {locale === "es"
              ? "Los casos de éxito se encuentran en proceso de validación editorial y legal para garantizar la exactitud de los datos y el cumplimiento de los acuerdos de confidencialidad."
              : "Success stories are currently undergoing editorial and legal validation to ensure data accuracy and compliance with confidentiality agreements."}
          </p>
        </div>
      )}
    </div>
  </section>;
}

function RichText({ block }: { block: CuratedBlock }) {
  const items = blockItems(block);
  const itemId = (item: Record<string, unknown>, index: number) => value(item, "id") || `${block.id}-${index + 1}`;
  return <section className="section curated-section" aria-labelledby={`${block.id}-title`}><div className="shell curated-rich-text"><div id={`${block.id}-title`}><Heading block={block} />{block.sourceNote && <p className="content-source-note">{block.sourceNote}</p>}</div>{items.length > 2 && <nav className="legal-index" aria-label="Índice"><strong>Índice</strong><ol>{items.map((item, index) => <li key={`${block.id}-index-${index}`}><a href={`#${itemId(item, index)}`}>{value(item, "heading")}</a></li>)}</ol></nav>}{items.map((item, index) => <article id={itemId(item, index)} key={`${block.id}-${index}`}><h3>{value(item, "heading")}</h3><p>{value(item, "body")}</p></article>)}</div></section>;
}

function Locations({ pageId, block, locale }: { pageId: string; block: CuratedBlock; locale: ContentLocale }) {
  return <section className="section section-muted curated-section" aria-labelledby={`${block.id}-title`}><div className="shell"><div id={`${block.id}-title`}><Heading block={block} /></div><div className="curated-card-grid curated-location-grid">{blockItems(block).map((item, index) => {
    const title = value(item, "title");
    const summary = value(item, "summary");
    const address = value(item, "address");
    const mapsUrl = value(item, "mapsUrl");
    return <article className="curated-card" key={`${block.id}-${index}`}>
      <CuratedImage pageId={pageId} assetId={value(item, "assetId")} alt={title} />
      <div className="curated-card-copy">
        <h3>{title}</h3>
        {address && <p className="location-address" style={{ fontWeight: 600, margin: "0.25rem 0 0.5rem" }}>{address}</p>}
        <p>{summary}</p>
        {mapsUrl && <a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.75rem" }}>{locale === "es" ? "Ver en Google Maps" : "View on Google Maps"} &rarr;</a>}
      </div>
    </article>;
  })}</div></div></section>;
}

function FormBlock({ page, block }: { page: PageRecord; block: CuratedBlock }) {
  if (!page.form) return null;
  return <section className="section section-muted curated-section"><div className="shell form-layout"><div><Heading block={block} />{block.sourceNote && <p className="content-source-note">{block.sourceNote}</p>}</div><SubmissionForm kind={page.form} locale={page.locale} /></div></section>;
}

function Stats({ block }: { block: CuratedBlock }) {
  if (block.approvalStatus !== "approved") return null;
  return <section className="section curated-section"><div className="shell"><Heading block={block} /><div className="curated-stats-grid">{blockItems(block).map((item, index) => <div className="curated-stat" key={`${block.id}-${index}`}><strong>{value(item, "value")}</strong><span>{value(item, "label")}</span></div>)}</div></div></section>;
}

function Cta({ content, locale }: { content: CuratedPageLocale; locale: ContentLocale }) {
  if (!content.cta) return null;
  return <section className="cta curated-cta"><div className="shell cta-inner"><div><p className="eyebrow">{content.cta.eyebrow}</p><h2>{content.cta.title}</h2><p>{content.cta.text}</p></div><ActionLink action={content.cta.action} locale={locale} className="button button-light" /></div></section>;
}

function RenderBlock({ page, locale, block }: { page: PageRecord; locale: ContentLocale; block: CuratedBlock }) {
  if (block.type === "outcome_grid" || block.type === "capability_grid" || block.type === "logo_grid") return <CardGrid pageId={page.id} locale={locale} block={block} />;
  if (block.type === "process_steps") return <ProcessSteps block={block} />;
  if (block.type === "timeline") return <Timeline block={block} />;
  if (block.type === "split_media") return <SplitMedia pageId={page.id} locale={locale} block={block} />;
  if (block.type === "proof_grid") return <ProofGrid pageId={page.id} block={block} locale={locale} />;
  if (block.type === "rich_text") return <RichText block={block} />;
  if (block.type === "locations") return <Locations pageId={page.id} block={block} locale={locale} />;
  if (block.type === "form") return <FormBlock page={page} block={block} />;
  if (block.type === "stats") return <Stats block={block} />;
  return null;
}

export function CuratedPageBlocks({ page, locale, content }: { page: PageRecord; locale: ContentLocale; content: CuratedPageLocale }) {
  return <>{content.blocks.map((block) => <RenderBlock page={page} locale={locale} block={block} key={block.id} />)}<Cta content={content} locale={locale} /></>;
}
