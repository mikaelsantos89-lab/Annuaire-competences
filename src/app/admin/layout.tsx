import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  if (session.user.role !== "ADMIN_RH") redirect("/recherche")

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
          <nav className="flex items-center gap-1">
            <Link href="/admin" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              Tableau de bord
            </Link>
            <Link href="/admin/salaries" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              Salariés
            </Link>
            <Link href="/admin/competences" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              Référentiel
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">RH</span>
          <span className="text-sm text-gray-500">{session.user.name}</span>
          <Link href="/recherche" className="text-sm text-gray-500 hover:text-gray-700">
            ← Annuaire
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  )
}
