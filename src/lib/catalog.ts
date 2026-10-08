import { supabase } from './supabase'
import type { Catalog, Product } from '../admin/catalog'

const publicColumns = 'id,name,brand,category,price,old_price,image,badge,description,status'
const adminColumns = `${publicColumns},source_id,sku,barcode,unit,source_type,review_flags`

async function readProducts(signal?: AbortSignal, admin = false): Promise<Product[]> {
  const products: Product[] = []
  // Explicit ranges prevent silently losing rows after the API's row limit.
  for (let offset = 0; ; offset += 500) {
    let query = supabase.from('products').select(admin ? adminColumns : publicColumns).order('id').range(offset, offset + 499)
    if (!admin) query = query.eq('status', 'published')
    if (signal) query = query.abortSignal(signal)
    const { data, error } = await query
    if (error) throw error
    for (const row of data || []) {
      const item = row as unknown as Record<string, unknown>
      products.push({
        id: String(item.id), name: String(item.name), brand: String(item.brand || ''), category: String(item.category || ''),
        price: Number(item.price), oldPrice: item.old_price == null ? undefined : Number(item.old_price),
        image: String(item.image || ''), badge: String(item.badge || ''), description: String(item.description || ''),
        status: item.status as Product['status'],
        ...(admin ? { sourceId: String(item.source_id || ''), sku: String(item.sku || ''), barcode: String(item.barcode || ''),
          unit: String(item.unit || ''), sourceType: String(item.source_type || ''), reviewFlags: item.review_flags as string[] } : {}),
      })
    }
    if (!data || data.length < 500) break
  }
  return products
}

export async function readCatalog(signal?: AbortSignal, admin = false) {
  let query = supabase.from('store_catalog').select('content,version').eq('id', 1)
  if (signal) query = query.abortSignal(signal)
  const { data, error } = await query.single()
  if (error) throw error
  if (!data?.content || !Array.isArray(data.content.categories) || !Array.isArray(data.content.advice)) throw new Error('Katalog nema ispravnu strukturu.')
  const products = await readProducts(signal, admin)
  return { content: { ...data.content, products } as Catalog, version: Number(data.version) }
}

export async function readStorefrontCatalog(signal: AbortSignal): Promise<Catalog> {
  try { return (await readCatalog(signal)).content }
  catch (error) {
    if (signal.aborted) throw error
    const response = await fetch(`${import.meta.env.BASE_URL}catalog.json`, { signal })
    if (!response.ok) throw error
    return response.json()
  }
}
