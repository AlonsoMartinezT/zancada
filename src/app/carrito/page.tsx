"use client";

import Image from "next/image";
import Link from "next/link";
import { BarraEnvio, Cantidad } from "@/components/CarritoCajon";
import Icono from "@/components/Icono";
import Resumen, { Cupon } from "@/components/Resumen";
import { asset } from "@/lib/asset";
import { pesos } from "@/lib/formato";
import { cambiarCantidad, quitar, totales, useTienda } from "@/lib/tienda";

export default function Carrito() {
  const { carrito, cupon } = useTienda();
  const t = totales(carrito, cupon);

  if (t.lineas.length === 0)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
        <Icono nombre="bolsa" className="h-14 w-14 text-gris" />
        <h1 className="mt-6 font-display text-5xl uppercase">Tu carrito está vacío</h1>
        <p className="mt-3 text-gris">Los básicos: Lowcourt blanco y el Runner 01 Fog casi nunca fallan.</p>
        <Link href="/tienda" className="mt-8 rounded-full bg-volt px-7 py-4 font-bold uppercase text-negro">
          Ir al catálogo
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="font-display text-5xl uppercase md:text-6xl">Tu carrito</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="rounded-md bg-carbon p-5">
            <BarraEnvio falta={t.faltaParaGratis} subtotal={t.subtotal} />
          </div>
          <ul className="mt-4 divide-y divide-linea border-y border-linea">
            {t.lineas.map((l) => (
              <li key={l.slug + l.color + l.talla} className="flex gap-5 py-6">
                <Link href={`/producto/${l.slug}`} className="foto-viñeta relative h-32 w-26 shrink-0 overflow-hidden rounded-md bg-carbon">
                  <Image src={asset(`/img/${l.colorInfo.foto}.jpg`)} alt="" fill sizes="104px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <Link href={`/producto/${l.slug}`} className="font-display text-2xl uppercase hover:text-volt">
                        {l.producto.nombre}
                      </Link>
                      <p className="folio">
                        {l.colorInfo.nombre} · Talla {l.t.etiqueta}
                      </p>
                    </div>
                    <p className="font-semibold tabular-nums">{pesos.format(l.importe)}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <Cantidad valor={l.cantidad} max={l.t.stock} etiqueta={l.producto.nombre} onCambio={(n) => cambiarCantidad(l.slug, l.color, l.talla, n)} />
                    {l.cantidad >= l.t.stock && <span className="text-sm text-rojo">Máximo disponible</span>}
                    <button type="button" onClick={() => quitar(l.slug, l.color, l.talla)} className="flex items-center gap-1 text-sm text-gris hover:text-rojo">
                      <Icono nombre="basura" className="h-4 w-4" /> Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit space-y-5 rounded-md bg-carbon p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl uppercase">Resumen</h2>
          <Cupon actual={cupon} />
          <Resumen t={t} conFotos={false} />
          <Link href="/checkout" className="flex items-center justify-center gap-2 rounded-full bg-volt py-4 font-bold uppercase text-negro hover:bg-hueso">
            Continuar al pago <Icono nombre="flecha" className="h-4 w-4" />
          </Link>
          <Link href="/tienda" className="block text-center text-sm font-semibold underline underline-offset-4">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
