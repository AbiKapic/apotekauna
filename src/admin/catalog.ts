import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { readCatalog } from "../lib/catalog"
import { productChanges } from './product-tools'
export type Product = { id: string; name: string; brand: string; category: string; price: number; oldPrice?: number; image: string; badge?: string; description: string; status?: 'draft' | 'published'; sourceId?: string; sku?: string; barcode?: string; unit?: string; sourceType?: string; reviewFlags?: string[] };
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
    readCatalog(controller.signal, true).then(result => {
      if (controller.signal.aborted) return
      setData(result.content); setVersion(result.version)
    }).catch(() => {
      if (!controller.signal.aborted) setError("Katalog nije dostupan. Pokrenite products.sql u Supabaseu.")
    })
    return () => controller.abort()
  }, [])
  const save = async (next: Catalog) => {
    if (!data) throw new Error('Katalog nije učitan.')
    const delta = productChanges(data.products, next.products)
    const { data: updated, error: failure } = await supabase.rpc("save_admin_content", {
      changes: delta.changes, deleted_ids: delta.deleted,
      next_metadata: { categories: next.categories, advice: next.advice, hero: next.hero, contact: next.contact },
      expected_version: version,
    })
    if (failure) throw new Error(failure.message.includes("catalog_conflict") ? "Katalog je promijenjen u drugom prozoru. Osvježite stranicu prije ponovnog uređivanja." : "Spremanje nije uspjelo. Provjerite pristup i podatke.")
    setData(next); setVersion(Number(updated))
  }
  return { data, error, save }
}
