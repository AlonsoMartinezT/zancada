"use client";

import { alternarFavorito, useTienda } from "@/lib/tienda";

export default function BotonFavorito({ slug, nombre, grande = false }: { slug: string; nombre: string; grande?: boolean }) {
  const { favoritos } = useTienda();
  const activo = favoritos.includes(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        alternarFavorito(slug);
      }}
      aria-pressed={activo}
      aria-label={activo ? `Quitar ${nombre} de favoritos` : `Guardar ${nombre} en favoritos`}
      className={`flex items-center justify-center rounded-full transition ${grande ? "h-14 w-14 border border-linea bg-carbon hover:border-rojo" : "h-10 w-10 bg-negro/70 backdrop-blur-sm hover:scale-110"} ${activo ? "text-rojo" : "text-hueso"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={activo ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 20s-7.5-4.6-9-9.5C2 6.9 4.3 4 7.4 4c2 0 3.6 1.1 4.6 2.7C13 5.1 14.6 4 16.6 4 19.7 4 22 6.9 21 10.5 19.5 15.4 12 20 12 20z" />
      </svg>
    </button>
  );
}
