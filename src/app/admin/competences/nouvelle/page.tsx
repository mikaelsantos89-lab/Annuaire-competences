import { createSkill } from "@/lib/actions"
import Link from "next/link"

const CATEGORIES = [
  { value: "EDUCATION_SPECIALISEE", label: "Éducation spécialisée" },
  { value: "EDUCATION_PRECOCE", label: "Éducation précoce spécialisée" },
  { value: "TECHNIQUE", label: "Technique" },
  { value: "THERAPEUTIQUE", label: "Thérapeutique" },
  { value: "PEDAGOGIE_ORIENTATION", label: "Pédagogie / Orientation" },
  { value: "ART_SPORT_CULTURE", label: "Art / Sport / Culture" },
  { value: "MANAGEMENT", label: "Management" },
]

export default function NouvelleCompetencePage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/competences" className="text-sm text-gray-400 hover:text-gray-600">
          ← Référentiel
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Nouvelle compétence</h1>
      </div>

      <form action={createSkill} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Libellé <span className="text-red-500">*</span>
          </label>
          <input
            name="label"
            required
            placeholder="Ex. Approche systémique, Logopédie, Bulgare…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sous-catégorie</label>
            <input
              name="subcategory"
              placeholder="Facultatif"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="skillType"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir…</option>
              <option value="METIER">Métier</option>
              <option value="NON_METIER">Hors métier</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nature <span className="text-red-500">*</span>
            </label>
            <select
              name="skillNature"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir…</option>
              <option value="CERTIFIE">Certifiée (diplôme, formation)</option>
              <option value="EXPERIENTIEL">Expérientielle</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mots-clés <span className="text-gray-400 font-normal">(séparés par des virgules)</span>
          </label>
          <input
            name="keywords"
            placeholder="autisme, TSA, accompagnement précoce…"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Ces mots-clés permettent de retrouver la compétence même si l'utilisateur ne tape pas le libellé exact.</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/competences"
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer la compétence
          </button>
        </div>
      </form>
    </div>
  )
}
