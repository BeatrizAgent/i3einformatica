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
    es: { title: "Canal temporal sin recogida de datos", text: "Este sitio estático no tiene un endpoint aprobado ni almacena denuncias. No introduzcas información sensible ni adjuntos aquí y no se garantiza el anonimato por correo. Mientras se aprueba el canal, puedes dirigir una comunicación por escrito al domicilio social de I3E IT RESOURCES SL: C/ Ríos Rosas, 46, 28003 Madrid.", subject: "", action: "" },
    en: { title: "Temporary channel without data collection", text: "This static site has no approved endpoint and does not store reports. Do not enter sensitive information or attachments here, and anonymity by email is not guaranteed. Until an approved channel exists, you may send a written communication to I3E IT RESOURCES SL's registered office: Calle de Ríos Rosas, 46, 28003 Madrid, Spain.", subject: "", action: "" },
  },
} as const;

export function SubmissionForm({ kind, locale }: { kind: "contact" | "jobs" | "complaint"; locale: PublishedLocale }) {
  const text = copy[kind][locale];
  return <div className="form-card static-form-notice">
    <p className="eyebrow">{text.title}</p>
    <p>{text.text}</p>
    {kind !== "complaint" && <a className="button" href={`mailto:info@i3einformatica.com?subject=${encodeURIComponent(text.subject)}`}>{text.action}</a>}
  </div>;
}
