import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { faviconAsset } from "@/lib/site-assets";
import { publicUrl } from "@/lib/public-path";

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
  metadataBase: new URL(publicUrl("/")),
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
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${titleFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang=location.pathname.startsWith('/en/')?'en':'es'" }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
