import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soluciones W | Asistencias",
  description:
    "Portal digital de autogestión de asistencias médicas, ambulancia, mascotas, hogar y odontología en Colombia.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-slate-700">
        {children}
      </body>
    </html>
  );
}
