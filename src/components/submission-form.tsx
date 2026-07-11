"use client";

import { useRef, useState, type FormEvent } from "react";
import type { PublishedLocale } from "@/lib/content/repository";

type Kind = "contact" | "jobs" | "complaint";

export function SubmissionForm({ kind, locale }: { kind: Kind; locale: PublishedLocale }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [reference, setReference] = useState<string>();
  const submissionToken = useRef<string | null>(null);
  const es = locale === "es";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setReference(undefined);
    const form = event.currentTarget;
    submissionToken.current ??= crypto.randomUUID();
    const data = new FormData(form);
    data.set("submissionToken", submissionToken.current);
    try {
      const response = await fetch(`/api/forms/${kind}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const result = (await response.json().catch(() => ({}))) as { reference?: string };
      setState(response.ok ? "success" : "error");
      if (response.ok) {
        setReference(result.reference);
        submissionToken.current = null;
        form.reset();
      }
    } catch {
      setState("error");
    }
  }

  return (
    <form className="form-card" onSubmit={submit} encType="multipart/form-data" aria-busy={state === "sending"}>
      <input type="hidden" name="locale" value={locale} />
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      {kind === "complaint" ? (
        <>
          <fieldset aria-describedby="reportType-error">
            <legend>{es ? "¿Qué necesitas reportar?" : "What do you need to report?"}</legend>
            <label className="check">
              <input id="reportType-irregularity" type="radio" name="reportType" value="irregularity" required />
              {es ? "Irregularidad" : "Irregularity"}
            </label>
            <label className="check">
              <input id="reportType-complaint" type="radio" name="reportType" value="complaint" required />
              {es ? "Denuncia" : "Complaint"}
            </label>
            <span id="reportType-error" className="field-error" role="alert">
              {es ? "Selecciona el tipo de reporte." : "Please select a report type."}
            </span>
          </fieldset>
          <label htmlFor="queryType">
            {es ? "Tipo de consulta" : "Type of report"}
            <select id="queryType" name="queryType" required defaultValue="" aria-errormessage="queryType-error">
              <option value="" disabled>{es ? "Selecciona una opción" : "Select an option"}</option>
              <option value="unregistered-worker">{es ? "Trabajador no dado de alta" : "Unregistered worker"}</option>
              <option value="unpaid-overtime">{es ? "Horas extras sin remunerar" : "Unpaid overtime"}</option>
              <option value="workplace-harassment">{es ? "Acoso laboral" : "Workplace harassment"}</option>
              <option value="sexual-harassment">{es ? "Acoso sexual" : "Sexual harassment"}</option>
              <option value="false-self-employment">{es ? "Falsos autónomos" : "False self-employment"}</option>
              <option value="other">{es ? "Otros" : "Other"}</option>
            </select>
            <span id="queryType-error" className="field-error" role="alert">
              {es ? "Selecciona una opción." : "Please select an option."}
            </span>
          </label>
          <label htmlFor="complaintMessage">
            {es ? "Observaciones" : "Details"}
            <textarea id="complaintMessage" name="message" required minLength={20} maxLength={5000} rows={7} aria-errormessage="complaintMessage-error" />
            <span id="complaintMessage-error" className="field-error" role="alert">
              {es ? "Describe los detalles (mín. 20 caracteres)." : "Please provide details (min. 20 characters)."}
            </span>
          </label>
        </>
      ) : (
        <>
          <div className="field-row">
            <label htmlFor="name">
              {es ? "Nombre" : "Name"}
              <input id="name" name="name" autoComplete="given-name" required maxLength={100} aria-errormessage="name-error" />
              <span id="name-error" className="field-error" role="alert">
                {es ? "Introduce tu nombre." : "Please enter your name."}
              </span>
            </label>
            {kind === "jobs" && (
              <label htmlFor="surname">
                {es ? "Apellidos" : "Surname"}
                <input id="surname" name="surname" autoComplete="family-name" required maxLength={120} aria-errormessage="surname-error" />
                <span id="surname-error" className="field-error" role="alert">
                  {es ? "Introduce tus apellidos." : "Please enter your surname."}
                </span>
              </label>
            )}
          </div>
          <label htmlFor="email">
            {es ? "Correo electrónico" : "Email"}
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} aria-errormessage="email-error" />
            <span id="email-error" className="field-error" role="alert">
              {es ? "Introduce un correo electrónico válido." : "Please enter a valid email address."}
            </span>
          </label>
          {kind === "jobs" && (
            <label htmlFor="identity">
              {es ? "DNI/NIF/NIE" : "Identity document"}
              <input id="identity" name="identity" autoComplete="off" required minLength={5} maxLength={24} aria-errormessage="identity-error" />
              <span id="identity-error" className="field-error" role="alert">
                {es ? "Introduce un documento de identidad válido." : "Please enter a valid identity document."}
              </span>
            </label>
          )}
          <label htmlFor="phone">
            {es ? "Teléfono" : "Phone"}
            <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} aria-errormessage="phone-error" />
            <span id="phone-error" className="field-error" role="alert">
              {es ? "Introduce un teléfono válido." : "Please enter a valid phone number."}
            </span>
          </label>
          <label htmlFor="message">
            {kind === "jobs" ? (es ? "Tu mensaje" : "Your message") : (es ? "¿Cómo podemos ayudarte?" : "How can we help?")}
            <textarea id="message" name="message" required minLength={20} maxLength={5000} rows={6} aria-errormessage="message-error" />
            <span id="message-error" className="field-error" role="alert">
              {es ? "Escribe un mensaje (mín. 20 caracteres)." : "Please write a message (min. 20 characters)."}
            </span>
          </label>
        </>
      )}

      {kind !== "contact" && (
        <label htmlFor="attachment">
          {kind === "jobs" ? (es ? "Adjuntar CV (PDF, máx. 5 MB)" : "Attach CV (PDF, max. 5 MB)") : (es ? "Adjuntar archivo (PDF, máx. 5 MB)" : "Attach file (PDF, max. 5 MB)")}
          <input id="attachment" name="attachment" type="file" accept="application/pdf,.pdf" required={kind === "jobs"} aria-errormessage="attachment-error" />
          <span id="attachment-error" className="field-error" role="alert">
            {es ? "Adjunta un archivo PDF válido." : "Please attach a valid PDF file."}
          </span>
        </label>
      )}
      <label className="check" htmlFor="consent">
        <input id="consent" name="consent" type="checkbox" value="true" required aria-errormessage="consent-error" />
        <span>{es ? "He leído la política de privacidad y acepto el tratamiento de mis datos." : "I have read the privacy policy and consent to the processing of my data."}</span>
        <span id="consent-error" className="field-error" role="alert">
          {es ? "Debes aceptar la política de privacidad." : "You must accept the privacy policy."}
        </span>
      </label>
      <button className="button" type="submit" disabled={state === "sending"}>{state === "sending" ? (es ? "Enviando…" : "Sending…") : (es ? "Enviar" : "Submit")}</button>
      <div className="form-status" data-state={state} role={state === "error" ? "alert" : "status"} aria-live="polite">
        {state === "success" && (es ? "Solicitud recibida." : "Request received.")}
        {state === "success" && reference && <strong>{es ? ` Código de seguimiento: ${reference}` : ` Tracking code: ${reference}`}</strong>}
        {state === "error" && (es ? "No se pudo enviar. Revisa los campos o inténtalo más tarde." : "Could not submit. Check the fields or try again later.")}
      </div>
    </form>
  );
}
