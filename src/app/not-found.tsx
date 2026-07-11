import Link from "next/link";
import { Logo } from "@/components/site-shell";

export default function NotFound() {
  return <main className="not-found"><Link href="/"><Logo /></Link><p className="eyebrow">Error 404</p><h1>Página no encontrada</h1><p>La dirección puede haber cambiado o no estar publicada todavía.</p><Link className="button" href="/">Volver al inicio</Link></main>;
}

