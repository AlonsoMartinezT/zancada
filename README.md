# Zancada · e-commerce con animación por scroll

**Tienda de tenis y ropa urbana**: proyecto conceptual de portafolio de [Amtixo](https://github.com/AlonsoMartinezT).

> Zancada es una marca **ficticia** en la Roma Norte, CDMX. Productos, precios, stock y pedidos son de demostración: **no se cobra nada ni se piden datos de tarjeta**.

🔗 **Demo:** https://alonsomartinezt.github.io/zancada/

## El brief

Un e-commerce completo (catálogo, carrito, checkout) para una marca de "drops" limitados, con la **animación ligada al scroll** como eje central del diseño: parallax en el hero, aparición escalonada de tarjetas, una marquesina infinita y una barra de progreso de lectura — todo nativo en CSS, sin librerías de animación.

## Qué incluye (25 páginas estáticas)

| Ruta | Función |
| --- | --- |
| `/` | Hero con parallax de foto, cifras, marquesina de catálogo, categorías, producto destacado con parallax de dos capas, pasos del drop y galería horizontal |
| `/tienda` | 15 productos con filtros (categoría, talla, disponibilidad, precio) guardados en la URL |
| `/producto/[slug]` | Selector de color (cambia la foto) y talla con stock por talla, ficha de materiales, relacionados |
| Carrito lateral + `/carrito` | Cantidades, barra de envío gratis, quitar piezas |
| `/checkout` | Contacto, entrega (domicilio o recoger), pago simulado, cupón `DROP10` |
| `/pedido` | Confirmación con folio y resumen por WhatsApp |
| `/favoritos`, `/ayuda` (con guía de tallas), 404 | |

## Animación ligada al scroll

Todo con `animation-timeline` nativo de CSS (`view()` y `scroll()`), definido en `src/app/globals.css`:

- **`.sf-sube` / `.sf-izq` / `.sf-der` / `.sf-aparece`** — aparición de secciones y tarjetas al entrar en pantalla (`animation-range: entry`).
- **`.sf-parallax`** — capas de foto que se desplazan durante todo su paso por la ventana (hero y producto destacado).
- **Barra de progreso** en el encabezado — `animation-timeline: scroll(root)`, crece de 0 a 1 con el scroll de toda la página.
- **Marquesina infinita** — cinta de anuncios y de productos, en bucle CSS puro.

Cada efecto respeta `prefers-reduced-motion: reduce` (se desactiva por completo) y tiene respaldo: `src/components/ScrollFX.tsx` agrega las clases finales vía `IntersectionObserver` en navegadores sin `animation-timeline` (Firefox), sin usar `scroll-timeline-polyfill` (incompleto, según la guía de referencia).

## Reglas de negocio

- Stock por talla y color; agotado ofrece "Avísame cuando vuelva".
- Envío de $129, gratis desde $1,500 o al recoger en tienda.
- Pago **simulado**: transferencia o pago al recibir. El método de tarjeta aparece reservado, listo para conectar una pasarela real (Stripe, Mercado Pago, Conekta).

## Stack

Next.js 16 (exportación estática) · React 19 · Tailwind CSS v4 · TypeScript · Bebas Neue + Archivo + JetBrains Mono · GitHub Pages con GitHub Actions.

```bash
npm install
npm run dev
```

## Fotografías

Fotos de [Unsplash](https://unsplash.com) bajo la [licencia de Unsplash](https://unsplash.com/license). Se evitaron a propósito fotos con logos de marcas reales visibles (Nike, Adidas, Puma, etc.): el catálogo usa siluetas, estudios abstractos y conceptos 3D sin marca.

| Archivo | Autor |
| --- | --- |
| `splash.jpg` | [Fachry Zella Devandra](https://unsplash.com/photos/WBDK76pCb9E) |
| `verde-neon.jpg` | [Lewis Hayden](https://unsplash.com/photos/7vqbIo8kSrE) |
| `hoodie-arena.jpg` | [The Ian](https://unsplash.com/photos/ZCoqcrWp9GY) |
| `hoodie-negro.jpg` | [Ali Saadat](https://unsplash.com/photos/ikLELWYbyxk) |
| `hoodie-rosa.jpg` | [Hunter Newton](https://unsplash.com/photos/YjxcPMb7JGw) |
| `hoodie-verde.jpg` | [The Ian](https://unsplash.com/photos/s9q_bn-uLhg) |
| `denim-flat.jpg` | [philippe wehrli](https://unsplash.com/photos/h3qsf19IY9Y) |
| `gorra-gris.jpg` | [Yang Deng](https://unsplash.com/photos/2loKxdi6Hmo) |
| `playera-negra.jpg` | [Katrina Beachy](https://unsplash.com/photos/B3v8od0jM3A) |
| `mochila-cruce.jpg` | [Bradley Dunn](https://unsplash.com/photos/77kBW3aUQ2M) |
| `mochila-callejon.jpg` | [Anton Etmanov](https://unsplash.com/photos/OpjaA-Ekv1c) |
| `caminando.jpg` | [Amirhossein Hasani](https://unsplash.com/photos/pAmqSVguAEc) |
| `skyline.jpg` | [Vong Vathanak](https://unsplash.com/photos/yKdA0Qwk2eg) |
| `sombra.jpg` | [Se. Tsuchiya](https://unsplash.com/photos/i9Qautx3SrQ) |
| `minimal-a.jpg` | [Trendest Studio](https://unsplash.com/photos/XZ3EmAIWuz0) |
| `minimal-b.jpg` | [The DK Photography](https://unsplash.com/photos/3GRO5BCcKgI) |
| `studio-pair.jpg` | [The DK Photography](https://unsplash.com/photos/jc0o2j7T5LA) |
| `mano-beige.jpg` | [Aditya Sharma](https://unsplash.com/photos/NEZoHojAxds) |
| `mano-gris.jpg` | [Aditya Sharma](https://unsplash.com/photos/yf_fLXUfeWQ) |
| `shelf-beige.jpg` | [Agung hendri](https://unsplash.com/photos/sJGlVPtFIJ4) |
| `concepto-naranja.jpg` | [Vadim Bogulov](https://unsplash.com/photos/rAKmYTWmXnk) |
| `concepto-azul.jpg` | [Snapmaker 3D Printer](https://unsplash.com/photos/m_qceB5Az5Y) |
| `calcetas-planas.jpg` | [Anna Evans](https://unsplash.com/photos/90kNrvWerXs) |
