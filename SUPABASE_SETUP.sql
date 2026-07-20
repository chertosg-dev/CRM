-- SUPABASE SETUP ΓΙΑ ΤΟ ΠΡΟΣΩΠΙΚΟ ΧΑΡΤΟΦΥΛΑΚΙΟ
create extension if not exists pgcrypto;

create table if not exists public.insureds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  first_name text,
  last_name text not null,
  company text,
  phone text,
  email text,
  afm text,
  dou text,
  adt text,
  birth_date date,
  street text,
  street_number text,
  area text,
  postal_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint insureds_id_owner_unique unique (id, owner_id)
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  insured_id uuid not null,
  policy_number text not null,
  product text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint policies_insured_owner_fkey foreign key (insured_id, owner_id)
    references public.insureds(id, owner_id) on delete cascade,
  constraint policies_owner_number_unique unique (owner_id, policy_number)
);

create index if not exists insureds_owner_last_name_idx on public.insureds(owner_id, last_name);
create index if not exists policies_owner_number_idx on public.policies(owner_id, policy_number);
create index if not exists policies_insured_id_idx on public.policies(insured_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists insureds_set_updated_at on public.insureds;
create trigger insureds_set_updated_at before update on public.insureds
for each row execute function public.set_updated_at();

drop trigger if exists policies_set_updated_at on public.policies;
create trigger policies_set_updated_at before update on public.policies
for each row execute function public.set_updated_at();

alter table public.insureds enable row level security;
alter table public.policies enable row level security;

revoke all on public.insureds from anon;
revoke all on public.policies from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.insureds to authenticated;
grant select, insert, update, delete on public.policies to authenticated;

drop policy if exists "insureds_select_own" on public.insureds;
create policy "insureds_select_own" on public.insureds for select to authenticated
using (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "insureds_insert_own" on public.insureds;
create policy "insureds_insert_own" on public.insureds for insert to authenticated
with check (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "insureds_update_own" on public.insureds;
create policy "insureds_update_own" on public.insureds for update to authenticated
using (auth.uid() is not null and auth.uid() = owner_id)
with check (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "insureds_delete_own" on public.insureds;
create policy "insureds_delete_own" on public.insureds for delete to authenticated
using (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "policies_select_own" on public.policies;
create policy "policies_select_own" on public.policies for select to authenticated
using (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "policies_insert_own" on public.policies;
create policy "policies_insert_own" on public.policies for insert to authenticated
with check (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "policies_update_own" on public.policies;
create policy "policies_update_own" on public.policies for update to authenticated
using (auth.uid() is not null and auth.uid() = owner_id)
with check (auth.uid() is not null and auth.uid() = owner_id);

drop policy if exists "policies_delete_own" on public.policies;
create policy "policies_delete_own" on public.policies for delete to authenticated
using (auth.uid() is not null and auth.uid() = owner_id);
