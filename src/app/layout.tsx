import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";
import { faviconAsset } from "@/lib/site-assets";

const titleFont = localFont({
  src: "./fonts/space-grotesk-variable.ttf",
  variable: "--font-title",
  display: "swap",
  weight: "300 700",
});

const bodyFont = localFont({
  src: "./fonts/manrope-variable.ttf",
  variable: "--font-body",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.i3einformatica.com"),
  title: { default: "i3e Informática", template: "%s | i3e Informática" },
  description: "Consultoría, ciberseguridad, cloud e infraestructuras para empresas.",
  applicationName: "i3e Informática",
  icons: { icon: faviconAsset, apple: faviconAsset },
  robots: { index: true, follow: true },
};

import { CookieBanner } from "@/components/cookie-banner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-i3e-locale") ?? "es";
  return (
    <html
      lang={locale}
      className={`${titleFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
