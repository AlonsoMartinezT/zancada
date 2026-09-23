"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import CarritoCajon from "./CarritoCajon";
import Icono from "./Icono";
import Logo from "./Logo";
import { categorias } from "@/data/productos";
import { ENVIO_GRATIS_DESDE, pesos } from "@/lib/formato";
import { abrirCarrito, useTienda } from "@/lib/tienda";

const nav = [
  { href: "/tienda", etiqueta: "Todo" },
  ...categorias.map((c) => ({ href: `/tienda?categoria=${c.id}`, etiqueta: c.nombre })),
  { href: "/ayuda", etiqueta: "Ayuda" },
];

const anuncios = ["Envío gratis desde " + pesos.format(ENVIO_GRATIS_DESDE), "Drop 09 ya disponible", "Cambios sin costo en 30 días", "Recoge en Roma Norte sin costo"];

function Buscador({ id, onBuscar }: { id: string; onBuscar: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <form role="search" onSubmit={onBuscar} className="relative">
      <label htmlFor={id} className="sr-only">
        Buscar productos
      </label>
      <input id={id} name="q" type="search" placeholder="Buscar…" className="h-11 w-full rounded-full border border-linea bg-carbon pl-11 pr-4 text-sm outline-none focus:border-volt" />
      <Icono nombre="lupa" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gris" />
    </form>
  );
}

export default function Encabezado() {
  const { carrito, favoritos } = useTienda();
  const piezas = carrito.reduce((t, l) => t + l.cantidad, 0);
  const router = useRouter();
  const ruta = usePathname();
  const menu = useRef<HTMLDialogElement>(null);

  function buscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    menu.current?.close();
    router.push(q ? `/tienda?q=${encodeURIComponent(q)}` : "/tienda");
  }

  return (
    <>
      {/* Marquesina infinita: se pausa con reduced-motion vía CSS */}
      <div className="fundido-h overflow-hidden border-b border-linea bg-carbon py-2" aria-hidden>
        <div className="marquesina-pista flex w-max gap-10 whitespace-nowrap">
          {[...anuncios, ...anuncios].map((a, i) => (
            <span key={i} className="folio flex items-center gap-10 text-hueso">
              {a} <Icono nombre="rayo" className="h-3 w-3 text-volt" />
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-linea bg-negro/90 backdrop-blur-md">
        {/* Barra de progreso de lectura: animation-timeline nativo, sin JS */}
        <div id="progreso-scroll" aria-hidden className="h-[2px] w-full bg-volt" />
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5">
          <button type="button" onClick={() => menu.current?.showModal()} className="-ml-2 flex h-11 w-11 items-center justify-center hover:text-volt lg:hidden" aria-label="Abrir menú" aria-haspopup="dialog">
            <Icono nombre="menu" className="h-6 w-6" />
          </button>
          <Logo />
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex gap-6 text-sm font-semibold uppercase tracking-wide">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`hover:text-volt ${ruta === n.href.split("?")[0] && !n.href.includes("?") ? "text-volt" : ""}`}>
                    {n.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto hidden w-64 md:block">
            <Buscador id="buscar-escritorio" onBuscar={buscar} />
          </div>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link href="/favoritos" className="relative flex h-11 w-11 items-center justify-center hover:text-volt" aria-label={`Favoritos (${favoritos.length})`}>
              <Icono nombre="corazon" className="h-6 w-6" />
              {favoritos.length > 0 && <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rojo px-1 text-xs font-bold text-hueso">{favoritos.length}</span>}
            </Link>
            <button type="button" onClick={abrirCarrito} className="relative flex h-11 w-11 items-center justify-center hover:text-volt" aria-label={`Carrito (${piezas} piezas)`}>
              <Icono nombre="bolsa" className="h-6 w-6" />
              {piezas > 0 && <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-volt px-1 text-xs font-bold text-negro">{piezas}</span>}
            </button>
          </div>
        </div>
      </header>

      <dialog ref={menu} aria-label="Menú" onClick={(e) => e.target === menu.current && menu.current?.close()} className="m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-negro p-6 text-hueso backdrop:bg-negro/60">
        <div className="flex items-center justify-between">
          <Logo />
          <button type="button" onClick={() => menu.current?.close()} aria-label="Cerrar menú" className="flex h-11 w-11 items-center justify-center hover:text-volt">
            <Icono nombre="cerrar" />
          </button>
        </div>
        <div className="mt-6">
          <Buscador id="buscar-movil" onBuscar={buscar} />
        </div>
        <ul className="mt-6 divide-y divide-linea border-y border-linea">
          {[...nav, { href: "/favoritos", etiqueta: "Favoritos" }, { href: "/carrito", etiqueta: "Carrito" }].map((n) => (
            <li key={n.href}>
              <Link href={n.href} onClick={() => menu.current?.close()} className="block py-4 font-display text-3xl uppercase">
                {n.etiqueta}
              </Link>
            </li>
          ))}
        </ul>
      </dialog>

      <CarritoCajon />
    </>
  );
}
