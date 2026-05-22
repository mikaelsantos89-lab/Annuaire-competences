import { db } from "@/lib/db"
import { employees, employeeSkills } from "@/lib/schema"
import { count, eq } from "drizzle-orm"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Salariés</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{list.length} salariés</p>
        </div>
        <Link href="/admin/salaries/nouveau" className={buttonVariants()}>
          + Nouveau salarié
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {list.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm">Aucun salarié pour l'instant</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Fonction</TableHead>
                  <TableHead>Compétences</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </TableCell>
                    <TableCell>{emp.institution}</TableCell>
                    <TableCell>{emp.jobTitle}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{emp.skillCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={emp.isActive ? "default" : "outline"}>
                        {emp.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/salaries/${emp.id}`}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        Gérer →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
