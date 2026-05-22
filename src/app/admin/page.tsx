import { db } from "@/lib/db"
import { employees, skills, employeeSkills } from "@/lib/schema"
import { count, eq } from "drizzle-orm"
import Link from "next/link"

export default async function AdminPage() {
  const [employeeCount] = await db.select({ count: count() }).from(employees).where(eq(employees.isActive, true))
  const [skillCount] = await db.select({ count: count() }).from(skills)
  const [linkCount] = await db.select({ count: count() }).from(employeeSkills)

  const stats = [
    { label: "Salariés actifs", value: employeeCount.count, href: "/admin/salaries", color: "blue" },
    { label: "Compétences référencées", value: skillCount.count, href: "/admin/competences", color: "green" },
    { label: "Associations salarié ↔ compétence", value: linkCount.count, href: "/admin/salaries", color: "purple" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord RH</h1>
        <p className="text-sm text-gray-500 mt-1">Gestion de l'annuaire de compétences Astural</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
          >
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Salariés</h2>
          <p className="text-sm text-gray-500 mb-4">Ajouter, modifier ou gérer les compétences des salariés.</p>
          <div className="flex gap-2">
            <Link href="/admin/salaries/nouveau" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              + Nouveau salarié
            </Link>
            <Link href="/admin/salaries" className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Voir tous
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Référentiel de compétences</h2>
          <p className="text-sm text-gray-500 mb-4">Gérer la liste des compétences disponibles dans l'annuaire.</p>
          <div className="flex gap-2">
            <Link href="/admin/competences/nouvelle" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              + Nouvelle compétence
            </Link>
            <Link href="/admin/competences" className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Voir toutes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
