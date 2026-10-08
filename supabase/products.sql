-- Run after bootstrap.sql. Existing storefront metadata and admin users are preserved.
begin;
create table if not exists public.products (
  id text primary key,
  name text not null check (length(trim(name)) > 0),
  brand text not null default '',
  category text not null default '',
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2),
  image text not null default '',
  badge text not null default '',
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  source_id text,
  sku text not null default '',
  barcode text not null default '',
  unit text not null default '',
  source_type text not null default '',
  source_file text not null default '',
  source_row integer,
  review_flags text[] not null default '{}',
  source_data jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  check (old_price is null or old_price > price),
  check (status <> 'published' or (price > 0 and category <> ''))
);
create unique index if not exists products_source_id on public.products(source_id) where source_id is not null;
create index if not exists products_status_name on public.products(status, name, id);
create index if not exists products_barcode on public.products(barcode);
alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select (id,name,brand,category,price,old_price,image,badge,description,status) on public.products to anon;
grant select on public.products to authenticated;
drop policy if exists "Published products" on public.products;
create policy "Published products" on public.products for select to anon, authenticated using (status = 'published');
drop policy if exists "Admin product drafts" on public.products;
create policy "Admin product drafts" on public.products for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

-- One transaction saves only changed products plus categories/articles metadata.
-- Catalog version serializes concurrent admin edits and imports.
create or replace function public.save_admin_content(
  changes jsonb, deleted_ids jsonb, next_metadata jsonb, expected_version bigint
) returns bigint language plpgsql security definer set search_path = '' as $$
declare
  current_version bigint;
  entry jsonb;
  product_status text;
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid()) then
    raise exception 'admin_access_required' using errcode = '42501';
  end if;
  select version into current_version from public.store_catalog where id = 1 for update;
  if current_version is null or current_version <> expected_version then
    raise exception 'catalog_conflict';
  end if;
  if jsonb_typeof(changes) is distinct from 'array'
    or jsonb_typeof(deleted_ids) is distinct from 'array'
    or jsonb_typeof(next_metadata->'categories') is distinct from 'array'
    or jsonb_typeof(next_metadata->'advice') is distinct from 'array'
    or jsonb_typeof(next_metadata->'contact') is distinct from 'object'
    or jsonb_typeof(next_metadata->'hero') is distinct from 'string' then
    raise exception 'invalid_catalog';
  end if;
  delete from public.products where id in (select jsonb_array_elements_text(deleted_ids));
  for entry in select value from jsonb_array_elements(changes) loop
    product_status := coalesce(entry->>'status', 'draft');
    if jsonb_typeof(entry->'price') is distinct from 'number'
      or nullif(trim(entry->>'id'), '') is null
      or nullif(trim(entry->>'name'), '') is null
      or product_status not in ('draft', 'published') then
      raise exception 'invalid_product';
    end if;
    if coalesce(entry->>'image', '') <> '' and (entry->>'image') !~ '^https://' then
      raise exception 'image_requires_https';
    end if;
    if product_status = 'published' and (
      (entry->>'price')::numeric <= 0 or not exists (
        select 1 from jsonb_array_elements(next_metadata->'categories') c where c->>'id' = entry->>'category'
      )
    ) then raise exception 'publish_requires_price_and_category'; end if;
    insert into public.products (id,name,brand,category,price,old_price,image,badge,description,status,sku,barcode)
    values (entry->>'id',trim(entry->>'name'),coalesce(entry->>'brand',''),coalesce(entry->>'category',''),
      (entry->>'price')::numeric,nullif(entry->>'oldPrice','')::numeric,coalesce(entry->>'image',''),
      coalesce(entry->>'badge',''),coalesce(entry->>'description',''),product_status,
      coalesce(entry->>'sku',''),coalesce(entry->>'barcode',''))
    on conflict (id) do update set name=excluded.name,brand=excluded.brand,category=excluded.category,
      price=excluded.price,old_price=excluded.old_price,image=excluded.image,badge=excluded.badge,
      description=excluded.description,status=excluded.status,updated_at=now();
    -- Source identifiers, barcode and provenance stay intact for imported records.
  end loop;
  if exists (select 1 from public.products p where p.category <> '' and not exists (
    select 1 from jsonb_array_elements(next_metadata->'categories') c where c->>'id' = p.category
  )) then raise exception 'category_in_use'; end if;
  update public.store_catalog set
    content = content || jsonb_build_object('categories',next_metadata->'categories','advice',next_metadata->'advice',
      'hero',next_metadata->'hero','contact',next_metadata->'contact'),
    version = version + 1, updated_at = now() where id = 1;
  return current_version + 1;
end;
$$;
revoke all on function public.save_admin_content(jsonb,jsonb,jsonb,bigint) from public, anon;
grant execute on function public.save_admin_content(jsonb,jsonb,jsonb,bigint) to authenticated;
commit;
