"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Icono from "./Icono";
import { asset } from "@/lib/asset";
import { pesos } from "@/lib/formato";
import { cambiarCantidad, ENVIO_GRATIS_DESDE, quitar, totales, useTienda } from "@/lib/tienda";

export function Cantidad({ valor, max, onCambio, etiqueta }: { valor: number; max: number; onCambio: (n: number) => void; etiqueta: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-linea bg-carbon" role="group" aria-label={`Cantidad de ${etiqueta}`}>
      <button type="button" onClick={() => onCambio(valor - 1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-carbon-2" aria-label="Quitar una">
        <Icono nombre="menos" className="h-4 w-4" />
      </button>
      <span className="w-7 text-center font-semibold tabular-nums" aria-live="polite">
        {valor}
      </span>
      <button type="button" onClick={() => onCambio(valor + 1)} disabled={valor >= max} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-carbon-2 disabled:opacity-30" aria-label="Agregar una">
        <Icono nombre="mas" className="h-4 w-4" />
      </button>
    </div>
  );
}

export function BarraEnvio({ falta, subtotal }: { falta: number; subtotal: number }) {
  const avance = Math.min(100, Math.round(((ENVIO_GRATIS_DESDE - falta) / ENVIO_GRATIS_DESDE) * 100));
  return (
    <div>
      <p className="text-sm">
        {subtotal === 0 ? (
          <>Envío gratis desde {pesos.format(ENVIO_GRATIS_DESDE)}</>
        ) : falta > 0 ? (
          <>
            Te faltan <strong className="text-volt">{pesos.format(falta)}</strong> para envío gratis
          </>
        ) : (
          <strong className="text-volt">Envío gratis desbloqueado</strong>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-carbon-2" role="progressbar" aria-valuenow={avance} aria-valuemin={0} aria-valuemax={100} aria-label="Avance para envío gratis">
        <div className="h-full rounded-full bg-volt transition-[width] duration-500" style={{ width: `${avance}%` }} />
      </div>
    </div>
  );
}

export default function CarritoCajon() {
  const ref = useRef<HTMLDialogElement>(null);
  const { carrito, cupon } = useTienda();
  const t = totales(carrito, cupon);

  useEffect(() => {
    const abrir = () => ref.current?.showModal();
    window.addEventListener("zancada:abrir-carrito", abrir);
    return () => window.removeEventListener("zancada:abrir-carrito", abrir);
  }, []);

  const cerrar = () => ref.current?.close();

  return (
    <dialog ref={ref} aria-label="Tu carrito" onClick={(e) => e.target === ref.current && cerrar()} className="cajon bg-negro p-0 text-hueso shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-linea px-6 py-5">
          <h2 className="font-display text-3xl uppercase">
            Carrito <span className="text-lg text-gris">({t.piezas})</span>
          </h2>
          <button type="button" onClick={cerrar} aria-label="Cerrar carrito" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-carbon">
            <Icono nombre="cerrar" />
          </button>
        </div>

        <div className="border-b border-linea px-6 py-4">
          <BarraEnvio falta={t.faltaParaGratis} subtotal={t.subtotal} />
        </div>

        {t.lineas.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <Icono nombre="bolsa" className="h-12 w-12 text-gris" />
            <p className="font-display text-2xl uppercase">Tu carrito está vacío</p>
            <Link href="/tienda" onClick={cerrar} className="rounded-full bg-volt px-6 py-3 font-bold text-negro">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-linea overflow-y-auto px-6">
              {t.lineas.map((l) => (
                <li key={l.slug + l.color + l.talla} className="flex gap-4 py-5">
                  <Link href={`/producto/${l.slug}`} onClick={cerrar} className="foto-viñeta relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-carbon">
                    <Image src={asset(`/img/${l.colorInfo.foto}.jpg`)} alt="" fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <Link href={`/producto/${l.slug}`} onClick={cerrar} className="font-semibold leading-tight hover:text-volt">
                        {l.producto.nombre}
                      </Link>
                      <span className="font-semibold tabular-nums">{pesos.format(l.importe)}</span>
                    </div>
                    <p className="folio">
                      {l.colorInfo.nombre} · Talla {l.t.etiqueta}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <Cantidad valor={l.cantidad} max={l.t.stock} etiqueta={l.producto.nombre} onCambio={(n) => cambiarCantidad(l.slug, l.color, l.talla, n)} />
                      <button type="button" onClick={() => quitar(l.slug, l.color, l.talla)} className="text-sm text-gris underline underline-offset-4 hover:text-rojo">
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-linea bg-carbon px-6 py-5">
              <p className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">{pesos.format(t.subtotal)}</span>
              </p>
              <p className="text-sm text-gris">Envío y cupones se calculan en el pago.</p>
              <Link href="/checkout" onClick={cerrar} className="flex items-center justify-center gap-2 rounded-full bg-volt py-4 font-bold text-negro transition hover:bg-hueso">
                Pagar <Icono nombre="flecha" className="h-4 w-4" />
              </Link>
              <Link href="/carrito" onClick={cerrar} className="block text-center text-sm font-semibold underline underline-offset-4">
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
