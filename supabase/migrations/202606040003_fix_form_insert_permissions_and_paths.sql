-- Repair ToolShala public form insert permissions after read lockdown.
-- Root cause covered by this migration: anon clients can pass RLS only when the
-- public schema/table privileges also allow INSERT. Keep public reads/updates/deletes blocked.

alter table public.subscribers enable row level security;
alter table public.subscribers force row level security;
alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

grant usage on schema public to anon;

-- Start from a private baseline. Then grant only the columns public forms insert.
revoke all on table public.subscribers from public, anon, authenticated;
revoke all on table public.contact_messages from public, anon, authenticated;

grant insert (email, source, page) on table public.subscribers to anon;
grant insert (name, email, subject, message, page, status) on table public.contact_messages to anon;


-- If either table existed before these migrations with serial/identity IDs instead of UUID
-- defaults, anonymous inserts also need permission to consume those owned sequences.
do $$
begin
  if to_regclass('public.subscribers_id_seq') is not null then
    grant usage on sequence public.subscribers_id_seq to anon;
  end if;

  if to_regclass('public.contact_messages_id_seq') is not null then
    grant usage on sequence public.contact_messages_id_seq to anon;
  end if;
end $$;

-- Remove public read/update/delete/all policies that would expose form data.
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
    and message is not null
    and length(btrim(message)) >= 20
    and status = 'new'
  );

-- Ask Supabase PostgREST to refresh metadata after policy/privilege changes.
notify pgrst, 'reload schema';
