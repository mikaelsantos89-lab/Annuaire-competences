import { db } from "@/lib/db"
import { skills } from "@/lib/schema"
import Link from "next/link"

const CATEGORY_LABELS: Record<string, string> = {
  EDUCATION_SPECIALISEE: "Éducation spécialisée",
  EDUCATION_PRECOCE: "Éducation précoce spécialisée",
  TECHNIQUE: "Technique",
  THERAPEUTIQUE: "Thérapeutique",
  PEDAGOGIE_ORIENTATION: "Pédagogie / Orientation",
  ART_SPORT_CULTURE: "Art / Sport / Culture",
  MANAGEMENT: "Management",
}

export default async function CompetencesPage() {
  const list = await db.select().from(skills).orderBy(skills.category, skills.label)

  const grouped = list.reduce<Record<string, typeof list>>((acc, skill) => {
    const cat = skill.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Référentiel de compétences</h1>
          <p className="text-sm text-gray-500 mt-0.5">{list.length} compétences</p>
        </div>
        <Link
          href="/admin/competences/nouvelle"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nouvelle compétence
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl text-center py-16 text-gray-400">
          <p className="text-sm">Aucune compétence dans le référentiel</p>
          <Link href="/admin/competences/nouvelle" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Créer la première compétence →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="font-medium text-gray-700 text-sm">{CATEGORY_LABELS[category] ?? category}</h2>
                <p className="text-xs text-gray-400">{catSkills.length} compétence{catSkills.length > 1 ? "s" : ""}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {catSkills.map((skill) => (
                  <div key={skill.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{skill.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {skill.subcategory && (
                          <span className="text-xs text-gray-400">{skill.subcategory}</span>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${skill.skillNature === "CERTIFIE" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                          {skill.skillNature === "CERTIFIE" ? "Certifié" : "Expérientiel"}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${skill.skillType === "METIER" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                          {skill.skillType === "METIER" ? "Métier" : "Hors métier"}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/competences/${skill.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Modifier →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
