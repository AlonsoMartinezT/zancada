"use client";

import Link from "next/link";
import Icono from "@/components/Icono";
import { pesos, whatsapp } from "@/lib/formato";
import { productoPorSlug } from "@/data/productos";
import { useTienda } from "@/lib/tienda";

const fecha = new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short" });

export default function Pedido() {
  const { pedido } = useTienda();

  if (!pedido)
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-5xl uppercase">Sin pedidos recientes</h1>
        <p className="mt-3 text-gris">Cuando confirmes una compra, aquí verás su resumen.</p>
        <Link href="/tienda" className="mt-8 inline-block rounded-full bg-volt px-7 py-4 font-bold uppercase text-negro">
          Ir al catálogo
        </Link>
      </div>
    );

  const mensaje = [
    `Hola Zancada, confirmo mi pedido ${pedido.folio}.`,
    ...pedido.lineas.map((l) => {
      const p = productoPorSlug(l.slug);
      const talla = p?.tallas.find((t) => t.id === l.talla)?.etiqueta ?? l.talla;
      return `• ${l.cantidad} × ${l.nombre} (talla ${talla})`;
    }),
    `Total: ${pesos.format(pedido.total)} · ${pedido.pago}`,
    pedido.entrega === "domicilio" ? `Entrega en: ${pedido.cliente.direccion}` : "Recojo en tienda",
  ].join("\n");

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-volt text-negro">
          <Icono nombre="check" className="h-8 w-8" />
        </span>
        <p className="folio mt-6 text-volt">Pedido {pedido.folio}</p>
        <h1 className="mt-2 font-display text-5xl uppercase md:text-6xl">¡Gracias, {pedido.cliente.nombre.split(" ")[0]}!</h1>
        <p className="mt-3 text-gris">
          Recibimos tu pedido el {fecha.format(new Date(pedido.fecha))}. Enviamos la confirmación a <strong className="text-hueso">{pedido.cliente.correo}</strong>.
        </p>
        <p className="mt-2 text-sm text-gris">(Es una demo: no se envió ningún correo ni se hizo ningún cobro.)</p>
      </div>

      <ol className="mt-12 grid gap-3 sm:grid-cols-3">
        {[
          ["Confirmado", "Ya apartamos tus piezas.", true],
          [pedido.entrega === "domicilio" ? "Preparando envío" : "Preparando para recoger", "Revisamos cada pieza antes de empacar.", false],
          [pedido.entrega === "domicilio" ? "En camino" : "Lista en tienda", "Te avisamos por WhatsApp.", false],
        ].map(([t, d, hecho], i) => (
          <li key={String(t)} className={`rounded-md p-5 ${hecho ? "bg-volt text-negro" : "bg-carbon"}`}>
            <span className="folio opacity-80">Paso {i + 1}</span>
            <p className="font-display text-xl uppercase">{t}</p>
            <p className="mt-1 text-sm opacity-80">{d}</p>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-md bg-carbon p-6">
        <h2 className="font-display text-2xl uppercase">Resumen</h2>
        <ul className="mt-4 divide-y divide-linea">
          {pedido.lineas.map((l) => {
            const p = productoPorSlug(l.slug);
            const talla = p?.tallas.find((t) => t.id === l.talla)?.etiqueta ?? l.talla;
            return (
              <li key={l.slug + l.color + l.talla} className="flex justify-between gap-4 py-3">
                <span>
                  {l.cantidad} × {l.nombre} <span className="text-gris">· Talla {talla}</span>
                </span>
                <span className="tabular-nums">{pesos.format(l.precio * l.cantidad)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-linea pt-3 text-sm">
          {pedido.descuento > 0 && (
            <div className="flex justify-between text-volt">
              <dt>Descuento</dt>
              <dd>−{pesos.format(pedido.descuento)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Envío</dt>
            <dd>{pedido.envio ? pesos.format(pedido.envio) : "Gratis"}</dd>
          </div>
          <div className="flex justify-between pt-2 text-lg font-semibold">
            <dt>Total</dt>
            <dd>{pesos.format(pedido.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 grid gap-4 border-t border-linea pt-6 text-sm sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">Entrega</h3>
            <p className="text-gris">{pedido.entrega === "domicilio" ? pedido.cliente.direccion : "Recoger en tienda, Roma Norte"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Pago</h3>
            <p className="text-gris">{pedido.pago}</p>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={whatsapp(mensaje)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-volt px-7 py-4 font-bold uppercase text-negro">
          <Icono nombre="chat" /> Enviar resumen por WhatsApp
        </a>
        <Link href="/tienda" className="inline-flex items-center gap-2 rounded-full border border-hueso/25 px-7 py-4 font-bold uppercase">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
