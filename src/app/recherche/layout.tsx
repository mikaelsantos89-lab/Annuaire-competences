import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function RechercheLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/recherche" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">Annuaire compétences</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session.user.role === "ADMIN_RH" && (
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Administration
            </Link>
          )}
          <span className="text-sm text-gray-500">{session.user.name}</span>
          <form action="/api/auth/sign-out" method="POST">
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-700">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
