"use client";

export function ReopenCookies({ label }: { label: string }) {
  const triggerReopen = () => {
    window.dispatchEvent(new CustomEvent("i3e-cookie-consent-reopen"));
  };

  return (
    <button
      type="button"
      onClick={triggerReopen}
      className="footer-reopen-cookies-btn"
    >
      {label}
    </button>
  );
}
