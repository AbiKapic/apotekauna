-- Run after bootstrap.sql and creating this account in Authentication > Users.
do $$
declare admin_id uuid;
begin
  select id into admin_id from auth.users
  where lower(email) = lower('apotekaunapharm@gmail.com');
  if admin_id is null then
    raise exception 'Create apotekaunapharm@gmail.com in Authentication > Users first.';
  end if;
  insert into public.admin_users (user_id) values (admin_id)
  on conflict do nothing;
end;
$$;

select u.email, a.user_id
from public.admin_users a join auth.users u on u.id = a.user_id
where lower(u.email) = lower('apotekaunapharm@gmail.com');
