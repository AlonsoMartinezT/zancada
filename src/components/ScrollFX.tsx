"use client";

import { useEffect } from "react";

/**
 * Respaldo de las animaciones por scroll para navegadores sin `animation-timeline`
 * (Firefox, principalmente). El CSS ya define el estado nativo con `view()`;
 * aquí solo agregamos `.sf-listo` con un IntersectionObserver cuando ese soporte falta.
 * No se usa `scroll-timeline-polyfill`: no está completo y da problemas (ver guía).
 */
export default function ScrollFX() {
  useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("(animation-timeline: view()) and (animation-range: entry)")) return;

    const objetivos = document.querySelectorAll<HTMLElement>(".sf-sube, .sf-aparece, .sf-izq, .sf-der");
    if (objetivos.length === 0) return;

    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido) {
      objetivos.forEach((el) => el.classList.add("sf-listo"));
      return;
    }

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
  }, []);

  return null;
}
