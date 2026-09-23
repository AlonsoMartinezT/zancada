import type { Metadata } from "next";
import { Suspense } from "react";
import Catalogo from "@/components/Catalogo";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Tenis, hoodies, gorras y accesorios. Filtra por categoría, talla y precio.",
};

export default function Tienda() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-7xl px-5 py-20 text-gris">Cargando catálogo…</p>}>
      <Catalogo />
    </Suspense>
  );
}
