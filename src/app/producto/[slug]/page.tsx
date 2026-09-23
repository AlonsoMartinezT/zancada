import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FichaProducto from "@/components/FichaProducto";
import TarjetaProducto from "@/components/TarjetaProducto";
import { categorias, hayStock, productoPorSlug, productos } from "@/data/productos";
import { asset } from "@/lib/asset";

export const dynamicParams = false;

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const p = productoPorSlug((await params).slug);
  return p ? { title: p.nombre, description: `${p.resumen} $${p.precio} MXN con envío en CDMX.` } : {};
}

export default async function Producto({ params }: PageProps<"/producto/[slug]">) {
  const p = productoPorSlug((await params).slug);
  if (!p) notFound();
  const categoria = categorias.find((c) => c.id === p.categoria)!;
  const relacionados = productos.filter((x) => x.categoria === p.categoria && x.slug !== p.slug && hayStock(x)).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.descripcion,
    image: asset(`/img/${p.colores[0].foto}.jpg`),
    brand: { "@type": "Brand", name: "Zancada" },
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      price: p.precio,
      availability: hayStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-5 py-8">
        <nav aria-label="Migas de pan" className="folio">
          <ol className="flex flex-wrap gap-2">
            <li className="after:ml-2 after:content-['/']">
              <Link href="/tienda" className="hover:text-volt">
                Tienda
              </Link>
            </li>
            <li className="after:ml-2 after:content-['/']">
              <Link href={`/tienda?categoria=${p.categoria}`} className="hover:text-volt">
                {categoria.nombre}
              </Link>
            </li>
            <li aria-current="page" className="text-hueso">
              {p.nombre}
            </li>
          </ol>
        </nav>

        <FichaProducto p={p} />
      </div>

      {relacionados.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16" aria-labelledby="titulo-relacionados">
          <h2 id="titulo-relacionados" className="font-display text-4xl uppercase">
            También en {categoria.nombre.toLowerCase()}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {relacionados.map((r) => (
              <TarjetaProducto key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
