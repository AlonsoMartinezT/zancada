"use client";

import Image from "next/image";
import { useState } from "react";
import Icono from "./Icono";
import { asset } from "@/lib/asset";
import { pesos } from "@/lib/formato";
import { aplicarCupon, cupones, quitarCupon, totales } from "@/lib/tienda";

export function Cupon({ actual }: { actual: string | null }) {
  const [error, setError] = useState(false);
  const intentar = () => {
    const campo = document.getElementById("cupon") as HTMLInputElement;
    setError(!aplicarCupon(campo.value));
  };
  if (actual)
    return (
      <p className="flex items-center justify-between rounded-md bg-carbon px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-semibold text-volt">
          <Icono nombre="etiqueta" className="h-4 w-4" /> {actual} · {cupones[actual].texto}
        </span>
        <button type="button" onClick={quitarCupon} className="underline underline-offset-4">
          Quitar
        </button>
      </p>
    );
  return (
    <div>
      <div className="flex gap-2">
        <label htmlFor="cupon" className="sr-only">
          Código de descuento
        </label>
        <input
          id="cupon"
          placeholder="Código de descuento"
          className="campo !py-2.5 uppercase"
          aria-describedby="cupon-ayuda"
          aria-invalid={error}
          onChange={() => setError(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              intentar();
            }
          }}
        />
        <button type="button" onClick={intentar} className="shrink-0 rounded-md bg-hueso px-4 font-bold text-negro">
          Aplicar
        </button>
      </div>
      <p id="cupon-ayuda" className={`mt-1.5 text-sm ${error ? "font-semibold text-rojo" : "text-gris"}`} role={error ? "alert" : undefined}>
        {error ? "Ese código no existe o ya venció." : "Prueba DROP10 en la demo."}
      </p>
    </div>
  );
}

export default function Resumen({ t, conFotos = true }: { t: ReturnType<typeof totales>; conFotos?: boolean }) {
  return (
    <div>
      {conFotos && (
        <ul className="divide-y divide-linea">
          {t.lineas.map((l) => (
            <li key={l.slug + l.color + l.talla} className="flex items-center gap-3 py-3">
              <span className="foto-viñeta relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-carbon">
                <Image src={asset(`/img/${l.colorInfo.foto}.jpg`)} alt="" fill sizes="56px" className="object-cover" />
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-md bg-volt px-1 text-xs font-bold text-negro">{l.cantidad}</span>
              </span>
              <span className="flex-1 text-sm">
                <span className="block font-semibold">{l.producto.nombre}</span>
                <span className="text-gris">
                  {l.colorInfo.nombre} · {l.t.etiqueta}
                </span>
              </span>
              <span className="text-sm font-semibold tabular-nums">{pesos.format(l.importe)}</span>
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-4 space-y-2 border-t border-linea pt-4">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{pesos.format(t.subtotal)}</dd>
        </div>
        {t.descuento > 0 && (
          <div className="flex justify-between text-volt">
            <dt>Descuento</dt>
            <dd className="tabular-nums">−{pesos.format(t.descuento)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd className="tabular-nums">{t.envio === 0 ? "Gratis" : pesos.format(t.envio)}</dd>
        </div>
        <div className="flex justify-between border-t border-linea pt-3 text-xl font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{pesos.format(t.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
