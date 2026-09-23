"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icono from "@/components/Icono";
import Resumen, { Cupon } from "@/components/Resumen";
import { TIENDA } from "@/lib/formato";
import { registrarPedido, totales, useTienda, type Pedido } from "@/lib/tienda";

const pagos = [
  { id: "transferencia", nombre: "Transferencia bancaria", texto: "Datos por correo y WhatsApp. Se aparta el pedido 24 horas." },
  { id: "contraentrega", nombre: "Pago al recibir", texto: "Efectivo o tarjeta con terminal al entregar. Solo CDMX." },
];

function Campo({ id, etiqueta, error, ayuda, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; etiqueta: string; error: string; ayuda?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {etiqueta}
      </label>
      {ayuda && (
        <span id={`${id}-ayuda`} className="mb-1.5 block text-sm text-gris">
          {ayuda}
        </span>
      )}
      <input id={id} name={id} className="campo" aria-errormessage={`${id}-error`} aria-describedby={ayuda ? `${id}-ayuda` : undefined} {...props} />
      <span id={`${id}-error`} className="error-campo">
        {error}
      </span>
    </div>
  );
}

const nuevoFolio = () => "ZK-" + Math.random().toString(36).slice(2, 7).toUpperCase();

export default function Checkout() {
  const { carrito, cupon } = useTienda();
  const router = useRouter();
  const [entrega, setEntrega] = useState<"domicilio" | "tienda">("domicilio");
  const [pago, setPago] = useState(pagos[0].id);
  const [enviando, setEnviando] = useState(false);
  const t = totales(carrito, cupon, entrega);

  if (t.lineas.length === 0 && !enviando)
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-5xl uppercase">No hay nada que pagar</h1>
        <p className="mt-3 text-gris">Tu carrito está vacío.</p>
        <Link href="/tienda" className="mt-8 inline-block rounded-full bg-volt px-7 py-4 font-bold uppercase text-negro">
          Ir al catálogo
        </Link>
      </div>
    );

  function confirmar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const texto = (k: string) => String(d.get(k) ?? "").trim();
    const pedido: Pedido = {
      folio: nuevoFolio(),
      fecha: new Date().toISOString(),
      lineas: t.lineas.map((l) => ({ slug: l.slug, color: l.color, talla: l.talla, cantidad: l.cantidad, nombre: l.producto.nombre, precio: l.producto.precio })),
      subtotal: t.subtotal,
      descuento: t.descuento,
      envio: t.envio,
      total: t.total,
      entrega,
      pago: pagos.find((p) => p.id === pago)!.nombre,
      cliente: {
        nombre: texto("nombre"),
        correo: texto("correo"),
        telefono: texto("telefono"),
        direccion: entrega === "domicilio" ? `${texto("calle")}, ${texto("colonia")}, C.P. ${texto("cp")}, ${texto("alcaldia")}, ${texto("estado")}` : undefined,
      },
    };
    setEnviando(true);
    registrarPedido(pedido);
    router.push("/pedido");
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="font-display text-5xl uppercase md:text-6xl">Pagar</h1>
      <p className="folio mt-2 flex items-center gap-2 text-volt">
        <Icono nombre="escudo" className="h-4 w-4" /> Tienda de demostración: no se realiza ningún cobro.
      </p>

      <form onSubmit={confirmar} className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-4 flex items-center gap-3 font-display text-2xl uppercase">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt font-sans text-sm text-negro">1</span> Contacto
            </legend>
            <Campo id="nombre" etiqueta="Nombre completo" autoComplete="name" required minLength={3} error="Escribe tu nombre y apellido." className="sm:col-span-2" />
            <Campo id="correo" etiqueta="Correo" type="email" autoComplete="email" required error="Escribe un correo válido, por ejemplo tu@correo.com." />
            <Campo id="telefono" etiqueta="Teléfono (WhatsApp)" type="tel" inputMode="tel" autoComplete="tel-national" required pattern="(?:[0-9]{2} ?[0-9]{4}|[0-9]{3} ?[0-9]{3}) ?[0-9]{4}" error="Escribe 10 dígitos." placeholder="55 1234 5678" />
          </fieldset>

          <fieldset>
            <legend className="mb-4 flex items-center gap-3 font-display text-2xl uppercase">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt font-sans text-sm text-negro">2</span> Entrega
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "domicilio" as const, titulo: "Envío a domicilio", texto: "CDMX y área metropolitana · 24–48 h", icono: "camion" as const },
                { id: "tienda" as const, titulo: "Recoger en tienda", texto: `${TIENDA.direccion[1]} · gratis`, icono: "tienda" as const },
              ].map((o) => (
                <label key={o.id} className="flex cursor-pointer gap-3 rounded-md border border-linea bg-carbon p-4 transition has-checked:border-volt">
                  <input type="radio" name="entrega" checked={entrega === o.id} onChange={() => setEntrega(o.id)} className="mt-1 h-4 w-4 accent-[var(--color-volt)]" />
                  <span>
                    <span className="flex items-center gap-2 font-semibold uppercase">
                      <Icono nombre={o.icono} className="h-4 w-4" /> {o.titulo}
                    </span>
                    <span className="text-sm text-gris">{o.texto}</span>
                  </span>
                </label>
              ))}
            </div>
            {entrega === "domicilio" ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-6">
                <Campo id="calle" etiqueta="Calle y número" autoComplete="address-line1" required minLength={4} error="Escribe la calle y el número." className="sm:col-span-6" />
                <Campo id="colonia" etiqueta="Colonia" autoComplete="address-level3" required error="Escribe la colonia." className="sm:col-span-3" />
                <Campo id="cp" etiqueta="Código postal" autoComplete="postal-code" inputMode="numeric" required pattern="[0-9]{5}" error="Son 5 dígitos." className="sm:col-span-3" />
                <Campo id="alcaldia" etiqueta="Alcaldía o municipio" autoComplete="address-level2" required error="Escribe la alcaldía o municipio." className="sm:col-span-3" />
                <div className="sm:col-span-3">
                  <label htmlFor="estado" className="mb-1.5 block text-sm font-semibold">
                    Estado
                  </label>
                  <select id="estado" name="estado" autoComplete="address-level1" className="campo">
                    <option>Ciudad de México</option>
                    <option>Estado de México</option>
                  </select>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-md bg-carbon p-4 text-sm">
                Te avisamos por WhatsApp cuando esté lista (normalmente el mismo día). {TIENDA.direccion.join(", ")} · {TIENDA.horario}.
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className="mb-4 flex items-center gap-3 font-display text-2xl uppercase">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-volt font-sans text-sm text-negro">3</span> Pago
            </legend>
            <div className="space-y-3">
              {pagos.map((p) => (
                <label key={p.id} className="flex cursor-pointer gap-3 rounded-md border border-linea bg-carbon p-4 transition has-checked:border-volt">
                  <input type="radio" name="pago" checked={pago === p.id} onChange={() => setPago(p.id)} className="mt-1 h-4 w-4 accent-[var(--color-volt)]" />
                  <span>
                    <span className="block font-semibold">{p.nombre}</span>
                    <span className="text-sm text-gris">{p.texto}</span>
                  </span>
                </label>
              ))}
              <div className="flex gap-3 rounded-md border border-dashed border-linea p-4 text-gris" aria-disabled="true">
                <span className="mt-1 h-4 w-4 shrink-0 rounded-full border border-linea" aria-hidden />
                <span>
                  <span className="block font-semibold">Tarjeta de crédito o débito</span>
                  <span className="text-sm">Se activa al conectar la pasarela de pagos del cliente (Stripe, Mercado Pago, Conekta). En esta demo no se piden datos de tarjeta.</span>
                </span>
              </div>
            </div>
          </fieldset>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[var(--color-volt)]" />
            <span>
              Entiendo que Zancada es una <strong>tienda de demostración</strong> y que este pedido no genera ningún cobro ni envío.
            </span>
          </label>
        </div>

        <aside className="h-fit space-y-5 rounded-md bg-carbon p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl uppercase">Tu pedido</h2>
          <Resumen t={t} />
          <Cupon actual={cupon} />
          <button type="submit" disabled={enviando} className="flex w-full items-center justify-center gap-2 rounded-full bg-volt py-4 font-bold uppercase text-negro hover:bg-hueso disabled:opacity-60">
            <Icono nombre="check" /> Confirmar pedido
          </button>
          <Link href="/carrito" className="block text-center text-sm font-semibold underline underline-offset-4">
            Volver al carrito
          </Link>
        </aside>
      </form>
    </div>
  );
}
