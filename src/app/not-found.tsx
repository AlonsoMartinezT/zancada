import Link from "next/link";

export default function NoEncontrada() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-28 text-center">
      <p className="font-display text-9xl text-volt">404</p>
      <h1 className="mt-2 font-display text-4xl uppercase">Este drop ya se agotó</h1>
      <p className="mt-3 text-gris">La página que buscas no existe o el producto ya no está en el catálogo.</p>
      <Link href="/tienda" className="mt-8 rounded-full bg-volt px-7 py-4 font-bold uppercase text-negro">
        Volver al catálogo
      </Link>
    </div>
  );
}
