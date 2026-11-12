import test from "node:test"
import assert from "node:assert/strict"
import {
  applyPromotions,
  collectionsFor,
  collectionProducts,
} from "../src/lib/collections.ts"
const product = {
  id: "a",
  name: "A",
  price: 20,
  image: "",
  brand: "",
  description: "",
  category: "health",
}
const catalog = {
  products: [product],
  categories: [],
  advice: [],
  hero: "",
  contact: {},
}
test("sale price applies once, keeps regular price, and rounds currency", () => {
  const data = {
    ...catalog,
    collections: {
      sale: {
        title: "Sale",
        enabled: true,
        items: [{ productId: "a", discount: 17 }],
      },
      popular: { title: "Popular", enabled: true, items: [] },
    },
  }
  const result = applyPromotions(data)
  assert.equal(result.products[0].price, 16.6)
  assert.equal(result.products[0].oldPrice, 20)
  assert.equal(applyPromotions(result).products[0].price, 16.6)
  assert.equal(product.price, 20)
  data.collections.sale.enabled = false
  assert.equal(applyPromotions(data).products[0].price, 20)
})
test("curated ordering excludes deleted products and respects an empty selection", () => {
  const list = {
    title: "Popular",
    enabled: true,
    items: [
      { productId: "missing", discount: 0 },
      { productId: "a", discount: 0 },
    ],
  }
  assert.deepEqual(collectionProducts(catalog, list), [product])
  assert.deepEqual(collectionProducts(catalog, { ...list, items: [] }), [])
})
test("legacy catalogs use existing discounts without inventing sale prices", () => {
  assert.deepEqual(collectionsFor(catalog).sale.items, [])
  assert.equal(collectionsFor(catalog).popular.items.length, 1)
  assert.equal(applyPromotions(catalog).products[0].price, 20)
})
