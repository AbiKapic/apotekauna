"""Read XLS exports and prepare a private, idempotent SQL import. Never writes to Supabase."""
import argparse, collections, json, sys
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--reader-path', required=True)
parser.add_argument('--source-dir', required=True)
parser.add_argument('--output-dir', default='imports')
args = parser.parse_args()
sys.path.insert(0, args.reader_path)
import xlrd

names = ['sifrarnik_artikala_20261005154239.xls', 'sifrarnik_artikala_20261005154303.xls']
raw = []
for name in names:
    book = xlrd.open_workbook(str(Path(args.source_dir) / name))
    sheet = book.sheet_by_index(0)
    headers = sheet.row_values(0)
    assert headers == ['ID','SIFRA','BARKOD','EKST_SIFRA','NAZIV','JED','PROIZVODJAC','GP','VRSTA','GRUPE','ATC','JIDL','DRG','IGL','MPC']
    for row in range(1, sheet.nrows):
        values = dict(zip(headers, sheet.row_values(row)))
        raw.append((values, name, row + 1))

def text(value):
    if isinstance(value, float) and value.is_integer(): return str(int(value))
    return str(value).strip()

selected = [(r, f, n) for r, f, n in raw if text(r['BARKOD'])]
assert len(raw) == 4013 and len(selected) == 2456
barcodes = collections.Counter(text(r['BARKOD']) for r, _, _ in selected)
skus = collections.Counter(text(r['SIFRA']) for r, _, _ in selected)

def valid_gtin(code):
    if not code.isdigit() or len(code) not in (8, 12, 13, 14): return False
    total = sum(int(digit) * (3 if index % 2 == 0 else 1) for index, digit in enumerate(reversed(code[:-1])))
    return (10 - total % 10) % 10 == int(code[-1])

products = []
for row, filename, line in selected:
    source_id = text(row['ID'])
    manufacturer = text(row['PROIZVODJAC'])
    if manufacturer.casefold() in ('nije uneseno', '0'): manufacturer = ''
    barcode = text(row['BARKOD'])
    flags = []
    if barcodes[barcode] > 1: flags.append('duplicate_barcode')
    if not valid_gtin(barcode): flags.append('invalid_barcode')
    if not manufacturer: flags.append('missing_brand')
    if row['MPC'] == 0: flags.append('zero_price')
    if skus[text(row['SIFRA'])] > 1: flags.append('duplicate_sku')
    products.append(dict(
        id='source-' + source_id, source_id=source_id, sku=text(row['SIFRA']), barcode=barcode,
        name=text(row['NAZIV']), brand=manufacturer, price=row['MPC'], category='',
        image='', description='', badge='', status='draft', unit=text(row['JED']),
        source_type=text(row['VRSTA']), source_file=filename, source_row=line,
        review_flags=flags, source_data=row,
    ))
assert len({p['id'] for p in products}) == len(products)
assert all(p['name'] and p['barcode'] and p['price'] >= 0 for p in products)

out = Path(args.output_dir)
out.mkdir(parents=True, exist_ok=True)
payload = json.dumps(products, ensure_ascii=False, separators=(',', ':'))
assert '$products$' not in payload
sql = '''-- Private import. Run products.sql first. All imported records start as drafts.
-- Existing records are preserved if this file is run again.
begin;
select version from public.store_catalog where id = 1 for update;
insert into public.products
  (id,source_id,sku,barcode,name,brand,price,category,image,description,badge,status,unit,source_type,source_file,source_row,review_flags,source_data)
select id,source_id,sku,barcode,name,brand,price,category,image,description,badge,status,unit,source_type,source_file,source_row,review_flags,source_data
from jsonb_to_recordset($products$''' + payload + '''$products$::jsonb) as r(
  id text,source_id text,sku text,barcode text,name text,brand text,price numeric,category text,image text,
  description text,badge text,status text,unit text,source_type text,source_file text,source_row integer,review_flags text[],source_data jsonb
)
on conflict (id) do nothing;
update public.store_catalog set version = version + 1, updated_at = now() where id = 1;
commit;
select count(*) as imported_products,
  count(*) filter (where image = '') as without_image,
  count(*) filter (where status = 'draft') as drafts
from public.products where source_id is not null;
'''
(out / 'products-import.sql').write_text(sql, encoding='utf-8')
prefix, _, suffix = sql.split('$products$')
for index, start in enumerate(range(0, len(products), 500), 1):
    part = json.dumps(products[start:start+500], ensure_ascii=False, separators=(',', ':'))
    (out / f'products-import-{index:02d}.sql').write_text(prefix + '$products$' + part + '$products$' + suffix, encoding='utf-8')
(out / 'products.json').write_text(payload, encoding='utf-8')
summary = dict(source_rows=len(raw), excluded_without_barcode=len(raw)-len(selected), import_rows=len(products),
    by_source_type=dict(collections.Counter(p['source_type'] for p in products)),
    flags=dict(collections.Counter(flag for p in products for flag in p['review_flags'])),
    status='draft', unique_ids=len({p['id'] for p in products}),
    barcode_collision_groups=sum(count > 1 for count in barcodes.values()))
(out / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=True))
