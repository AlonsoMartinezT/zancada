import Image from "next/image";
import { asset } from "@/lib/asset";

const pasos: [string, string, string][] = [
  ["01", "Malla técnica", "Ligera y transpirable, con refuerzos justo donde el pie se dobla al caminar."],
  ["02", "Suela dentada", "Agarre real en banqueta mojada, no solo en la foto del producto."],
  ["03", "Plantilla con memoria", "Se amolda a tu pisada después de las primeras semanas de uso."],
];

// El tenis recorre la pantalla mientras haces scroll: ver el mecanismo en globals.css (bloque "VITRINA").
export default function Vitrina() {
  return (
    <section className="vitrina-pista relative border-y border-linea bg-carbon" aria-label="Runner 01 en detalle, con ficha técnica ilustrada">
      <div className="vitrina-sticky flex flex-col items-center justify-center px-5 py-20">
        <p className="folio">Runner 01 · en detalle</p>

        <div className="vitrina-progreso mt-6 w-full max-w-xs gap-2">
          {[1, 2, 3].map((n) => (
            <span key={n} className="h-[3px] flex-1 overflow-hidden rounded-full bg-linea">
              <span className={`vitrina-barra vitrina-b${n} block h-full w-full bg-volt`} aria-hidden />
            </span>
          ))}
        </div>

        <div className="vitrina-tenis relative mx-auto mt-10 aspect-square w-[68vw] max-w-lg sm:w-[40vw]">
          <Image src={asset("/img/sombra.jpg")} alt="El Runner 01 en el aire, visto desde distintos ángulos según avanzas" fill sizes="(min-width: 1024px) 40vw, 68vw" className="object-contain" />
        </div>

        <div className="relative mt-10 h-28 w-full max-w-sm text-center sm:h-24">
          {pasos.map(([n, t, d], i) => (
            <div key={n} className={`vitrina-c${i + 1} absolute inset-0`}>
              <p className="font-display text-2xl text-volt">{n}</p>
              <h3 className="font-display text-2xl uppercase sm:text-3xl">{t}</h3>
              <p className="mt-1 text-sm text-gris sm:text-base">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
