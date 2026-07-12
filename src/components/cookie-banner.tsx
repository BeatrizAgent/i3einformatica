"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getCookieConsent, saveCookieConsent, type CookiePreferences } from "@/lib/cookie-consent";





export function CookieBanner() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en/") || pathname === "/en";
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    personalization: false,
  });

  useEffect(() => {
    const storedConsent = getCookieConsent();
    const hasConsent = storedConsent !== null;

    const timer = setTimeout(() => {
      setMounted(true);
      if (!hasConsent) {
        setVisible(true);
      } else {
        setPrefs(storedConsent);
        saveCookieConsent(storedConsent);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
    };

    dialog.addEventListener("cancel", handleCancel);

    if (visible) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [visible]);

  useEffect(() => {
    const handleReopen = () => {
      const storedConsent = getCookieConsent();
      if (storedConsent) {
        setPrefs(storedConsent);
      }
      setShowConfig(true);
      setVisible(true);
    };
    window.addEventListener("i3e-cookie-consent-reopen", handleReopen);
    return () => window.removeEventListener("i3e-cookie-consent-reopen", handleReopen);
  }, []);

  if (!mounted) return null;

  const saveConsent = (updatedPrefs: CookiePreferences) => {
    saveCookieConsent(updatedPrefs);
    setVisible(false);
    setShowConfig(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, personalization: true };
    setPrefs(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = { necessary: true, analytics: false, personalization: false };
    setPrefs(allRejected);
    saveConsent(allRejected);
  };

  const handleSavePreferences = () => {
    saveConsent(prefs);
  };

  const t = {
    title: isEn ? "Cookie Consent" : "Control de Cookies",
    desc: isEn 
      ? "This static site stores your consent choice locally. No analytics or advertising resource loads before consent. You can accept optional categories, reject them, or customize your preferences."
      : "Este sitio estático guarda localmente tu elección de consentimiento. No carga analítica ni publicidad antes del consentimiento. Puedes aceptar categorías opcionales, rechazarlas o configurar tus preferencias.",
    acceptAll: isEn ? "Accept All" : "Aceptar todas",
    rejectAll: isEn ? "Reject All" : "Rechazar no esenciales",
    configure: isEn ? "Customize" : "Configurar",
    save: isEn ? "Save Preferences" : "Guardar preferencias",
    back: isEn ? "Back" : "Volver",
    types: {
      necessary: {
        title: isEn ? "Necessary Cookies (Required)" : "Cookies Técnicas (Obligatorias)",
        desc: isEn 
          ? "Essential for the website to function properly. Cannot be disabled."
          : "Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.",
      },
      analytics: {
        title: isEn ? "Analytics Cookies" : "Cookies de Análisis",
        desc: isEn 
          ? "Allow us to measure traffic and see how visitors interact with the site."
          : "Nos permiten medir el tráfico y conocer de forma anónima cómo interactúan los usuarios con el sitio.",
      },
      personalization: {
        title: isEn ? "Personalization Cookies" : "Cookies de Personalización",
        desc: isEn 
          ? "Remember your settings (like language choice) for future visits."
          : "Recuerdan tus preferencias de visualización (como el idioma) para futuras visitas.",
      }
    }
  };

  return (
    <dialog 
      ref={dialogRef}
      className="cookie-banner-wrapper"
      aria-labelledby="cookie-title"
    >
      <div className="cookie-banner-container">
        {!showConfig ? (
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
            <h2 id="cookie-title" className="cookie-banner-heading">{t.title}</h2>
            <p>{t.desc}</p>
            <Link href={isEn ? "/en/cookie-policy" : "/politica-de-cookies"}>{isEn ? "Read cookie policy" : "Leer política de cookies"}</Link>
            </div>
            <div className="cookie-banner-actions">
              <button onClick={handleAcceptAll} className="button">{t.acceptAll}</button>
              <button onClick={handleRejectAll} className="button button-outline">{t.rejectAll}</button>
              <button onClick={() => setShowConfig(true)} className="cookie-banner-config-btn">{t.configure}</button>
            </div>
          </div>
        ) : (
          <div className="cookie-banner-config">
            <h2 id="cookie-title" className="cookie-banner-heading">{t.title}</h2>
            <div className="cookie-banner-options">
              <div className="cookie-option-row">
                <label className="cookie-option-label">
                  <input 
                    type="checkbox" 
                    checked={prefs.necessary} 
                    disabled 
                    className="cookie-checkbox"
                  />
                  <span>{t.types.necessary.title}</span>
                </label>
                <p className="cookie-option-desc">{t.types.necessary.desc}</p>
              </div>

              <div className="cookie-option-row">
                <label className="cookie-option-label">
                  <input 
                    type="checkbox" 
                    checked={prefs.analytics} 
                    onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                    className="cookie-checkbox"
                  />
                  <span>{t.types.analytics.title}</span>
                </label>
                <p className="cookie-option-desc">{t.types.analytics.desc}</p>
              </div>

              <div className="cookie-option-row">
                <label className="cookie-option-label">
                  <input 
                    type="checkbox" 
                    checked={prefs.personalization} 
                    onChange={(e) => setPrefs({ ...prefs, personalization: e.target.checked })}
                    className="cookie-checkbox"
                  />
                  <span>{t.types.personalization.title}</span>
                </label>
                <p className="cookie-option-desc">{t.types.personalization.desc}</p>
              </div>
            </div>

            <div className="cookie-banner-actions">
              <button onClick={handleSavePreferences} className="button">{t.save}</button>
              <button onClick={() => setShowConfig(false)} className="button button-outline">{t.back}</button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .cookie-banner-wrapper {
          position: fixed;
          inset: auto 1.5rem 1.5rem auto;
          max-width: 32rem;
          margin: 0;
          padding: 0;
          background: var(--surface-lowest);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          box-shadow: 0 8px 30px rgba(11, 17, 62, 0.14);
          animation: slideUp 0.3s ease-out;
        }

        .cookie-banner-wrapper::backdrop {
          background: transparent;
        }

        @media (max-width: 640px) {
          .cookie-banner-wrapper {
            inset: auto 0 0 0;
            max-width: 100%;
            border-radius: 0;
            border-width: 1px 0 0 0;
          }
        }

        .cookie-banner-container {
          padding: 1.5rem;
        }

        .cookie-banner-heading {
          font-family: var(--font-geist-sans), Arial, sans-serif;
          color: var(--nav-dark);
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .cookie-banner-text p {
          font-family: var(--font-inter), Inter, Arial, sans-serif;
          font-size: 0.875rem;
          color: var(--body-text);
          margin: 0 0 1.25rem 0;
          line-height: 1.5;
        }

        .cookie-banner-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
        }

        .button-outline {
          background: transparent;
          border: 1px solid var(--outline);
          color: var(--nav-dark);
        }

        .button-outline:hover {
          background: var(--surface-low);
        }

        .cookie-banner-config-btn {
          background: transparent;
          border: 0;
          font-family: var(--font-geist-sans), Arial, sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--secondary);
          text-decoration: underline;
          cursor: pointer;
          padding: 0.5rem;
          margin-left: auto;
        }

        .cookie-banner-config-btn:hover {
          color: var(--nav-dark);
        }

        .cookie-banner-options {
          display: grid;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          margin-top: 1rem;
        }

        .cookie-option-row {
          display: grid;
          gap: 0.25rem;
        }

        .cookie-option-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-geist-sans), Arial, sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--nav-dark);
          cursor: pointer;
        }

        .cookie-checkbox {
          width: 1.1rem;
          height: 1.1rem;
          accent-color: var(--action-blue);
          cursor: pointer;
        }

        .cookie-option-desc {
          margin: 0;
          font-family: var(--font-inter), Inter, Arial, sans-serif;
          font-size: 0.8rem;
          color: var(--muted);
          padding-left: 1.6rem;
          line-height: 1.4;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cookie-banner-wrapper {
            animation: none;
          }
        }
      `}</style>
    </dialog>
  );
}
