-- ToolShala public form storage for newsletter subscribers and contact messages.
-- Apply this migration in Supabase so submissions are visible in dashboard tables
-- while Row Level Security blocks public reads/updates/deletes.

create extension if not exists pgcrypto;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  page text,
  created_at timestamptz not null default now()
);

alter table public.subscribers add column if not exists id uuid default gen_random_uuid();
alter table public.subscribers add column if not exists email text;
alter table public.subscribers add column if not exists source text;
alter table public.subscribers add column if not exists page text;
alter table public.subscribers add column if not exists created_at timestamptz not null default now();

alter table public.subscribers alter column email set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'subscribers_email_not_blank') then
    alter table public.subscribers add constraint subscribers_email_not_blank check (length(btrim(email)) > 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'subscribers_email_format') then
    alter table public.subscribers add constraint subscribers_email_format check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$');
  end if;
end $$;

create unique index if not exists subscribers_email_unique_idx on public.subscribers (email);
create index if not exists subscribers_created_at_idx on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;
alter table public.subscribers force row level security;

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

alter table public.contact_messages add column if not exists id uuid default gen_random_uuid();
alter table public.contact_messages add column if not exists name text;
alter table public.contact_messages add column if not exists email text;
alter table public.contact_messages add column if not exists subject text;
alter table public.contact_messages add column if not exists message text;
alter table public.contact_messages add column if not exists page text;
alter table public.contact_messages add column if not exists status text not null default 'new';
alter table public.contact_messages add column if not exists created_at timestamptz not null default now();

alter table public.contact_messages alter column name set not null;
alter table public.contact_messages alter column email set not null;
alter table public.contact_messages alter column message set not null;
alter table public.contact_messages alter column status set default 'new';
alter table public.contact_messages alter column status set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_name_not_blank') then
    alter table public.contact_messages add constraint contact_messages_name_not_blank check (length(btrim(name)) >= 2);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_email_format') then
    alter table public.contact_messages add constraint contact_messages_email_format check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_message_not_blank') then
    alter table public.contact_messages add constraint contact_messages_message_not_blank check (length(btrim(message)) >= 20);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_status_not_blank') then
    alter table public.contact_messages add constraint contact_messages_status_not_blank check (length(btrim(status)) > 0);
  end if;
end $$;

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages (status);

alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

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
