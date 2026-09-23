export const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export const ENVIO_GRATIS_DESDE = 1500;
export const COSTO_ENVIO = 129;

export const TIENDA = {
  nombre: "Zancada",
  whatsapp: "525500000000",
  telefono: "55 0000 0000",
  direccion: ["Av. Álvaro Obregón 150", "Roma Norte, Ciudad de México"],
  horario: "Lunes a sábado · 12:00 – 20:00",
};

export const whatsapp = (texto: string) => `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(texto)}`;
