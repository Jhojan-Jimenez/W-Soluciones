import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="es" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
