-- Force ToolShala form storage through the public REST schema and keep public users insert-only.
-- The application calls subscribers and contact_messages directly through the public REST schema.

create extension if not exists pgcrypto;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  page text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  page text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;
alter table public.subscribers force row level security;
alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

grant usage on schema public to anon;

-- Lock public form data down, then grant only the exact columns submitted by the forms.
revoke all on table public.subscribers from public, anon, authenticated;
revoke all on table public.contact_messages from public, anon, authenticated;
grant insert (email) on table public.subscribers to anon;
grant insert (name, email, subject, message) on table public.contact_messages to anon;

-- Anonymous inserts may need sequence usage if an existing project created these IDs as serial/identity.
do $$
begin
  if to_regclass('public.subscribers_id_seq') is not null then
    grant usage on sequence public.subscribers_id_seq to anon;
  end if;

  if to_regclass('public.contact_messages_id_seq') is not null then
    grant usage on sequence public.contact_messages_id_seq to anon;
  end if;
end $$;

-- Remove any public read/update/delete policies; absence of these policies keeps those operations blocked by RLS.
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
    and subject is not null
    and length(btrim(subject)) >= 4
    and message is not null
    and length(btrim(message)) >= 20
  );

notify pgrst, 'reload schema';
