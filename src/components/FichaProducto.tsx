"use client";

import Image from "next/image";
import { useState } from "react";
import { ViewTransition } from "react";
import Icono from "./Icono";
import PanelCompra from "./PanelCompra";
import { hayStock, type Producto } from "@/data/productos";
import { asset } from "@/lib/asset";

export default function FichaProducto({ p }: { p: Producto }) {
  const [foto, setFoto] = useState(p.colores[0].foto);

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div className="relative aspect-square overflow-hidden rounded-md bg-carbon lg:sticky lg:top-28 lg:self-start">
        <ViewTransition name={`prod-${p.slug}`} share="pieza" default="none">
          <div className={`foto-viñeta absolute inset-0 ${hayStock(p) ? "" : "opacity-50 grayscale"}`}>
            <Image src={asset(`/img/${foto}.jpg`)} alt={p.nombre} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition-opacity duration-300" />
          </div>
        </ViewTransition>
        {p.etiqueta && <span className="absolute left-5 top-5 rounded-sm bg-volt px-3 py-1.5 text-sm font-bold uppercase text-negro">{p.etiqueta}</span>}
      </div>

      <div>
        <p className="folio">{p.drop}</p>
        <h1 className="mt-1 font-display text-6xl uppercase leading-none md:text-7xl">{p.nombre}</h1>
        <p className="mt-4 text-lg text-gris">{p.resumen}</p>

        <div className="mt-8 border-t border-linea pt-8">
          <PanelCompra p={p} onColor={setFoto} />
        </div>

        <section className="mt-10">
          <h2 className="folio mb-3">Materiales</h2>
          <ul className="flex flex-wrap gap-2">
            {p.materiales.map((m) => (
              <li key={m} className="rounded-full border border-linea px-3 py-1.5 text-sm">
                {m}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 space-y-3">
          <details className="group border-b border-linea pb-3" open>
            <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-semibold uppercase [&::-webkit-details-marker]:hidden">
              Descripción <Icono nombre="mas" className="h-4 w-4 transition group-open:rotate-45" />
            </summary>
            <p className="text-gris">{p.descripcion}</p>
          </details>
          <details className="group border-b border-linea pb-3">
            <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-semibold uppercase [&::-webkit-details-marker]:hidden">
              Envío y devoluciones <Icono nombre="mas" className="h-4 w-4 transition group-open:rotate-45" />
            </summary>
            <p className="text-gris">
              Sale en 24–48 horas. CDMX y área metropolitana. 30 días para cambio de talla o devolución, la pieza debe venir sin uso y con etiqueta.
            </p>
          </details>
        </section>
      </div>
    </div>
  );
}
