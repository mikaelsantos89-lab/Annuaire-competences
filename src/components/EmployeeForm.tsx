"use client"

import { createEmployee } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

const INSTITUTIONS = ["SEI", "Clair-Val", "Servette", "Externat", "Service général", "Autre"]

export default function EmployeeForm() {
  const [institution, setInstitution] = useState("")

  async function handleAction(formData: FormData) {
    formData.set("institution", institution)
    await createEmployee(formData)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleAction} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email professionnel</Label>
            <Input id="email" name="email" type="email" required placeholder="prenom.nom@astural.ch" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Select onValueChange={(v: string | null) => setInstitution(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTIONS.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Fonction / poste</Label>
              <Input id="jobTitle" name="jobTitle" required placeholder="Éducateur spécialisé" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">Créer le salarié</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
