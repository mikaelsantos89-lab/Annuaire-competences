import { db } from "@/lib/db"
import { skills } from "@/lib/schema"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Référentiel de compétences</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{list.length} compétences</p>
        </div>
        <Link href="/admin/competences/nouvelle" className={buttonVariants()}>
          + Nouvelle compétence
        </Link>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16 text-muted-foreground">
            <p className="text-sm">Aucune compétence dans le référentiel</p>
            <Link href="/admin/competences/nouvelle" className={buttonVariants({ variant: "link" })}>
              Créer la première compétence →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {CATEGORY_LABELS[category] ?? category}
                  <Badge variant="secondary">{catSkills.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y">
                  {catSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{skill.label}</p>
                        {skill.subcategory && (
                          <p className="text-xs text-muted-foreground">{skill.subcategory}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant={skill.skillNature === "CERTIFIE" ? "default" : "secondary"} className="text-xs h-5">
                            {skill.skillNature === "CERTIFIE" ? "Certifiée" : "Expérientielle"}
                          </Badge>
                          <Badge variant="outline" className="text-xs h-5">
                            {skill.skillType === "METIER" ? "Métier" : "Hors métier"}
                          </Badge>
                        </div>
                      </div>
                      <Link
                        href={`/admin/competences/${skill.id}`}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        Modifier →
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
