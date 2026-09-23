import type { Metadata } from "next";
import { Archivo, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import ScrollFX from "@/components/ScrollFX";
import "./globals.css";

const bebas = Bebas_Neue({ variable: "--font-bebas", weight: "400", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", weight: ["400", "500"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Zancada · Tenis y ropa urbana en drops limitados", template: "%s · Zancada" },
  description: "Tenis, hoodies, gorras y accesorios en drops limitados. Marca independiente en la Roma Norte, CDMX. Envío en 24-48 horas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${bebas.variable} ${archivo.variable} ${mono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <a href="#contenido" className="sr-only z-50 rounded-full bg-volt px-4 py-2 font-bold text-negro focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Saltar al contenido
        </a>
        <ScrollFX />
        <Encabezado />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Pie />
      </body>
    </html>
  );
}
