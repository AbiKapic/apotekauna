import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { readCatalog } from "../lib/catalog"
export type Product = { id: string; name: string; brand: string; category: string; price: number; oldPrice?: number; image: string; badge?: string; description: string };
export type Category = { id: string; name: string; description: string; icon: string; image?: string };
export type Advice = { id: string; title: string; summary: string; image: string; content: string; tag: string };
export type Catalog = { products: Product[]; categories: Category[]; advice: Advice[]; hero: string; contact: { email: string; phone: string; hours: string } };
export const remoteCatalog = true
export function useCatalog() {
  const [data, setData] = useState<Catalog | null>(null)
  const [version, setVersion] = useState(0)
  const [error, setError] = useState("")
  useEffect(() => {
    const controller = new AbortController()
    readCatalog(controller.signal).then(result => {
      if (controller.signal.aborted) return
      setData(result.content); setVersion(result.version)
    }).catch(() => {
      if (!controller.signal.aborted) setError("Katalog nije dostupan. Pokrenite SQL postavku u Supabaseu.")
    })
    return () => controller.abort()
  }, [])
  const save = async (next: Catalog) => {
    const { data: updated, error: failure } = await supabase.rpc("save_store_catalog", { next_content: next, expected_version: version })
    if (failure) throw new Error(failure.message.includes("catalog_conflict") ? "Katalog je promijenjen u drugom prozoru. Osvježite stranicu prije ponovnog uređivanja." : "Spremanje nije uspjelo. Provjerite pristup i podatke.")
    setData(next); setVersion(Number(updated))
  }
  return { data, error, save }
}
