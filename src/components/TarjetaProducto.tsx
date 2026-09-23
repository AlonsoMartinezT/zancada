import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import BotonFavorito from "./BotonFavorito";
import Icono from "./Icono";
import { hayStock, totalStock, type Producto } from "@/data/productos";
import { asset } from "@/lib/asset";
import { pesos } from "@/lib/formato";

export default function TarjetaProducto({ p, prioridad = false, animar = "sf-sube", transicion = true }: { p: Producto; prioridad?: boolean; animar?: "sf-sube" | "" ; transicion?: boolean }) {
  const disponible = hayStock(p);
  const stock = totalStock(p);
  const foto = p.colores[0].foto;

  const imagen = (
    <div className={`foto-viñeta absolute inset-0 transition duration-700 group-hover:scale-105 ${disponible ? "" : "opacity-40 grayscale"}`}>
      <Image src={asset(`/img/${foto}.jpg`)} alt={p.nombre} fill priority={prioridad} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
    </div>
  );

  return (
    <article className={`${animar} group relative`}>
      <Link href={`/producto/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-carbon">
          {transicion ? (
            <ViewTransition name={`prod-${p.slug}`} share="pieza" default="none">
              {imagen}
            </ViewTransition>
          ) : (
            imagen
          )}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {!disponible && <span className="rounded-sm bg-hueso px-2 py-1 text-xs font-bold uppercase text-negro">Agotado</span>}
            {disponible && p.etiqueta && (
              <span className={`rounded-sm px-2 py-1 text-xs font-bold uppercase ${p.etiqueta === "Últimas piezas" ? "bg-rojo text-hueso" : "bg-volt text-negro"}`}>{p.etiqueta}</span>
            )}
            {p.precioAntes && <span className="rounded-sm bg-rojo px-2 py-1 text-xs font-bold uppercase text-hueso">Oferta</span>}
          </div>
          {disponible && stock <= 3 && (
            <p className="folio absolute bottom-3 left-3 text-volt">Quedan {stock}</p>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <p className="folio">{p.drop}</p>
            <h3 className="font-display text-2xl uppercase leading-none group-hover:text-volt">{p.nombre}</h3>
          </div>
          <p className="shrink-0 text-right">
            <span className="block font-semibold tabular-nums">{pesos.format(p.precio)}</span>
            {p.precioAntes && <s className="block text-xs text-gris">{pesos.format(p.precioAntes)}</s>}
          </p>
        </div>
        {p.colores.length > 1 && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gris">
            <Icono nombre="etiqueta" className="h-3.5 w-3.5" /> {p.colores.length} colores
          </p>
        )}
      </Link>
      <div className="absolute right-3 top-3">
        <BotonFavorito slug={p.slug} nombre={p.nombre} />
      </div>
    </article>
  );
}
