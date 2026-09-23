const trazos = {
  bolsa: <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2" />,
  corazon: <path d="M12 20s-7.5-4.6-9-9.5C2 6.9 4.3 4 7.4 4c2 0 3.6 1.1 4.6 2.7C13 5.1 14.6 4 16.6 4 19.7 4 22 6.9 21 10.5 19.5 15.4 12 20 12 20z" />,
  lupa: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  menos: <path d="M6 12h12" />,
  mas: <path d="M12 6v12M6 12h12" />,
  cerrar: <path d="M6 6l12 12M18 6L6 18" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  flechaAbajo: <path d="M12 5v14M6 13l6 6 6-6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  filtro: <path d="M4 6h16M7 12h10M10 18h4" />,
  basura: <path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" />,
  chat: <path d="M4 5h16v11H9l-5 4zM8 10h8M8 13h5" />,
  etiqueta: <path d="M3 12V4h8l10 10-8 8zM7.5 8.5h.01" />,
  camion: <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z" />,
  escudo: <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5" />,
  tienda: <path d="M4 9l1.5-5h13L20 9M4 9h16v11H4zM4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0A2.7 2.7 0 0020 9M10 20v-5h4v5" />,
  rayo: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
  regla: <path d="M4 4h16v6H4zM8 4v3M12 4v3M16 4v3" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
} satisfies Record<string, React.ReactNode>;

export type IconoId = keyof typeof trazos;

export default function Icono({ nombre, className = "h-5 w-5" }: { nombre: IconoId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {trazos[nombre]}
    </svg>
  );
}
