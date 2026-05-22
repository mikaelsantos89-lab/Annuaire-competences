"use client"

import { useState, useTransition } from "react"
import { assignSkill, removeSkill } from "@/lib/actions"
import type { Skill } from "@/lib/schema"

const CATEGORY_LABELS: Record<string, string> = {
  EDUCATION_SPECIALISEE: "Éducation spécialisée",
  EDUCATION_PRECOCE: "Éducation précoce spécialisée",
  TECHNIQUE: "Technique",
  THERAPEUTIQUE: "Thérapeutique",
  PEDAGOGIE_ORIENTATION: "Pédagogie / Orientation",
  ART_SPORT_CULTURE: "Art / Sport / Culture",
  MANAGEMENT: "Management",
}

const SHARING_LABELS = {
  individuel: "Individuel",
  equipe: "Mon équipe",
  astural: "Tout Astural",
  externe: "Externe",
}

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
  const [selectedCategory, setSelectedCategory] = useState("")

  const categories = [...new Set(allSkills.map((s) => s.category))]

  const filtered = allSkills.filter((s) => {
    const matchSearch = !search || s.label.toLowerCase().includes(search.toLowerCase())
    const matchCat = !selectedCategory || s.category === selectedCategory
    return matchSearch && matchCat
  })

  function handleAssign(skillId: string, level: SharingLevel) {
    setLocalAssigned((prev) => ({ ...prev, [skillId]: level }))
    startTransition(() => assignSkill(employeeId, skillId, level))
  }

  function handleRemove(skillId: string) {
    setLocalAssigned((prev) => {
      const next = { ...prev }
      delete next[skillId]
      return next
    })
    startTransition(() => removeSkill(employeeId, skillId))
  }

  const assignedSkills = allSkills.filter((s) => localAssigned[s.id])
  const unassignedSkills = filtered.filter((s) => !localAssigned[s.id])

  return (
    <div className="space-y-6">
      {/* Compétences assignées */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">
          Compétences assignées
          <span className="ml-2 text-sm font-normal text-gray-500">({assignedSkills.length})</span>
        </h2>

        {assignedSkills.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl py-8 text-center text-gray-400 text-sm">
            Aucune compétence assignée — utilisez le référentiel ci-dessous
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {assignedSkills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{skill.label}</p>
                  <p className="text-xs text-gray-400">{CATEGORY_LABELS[skill.category]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={localAssigned[skill.id]}
                    onChange={(e) => handleAssign(skill.id, e.target.value as SharingLevel)}
                    disabled={isPending}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(SHARING_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemove(skill.id)}
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    title="Retirer cette compétence"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Référentiel — ajouter des compétences */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Ajouter des compétences</h2>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans le référentiel…"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {unassignedSkills.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">Aucune compétence disponible</p>
          ) : (
            unassignedSkills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-sm text-gray-900">{skill.label}</p>
                  <p className="text-xs text-gray-400">{CATEGORY_LABELS[skill.category]}</p>
                </div>
                <button
                  onClick={() => handleAssign(skill.id, "astural")}
                  disabled={isPending}
                  className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  + Ajouter
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
