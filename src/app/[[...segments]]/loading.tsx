export default function PublicPageLoading() {
  return (
    <main className="page-loading" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando página</span>
      <div className="page-loading-hero">
        <div className="page-loading-shell">
          <div className="page-loading-line page-loading-line--label" />
          <div className="page-loading-line page-loading-line--title" />
          <div className="page-loading-line page-loading-line--title-short" />
          <div className="page-loading-line page-loading-line--body" />
          <div className="page-loading-line page-loading-line--button" />
        </div>
      </div>
      <div className="page-loading-shell page-loading-grid" aria-hidden="true">
        <div className="page-loading-card" />
        <div className="page-loading-card" />
        <div className="page-loading-card" />
      </div>
    </main>
  );
}
