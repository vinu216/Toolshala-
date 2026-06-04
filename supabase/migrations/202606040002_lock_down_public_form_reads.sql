-- Lock down public form tables so newsletter subscribers/contact messages are never publicly readable.
-- Dashboard/service-role access is unaffected; public/anon/authenticated clients remain insert-only.

alter table public.subscribers enable row level security;
alter table public.subscribers force row level security;
alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

-- Remove any previously-created public read/write policies, including broad ALL policies.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('subscribers', 'contact_messages')
      and cmd in ('SELECT', 'UPDATE', 'DELETE', 'ALL')
      and roles && array['public', 'anon', 'authenticated']::name[]
  loop
    execute format('drop policy if exists %I on %I.%I', policy_record.policyname, policy_record.schemaname, policy_record.tablename);
  end loop;
end $$;

revoke all on table public.subscribers from public, anon, authenticated;
revoke all on table public.contact_messages from public, anon, authenticated;

grant insert on table public.subscribers to anon;
grant insert on table public.contact_messages to anon;

drop policy if exists "Public can insert newsletter subscribers" on public.subscribers;
create policy "Public can insert newsletter subscribers"
  on public.subscribers
  for insert
  to anon
  with check (
    email is not null
    and length(btrim(email)) > 0
    and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'
  );

drop policy if exists "Public can insert contact messages" on public.contact_messages;
create policy "Public can insert contact messages"
  on public.contact_messages
  for insert
  to anon
  with check (
    name is not null
    and length(btrim(name)) >= 2
    and email is not null
    and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'
    and message is not null
    and length(btrim(message)) >= 20
    and status = 'new'
  );
