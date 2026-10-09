import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soluciones W – Plataforma de Asistencias & Afiliaciones",
  description:
    "Portal digital de autogestión y afiliación de asistencias médicas, ambulancia, mascotas, hogar y odontología en Colombia. Dirección Wilson Triana.",
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
    <html lang="es" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Spartan:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-[#0b5278]">
        {children}
      </body>
    </html>
  );
}
