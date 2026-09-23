"use client";

import { useEffect } from "react";

/**
 * Respaldo de las animaciones por scroll para navegadores sin `animation-timeline`
 * (Firefox, principalmente). El CSS ya define el estado nativo con `view()`;
 * aquí solo agregamos `.sf-listo` con un IntersectionObserver cuando ese soporte falta.
 * No se usa `scroll-timeline-polyfill`: no está completo y da problemas (ver guía).
 */
function iniciarRevelado() {
  const objetivos = document.querySelectorAll<HTMLElement>(".sf-sube, .sf-aparece, .sf-izq, .sf-der");
  if (objetivos.length === 0) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add("sf-listo");
          observador.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );
  objetivos.forEach((el) => observador.observe(el));
  return () => observador.disconnect();
}

/**
 * Respaldo de la "vitrina" (el tenis que se mueve con el scroll) para navegadores
 * sin `animation-timeline`. Activa a mano el mismo montaje (sección alta + hijo
 * sticky) y calcula el progreso 0–1 con la posición real de scroll, aplicando
 * el mismo recorrido (traslada, gira, escala) que las @keyframes nativas definen
 * en globals.css, para que el resultado se vea igual en Firefox.
 */
function iniciarVitrinaJS() {
  const pista = document.querySelector<HTMLElement>(".vitrina-pista");
  const sticky = document.querySelector<HTMLElement>(".vitrina-sticky");
  const tenis = document.querySelector<HTMLElement>(".vitrina-tenis");
  const progreso = document.querySelector<HTMLElement>(".vitrina-progreso");
  const c2 = document.querySelector<HTMLElement>(".vitrina-c2");
  const c3 = document.querySelector<HTMLElement>(".vitrina-c3");
  const barras = document.querySelectorAll<HTMLElement>(".vitrina-barra");
  if (!pista || !sticky || !tenis) return;

  pista.style.height = "340vh";
  sticky.style.position = "sticky";
  sticky.style.top = "0";
  sticky.style.height = "100svh";
  sticky.style.overflow = "hidden";
  if (progreso) progreso.style.display = "flex";
  if (c2) c2.style.display = "block";
  if (c3) c3.style.display = "block";

  // Dos curvas independientes, calcadas de @keyframes vitrina-tenis: ahí la
  // opacidad tiene sus propios cortes (0/12/88/100%) y el movimiento los suyos
  // (0/50/100%), porque en CSS cada propiedad solo interpola entre los
  // keyframes que la mencionan explícitamente.
  const mover = [
    { p: 0, x: -32, y: 6, r: -28, s: 0.55 },
    { p: 0.5, x: 0, y: 0, r: 0, s: 1.15 },
    { p: 1, x: 32, y: -6, r: 24, s: 0.55 },
  ];
  const desvanecer = [
    { p: 0, o: 0 },
    { p: 0.12, o: 1 },
    { p: 0.88, o: 1 },
    { p: 1, o: 0 },
  ];

  function mezclar(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function porTramos<T extends { p: number }>(claves: T[], progreso01: number, campos: (keyof T)[]) {
    let i = 0;
    while (i < claves.length - 2 && progreso01 > claves[i + 1].p) i++;
    const a = claves[i];
    const b = claves[i + 1];
    const t = b.p === a.p ? 0 : (progreso01 - a.p) / (b.p - a.p);
    const salida = {} as Record<keyof T, number>;
    for (const campo of campos) salida[campo] = mezclar(a[campo] as number, b[campo] as number, t) as never;
    return salida;
  }

  function fadeEnRango(progreso01: number, desde: number, hasta: number) {
    const ancho = hasta - desde;
    if (progreso01 <= desde || progreso01 >= hasta) return 0;
    const t = (progreso01 - desde) / ancho;
    const borde = 0.18;
    if (t < borde) return t / borde;
    if (t > 1 - borde) return (1 - t) / borde;
    return 1;
  }

  let pendiente = false;
  function calcular() {
    pendiente = false;
    const r = pista!.getBoundingClientRect();
    const vh = window.innerHeight;
    const recorrido = r.height - vh;
    const progreso01 = recorrido <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / recorrido));

    const { x, y, r: rot, s } = porTramos(mover, progreso01, ["x", "y", "r", "s"]);
    const { o } = porTramos(desvanecer, progreso01, ["o"]);
    tenis!.style.translate = `${x}vw ${y}vh`;
    tenis!.style.rotate = `${rot}deg`;
    tenis!.style.scale = `${s}`;
    tenis!.style.opacity = `${o}`;

    const c1 = document.querySelector<HTMLElement>(".vitrina-c1");
    if (c1) c1.style.opacity = `${fadeEnRango(progreso01, 0.02, 0.32)}`;
    if (c2) c2.style.opacity = `${fadeEnRango(progreso01, 0.36, 0.66)}`;
    if (c3) c3.style.opacity = `${fadeEnRango(progreso01, 0.7, 0.98)}`;

    barras.forEach((b, i) => {
      const inicio = i / 3;
      const t = Math.min(1, Math.max(0, (progreso01 - inicio) / (1 / 3)));
      b.style.transform = `scaleX(${t})`;
      b.style.transformOrigin = "0 50%";
    });
  }

  function onScroll() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(calcular);
  }

  calcular();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

export default function ScrollFX() {
  useEffect(() => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido) {
      // Respeta la preferencia: deja todo en su estado final estático, sin animar.
      document.querySelectorAll<HTMLElement>(".sf-sube, .sf-aparece, .sf-izq, .sf-der").forEach((el) => el.classList.add("sf-listo"));
      return;
    }

    const limpiezas: (void | (() => void))[] = [];
    if (!(typeof CSS !== "undefined" && CSS.supports("(animation-timeline: view()) and (animation-range: entry)"))) {
      limpiezas.push(iniciarRevelado());
      limpiezas.push(iniciarVitrinaJS());
    }
    return () => limpiezas.forEach((fn) => fn?.());
  }, []);

  return null;
}
