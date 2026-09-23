import Link from "next/link";

// El rayo de "Zancada": una zeta trazada como huella en movimiento.
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Zancada, inicio">
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path d="M6 8h20l-13 12h13" fill="none" stroke="var(--color-volt)" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
      <span className="font-display text-2xl uppercase leading-none tracking-wide">
        Zanca<span className="text-volt">da</span>
      </span>
    </Link>
  );
}
