import type { Metadata } from "next";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE, pesos, TIENDA, whatsapp } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Ayuda",
  description: "Envíos, cambios y devoluciones, guía de tallas y formas de pago.",
};

const tallas = [
  ["25", "39 MX"],
  ["25.5", "39.5 MX"],
  ["26", "40 MX"],
  ["26.5", "40.5 MX"],
  ["27", "41 MX"],
  ["27.5", "42 MX"],
  ["28", "43 MX"],
];

const temas: { id: string; titulo: string; preguntas: [string, string][] }[] = [
  {
    id: "envios",
    titulo: "Envíos",
    preguntas: [
      ["¿A dónde envían?", "A la Ciudad de México y los municipios conurbados del Estado de México. Por ahora no enviamos a otros estados."],
      ["¿Cuánto cuesta?", `${pesos.format(COSTO_ENVIO)} por pedido. Es gratis desde ${pesos.format(ENVIO_GRATIS_DESDE)} o si recoges en tienda.`],
      ["¿Cuándo llega?", "Sale en 24 a 48 horas hábiles. Te avisamos por WhatsApp con la hora aproximada."],
    ],
  },
  {
    id: "cambios",
    titulo: "Cambios y devoluciones",
    preguntas: [
      ["¿Puedo cambiar de talla?", "Sí, hasta 30 días después de recibirlo, siempre que la pieza no tenga uso y conserve la etiqueta."],
      ["¿Y si llega defectuoso?", "Mándanos fotos por WhatsApp y lo resolvemos sin costo, con reposición o reembolso."],
    ],
  },
  {
    id: "tallas",
    titulo: "Guía de tallas",
    preguntas: [],
  },
  {
    id: "pagos",
    titulo: "Formas de pago",
    preguntas: [
      ["¿Qué métodos aceptan?", "Transferencia bancaria y pago al recibir en CDMX. El pago con tarjeta en línea se activa al conectar la pasarela de pagos."],
      ["¿Emiten factura?", "Sí. Escríbenos con tu folio y tus datos fiscales dentro del mismo mes de compra."],
    ],
  },
];

export default function Ayuda() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="font-display text-6xl uppercase md:text-8xl">Ayuda</h1>
          <p className="mt-4 max-w-lg text-lg text-gris">Envíos, cambios y guía de tallas. Si no encuentras tu respuesta, escríbenos por WhatsApp.</p>
          <nav aria-label="Temas" className="mt-8 flex flex-wrap gap-2">
            {temas.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="rounded-full border border-linea px-4 py-2 text-sm font-semibold uppercase hover:border-volt">
                {t.titulo}
              </a>
            ))}
          </nav>
        </div>
        <div className="foto-viñeta relative aspect-[4/3] overflow-hidden rounded-md">
          <Image src={asset("/img/shelf-beige.jpg")} alt="Tenis exhibidos en un estante de madera" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_2fr]">
        <aside className="h-fit min-w-0 rounded-md bg-carbon p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl uppercase">Habla con nosotros</h2>
          <p className="mt-3 text-gris">
            {TIENDA.horario}
            <br />
            {TIENDA.direccion.join(", ")}
          </p>
          <a href={whatsapp("Hola Zancada, tengo una pregunta.")} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-volt px-6 py-3 font-bold uppercase text-negro">
            Escribir por WhatsApp
          </a>
        </aside>
        <div className="min-w-0 space-y-12">
          {temas.map((t) => (
            <section key={t.id} id={t.id} aria-labelledby={`${t.id}-titulo`}>
              <h2 id={`${t.id}-titulo`} className="font-display text-3xl uppercase">
                {t.titulo}
              </h2>
              {t.id === "tallas" ? (
                <div className="mt-4 overflow-x-auto rounded-md border border-linea">
                  <table className="w-full min-w-[420px] text-left">
                    <thead className="folio bg-carbon">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-normal">
                          Zancada
                        </th>
                        <th scope="col" className="px-4 py-3 font-normal">
                          Equivalente MX
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tallas.map(([z, mx]) => (
                        <tr key={z} className="border-t border-linea">
                          <td className="px-4 py-3 font-semibold">{z}</td>
                          <td className="px-4 py-3 text-gris">{mx}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="p-4 text-sm text-gris">Nuestra horma es ligeramente amplia. Si mides entre dos tallas, te recomendamos la menor.</p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-linea border-y border-linea">
                  {t.preguntas.map(([q, r]) => (
                    <details key={q} className="group py-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                        {q}
                        <span className="text-2xl leading-none text-volt transition group-open:rotate-45" aria-hidden>
                          +
                        </span>
                      </summary>
                      <p className="pb-4 text-gris">{r}</p>
                    </details>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
