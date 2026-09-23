import { useSyncExternalStore } from "react";
import { productoPorSlug, type Producto, type Talla } from "@/data/productos";
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE } from "./formato";

/*
 * Estado del carrito, favoritos y último pedido.
 * Vive en localStorage porque el sitio es estático (GitHub Pages): no hay servidor.
 */

export type Linea = { slug: string; color: string; talla: string; cantidad: number };
export type Pedido = {
  folio: string;
  fecha: string;
  lineas: (Linea & { nombre: string; color: string; talla: string; precio: number })[];
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  entrega: "domicilio" | "tienda";
  pago: string;
  cliente: { nombre: string; correo: string; telefono: string; direccion?: string };
};

type Estado = { carrito: Linea[]; favoritos: string[]; cupon: string | null; pedido: Pedido | null };

const CLAVE = "zancada:estado";
const vacio: Estado = { carrito: [], favoritos: [], cupon: null, pedido: null };

let estado: Estado = vacio;
let cargado = false;
const oyentes = new Set<() => void>();

function cargar() {
  if (cargado || typeof window === "undefined") return;
  cargado = true;
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo) estado = { ...vacio, ...JSON.parse(crudo) };
  } catch {
    /* navegación privada: el carrito dura lo que la pestaña */
  }
}

function guardar(nuevo: Estado) {
  estado = nuevo;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* ignorado a propósito */
  }
  oyentes.forEach((o) => o());
}

function suscribir(o: () => void) {
  cargar();
  oyentes.add(o);
  const alCambiar = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    cargado = false;
    cargar();
    o();
  };
  window.addEventListener("storage", alCambiar);
  return () => {
    oyentes.delete(o);
    window.removeEventListener("storage", alCambiar);
  };
}

const leer = () => {
  cargar();
  return estado;
};

export function useTienda() {
  return useSyncExternalStore(suscribir, leer, () => vacio);
}

function buscarTalla(p: Producto | undefined, talla: string): Talla | undefined {
  return p?.tallas.find((t) => t.id === talla);
}

/* ─────────── Acciones ─────────── */

export function agregar(slug: string, color: string, talla: string, cantidad = 1) {
  const p = productoPorSlug(slug);
  const t = buscarTalla(p, talla);
  if (!p || !t || t.stock === 0) return;
  const existe = estado.carrito.find((l) => l.slug === slug && l.color === color && l.talla === talla);
  const carrito = existe
    ? estado.carrito.map((l) => (l === existe ? { ...l, cantidad: Math.min(l.cantidad + cantidad, t.stock) } : l))
    : [...estado.carrito, { slug, color, talla, cantidad: Math.min(cantidad, t.stock) }];
  guardar({ ...estado, carrito });
}

export function cambiarCantidad(slug: string, color: string, talla: string, cantidad: number) {
  const t = buscarTalla(productoPorSlug(slug), talla);
  if (!t) return;
  const carrito =
    cantidad <= 0
      ? estado.carrito.filter((l) => !(l.slug === slug && l.color === color && l.talla === talla))
      : estado.carrito.map((l) => (l.slug === slug && l.color === color && l.talla === talla ? { ...l, cantidad: Math.min(cantidad, t.stock) } : l));
  guardar({ ...estado, carrito });
}

export const quitar = (slug: string, color: string, talla: string) => cambiarCantidad(slug, color, talla, 0);

export function alternarFavorito(slug: string) {
  const favoritos = estado.favoritos.includes(slug) ? estado.favoritos.filter((s) => s !== slug) : [...estado.favoritos, slug];
  guardar({ ...estado, favoritos });
}

export const cupones: Record<string, { porcentaje: number; texto: string }> = {
  DROP10: { porcentaje: 10, texto: "10% de bienvenida al drop" },
};

export function aplicarCupon(codigo: string): boolean {
  const c = codigo.trim().toUpperCase();
  if (!cupones[c]) return false;
  guardar({ ...estado, cupon: c });
  return true;
}

export const quitarCupon = () => guardar({ ...estado, cupon: null });

export function registrarPedido(pedido: Pedido) {
  guardar({ ...estado, carrito: [], cupon: null, pedido });
}

/* ─────────── Cálculos ─────────── */

export { COSTO_ENVIO, ENVIO_GRATIS_DESDE };

export type LineaDetallada = Linea & { producto: Producto; colorInfo: Producto["colores"][number]; t: Talla; importe: number };

export function detallar(carrito: Linea[]): LineaDetallada[] {
  return carrito.flatMap((l) => {
    const producto = productoPorSlug(l.slug);
    const t = buscarTalla(producto, l.talla);
    const colorInfo = producto?.colores.find((c) => c.id === l.color) ?? producto?.colores[0];
    return producto && t && colorInfo ? [{ ...l, producto, colorInfo, t, importe: producto.precio * l.cantidad }] : [];
  });
}

export function totales(carrito: Linea[], cupon: string | null, entrega: "domicilio" | "tienda" = "domicilio") {
  const lineas = detallar(carrito);
  const subtotal = lineas.reduce((t, l) => t + l.importe, 0);
  const piezas = lineas.reduce((t, l) => t + l.cantidad, 0);
  const descuento = cupon && cupones[cupon] ? Math.round((subtotal * cupones[cupon].porcentaje) / 100) : 0;
  const envio = entrega === "tienda" || subtotal - descuento >= ENVIO_GRATIS_DESDE || subtotal === 0 ? 0 : COSTO_ENVIO;
  return { lineas, subtotal, piezas, descuento, envio, total: subtotal - descuento + envio, faltaParaGratis: Math.max(0, ENVIO_GRATIS_DESDE - (subtotal - descuento)) };
}

export const abrirCarrito = () => window.dispatchEvent(new Event("zancada:abrir-carrito"));
