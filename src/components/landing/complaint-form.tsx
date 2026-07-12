"use client";

import { useRef, useState, type FormEvent } from "react";

import type { ContentLocale } from "@/lib/page-content";

const endpoint = process.env.NEXT_PUBLIC_COMPLAINTS_ENDPOINT ?? "";
const maxFileSizeMb = Number(process.env.NEXT_PUBLIC_COMPLAINTS_MAX_FILE_MB ?? "10");
const maxFiles = Number(process.env.NEXT_PUBLIC_COMPLAINTS_MAX_FILES ?? "5");
const maxFileSize = maxFileSizeMb * 1024 * 1024;

const copy = {
  es: {
    reportLegend: "\u00bfQu\u00e9 necesitas reportar?",
    reportOptions: { irregularidad: "Irregularidad", denuncia: "Denuncia" },
    typeLegend: "Tipo de consulta",
    types: [
      ["alta-seguridad-social", "No dar de alta en la Seguridad Social a un trabajador"],
      ["horas-extra", "Hacer horas extra sin remunerar"],
      ["acoso-laboral", "Acoso laboral"],
      ["acoso-sexual", "Acoso sexual"],
      ["falsos-autonomos", "Existencia de falsos aut\u00f3nomos en la empresa"],
      ["otros", "Otros"],
    ],
    observations: "Observaciones",
    observationsPlaceholder: "Escribe aqu\u00ed tus observaciones si las tienes",
    files: "Adjuntar archivos",
    chooseFiles: "Seleccionar archivos",
    noFiles: "Ning\u00fan archivo seleccionado",
    fileHelp: `PDF, DOC, DOCX, JPG, PNG o TXT. Hasta ${maxFiles} archivos de ${maxFileSizeMb} MB cada uno.`,
    privacy: "He le\u00eddo y acepto la pol\u00edtica de privacidad.",
    privacyLink: "/politica-de-privacidad",
    submit: "Enviar denuncia",
    sending: "Enviando...",
    notConfigured: "Formulario preparado. Falta configurar el endpoint seguro antes de activar el env\u00edo.",
    validation: "Revisa los campos obligatorios y el tama\u00f1o de los archivos.",
    fileTooLarge: (name: string) => `${name} supera el l\u00edmite de ${maxFileSizeMb} MB.`,
    tooManyFiles: `Puedes adjuntar un m\u00e1ximo de ${maxFiles} archivos.`,
    networkError: "No se ha podido enviar la denuncia. Int\u00e9ntalo de nuevo m\u00e1s tarde.",
    success: "La comunicaci\u00f3n se ha enviado correctamente.",
    reference: "Referencia",
  },
  en: {
    reportLegend: "What do you need to report?",
    reportOptions: { irregularidad: "Irregularity", denuncia: "Report" },
    typeLegend: "Type of concern",
    types: [
      ["alta-seguridad-social", "A worker not registered with Social Security"],
      ["horas-extra", "Unpaid overtime"],
      ["acoso-laboral", "Workplace harassment"],
      ["acoso-sexual", "Sexual harassment"],
      ["falsos-autonomos", "False self-employment in the company"],
      ["otros", "Other"],
    ],
    observations: "Comments",
    observationsPlaceholder: "Add any comments you would like to share",
    files: "Attach files",
    chooseFiles: "Choose files",
    noFiles: "No file selected",
    fileHelp: `PDF, DOC, DOCX, JPG, PNG or TXT. Up to ${maxFiles} files of ${maxFileSizeMb} MB each.`,
    privacy: "I have read and accept the privacy policy.",
    privacyLink: "/en/privacy-policy",
    submit: "Send report",
    sending: "Sending...",
    notConfigured: "Form ready. A secure endpoint must be configured before submissions are enabled.",
    validation: "Review the required fields and file sizes.",
    fileTooLarge: (name: string) => `${name} exceeds the ${maxFileSizeMb} MB limit.`,
    tooManyFiles: `You can attach up to ${maxFiles} files.`,
    networkError: "The report could not be sent. Please try again later.",
    success: "Your communication was sent successfully.",
    reference: "Reference",
  },
} as const;

type Status = { state: "idle" | "info" | "error" | "success"; message: string; reference?: string };

export function ComplaintForm({ locale }: { locale: ContentLocale }) {
  const text = copy[locale];
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>({ state: endpoint ? "idle" : "info", message: endpoint ? "" : text.notConfigured });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFiles(files: FileList | null) {
    const nextFiles = Array.from(files ?? []);
    if (nextFiles.length > maxFiles) {
      setStatus({ state: "error", message: text.tooManyFiles });
      return;
    }
    const invalidFile = nextFiles.find((file) => file.size > maxFileSize);
    if (invalidFile) {
      setStatus({ state: "error", message: text.fileTooLarge(invalidFile.name) });
      return;
    }
    setSelectedFiles(nextFiles.map((file) => file.name));
    setStatus({ state: endpoint ? "idle" : "info", message: endpoint ? "" : text.notConfigured });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!endpoint) {
      setStatus({ state: "info", message: text.notConfigured });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    if (files.length > maxFiles || files.some((file) => file.size > maxFileSize)) {
      setStatus({ state: "error", message: text.validation });
      return;
    }

    setIsSubmitting(true);
    setStatus({ state: "info", message: text.sending });
    try {
      formData.set("locale", locale);
      formData.set("source", "i3einformatica-complaints");
      const response = await fetch(endpoint, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      const raw = await response.text();
      let payload: { message?: string; reference?: string } = {};
      try { payload = raw ? JSON.parse(raw) as { message?: string; reference?: string } : {}; } catch { /* The endpoint may return an empty 2xx response. */ }
      if (!response.ok) throw new Error(payload.message || text.networkError);
      form.reset();
      setSelectedFiles([]);
      setStatus({ state: "success", message: payload.message || text.success, reference: payload.reference });
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : text.networkError });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={formRef} className="complaints-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <fieldset>
        <legend>{text.reportLegend}</legend>
        <div className="complaints-radio-list complaints-radio-list-inline">
          {(Object.entries(text.reportOptions) as Array<["irregularidad" | "denuncia", string]>).map(([value, label]) => (
            <label className="complaints-radio" key={value}>
              <input type="radio" name="reportType" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{text.typeLegend}</legend>
        <div className="complaints-radio-list">
          {text.types.map(([value, label]) => (
            <label className="complaints-radio" key={value}>
              <input type="radio" name="consultationType" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="complaints-field">
        <span>{text.observations}</span>
        <textarea name="observations" rows={5} placeholder={text.observationsPlaceholder} />
      </label>

      <label className="complaints-field">
        <span>{text.files}</span>
        <input name="files" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt" onChange={(event) => handleFiles(event.target.files)} />
        <small>{selectedFiles.length ? selectedFiles.join(", ") : text.noFiles}</small>
        <small>{text.fileHelp}</small>
      </label>

      <label className="complaints-consent">
        <input name="privacyAccepted" type="checkbox" value="true" required />
        <span>{text.privacy} <a href={text.privacyLink}>{locale === "es" ? "Leer política" : "Read policy"}</a></span>
      </label>

      <div className="complaints-form-actions">
        <button className="button" type="submit" disabled={isSubmitting || !endpoint}>{isSubmitting ? text.sending : text.submit}</button>
        <p className="complaints-form-status" data-state={status.state} role={status.state === "error" ? "alert" : "status"} aria-live="polite">
          {status.message}{status.reference ? ` ${text.reference}: ${status.reference}` : ""}
        </p>
      </div>
    </form>
  );
}
