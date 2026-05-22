"use client"

import { useState, useTransition } from "react"
import { assignSkill, removeSkill } from "@/lib/actions"
import type { Skill } from "@/lib/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const CATEGORY_LABELS: Record<string, string> = {
  EDUCATION_SPECIALISEE: "Éducation spécialisée",
  EDUCATION_PRECOCE: "Éducation précoce spécialisée",
  TECHNIQUE: "Technique",
  THERAPEUTIQUE: "Thérapeutique",
  PEDAGOGIE_ORIENTATION: "Pédagogie / Orientation",
  ART_SPORT_CULTURE: "Art / Sport / Culture",
  MANAGEMENT: "Management",
}

const SHARING_OPTIONS = [
  { value: "individuel", label: "Individuel" },
  { value: "equipe", label: "Mon équipe" },
  { value: "astural", label: "Tout Astural" },
  { value: "externe", label: "Externe" },
] as const

type SharingLevel = "individuel" | "equipe" | "astural" | "externe"

interface Props {
  employeeId: string
  allSkills: Skill[]
  assignedMap: Record<string, string>
}

export default function EmployeeSkillsManager({ employeeId, allSkills, assignedMap }: Props) {
  const [isPending, startTransition] = useTransition()
  const [localAssigned, setLocalAssigned] = useState<Record<string, string>>(assignedMap)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [...new Set(allSkills.map((s) => s.category))]

  const filtered = allSkills.filter((s) => {
    const matchSearch = !search || s.label.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCategory === "all" || s.category === selectedCategory
    return matchSearch && matchCat
  })

  function handleAssign(skillId: string, level: SharingLevel) {
    setLocalAssigned((prev) => ({ ...prev, [skillId]: level }))
    startTransition(async () => {
      await assignSkill(employeeId, skillId, level)
      toast.success("Compétence mise à jour")
    })
  }

  function handleRemove(skillId: string, skillLabel: string) {
    setLocalAssigned((prev) => {
      const next = { ...prev }
      delete next[skillId]
      return next
    })
    startTransition(async () => {
      await removeSkill(employeeId, skillId)
      toast.success(`« ${skillLabel} » retiré`)
    })
  }

  const assignedSkills = allSkills.filter((s) => localAssigned[s.id])
  const unassignedSkills = filtered.filter((s) => !localAssigned[s.id])

  return (
    <div className="space-y-6">
      {/* Compétences assignées */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            Compétences assignées
            <Badge variant="secondary">{assignedSkills.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
              Aucune compétence assignée — utilisez le référentiel ci-dessous
            </p>
          ) : (
            <div className="divide-y">
              {assignedSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{skill.label}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[skill.category]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={localAssigned[skill.id]}
                      onValueChange={(v) => handleAssign(skill.id, (v ?? "astural") as SharingLevel)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-36" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHARING_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(skill.id, skill.label)}
                      disabled={isPending}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Référentiel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ajouter des compétences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans le référentiel…"
              className="flex-1"
            />
            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v ?? "all")}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                <Separator />
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg divide-y max-h-72 overflow-y-auto">
            {unassignedSkills.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">Aucune compétence disponible</p>
            ) : (
              unassignedSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/50">
                  <div>
                    <p className="text-sm">{skill.label}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[skill.category]}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleAssign(skill.id, "astural")}
                    disabled={isPending}
                  >
                    + Ajouter
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
