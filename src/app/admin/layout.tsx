import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  if (session.user.role !== "ADMIN_RH") redirect("/recherche")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recherche" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-sm">Annuaire compétences</span>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <nav className="flex items-center gap-1">
            <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Tableau de bord
            </Link>
            <Link href="/admin/salaries" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Salariés
            </Link>
            <Link href="/admin/competences" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Référentiel
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">RH</Badge>
          <span className="text-sm text-muted-foreground">{session.user.name}</span>
          <Separator orientation="vertical" className="h-4" />
          <Link href="/recherche" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            ← Annuaire
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  )
}
