import { db } from "@/lib/db"
import { employees, employeeSkills } from "@/lib/schema"
import { count, eq } from "drizzle-orm"
import Link from "next/link"

export default async function SalariesPage() {
  const list = await db
    .select({
      id: employees.id,
      firstName: employees.firstName,
      lastName: employees.lastName,
      email: employees.email,
      institution: employees.institution,
      jobTitle: employees.jobTitle,
      isActive: employees.isActive,
      skillCount: count(employeeSkills.id),
    })
    .from(employees)
    .leftJoin(employeeSkills, eq(employees.id, employeeSkills.employeeId))
    .groupBy(employees.id)
    .orderBy(employees.lastName, employees.firstName)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Salariés</h1>
          <p className="text-sm text-gray-500 mt-0.5">{list.length} salariés</p>
        </div>
        <Link
          href="/admin/salaries/nouveau"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nouveau salarié
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {list.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Aucun salarié pour l'instant</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Nom</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Institution</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Fonction</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Compétences</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-gray-400">{emp.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{emp.institution}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.jobTitle}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-700 font-medium">{emp.skillCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${emp.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {emp.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/salaries/${emp.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Gérer →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
