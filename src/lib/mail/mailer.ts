import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | undefined;

function getTransporter() {
  const smtpUrl = process.env.SMTP_URL;
  if (!smtpUrl) throw new Error("SMTP_URL is required for notifications");
  transporter ??= nodemailer.createTransport(smtpUrl);
  return transporter;
}

export async function sendSubmissionNotification(input: {
  subject: string;
  summary: string;
  adminPath: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM ?? "web@i3einformatica.com",
    to: process.env.MAIL_TO ?? "info@i3einformatica.com",
    subject: input.subject,
    text: `${input.summary}\n\nGestionar: ${new URL(input.adminPath, siteUrl)}`,
  });
}
