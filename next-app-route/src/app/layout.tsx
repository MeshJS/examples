import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mesh App on Cardano",
  description: "A Cardano dApp powered my Mesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
