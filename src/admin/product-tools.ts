import type { Product } from './catalog'

export function effectiveReviewFlags(product: Product) {
  const flags = (product.reviewFlags || []).filter(flag => flag !== 'missing_brand' && flag !== 'zero_price')
  if (!product.brand.trim()) flags.push('missing_brand')
  if (product.price <= 0) flags.push('zero_price')
  return flags
}

export function matchesProduct(product: Product, query: string, category: string, image: string, status: string, review: string) {
  const haystack = `${product.name} ${product.brand} ${product.sku || ''} ${product.barcode || ''} ${product.sourceId || ''}`.toLocaleLowerCase()
  return haystack.includes(query.trim().toLocaleLowerCase())
    && (!category || (category === '__none' ? !product.category : product.category === category))
    && (!image || (image === 'missing' ? !product.image.trim() : Boolean(product.image.trim())))
    && (!status || product.status === status)
    && (!review || effectiveReviewFlags(product).length > 0)
}

export function productChanges(previous: Product[], next: Product[]) {
  const originals = new Map(previous.map(item => [item.id, item]))
  const ids = new Set(next.map(item => item.id))
  return {
    changes: next.filter(item => JSON.stringify(item) !== JSON.stringify(originals.get(item.id))),
    deleted: previous.filter(item => !ids.has(item.id)).map(item => item.id),
  }
}

export const reviewLabels: Record<string, string> = {
  duplicate_barcode: 'Barkod koristi više artikala',
  invalid_barcode: 'Provjeriti format ili kontrolnu cifru barkoda',
  missing_brand: 'Nedostaje proizvođač',
  zero_price: 'Cijena je 0',
  duplicate_sku: 'Šifru koristi više artikala',
}
