import { db } from "@/lib/db"
import { skills } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function EditCompetencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const skill = await db.query.skills.findFirst({ where: eq(skills.id, id) })
  if (!skill) notFound()

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/competences" className="text-sm text-gray-400 hover:text-gray-600">← Référentiel</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">{skill.label}</h1>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-sm text-gray-500">Modification de compétence — à implémenter.</p>
      </div>
    </div>
  )
}
