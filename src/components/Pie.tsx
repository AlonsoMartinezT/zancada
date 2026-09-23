import Link from "next/link";
import Icono, { type IconoId } from "./Icono";
import Logo from "./Logo";
import { categorias } from "@/data/productos";
import { TIENDA } from "@/lib/formato";

const promesas: { icono: IconoId; titulo: string; texto: string }[] = [
  { icono: "camion", titulo: "Envío en 24–48 h", texto: "CDMX y área metropolitana, en caja con tape de marca." },
  { icono: "escudo", titulo: "Cambios en 30 días", texto: "Talla equivocada no es problema tuyo, es nuestro." },
  { icono: "chat", titulo: "Soporte por WhatsApp", texto: "De 12 a 20 h contestamos en minutos." },
  { icono: "tienda", titulo: "Recoge en Roma Norte", texto: "Sin costo, pruébatelos antes de llevarlos." },
];

export default function Pie() {
  return (
    <footer className="mt-24 border-t border-linea">
      <div className="franja h-1.5" aria-hidden />
      <ul className="border-b border-linea bg-carbon">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {promesas.map((p) => (
            <li key={p.titulo} className="flex gap-4">
              <Icono nombre={p.icono} className="h-6 w-6 shrink-0 text-volt" />
              <div>
                <p className="font-semibold uppercase tracking-wide">{p.titulo}</p>
                <p className="text-sm text-gris">{p.texto}</p>
              </div>
            </li>
          ))}
        </div>
      </ul>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-gris">Marca independiente de tenis y ropa urbana en la Roma Norte. Drops limitados; cuando se acaban, no vuelven.</p>
          <p className="mt-4 text-sm text-gris">
            {TIENDA.direccion.join(", ")}
            <br />
            {TIENDA.horario}
          </p>
        </div>
        <div>
          <h2 className="folio mb-3">Catálogo</h2>
          <ul className="space-y-2">
            {categorias.map((c) => (
              <li key={c.id}>
                <Link href={`/tienda?categoria=${c.id}`} className="hover:text-volt">
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="folio mb-3">Ayuda</h2>
          <ul className="space-y-2">
            {[
              ["/ayuda#envios", "Envíos"],
              ["/ayuda#cambios", "Cambios y devoluciones"],
              ["/ayuda#tallas", "Guía de tallas"],
              ["/ayuda#pagos", "Formas de pago"],
              ["/favoritos", "Mis favoritos"],
            ].map(([h, t]) => (
              <li key={h}>
                <Link href={h} className="hover:text-volt">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-linea px-5 py-6 text-center text-sm text-gris">
        Proyecto conceptual de portafolio: Zancada es una marca ficticia; productos, precios y pedidos son de demostración y no se cobra nada. Diseño y desarrollo por Amtixo. Fotografías de Unsplash.
      </p>
    </footer>
  );
}
