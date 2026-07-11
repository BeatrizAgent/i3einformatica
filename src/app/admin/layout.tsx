import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/site-shell";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Administración", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) return <main className="admin-login"><Logo /><p className="eyebrow">Área privada</p><h1>Panel editorial</h1><p>Inicia sesión con tu cuenta corporativa para administrar el contenido.</p><Link className="button" href="/api/auth/login?returnTo=/admin">Iniciar sesión</Link><Link href="/">Volver al sitio</Link></main>;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin"><Logo /></Link><nav aria-label="Administración"><Link href="/admin" aria-current="page">Contenido</Link><span aria-disabled="true">Glosario</span><span aria-disabled="true">Trabajos</span><span aria-disabled="true">Formularios</span></nav><div className="admin-user"><strong>{user.displayName ?? user.email}</strong><small>{user.role}</small><form action="/api/auth/logout" method="post"><button type="submit">Cerrar sesión</button></form></div><Link href="/" className="admin-back">← Ver sitio</Link></aside><main className="admin-main">{children}</main></div>;
}
