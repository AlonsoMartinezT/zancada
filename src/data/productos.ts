export type Categoria = "tenis" | "hoodies" | "gorras" | "accesorios";
export type Talla = { id: string; etiqueta: string; stock: number };
export type Color = { id: string; nombre: string; hex: string; foto: string };

export type Producto = {
  slug: string;
  nombre: string;
  categoria: Categoria;
  drop: string;
  resumen: string;
  descripcion: string;
  precio: number;
  precioAntes?: number;
  colores: Color[];
  tallas: Talla[];
  materiales: string[];
  etiqueta?: "Nuevo drop" | "Últimas piezas" | "Restock";
  destacado?: boolean;
};

export const categorias: { id: Categoria; nombre: string; foto: string }[] = [
  { id: "tenis", nombre: "Tenis", foto: "minimal-b" },
  { id: "hoodies", nombre: "Hoodies", foto: "hoodie-negro" },
  { id: "gorras", nombre: "Gorras", foto: "gorra-gris" },
  { id: "accesorios", nombre: "Accesorios", foto: "mochila-cruce" },
];

const tallasTenis = (stock: number[]): Talla[] =>
  ["25", "25.5", "26", "26.5", "27", "27.5", "28"].map((t, i) => ({ id: t, etiqueta: t, stock: stock[i] ?? 0 }));

const tallasRopa = (stock: number[]): Talla[] => ["CH", "M", "G", "XG"].map((t, i) => ({ id: t, etiqueta: t, stock: stock[i] ?? 0 }));

