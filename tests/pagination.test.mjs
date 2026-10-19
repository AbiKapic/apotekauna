import test from 'node:test'
import assert from 'node:assert/strict'
import { paginate } from '../src/lib/pagination.ts'

test('pages cover every product once and only render the requested batch', () => {
  const products = Array.from({ length: 149 }, (_, id) => ({ id }))
  const pages = Array.from({ length: 13 }, (_, i) => paginate(products, i + 1, 12))
  assert.equal(pages[0].items.length, 12)
  assert.equal(pages[12].items.length, 5)
  assert.equal(pages[12].end, 149)
  assert.deepEqual(pages.flatMap(p => p.items), products)
})

test('a narrowed filter clamps an old page and empty results have a zero range', () => {
  const narrowed = paginate(['match'], 20, 8)
  assert.equal(narrowed.page, 1)
  assert.deepEqual(narrowed.items, ['match'])
  assert.deepEqual(paginate([], 10, 12), { page: 1, pages: 1, start: 0, end: 0, items: [] })
})

test('invalid URL page values safely select the first page', () => {
  for (const page of [NaN, Infinity, -1, 0, 1.5]) {
    assert.equal(paginate([1, 2, 3], page, 1).page, 1)
  }
})
