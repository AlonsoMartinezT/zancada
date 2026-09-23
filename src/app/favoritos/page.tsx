"use client";

import Link from "next/link";
import Icono from "@/components/Icono";
import TarjetaProducto from "@/components/TarjetaProducto";
import { productos } from "@/data/productos";
import { useTienda } from "@/lib/tienda";

export default function Favoritos() {
  const { favoritos } = useTienda();
  const lista = productos.filter((p) => favoritos.includes(p.slug));

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="font-display text-5xl uppercase md:text-6xl">Tus favoritos</h1>
      <p className="folio mt-2">Se guardan en este navegador.</p>
      {lista.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-md border border-dashed border-linea p-14 text-center">
          <Icono nombre="corazon" className="h-10 w-10 text-gris" />
          <p className="mt-4 font-display text-2xl uppercase">Aún no guardas ninguno</p>
          <p className="mt-1 text-gris">Toca el corazón de cualquier producto para guardarlo aquí.</p>
          <Link href="/tienda" className="mt-6 rounded-full bg-volt px-6 py-3 font-bold uppercase text-negro">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {lista.map((p) => (
            <TarjetaProducto key={p.slug} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
