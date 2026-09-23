"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import Icono from "./Icono";
import TarjetaProducto from "./TarjetaProducto";
import { categorias, hayStock, productos, type Categoria } from "@/data/productos";
import { pesos } from "@/lib/formato";

const ordenes = {
  destacadas: "Destacadas",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  nombre: "Nombre (A–Z)",
} as const;
type Orden = keyof typeof ordenes;
const PRECIO_TOPE = 3000;
const TALLAS_TENIS = ["25", "25.5", "26", "26.5", "27", "27.5", "28"];

const sinAcentos = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Catalogo() {
  const params = useSearchParams();
  const router = useRouter();
  const ruta = usePathname();
  const panel = useRef<HTMLDialogElement>(null);

  const f = {
    q: params.get("q") ?? "",
    categoria: (params.get("categoria") as Categoria | null) ?? null,
    talla: params.get("talla"),
    disponibles: params.get("disponibles") === "1",
    max: Number(params.get("max")) || PRECIO_TOPE,
    orden: (params.get("orden") as Orden | null) ?? "destacadas",
  };

  function poner(cambios: Record<string, string | null>) {
    const n = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(cambios)) {
      if (v === null || v === "") n.delete(k);
      else n.set(k, v);
    }
    const qs = n.toString();
    router.replace(qs ? `${ruta}?${qs}` : ruta, { scroll: false });
  }

  const q = sinAcentos(f.q.trim());
  let lista = productos.filter(
    (p) =>
      (!q || sinAcentos(`${p.nombre} ${p.resumen} ${p.drop}`).includes(q)) &&
      (!f.categoria || p.categoria === f.categoria) &&
      (!f.talla || p.tallas.some((t) => t.id === f.talla && t.stock > 0)) &&
      (!f.disponibles || hayStock(p)) &&
      p.precio <= f.max,
  );
  if (f.orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
  if (f.orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
  if (f.orden === "nombre") lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  if (f.orden === "destacadas") lista = [...lista].sort((a, b) => Number(hayStock(b)) - Number(hayStock(a)));

  const activos = [f.q, f.categoria, f.talla, f.disponibles, f.max < PRECIO_TOPE].filter(Boolean).length;
  const limpiar = () => router.replace(ruta, { scroll: false });
  const titulo = f.categoria ? categorias.find((c) => c.id === f.categoria)?.nombre : "Todo el catálogo";
  const mostrarTallas = !f.categoria || f.categoria === "tenis";

  const Filtros = (
    <div className="space-y-8">
      <fieldset>
        <legend className="folio mb-3">Categoría</legend>
        <div className="flex flex-wrap gap-2">
          {[{ id: null, nombre: "Todo" }, ...categorias].map((c) => (
            <button
              key={c.id ?? "todo"}
              type="button"
              onClick={() => poner({ categoria: c.id, talla: c.id && c.id !== "tenis" ? null : f.talla })}
              aria-pressed={f.categoria === c.id}
              className="rounded-full border border-linea px-3.5 py-1.5 text-sm font-semibold uppercase transition hover:border-hueso aria-pressed:border-volt aria-pressed:bg-volt aria-pressed:text-negro"
            >
              {c.nombre}
            </button>
          ))}
        </div>
      </fieldset>

      {mostrarTallas && (
        <fieldset>
          <legend className="folio mb-3">Talla</legend>
          <div className="grid grid-cols-4 gap-2">
            {TALLAS_TENIS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => poner({ talla: f.talla === t ? null : t, categoria: "tenis" })}
                aria-pressed={f.talla === t}
                className="rounded-md border border-linea py-2 text-sm font-semibold transition hover:border-hueso aria-pressed:border-volt aria-pressed:bg-volt aria-pressed:text-negro"
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-carbon">
        <input type="checkbox" checked={f.disponibles} onChange={(e) => poner({ disponibles: e.target.checked ? "1" : null })} className="h-4 w-4 accent-[var(--color-volt)]" />
        Solo disponibles
      </label>

      <div>
        <label htmlFor="precio-max" className="folio flex justify-between">
          Precio máximo <span className="normal-case tracking-normal text-hueso">{f.max >= PRECIO_TOPE ? "Sin límite" : pesos.format(f.max)}</span>
        </label>
        <input
          id="precio-max"
          type="range"
          min={300}
          max={PRECIO_TOPE}
          step={50}
          value={f.max}
          onChange={(e) => poner({ max: Number(e.target.value) >= PRECIO_TOPE ? null : e.target.value })}
          className="mt-3 w-full accent-[var(--color-volt)]"
        />
      </div>

      {activos > 0 && (
        <button type="button" onClick={limpiar} className="text-sm font-semibold text-volt underline underline-offset-4">
          Limpiar filtros ({activos})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-linea pb-6">
        <div>
          <h1 className="font-display text-5xl uppercase md:text-6xl">{titulo}</h1>
          <p className="mt-2 folio" aria-live="polite">
            {lista.length} {lista.length === 1 ? "producto" : "productos"}
            {f.q && (
              <>
                {" "}
                para “{f.q}”{" "}
                <button type="button" onClick={() => poner({ q: null })} className="underline underline-offset-4">
                  quitar
                </button>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => panel.current?.showModal()} className="flex h-11 items-center gap-2 rounded-full border border-linea bg-carbon px-4 text-sm font-bold uppercase lg:hidden">
            <Icono nombre="filtro" className="h-4 w-4" /> Filtros {activos > 0 && `(${activos})`}
          </button>
          <label htmlFor="orden" className="sr-only">
            Ordenar
          </label>
          <select id="orden" value={f.orden} onChange={(e) => poner({ orden: e.target.value === "destacadas" ? null : e.target.value })} className="h-11 rounded-full border border-linea bg-carbon px-4 text-sm font-semibold">
            {Object.entries(ordenes).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-28">{Filtros}</div>
        </aside>

        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-linea p-14 text-center">
            <Icono nombre="lupa" className="h-10 w-10 text-gris" />
            <p className="mt-4 font-display text-2xl uppercase">Nada por aquí</p>
            <p className="mt-1 text-gris">Quita algún filtro o prueba otra búsqueda.</p>
            <button type="button" onClick={limpiar} className="mt-6 rounded-full bg-volt px-6 py-3 font-bold uppercase text-negro">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
            {lista.map((p, i) => (
              <TarjetaProducto key={p.slug} p={p} prioridad={i < 3} />
            ))}
          </div>
        )}
      </div>

      <dialog ref={panel} aria-label="Filtros" onClick={(e) => e.target === panel.current && panel.current?.close()} className="cajon bg-negro p-0 text-hueso">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-linea px-6 py-5">
            <h2 className="font-display text-3xl uppercase">Filtros</h2>
            <button type="button" onClick={() => panel.current?.close()} aria-label="Cerrar filtros" className="flex h-10 w-10 items-center justify-center hover:text-volt">
              <Icono nombre="cerrar" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{Filtros}</div>
          <div className="border-t border-linea p-5">
            <button type="button" onClick={() => panel.current?.close()} className="w-full rounded-full bg-volt py-4 font-bold uppercase text-negro">
              Ver {lista.length} {lista.length === 1 ? "producto" : "productos"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
