import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/content/repository";
import { assetPath } from "@/lib/public-path";

const rightArrow = String.fromCharCode(0x2192);

export function TeamCta({ locale }: { locale: Locale }) {
  const isSpanish = locale !== "en";
  const content = isSpanish
    ? { title: "\u00bfQuieres unirte al equipo?", text: "Buscamos personas que disfruten resolviendo problemas, trabajando en equipo y aportando valor. Si quieres crecer profesionalmente en un entorno amigable y cercano, este es tu lugar.", label: "M\u00e1s informaci\u00f3n", href: "/unete-al-equipo" }
    : { title: "Would you like to join our team?", text: "We are looking for people who enjoy solving problems, working as a team and creating value. If you want to grow professionally in a friendly, supportive environment, this is your place.", label: "Learn more", href: "/en/join-the-team" };

  return (
    <section className="team-cta content-deferred-lg" aria-labelledby="team-cta-title">
      <Image src={assetPath("/assets/i3e/10.webp")} alt="Equipo reunido en una oficina" fill sizes="100vw" />
      <div className="team-cta-overlay" aria-hidden="true" />
      <div className="shell team-cta-content">
        <p className="eyebrow">{isSpanish ? "Equipo i3e" : "i3e team"}</p>
        <h2 id="team-cta-title">{content.title}</h2>
        <p>{content.text}</p>
        <Link className="button button-light" href={content.href}>{content.label} <span aria-hidden="true">{rightArrow}</span></Link>
      </div>
    </section>
  );
}
