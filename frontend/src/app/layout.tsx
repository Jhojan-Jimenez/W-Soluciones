import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soluciones W | Sistemas de Asistencia Familiar B2C",
  description:
    "Portal digital de autogestión de asistencias médicas, ambulancia, mascotas, hogar y odontología en Colombia. Activación en menos de 2 minutos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${poppins.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-[#626262]">
        {children}
      </body>
    </html>
  );
}
