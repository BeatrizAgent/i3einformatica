"use client";

export function ReopenCookies({ label }: { label: string }) {
  const triggerReopen = () => {
    window.dispatchEvent(new CustomEvent("i3e-cookie-consent-reopen"));
  };

  return (
    <button
      type="button"
      onClick={triggerReopen}
      style={{
        background: "none",
        border: 0,
        padding: 0,
        color: "inherit",
        font: "inherit",
        textAlign: "left",
        cursor: "pointer"
      }}
      className="footer-reopen-cookies-btn"
    >
      {label}
    </button>
  );
}
