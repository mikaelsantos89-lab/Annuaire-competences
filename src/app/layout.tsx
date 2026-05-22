import type { Metadata } from "next"
import "./globals.css"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Annuaire de compétences — Astural",
  description: "Cartographie des compétences des professionnels de l'Astural",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={cn("h-full antialiased", geist.variable)}>
      <body className="min-h-full bg-background">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
