import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catalogo Digital",
  description: "Catalogo digital automatizado para comercios locales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