export const productos: Producto[] = [
  {
    slug: "runner-01-fog",
    nombre: "Runner 01 · Fog",
    categoria: "tenis",
    drop: "DROP 09",
    resumen: "Silueta baja en gris niebla, suela dentada y malla técnica.",
    descripcion: "El corte que abrió el catálogo. Malla técnica con refuerzos de piel sintética, suela de goma dentada para agarre en banqueta mojada y plantilla con memoria. Se acomoda a la calle sin perder línea de pista.",
    precio: 2190,
    colores: [
      { id: "fog", nombre: "Fog", hex: "#9a9a94", foto: "minimal-b" },
      { id: "carbon", nombre: "Carbón", hex: "#2b2b2b", foto: "sombra" },
    ],
    tallas: tallasTenis([3, 6, 8, 6, 4, 2, 0]),
    materiales: ["Malla técnica", "Piel sintética", "Suela de goma"],
    etiqueta: "Nuevo drop",
    destacado: true,
  },
  {
    slug: "runner-01-volt",
    nombre: "Runner 01 · Volt Edge",
    categoria: "tenis",
    drop: "DROP 09",
    resumen: "Mismo corte, filo volt en la entresuela.",
    descripcion: "La misma horma del Runner 01 con un filo volt que corre por la entresuela. Edición limitada del drop 09: cuando se acaba, no vuelve con este colorway.",
    precio: 2390,
    colores: [{ id: "volt", nombre: "Volt Edge", hex: "#d7ff3f", foto: "verde-neon" }],
    tallas: tallasTenis([1, 2, 3, 2, 1, 0, 0]),
    materiales: ["Malla técnica", "TPU", "Suela de goma"],
    etiqueta: "Últimas piezas",
  },
  {
    slug: "highline-mono",
    nombre: "Highline · Mono",
    categoria: "tenis",
    drop: "DROP 07",
    resumen: "Bota alta monocromática, cierre de agujetas planas.",
    descripcion: "Corte alto para tobillo cubierto, en un solo tono de punta a suela. Agujetas planas encerdas y ojillos metálicos. La pieza que más se repite en restock.",
    precio: 2690,
    colores: [
      { id: "blanco", nombre: "Blanco hueso", hex: "#f2f1ec", foto: "studio-pair" },
      { id: "negro", nombre: "Negro mate", hex: "#141414", foto: "sombra" },
    ],
    tallas: tallasTenis([5, 7, 9, 8, 6, 3, 1]),
    materiales: ["Lona reforzada", "Piel sintética", "Suela vulcanizada"],
    etiqueta: "Restock",
    destacado: true,
  },
  {
    slug: "lowcourt-blanco",
    nombre: "Lowcourt · Blanco",
    categoria: "tenis",
    drop: "DROP 05",
    resumen: "El básico blanco que combina con todo el clóset.",
    descripcion: "Corte bajo de cancha, piel sintética perforada para ventilación y suela plana de goma. El punto de entrada al catálogo.",
    precio: 1890,
    colores: [{ id: "blanco", nombre: "Blanco", hex: "#f2f1ec", foto: "minimal-a" }],
    tallas: tallasTenis([8, 9, 10, 9, 7, 5, 3]),
    materiales: ["Piel sintética", "Suela de goma"],
  },
  {
    slug: "trail-rojo",
    nombre: "Trail · Suela Roja",
    categoria: "tenis",
    drop: "DROP 07",
    resumen: "Entresuela roja de contraste, para terreno mixto.",
    descripcion: "Diseñado para banqueta y terracería por igual. Suela con tacos bajos y entresuela roja que se asoma en cada paso.",
    precio: 2450,
    precioAntes: 2790,
    colores: [{ id: "rojo", nombre: "Suela roja", hex: "#ff3b30", foto: "concepto-naranja" }],
    tallas: tallasTenis([2, 4, 5, 4, 3, 2, 1]),
    materiales: ["Mesh ripstop", "EVA", "Suela de goma tacos bajos"],
  },
  {
    slug: "knit-carbon",
    nombre: "Knit · Carbón",
    categoria: "tenis",
    drop: "DROP 09",
    resumen: "Tejido de punto sin costuras, calce de calcetín.",
    descripcion: "Upper tejido en una sola pieza, sin costuras internas. Calza como calcetín y pesa lo mínimo. El más ligero del catálogo.",
    precio: 2290,
    colores: [{ id: "carbon", nombre: "Carbón", hex: "#2b2b2b", foto: "concepto-azul" }],
    tallas: tallasTenis([0, 3, 4, 3, 2, 1, 0]),
    materiales: ["Punto técnico", "Suela EVA inyectada"],
  },
  {
    slug: "hoodie-arena",
    nombre: "Hoodie · Arena",
    categoria: "hoodies",
    drop: "DROP 08",
    resumen: "Franela pesada de 400 g, gorro forrado.",
    descripcion: "Franela de 400 gramos, gorro forrado en jersey y bolsillo canguro con refuerzo. Corte oversize pensado para capas.",
    precio: 1290,
    colores: [{ id: "arena", nombre: "Arena", hex: "#c9c0a8", foto: "hoodie-arena" }],
    tallas: tallasRopa([6, 9, 8, 4]),
    materiales: ["Franela 400 g", "80% algodón, 20% poliéster"],
    destacado: true,
  },
  {
    slug: "hoodie-negro",
    nombre: "Hoodie · Negro Mate",
    categoria: "hoodies",
    drop: "DROP 08",
    resumen: "El negro que no destiñe. Corte oversize.",
    descripcion: "Tinte reactivo de alta fijación para que el negro aguante lavadas sin verse gris. Mismo corte oversize que el resto del drop.",
    precio: 1290,
    colores: [{ id: "negro", nombre: "Negro mate", hex: "#141414", foto: "hoodie-negro" }],
    tallas: tallasRopa([7, 10, 9, 5]),
    materiales: ["Franela 400 g", "80% algodón, 20% poliéster"],
    etiqueta: "Nuevo drop",
  },
  {
    slug: "hoodie-rosa",
    nombre: "Hoodie · Rosa Polvo",
    categoria: "hoodies",
    drop: "DROP 08",
    resumen: "El tono que faltaba en el clóset gris.",
    descripcion: "Mismo corte y peso del resto del drop, en un rosa polvo que no se ve a niño. Bolsillo canguro y puños acanalados.",
    precio: 1290,
    colores: [{ id: "rosa", nombre: "Rosa polvo", hex: "#d9a6a0", foto: "hoodie-rosa" }],
    tallas: tallasRopa([3, 5, 4, 1]),
    materiales: ["Franela 400 g", "80% algodón, 20% poliéster"],
  },
  {
    slug: "hoodie-verde",
    nombre: "Hoodie · Verde Militar",
    categoria: "hoodies",
    drop: "DROP 06",
    resumen: "Verde opaco, cordón plano en el gorro.",
    descripcion: "Verde militar sin brillo, con cordón plano trenzado en el gorro y costuras reforzadas en el bolsillo canguro.",
    precio: 1190,
    colores: [{ id: "verde", nombre: "Verde militar", hex: "#4a5240", foto: "hoodie-verde" }],
    tallas: tallasRopa([0, 2, 3, 2]),
    materiales: ["Franela 380 g", "Algodón peinado"],
  },
  {
    slug: "playera-logo",
    nombre: "Playera · Logo Trazo",
    categoria: "hoodies",
    drop: "DROP 08",
    resumen: "Algodón peinado 220 g, logo serigrafiado al pecho.",
    descripcion: "La playera base del drop: algodón peinado de 220 gramos y el logo de Zancada serigrafiado, sin bordado, para que no raspe.",
    precio: 590,
    colores: [{ id: "negro", nombre: "Negro", hex: "#141414", foto: "playera-negra" }],
    tallas: tallasRopa([10, 14, 12, 7]),
    materiales: ["100% algodón peinado 220 g"],
  },
  {
    slug: "gorra-curva",
    nombre: "Gorra · Curva Gris",
    categoria: "gorras",
    drop: "DROP 06",
    resumen: "Visera curva, ajuste con hebilla metálica.",
    descripcion: "Seis paneles, visera curva prelavada y hebilla metálica trasera. El logo va bordado en tono sobre tono, casi invisible de lejos.",
    precio: 490,
    colores: [{ id: "gris", nombre: "Gris piedra", hex: "#8a8a84", foto: "gorra-gris" }],
    tallas: [{ id: "unica", etiqueta: "Talla única ajustable", stock: 18 }],
    materiales: ["Algodón lavado", "Hebilla metálica"],
  },
  {
    slug: "mochila-cruzada",
    nombre: "Mochila · Cruzada Táctica",
    categoria: "accesorios",
    drop: "DROP 07",
    resumen: "Compartimento acolchado para laptop, correa reforzada.",
    descripcion: "Lona resistente al agua, compartimento acolchado para laptop de hasta 14 pulgadas y correa cruzada reforzada con hebilla de metal.",
    precio: 890,
    colores: [{ id: "negro", nombre: "Negro", hex: "#141414", foto: "mochila-cruce" }],
    tallas: [{ id: "unica", etiqueta: "Talla única", stock: 9 }],
    materiales: ["Lona impermeable", "Forro acolchado"],
  },
  {
    slug: "mochila-urbana",
    nombre: "Mochila · Urbana 20L",
    categoria: "accesorios",
    drop: "DROP 05",
    resumen: "20 litros, bolsillo oculto antirrobo.",
    descripcion: "Capacidad de 20 litros para el día completo, con bolsillo oculto contra la espalda para lo que no quieres que se vea.",
    precio: 990,
    colores: [{ id: "negro", nombre: "Negro", hex: "#141414", foto: "mochila-callejon" }],
    tallas: [{ id: "unica", etiqueta: "Talla única", stock: 0 }],
    materiales: ["Poliéster balístico", "Cierres YKK"],
  },
  {
    slug: "calcetas-pack",
    nombre: "Calcetas · Pack de 3",
    categoria: "accesorios",
    drop: "DROP 09",
    resumen: "Tres pares, planta acolchada, logo tejido.",
    descripcion: "Pack de tres pares con planta acolchada en la zona de impacto y el logo tejido en el tobillo, no impreso.",
    precio: 350,
    colores: [{ id: "surtido", nombre: "Colores surtidos", hex: "#d7ff3f", foto: "calcetas-planas" }],
    tallas: [{ id: "unica", etiqueta: "Talla única (24–28)", stock: 22 }],
    materiales: ["Algodón peinado", "Elastano"],
    etiqueta: "Nuevo drop",
  },
];

export const productoPorSlug = (slug: string) => productos.find((p) => p.slug === slug);
export const totalStock = (p: Producto) => p.tallas.reduce((t, x) => t + x.stock, 0);
export const hayStock = (p: Producto) => totalStock(p) > 0;
