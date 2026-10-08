import test from 'node:test'
import assert from 'node:assert/strict'
import { matchesProduct, effectiveReviewFlags, productChanges } from '../src/admin/product-tools.ts'

const item = { id:'source-11579',sourceId:'11579',sku:'11579',barcode:'4250382203858',name:'Coenzym Q10',brand:'',category:'',price:37.1,image:'',description:'',status:'draft',reviewFlags:['missing_brand','duplicate_barcode'] }
test('image, status, category and barcode filters combine without losing source identifiers', () => {
  assert.equal(matchesProduct(item,'4250382203858','__none','missing','draft','review'),true)
  assert.equal(matchesProduct(item,'','', 'present','',''),false)
  assert.equal(matchesProduct({...item,image:'https://example.com/a.jpg'},'Q10','','present','draft',''),true)
  assert.equal(matchesProduct(item,'','', '','published',''),false)
  assert.equal(matchesProduct({...item,image:'   '},'11579','','missing','',''),true)
})
test('corrected manufacturer and price stop displaying resolved quality issues', () => {
  assert.deepEqual(effectiveReviewFlags({...item,brand:'Manufacturer',reviewFlags:['missing_brand','zero_price','duplicate_barcode']}),['duplicate_barcode'])
  assert.ok(effectiveReviewFlags({...item,price:0}).includes('zero_price'))
})
test('saving one image sends only the changed row and preserves imported fields', () => {
  const other = {...item,id:'source-2'}
  const updated = {...item,image:'https://example.com/a.jpg'}
  const delta = productChanges([item,other],[updated,other])
  assert.equal(delta.changes.length,1)
  assert.equal(delta.changes[0].barcode,item.barcode)
  assert.deepEqual(delta.deleted,[])
  assert.deepEqual(productChanges([item,other],[item]).deleted,['source-2'])
})
