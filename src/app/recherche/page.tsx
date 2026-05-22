import { db } from "@/lib/db"
import { skills, employees, employeeSkills } from "@/lib/schema"
import { eq, ilike, or, sql } from "drizzle-orm"
import SearchResults from "@/components/SearchResults"
import SearchBar from "@/components/SearchBar"

interface SearchParams {
  q?: string
  categorie?: string
}

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { q, categorie } = await searchParams

  // Récupère toutes les catégories pour le filtre
  const allCategories = await db
    .selectDistinct({ category: skills.category })
    .from(skills)
    .orderBy(skills.category)

  // Recherche des compétences + personnes ressources
  let results: Array<{
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
  }> = []

  if (q || categorie) {
    const conditions = []

    if (q) {
      conditions.push(
        ilike(skills.label, `%${q}%`),
        sql`${q} = ANY(${skills.keywords})`
      )
    }

    if (categorie) {
      conditions.push(eq(skills.category, categorie as typeof skills.category._.data))
    }

    results = await db
      .select({
        employeeId: employees.id,
        firstName: employees.firstName,
        lastName: employees.lastName,
        email: employees.email,
        institution: employees.institution,
        jobTitle: employees.jobTitle,
        skillId: skills.id,
        skillLabel: skills.label,
        category: skills.category,
        skillNature: skills.skillNature,
        skillType: skills.skillType,
        sharingLevel: employeeSkills.sharingLevel,
      })
      .from(employeeSkills)
      .innerJoin(employees, eq(employeeSkills.employeeId, employees.id))
      .innerJoin(skills, eq(employeeSkills.skillId, skills.id))
      .where(
        sql`(${employees.isActive} = true AND ${employeeSkills.sharingLevel} != 'individuel' AND (${conditions.length > 0 ? or(...conditions) : sql`true`}))`
      )
      .orderBy(employees.lastName, employees.firstName)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Trouver une personne ressource
        </h1>
        <p className="text-gray-500 text-sm">
          Recherchez par compétence, mot-clé ou parcourez par catégorie
        </p>
      </div>

      <SearchBar
        initialQuery={q}
        initialCategory={categorie}
        categories={allCategories.map((c) => c.category)}
      />

      <div className="mt-8">
        <SearchResults results={results} query={q} />
      </div>
    </div>
  )
}
