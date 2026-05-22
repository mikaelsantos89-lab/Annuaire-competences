import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function RechercheLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/recherche" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-sm">Annuaire compétences</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session.user.role === "ADMIN_RH" && (
            <>
              <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Administration
              </Link>
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          <span className="text-sm text-muted-foreground">{session.user.name}</span>
          <form action="/api/auth/sign-out" method="POST">
            <Button type="submit" variant="ghost" size="sm">
              Déconnexion
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
