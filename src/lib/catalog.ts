import { supabase } from "./supabase"
import type { Catalog } from "../admin/catalog"

export async function readCatalog(signal?: AbortSignal) {
  let query = supabase.from("store_catalog").select("content,version").eq("id", 1)
  if (signal) query = query.abortSignal(signal)
  const { data, error } = await query.single()
  if (error) throw new Error("Katalog nije dostupan. Provjerite Supabase postavke.")
  if (!data?.content || !Array.isArray(data.content.products) || !Array.isArray(data.content.categories) || !Array.isArray(data.content.advice)) throw new Error("Katalog nema ispravnu strukturu.")
  return { content: data.content as Catalog, version: data.version as number }
}

export async function readStorefrontCatalog(signal: AbortSignal): Promise<Catalog> {
  try { return (await readCatalog(signal)).content }
  catch (error) {
    if (signal.aborted) throw error
    // Preserve the existing storefront during initial database setup/outages.
    const response = await fetch(`${import.meta.env.BASE_URL}catalog.json`, { signal })
    if (!response.ok) throw error
    return response.json()
  }
}
