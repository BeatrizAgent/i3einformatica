import { assetPath } from "@/lib/public-path";
import Image from "next/image";
import type { Locale } from "@/lib/content/repository";

const clients = [
  {
    name: "Starbaix",
    src: assetPath("/assets/i3e/starbaix_v2.webp"),
    width: 70,
    height: 47,
    className: "logo-starbaix",
  },
  {
    name: "Telefónica",
    src: assetPath("/assets/i3e/telefonica_v2.webp"),
    width: 135,
    height: 34,
    className: "logo-telefonica",
  },
  {
    name: "Tupinamba",
    src: assetPath("/assets/i3e/tupinamba_v2.webp"),
    width: 118,
    height: 43,
    className: "logo-tupinamba",
  },
];

export function ClientStrip({ locale }: { locale: Locale }) {
  const isSpanish = locale !== "en";
  return (
    <section className="client-strip content-deferred" aria-labelledby="clients-title">
      <div className="shell client-strip-inner">
        <p id="clients-title">{isSpanish ? "Algunos de nuestros clientes" : "Some of our clients"}</p>
        <div className="client-logo-list">
          {clients.map((client) => (
            <div className={`client-logo-item ${client.className}`} key={client.name}>
              <Image
                src={client.src}
                alt={client.name}
                width={client.width}
                height={client.height}
                sizes="(max-width: 768px) 120px, 150px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

