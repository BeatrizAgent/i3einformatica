import type { PublishedLocale } from "@/lib/content/repository";

const copy = {
  contact: {
    es: { title: "Contacto directo", text: "Esta versión estática no guarda formularios. Escríbenos por correo y responderemos a tu solicitud.", subject: "Consulta desde la web", action: "Enviar consulta" },
    en: { title: "Direct contact", text: "This static version does not store forms. Email us and we will respond to your request.", subject: "Website enquiry", action: "Send enquiry" },
  },
  jobs: {
    es: { title: "Únete al equipo", text: "La versión estática no procesa candidaturas. Envía tu CV y tus datos por correo.", subject: "Candidatura profesional", action: "Enviar candidatura" },
    en: { title: "Join the team", text: "The static version does not process applications. Email your CV and details.", subject: "Job application", action: "Send application" },
  },
  complaint: {
    es: { title: "Canal de comunicación", text: "La versión estática no almacena denuncias. Para una comunicación confidencial, escribe al canal corporativo.", subject: "Comunicación confidencial", action: "Abrir correo confidencial" },
    en: { title: "Reporting channel", text: "The static version does not store reports. For a confidential report, email the corporate channel.", subject: "Confidential report", action: "Open confidential email" },
  },
} as const;

export function SubmissionForm({ kind, locale }: { kind: "contact" | "jobs" | "complaint"; locale: PublishedLocale }) {
  const text = copy[kind][locale];
  return <div className="form-card static-form-notice">
    <p className="eyebrow">{text.title}</p>
    <p>{text.text}</p>
    <a className="button" href={`mailto:info@i3einformatica.com?subject=${encodeURIComponent(text.subject)}`}>{text.action}</a>
  </div>;
}
