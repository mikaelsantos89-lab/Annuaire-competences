"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const CATEGORY_LABELS: Record<string, string> = {
  EDUCATION_SPECIALISEE: "Éducation spécialisée",
  EDUCATION_PRECOCE: "Éducation précoce spécialisée",
  TECHNIQUE: "Technique",
  THERAPEUTIQUE: "Thérapeutique",
  PEDAGOGIE_ORIENTATION: "Pédagogie / Orientation",
  ART_SPORT_CULTURE: "Art / Sport / Culture",
  MANAGEMENT: "Management",
}

interface SearchBarProps {
  initialQuery?: string
  initialCategory?: string
  categories: string[]
}

export default function SearchBar({ initialQuery, initialCategory, categories }: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(initialQuery ?? "")
  const [category, setCategory] = useState(initialCategory ?? "")

  function push(q: string, cat: string) {
    const params = new URLSearchParams()
    if (q.trim()) params.set("q", q.trim())
    if (cat) params.set("categorie", cat)
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    push(query, category)
  }

  function handleCategoryToggle(cat: string) {
    const next = category === cat ? "" : cat
    setCategory(next)
    push(query, next)
  }

  function handleReset() {
    setQuery("")
    setCategory("")
    startTransition(() => router.push(pathname))
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Logopédie, autisme, yoga, bulgare…"
          className="flex-1"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "…" : "Rechercher"}
        </Button>
        {(initialQuery || initialCategory) && (
          <Button type="button" variant="outline" onClick={handleReset}>
            Effacer
          </Button>
        )}
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={category === cat ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                category !== cat && "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleCategoryToggle(cat)}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
