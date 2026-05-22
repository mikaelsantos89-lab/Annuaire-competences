"use server"

import { db } from "./db"
import { employees, skills, employeeSkills } from "./schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// ─── Salariés ─────────────────────────────────────────────────────────────────

export async function createEmployee(formData: FormData) {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const institution = formData.get("institution") as string
  const jobTitle = formData.get("jobTitle") as string

  const [created] = await db
    .insert(employees)
    .values({ firstName, lastName, email, institution, jobTitle })
    .returning({ id: employees.id })

  revalidatePath("/admin/salaries")
  redirect(`/admin/salaries/${created.id}`)
}

export async function toggleEmployeeActive(employeeId: string, isActive: boolean) {
  await db.update(employees).set({ isActive }).where(eq(employees.id, employeeId))
  revalidatePath("/admin/salaries")
  revalidatePath(`/admin/salaries/${employeeId}`)
}

// ─── Compétences du référentiel ───────────────────────────────────────────────

export async function createSkill(formData: FormData) {
  const label = formData.get("label") as string
  const category = formData.get("category") as typeof skills.category._.data
  const subcategory = (formData.get("subcategory") as string) || null
  const skillType = formData.get("skillType") as typeof skills.skillType._.data
  const skillNature = formData.get("skillNature") as typeof skills.skillNature._.data
  const keywordsRaw = (formData.get("keywords") as string) || ""
  const keywords = keywordsRaw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)

  await db.insert(skills).values({ label, category, subcategory, skillType, skillNature, keywords })

  revalidatePath("/admin/competences")
  redirect("/admin/competences")
}

// ─── Association salarié ↔ compétence ────────────────────────────────────────

export async function assignSkill(
  employeeId: string,
  skillId: string,
  sharingLevel: typeof employeeSkills.sharingLevel._.data
) {
  await db
    .insert(employeeSkills)
    .values({ employeeId, skillId, sharingLevel })
    .onConflictDoUpdate({
      target: [employeeSkills.employeeId, employeeSkills.skillId],
      set: { sharingLevel, updatedAt: new Date() },
    })

  revalidatePath(`/admin/salaries/${employeeId}`)
}

export async function removeSkill(employeeId: string, skillId: string) {
  await db
    .delete(employeeSkills)
    .where(eq(employeeSkills.employeeId, employeeId))

  revalidatePath(`/admin/salaries/${employeeId}`)
}
