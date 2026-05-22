import { createSkill } from "@/lib/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/competences" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          ← Référentiel
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">Nouvelle compétence</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={createSkill} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="label">
                Libellé <span className="text-destructive">*</span>
              </Label>
              <Input id="label" name="label" required placeholder="Ex. Approche systémique, Logopédie, Bulgare…" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie <span className="text-destructive">*</span></Label>
                <Select name="category">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Sous-catégorie</Label>
                <Input id="subcategory" name="subcategory" placeholder="Facultatif" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <Select name="skillType">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="METIER">Métier</SelectItem>
                    <SelectItem value="NON_METIER">Hors métier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nature <span className="text-destructive">*</span></Label>
                <Select name="skillNature">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CERTIFIE">Certifiée (diplôme, formation)</SelectItem>
                    <SelectItem value="EXPERIENTIEL">Expérientielle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">
                Mots-clés{" "}
                <span className="text-muted-foreground font-normal">(séparés par des virgules)</span>
              </Label>
              <Input id="keywords" name="keywords" placeholder="autisme, TSA, accompagnement précoce…" />
              <p className="text-xs text-muted-foreground">
                Ces mots-clés permettent de retrouver la compétence même si l'utilisateur ne tape pas le libellé exact.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/admin/competences" className={buttonVariants({ variant: "outline" })}>
                Annuler
              </Link>
              <Button type="submit">Créer la compétence</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
