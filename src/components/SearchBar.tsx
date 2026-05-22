"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useTransition } from "react"

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (category) params.set("categorie", category)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function handleReset() {
    setQuery("")
    setCategory("")
    startTransition(() => router.push(pathname))
  }

  return (
    <form onSubmit={handleSearch} className="space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Logopédie, autisme, yoga, bulgare…"
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? "…" : "Rechercher"}
        </button>
        {(initialQuery || initialCategory) && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg bg-white"
          >
            Effacer
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                const newCat = category === cat ? "" : cat
                setCategory(newCat)
                const params = new URLSearchParams()
                if (query.trim()) params.set("q", query.trim())
                if (newCat) params.set("categorie", newCat)
                startTransition(() => router.push(`${pathname}?${params.toString()}`))
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
