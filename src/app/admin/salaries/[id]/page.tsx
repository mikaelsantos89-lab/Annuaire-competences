import { db } from "@/lib/db"
import { employees, skills, employeeSkills } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import EmployeeSkillsManager from "@/components/EmployeeSkillsManager"

export default async function SalariePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const employee = await db.query.employees.findFirst({
    where: eq(employees.id, id),
  })

  if (!employee) notFound()

  const allSkills = await db.select().from(skills).orderBy(skills.category, skills.label)

  const assigned = await db
    .select({ skillId: employeeSkills.skillId, sharingLevel: employeeSkills.sharingLevel })
    .from(employeeSkills)
    .where(eq(employeeSkills.employeeId, id))

  const assignedMap = Object.fromEntries(assigned.map((a) => [a.skillId, a.sharingLevel]))

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/salaries" className="text-sm text-gray-400 hover:text-gray-600">
          ← Salariés
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">
          {employee.firstName} {employee.lastName}
        </h1>
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${employee.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {employee.isActive ? "Actif" : "Inactif"}
        </span>
      </div>

      {/* Infos salarié */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Institution</p>
            <p className="font-medium text-gray-900">{employee.institution}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Fonction</p>
            <p className="font-medium text-gray-900">{employee.jobTitle}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-0.5">Email</p>
            <p className="font-medium text-gray-900">{employee.email}</p>
          </div>
        </div>
      </div>

      {/* Gestion des compétences */}
      <EmployeeSkillsManager
        employeeId={id}
        allSkills={allSkills}
        assignedMap={assignedMap}
      />
    </div>
  )
}
