import { db } from "@/lib/db"
import { employees, skills, employeeSkills } from "@/lib/schema"
import { count, eq } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

export default async function AdminPage() {
  const [employeeCount] = await db.select({ count: count() }).from(employees).where(eq(employees.isActive, true))
  const [skillCount] = await db.select({ count: count() }).from(skills)
  const [linkCount] = await db.select({ count: count() }).from(employeeSkills)

  const stats = [
    { label: "Salariés actifs", value: employeeCount.count, href: "/admin/salaries" },
    { label: "Compétences référencées", value: skillCount.count, href: "/admin/competences" },
    { label: "Associations salarié ↔ compétence", value: linkCount.count, href: "/admin/salaries" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Tableau de bord RH</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestion de l'annuaire de compétences Astural</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Salariés</CardTitle>
            <CardDescription>Ajouter un salarié lors de son onboarding et gérer ses compétences.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href="/admin/salaries/nouveau" className={buttonVariants({ size: "sm" })}>
              + Nouveau salarié
            </Link>
            <Link href="/admin/salaries" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Voir tous
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Référentiel de compétences</CardTitle>
            <CardDescription>Gérer la liste des compétences disponibles dans l'annuaire.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href="/admin/competences/nouvelle" className={buttonVariants({ size: "sm" })}>
              + Nouvelle compétence
            </Link>
            <Link href="/admin/competences" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Voir toutes
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
