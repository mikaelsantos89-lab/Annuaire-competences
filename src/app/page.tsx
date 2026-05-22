import { redirect } from "next/navigation"

// La racine redirige vers la recherche (page principale pour les collaborateurs)
export default function Home() {
  redirect("/recherche")
}
