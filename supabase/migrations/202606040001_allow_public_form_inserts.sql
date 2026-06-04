-- Keep ToolShala public form tables private while allowing anonymous insert-only submissions.
-- Server handlers use the service-role key when available, or the anon key when deployments only expose anon insert config.

alter table public.subscribers enable row level security;
alter table public.subscribers force row level security;
alter table public.contact_messages enable row level security;
alter table public.contact_messages force row level security;

revoke select, update, delete on public.subscribers from anon;
revoke select, update, delete on public.contact_messages from anon;
revoke select, update, delete on public.subscribers from public;
revoke select, update, delete on public.contact_messages from public;
revoke select, update, delete on public.subscribers from authenticated;
revoke select, update, delete on public.contact_messages from authenticated;

grant insert on public.subscribers to anon;
grant insert on public.contact_messages to anon;

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
