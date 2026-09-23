"use client";

import { useState } from "react";
import BotonFavorito from "./BotonFavorito";
import { Cantidad } from "./CarritoCajon";
import Icono from "./Icono";
import type { Producto } from "@/data/productos";
import { pesos, whatsapp } from "@/lib/formato";
import { abrirCarrito, agregar, useTienda } from "@/lib/tienda";

export default function PanelCompra({ p, onColor }: { p: Producto; onColor: (foto: string) => void }) {
  const [colorId, setColorId] = useState(p.colores[0].id);
  const primeraConStock = p.tallas.find((t) => t.stock > 0) ?? p.tallas[0];
  const [tallaId, setTallaId] = useState(primeraConStock.id);
  const [cantidad, setCantidad] = useState(1);
  const { carrito } = useTienda();

  const color = p.colores.find((c) => c.id === colorId)!;
  const talla = p.tallas.find((t) => t.id === tallaId)!;
  const enCarrito = carrito.find((l) => l.slug === p.slug && l.color === colorId && l.talla === tallaId)?.cantidad ?? 0;
  const disponibles = Math.max(0, talla.stock - enCarrito);
  const agotada = talla.stock === 0;
  const unicaTalla = p.tallas.length === 1;

  function comprar() {
    agregar(p.slug, colorId, tallaId, cantidad);
    setCantidad(1);
    abrirCarrito();
  }

  return (
    <div>
      <p className="flex items-baseline gap-3">
        <span className="font-display text-4xl tabular-nums text-volt">{pesos.format(p.precio)}</span>
        {p.precioAntes && <s className="text-lg text-gris">{pesos.format(p.precioAntes)}</s>}
      </p>
      <p className="folio mt-1">IVA incluido · envío calculado al pagar</p>

      {p.colores.length > 1 && (
        <fieldset className="mt-8">
          <legend className="folio mb-3">Color · {color.nombre}</legend>
          <div className="flex gap-2">
            {p.colores.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setColorId(c.id);
                  onColor(c.foto);
                }}
                aria-pressed={colorId === c.id}
                aria-label={c.nombre}
                className="h-11 w-11 rounded-full border-2 transition aria-pressed:border-volt"
                style={{ borderColor: colorId === c.id ? undefined : "var(--color-linea)" }}
              >
                <span className="block h-full w-full rounded-full border border-negro/20" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {!unicaTalla && (
        <fieldset className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <legend className="folio">Talla</legend>
            <a href="/ayuda#tallas" className="text-xs font-semibold text-volt underline underline-offset-4">
              Guía de tallas
            </a>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {p.tallas.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={t.stock === 0}
                onClick={() => {
                  setTallaId(t.id);
                  setCantidad(1);
                }}
                aria-pressed={tallaId === t.id}
                className="relative rounded-md border border-linea py-2.5 text-sm font-semibold transition aria-pressed:border-volt aria-pressed:bg-volt aria-pressed:text-negro disabled:cursor-not-allowed disabled:opacity-30"
              >
                {t.etiqueta}
                {t.stock === 0 && <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-gris" aria-hidden />}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {unicaTalla && <p className="mt-6 text-gris">{talla.etiqueta}</p>}

      <p className={`mt-6 flex items-center gap-2 text-sm font-semibold uppercase ${agotada ? "text-rojo" : talla.stock <= 2 ? "text-rojo" : "text-volt"}`}>
        <span className={`h-2 w-2 rounded-full ${agotada || talla.stock <= 2 ? "bg-rojo" : "bg-volt"}`} aria-hidden />
        {agotada ? "Agotado en esta talla" : talla.stock === 1 ? "Queda 1 pieza" : talla.stock <= 3 ? `Quedan ${talla.stock}` : "Disponible · sale en 24–48 h"}
      </p>

      {agotada ? (
        <a
          href={whatsapp(`Hola Zancada, avísenme cuando vuelva ${p.nombre} en talla ${talla.etiqueta}.`)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-hueso py-4 font-bold uppercase"
        >
          <Icono nombre="chat" /> Avísame cuando vuelva
        </a>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Cantidad valor={cantidad} max={Math.max(1, disponibles)} etiqueta={p.nombre} onCambio={(n) => setCantidad(Math.min(Math.max(1, n), Math.max(1, disponibles)))} />
          <button
            type="button"
            onClick={comprar}
            disabled={disponibles === 0}
            className="flex min-w-48 flex-1 items-center justify-center gap-2 rounded-full bg-volt py-4 font-bold uppercase text-negro transition hover:bg-hueso disabled:cursor-not-allowed disabled:bg-linea disabled:text-gris"
          >
            <Icono nombre="bolsa" /> {disponibles === 0 ? "Ya tienes todas" : `Agregar · ${pesos.format(p.precio * cantidad)}`}
          </button>
          <BotonFavorito slug={p.slug} nombre={p.nombre} grande />
        </div>
      )}
      {enCarrito > 0 && !agotada && (
        <p className="mt-3 text-sm text-gris">
          Ya tienes {enCarrito} en tu carrito.{" "}
          <button type="button" onClick={abrirCarrito} className="font-semibold text-volt underline underline-offset-4">
            Ver carrito
          </button>
        </p>
      )}
    </div>
  );
}
