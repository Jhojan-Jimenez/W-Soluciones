import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soluciones W | Plataforma de Asistencia Familiar B2C",
  description:
    "Portal digital de autogestión de asistencias médicas, ambulancia, mascotas, hogar y odontología en Colombia. Activación en menos de 2 minutos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${inter.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-slate-700">
        {children}
      </body>
    </html>
  );
}
