const CATEGORY_LABELS: Record<string, string> = {
  EDUCATION_SPECIALISEE: "Éducation spécialisée",
  EDUCATION_PRECOCE: "Éducation précoce spécialisée",
  TECHNIQUE: "Technique",
  THERAPEUTIQUE: "Thérapeutique",
  PEDAGOGIE_ORIENTATION: "Pédagogie / Orientation",
  ART_SPORT_CULTURE: "Art / Sport / Culture",
  MANAGEMENT: "Management",
}

const NATURE_LABELS: Record<string, string> = {
  CERTIFIE: "Certifié",
  EXPERIENTIEL: "Expérientiel",
}

const TYPE_LABELS: Record<string, string> = {
  METIER: "Métier",
  NON_METIER: "Hors métier",
}

interface Result {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  institution: string
  jobTitle: string
  skillId: string
  skillLabel: string
  category: string
  skillNature: string
  skillType: string
  sharingLevel: string
}

interface SearchResultsProps {
  results: Result[]
  query?: string
}

// Groupe les résultats par personne
function groupByEmployee(results: Result[]) {
  const map = new Map<string, { employee: Omit<Result, "skillId" | "skillLabel" | "category" | "skillNature" | "skillType" | "sharingLevel">; skills: Array<{ id: string; label: string; category: string; nature: string; type: string }> }>()

  for (const r of results) {
    if (!map.has(r.employeeId)) {
      map.set(r.employeeId, {
        employee: {
          employeeId: r.employeeId,
          firstName: r.firstName,
          lastName: r.lastName,
          email: r.email,
          institution: r.institution,
          jobTitle: r.jobTitle,
        },
        skills: [],
      })
    }
    map.get(r.employeeId)!.skills.push({
      id: r.skillId,
      label: r.skillLabel,
      category: r.category,
      nature: r.skillNature,
      type: r.skillType,
    })
  }

  return Array.from(map.values())
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!query && results.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-sm">Entrez un mot-clé pour trouver une personne ressource</p>
      </div>
    )
  }

  if (query && results.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-sm">Aucun résultat pour « {query} »</p>
        <p className="text-xs mt-1">Essayez un autre mot-clé ou parcourez les catégories</p>
      </div>
    )
  }

  const grouped = groupByEmployee(results)

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {grouped.length} personne{grouped.length > 1 ? "s" : ""} •{" "}
        {results.length} compétence{results.length > 1 ? "s" : ""}
      </p>

      <div className="space-y-3">
        {grouped.map(({ employee, skills }) => (
          <div
            key={employee.employeeId}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 text-sm font-semibold">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {employee.jobTitle} · {employee.institution}
                    </p>
                  </div>
                </div>

                {/* Compétences */}
                <div className="mt-3 flex flex-wrap gap-1.5 ml-12">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      title={`${CATEGORY_LABELS[skill.category]} · ${NATURE_LABELS[skill.nature]}`}
                    >
                      {skill.label}
                      {skill.nature === "CERTIFIE" && (
                        <span className="text-blue-600 font-medium">✓</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <a
                href={`mailto:${employee.email}`}
                className="flex-shrink-0 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contacter
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
