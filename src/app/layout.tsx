import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Annuaire de compétences — Astural",
  description: "Cartographie des compétences des professionnels de l'Astural",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-gray-50">{children}</body>
    </html>
  )
}
