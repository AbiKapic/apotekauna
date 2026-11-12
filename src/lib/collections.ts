import type { Catalog, Collection, Product } from "../admin/catalog"
export function collectionsFor(
  data: Catalog,
): { sale: Collection; popular: Collection } {
  return (
    data.collections || {
      sale: {
        title: "U Akciji",
        enabled: true,
        items: data.products
          .filter((p) => p.oldPrice && p.oldPrice > p.price)
          .slice(0, 5)
          .map((p) => ({
            productId: p.id,
            discount: Math.round((1 - p.price / p.oldPrice!) * 100),
          })),
      },
      popular: {
        title: "Popularno",
        enabled: true,
        items: data.products
          .slice(0, 5)
          .map((p) => ({ productId: p.id, discount: 0 })),
      },
    }
  )
}
export function applyPromotions(data: Catalog): Catalog {
  const sale = collectionsFor(data).sale
  if (!sale.enabled) return data
  return {
    ...data,
    products: data.products.map((product) => {
      const item = sale.items.find((item) => item.productId === product.id)
      if (
        !item ||
        !Number.isFinite(item.discount) ||
        item.discount <= 0 ||
        item.discount >= 100
      )
        return product
      const original =
        product.oldPrice && product.oldPrice > product.price
          ? product.oldPrice
          : product.price
      return {
        ...product,
        oldPrice: original,
        price: Math.round(original * (1 - item.discount / 100) * 100) / 100,
      }
    }),
  }
}
export function collectionProducts(
  data: Catalog,
  collection: Collection,
): Product[] {
  return collection.items.flatMap((item) => {
    const product = data.products.find((p) => p.id === item.productId)
    return product ? [product] : []
  })
}
