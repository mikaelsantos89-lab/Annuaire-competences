import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const CATEGORY_LABELS: Record<string, string> = {
  EDUCATION_SPECIALISEE: "Éducation spécialisée",
  EDUCATION_PRECOCE: "Éducation précoce spécialisée",
  TECHNIQUE: "Technique",
  THERAPEUTIQUE: "Thérapeutique",
  PEDAGOGIE_ORIENTATION: "Pédagogie / Orientation",
  ART_SPORT_CULTURE: "Art / Sport / Culture",
  MANAGEMENT: "Management",
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

function groupByEmployee(results: Result[]) {
  const map = new Map<string, {
    employee: Pick<Result, "employeeId" | "firstName" | "lastName" | "email" | "institution" | "jobTitle">
    skills: Array<{ id: string; label: string; category: string; nature: string }>
  }>()
  for (const r of results) {
    if (!map.has(r.employeeId)) {
      map.set(r.employeeId, {
        employee: { employeeId: r.employeeId, firstName: r.firstName, lastName: r.lastName, email: r.email, institution: r.institution, jobTitle: r.jobTitle },
        skills: [],
      })
    }
    map.get(r.employeeId)!.skills.push({ id: r.skillId, label: r.skillLabel, category: r.category, nature: r.skillNature })
  }
  return Array.from(map.values())
}

export default function SearchResults({ results, query }: { results: Result[]; query?: string }) {
  if (!query && results.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-sm">Entrez un mot-clé pour trouver une personne ressource</p>
      </div>
    )
  }
  if (query && results.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-sm font-medium">Aucun résultat pour « {query} »</p>
        <p className="text-xs mt-1">Essayez un autre mot-clé ou parcourez les catégories</p>
      </div>
    )
  }

  const grouped = groupByEmployee(results)

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {grouped.length} personne{grouped.length > 1 ? "s" : ""} · {results.length} compétence{results.length > 1 ? "s" : ""}
      </p>
      {grouped.map(({ employee, skills }) => (
        <Card key={employee.employeeId} className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{employee.firstName} {employee.lastName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{employee.jobTitle} · {employee.institution}</p>
                  <Separator className="my-2.5" />
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-xs font-normal" title={CATEGORY_LABELS[skill.category]}>
                        {skill.label}
                        {skill.nature === "CERTIFIE" && <span className="ml-1 text-primary font-semibold">✓</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href={`mailto:${employee.email}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Contacter
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
