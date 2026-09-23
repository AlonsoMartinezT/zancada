import Image from "next/image";
import Link from "next/link";
import Icono from "@/components/Icono";
import TarjetaProducto from "@/components/TarjetaProducto";
import { categorias, productos } from "@/data/productos";
import { asset } from "@/lib/asset";
import { pesos } from "@/lib/formato";

const destacados = productos.filter((p) => p.destacado);
const nombresMarquesina = productos.map((p) => `${p.nombre} — ${pesos.format(p.precio)}`);

const pasos = [
  { n: "01", titulo: "Elige tu drop", texto: "Cada colección tiene número limitado de piezas. Cuando se acaban, no hay reposición del mismo colorway." },
  { n: "02", titulo: "Talla y color", texto: "Guía de tallas en cada producto, con el stock exacto por talla. Nada de 'disponible' genérico." },
  { n: "03", titulo: "Recibe o recoge", texto: "Envío en 24–48 horas en CDMX o recoge sin costo en la tienda de Roma Norte." },
];

export default function Inicio() {
  return (
    <>
      {/* ═══════════ HERO con parallax ═══════════ */}
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden">
        <div className="sf-parallax absolute inset-0 -z-10 scale-110">
          <Image src={asset("/img/mano-gris.jpg")} alt="Mano sosteniendo un tenis Zancada en el aire, estudio oscuro" fill priority sizes="100vw" className="object-cover object-[50%_35%]" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-negro via-negro/60 to-negro/10" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32">
          <p className="folio sf-aparece mb-4 flex items-center gap-2 text-volt">
            <span className="h-2 w-2 animate-pulse rounded-full bg-volt" /> Drop 09 · Disponible ahora
          </p>
          <h1 className="sf-aparece max-w-4xl text-balance font-display text-7xl uppercase leading-[0.85] sm:text-8xl lg:text-[9rem]">
            Camina <span className="text-volt">distinto.</span>
          </h1>
          <p className="sf-aparece mt-6 max-w-md text-lg text-gris">
            Tenis, hoodies y accesorios en drops limitados. Diseñados en la Roma Norte, agotados casi siempre en la misma semana.
          </p>
          <div className="sf-aparece mt-8 flex flex-wrap gap-3">
            <Link href="/tienda" className="inline-flex items-center gap-2 rounded-full bg-volt px-7 py-4 font-bold uppercase text-negro transition hover:bg-hueso">
              Ver el drop <Icono nombre="flecha" className="h-4 w-4" />
            </Link>
            <Link href="#nuevo-drop" className="inline-flex items-center gap-2 rounded-full border border-hueso/25 px-7 py-4 font-bold uppercase transition hover:border-volt hover:text-volt">
              Qué es un drop
            </Link>
          </div>
        </div>

        <a href="#cifras" aria-label="Bajar a la siguiente sección" className="absolute bottom-6 right-6 hidden h-11 w-11 items-center justify-center rounded-full border border-hueso/25 sm:flex">
          <Icono nombre="flechaAbajo" className="h-5 w-5 animate-bounce motion-reduce:animate-none" />
        </a>
      </section>

      {/* ═══════════ Cifras ═══════════ */}
      <section id="cifras" className="mx-auto grid max-w-7xl gap-px bg-linea px-5 py-px sm:grid-cols-3">
        {[
          ["09", "drops lanzados"],
          ["48 h", "de aquí a tu puerta"],
          ["30 días", "para cambios sin preguntas"],
        ].map(([n, t]) => (
          <div key={t} className="sf-sube bg-negro p-8 text-center">
            <p className="font-display text-6xl text-volt">{n}</p>
            <p className="mt-1 folio">{t}</p>
          </div>
        ))}
      </section>

      {/* ═══════════ Marquesina de catálogo ═══════════ */}
      <div className="fundido-h overflow-hidden border-y border-linea py-5" aria-hidden>
        <div className="marquesina-pista flex w-max gap-12 whitespace-nowrap font-display text-4xl uppercase">
          {[...nombresMarquesina, ...nombresMarquesina].map((n, i) => (
            <span key={i} className="flex items-center gap-12">
              {n} <span className="text-volt">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════ Categorías ═══════════ */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="sf-sube font-display text-5xl uppercase md:text-6xl">Compra por categoría</h2>
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categorias.map((c, i) => (
            <Link key={c.id} href={`/tienda?categoria=${c.id}`} className="sf-sube group relative aspect-[4/5] overflow-hidden rounded-md bg-carbon" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="foto-viñeta absolute inset-0">
                <Image src={asset(`/img/${c.foto}.jpg`)} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-2xl uppercase group-hover:text-volt">{c.nombre}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ Producto destacado grande, parallax de dos capas ═══════════ */}
      {destacados[0] && (
        <section className="relative overflow-hidden border-y border-linea bg-carbon">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
            <div className="sf-izq relative aspect-square overflow-hidden rounded-md lg:order-last">
              <div className="sf-parallax absolute inset-0 scale-125">
                <Image src={asset(`/img/${destacados[0].colores[0].foto}.jpg`)} alt={destacados[0].nombre} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="sf-der">
              <p className="folio text-volt">{destacados[0].drop} · Pieza destacada</p>
              <h2 className="mt-3 font-display text-6xl uppercase leading-none md:text-7xl">{destacados[0].nombre}</h2>
              <p className="mt-5 max-w-md text-lg text-gris">{destacados[0].resumen}</p>
              <p className="mt-6 font-display text-4xl text-volt">{pesos.format(destacados[0].precio)}</p>
              <Link href={`/producto/${destacados[0].slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-volt px-7 py-4 font-bold uppercase text-negro">
                Ver producto <Icono nombre="flecha" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ Cómo comprar ═══════════ */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="sf-sube font-display text-5xl uppercase md:text-6xl">Cómo funciona un drop</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {pasos.map((p, i) => (
            <li key={p.n} className="sf-sube border-t-2 border-volt pt-6" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="font-display text-6xl text-linea">{p.n}</span>
              <h3 className="mt-2 font-display text-2xl uppercase">{p.titulo}</h3>
              <p className="mt-2 text-gris">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ═══════════ Nuevo drop: scroller horizontal ═══════════ */}
      <section id="nuevo-drop" className="border-t border-linea py-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-5">
          <div>
            <p className="folio text-volt">Drop 09</p>
            <h2 className="sf-sube mt-2 font-display text-5xl uppercase md:text-6xl">Lo nuevo esta semana</h2>
          </div>
          <Link href="/tienda" className="inline-flex items-center gap-2 font-bold uppercase text-volt hover:underline">
            Ver los {productos.length} productos <Icono nombre="flecha" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 px-5 sm:grid-cols-3 lg:mx-auto lg:max-w-7xl lg:grid-cols-4">
          {productos
            .filter((p) => p.drop === "DROP 09")
            .map((p) => (
              <TarjetaProducto key={p.slug} p={p} />
            ))}
        </div>
      </section>

      {/* ═══════════ Banda final ═══════════ */}
      <section className="relative overflow-hidden bg-volt text-negro">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-16 md:flex-row md:items-center">
          <h2 className="sf-sube max-w-xl text-balance font-display text-6xl uppercase leading-[0.9]">No te quedes fuera del próximo drop.</h2>
          <Link href="/tienda" className="sf-sube inline-flex items-center gap-2 rounded-full bg-negro px-8 py-5 font-bold uppercase text-hueso">
            Explorar catálogo <Icono nombre="flecha" className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
