import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// ─── Enums ────────────────────────────────────────────────────────────────────

export const categoryEnum = pgEnum("category", [
  "EDUCATION_SPECIALISEE",
  "EDUCATION_PRECOCE",
  "TECHNIQUE",
  "THERAPEUTIQUE",
  "PEDAGOGIE_ORIENTATION",
  "ART_SPORT_CULTURE",
  "MANAGEMENT",
])

export const skillTypeEnum = pgEnum("skill_type", ["METIER", "NON_METIER"])

export const skillNatureEnum = pgEnum("skill_nature", ["CERTIFIE", "EXPERIENTIEL"])

export const sharingLevelEnum = pgEnum("sharing_level", [
  "individuel",
  "equipe",
  "astural",
  "externe",
])

export const userRoleEnum = pgEnum("user_role", ["ADMIN_RH", "COLLABORATEUR"])

// ─── Référentiel de compétences ───────────────────────────────────────────────

export const skills = pgTable("skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  label: text("label").notNull(),
  category: categoryEnum("category").notNull(),
  subcategory: text("subcategory"),
  skillType: skillTypeEnum("skill_type").notNull(),
  skillNature: skillNatureEnum("skill_nature").notNull(),
  keywords: text("keywords").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── Salariés ─────────────────────────────────────────────────────────────────

export const employees = pgTable("employees", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  institution: text("institution").notNull(),
  jobTitle: text("job_title").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── Association Salarié ↔ Compétence ─────────────────────────────────────────

export const employeeSkills = pgTable(
  "employee_skills",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    employeeId: text("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    skillId: text("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    sharingLevel: sharingLevelEnum("sharing_level").notNull().default("astural"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [unique().on(t.employeeId, t.skillId)]
)

// ─── Auth (Better Auth) ───────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("COLLABORATEUR"),
  employeeId: text("employee_id").references(() => employees.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── Types inférés ────────────────────────────────────────────────────────────

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert
export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert
export type EmployeeSkill = typeof employeeSkills.$inferSelect
export type User = typeof users.$inferSelect
