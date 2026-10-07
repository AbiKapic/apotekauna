begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
drop policy if exists "Read own admin membership" on public.admin_users;
create policy "Read own admin membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.store_catalog (
  id integer primary key check (id = 1),
  content jsonb not null check (
    jsonb_typeof(content->'products') = 'array'
    and jsonb_typeof(content->'categories') = 'array'
    and jsonb_typeof(content->'advice') = 'array'
    and content ?& array['products', 'categories', 'advice', 'hero', 'contact']
  ),
  version bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.store_catalog enable row level security;
revoke all on public.store_catalog from anon, authenticated;
grant select on public.store_catalog to anon, authenticated;
drop policy if exists "Read public catalog" on public.store_catalog;
create policy "Read public catalog" on public.store_catalog
  for select to anon, authenticated using (true);

create or replace function public.save_store_catalog(next_content jsonb, expected_version bigint)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare new_version bigint;
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid()) then
    raise exception 'admin_access_required' using errcode = '42501';
  end if;
  if next_content is null
    or jsonb_typeof(next_content->'products') is distinct from 'array'
    or jsonb_typeof(next_content->'categories') is distinct from 'array'
    or jsonb_typeof(next_content->'advice') is distinct from 'array'
    or jsonb_typeof(next_content->'contact') is distinct from 'object'
    or jsonb_typeof(next_content->'hero') is distinct from 'string' then
    raise exception 'invalid_catalog';
  end if;
  if exists (
    select 1 from jsonb_array_elements(next_content->'products') p
    where jsonb_typeof(p->'price') is distinct from 'number'
      or not (p ?& array['id', 'name', 'brand', 'category', 'price', 'image', 'description'])
  ) then raise exception 'invalid_product'; end if;
  if exists (
    select 1 from jsonb_array_elements(next_content->'products') p
    where (p->>'price')::numeric < 0
      or not exists (select 1 from jsonb_array_elements(next_content->'categories') c where c->>'id' = p->>'category')
  ) then raise exception 'invalid_product_category_or_price'; end if;
  update public.store_catalog
    set content = next_content, version = version + 1, updated_at = now()
    where id = 1 and version = expected_version
    returning version into new_version;
  if new_version is null then raise exception 'catalog_conflict'; end if;
  return new_version;
end;
$$;
revoke all on function public.save_store_catalog(jsonb, bigint) from public, anon;
grant execute on function public.save_store_catalog(jsonb, bigint) to authenticated;

commit;
