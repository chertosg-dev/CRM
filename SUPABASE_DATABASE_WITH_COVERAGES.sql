-- ============================================================
-- SUPABASE DATABASE: ΑΣΦΑΛΙΣΜΕΝΟΙ, ΣΥΜΒΟΛΑΙΑ ΚΑΙ ΚΑΛΥΨΕΙΣ
-- Ασφαλές για επανεκτέλεση. Δεν διαγράφει υπάρχοντα δεδομένα.
-- ============================================================

begin;

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. ΒΑΣΙΚΟΙ ΠΙΝΑΚΕΣ
-- ------------------------------------------------------------

create table if not exists public.insureds (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,

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
  owner_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,

  insured_id uuid not null,
  policy_number text not null,
  product text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint policies_insured_owner_fkey
    foreign key (insured_id, owner_id)
    references public.insureds(id, owner_id)
    on delete cascade,

  constraint policies_owner_number_unique
    unique (owner_id, policy_number)
);

-- Απαραίτητο για ασφαλή σύνδεση καλύψεων με συμβόλαιο και ιδιοκτήτη.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'policies_id_owner_unique'
      and conrelid = 'public.policies'::regclass
  ) then
    alter table public.policies
      add constraint policies_id_owner_unique unique (id, owner_id);
  end if;
end
$$;

-- ------------------------------------------------------------
-- 2. ΛΙΣΤΕΣ ΕΠΙΛΟΓΩΝ ΚΑΛΥΨΕΩΝ
-- Οι λίστες βρίσκονται στη βάση, ώστε να επεκτείνονται αργότερα.
-- ------------------------------------------------------------

create table if not exists public.hospital_program_options (
  value text primary key,
  sort_order integer not null unique,
  active boolean not null default true
);

create table if not exists public.diagnostic_package_options (
  value text primary key,
  sort_order integer not null unique,
  active boolean not null default true
);

create table if not exists public.ife_options (
  value numeric(14,2) primary key,
  label text not null unique,
  sort_order integer not null unique,
  active boolean not null default true,
  constraint ife_options_positive check (value >= 0)
);

insert into public.hospital_program_options (value, sort_order)
values
  ('Βασική προστασία', 1),
  ('Προνομιακή προστασία', 2),
  ('Full Lux 0€', 3),
  ('Full Α 0€', 4),
  ('Full Α 750€', 5),
  ('Full Β 750€', 6),
  ('Full Α 1.500€', 7),
  ('Full Β 1.500€', 8),
  ('Full Α 3.000€', 9),
  ('Full Β 3.000€', 10),
  ('Full Α 6.000€', 11),
  ('Full Β 6.000€', 12),
  ('Full Α 10.000€', 13),
  ('Full Β 10.000€', 14),
  ('Full Health Ειδικό (χωρίς διαβήτη)', 15),
  ('Full Health Ειδικό (με διαβήτη)', 16),
  ('Full Health Plus Α 1.500€', 17),
  ('Full Health Plus Β 1.500€', 18),
  ('Full Health Plus Α 3.000€', 19),
  ('Full Health Plus Β 3.000€', 20),
  ('Full Health Plus Α 6.000€', 21),
  ('Full Health Plus Β 6.000€', 22),
  ('Full Health Value', 23)
on conflict (value) do update
set sort_order = excluded.sort_order,
    active = true;

insert into public.diagnostic_package_options (value, sort_order)
values
  ('Full Απεριόριστο 0%', 1),
  ('Full 700€ 0%', 2),
  ('Full 700€ 10%', 3),
  ('Full 2.000€ 0%', 4),
  ('Full 2.000€ 10%', 5),
  ('Full Διάγνωση Ειδική Μέριμνα', 6)
on conflict (value) do update
set sort_order = excluded.sort_order,
    active = true;

insert into public.ife_options (value, label, sort_order)
values
  (1000.00, '1.000€', 1),
  (2000.00, '2.000€', 2),
  (3000.00, '3.000€', 3)
on conflict (value) do update
set label = excluded.label,
    sort_order = excluded.sort_order,
    active = true;

-- ------------------------------------------------------------
-- 3. ΚΑΡΤΕΛΑ ΚΑΛΥΨΕΩΝ ΑΝΑ ΣΥΜΒΟΛΑΙΟ
-- Μία εγγραφή καλύψεων για κάθε συμβόλαιο.
-- ------------------------------------------------------------

create table if not exists public.policy_coverages (
  id uuid primary key default gen_random_uuid(),

  owner_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,

  policy_id uuid not null,

  start_date date,
  tariff text,

  life_insurance_amount numeric(14,2),
  accidental_death_amount numeric(14,2),

  premium_waiver boolean not null default false,

  ife_amount numeric(14,2),

  temporary_disability_daily_amount numeric(14,2),
  income_loss_daily_amount numeric(14,2),

  critical_illness_amount numeric(14,2),

  hospital_program text,

  hospital_daily_allowance numeric(14,2),
  surgical_allowance numeric(14,2),

  diagnostic_package text,

  comments text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint policy_coverages_policy_owner_fkey
    foreign key (policy_id, owner_id)
    references public.policies(id, owner_id)
    on delete cascade,

  constraint policy_coverages_one_per_policy
    unique (owner_id, policy_id),

  constraint policy_coverages_ife_fkey
    foreign key (ife_amount)
    references public.ife_options(value),

  constraint policy_coverages_hospital_program_fkey
    foreign key (hospital_program)
    references public.hospital_program_options(value),

  constraint policy_coverages_diagnostic_package_fkey
    foreign key (diagnostic_package)
    references public.diagnostic_package_options(value),

  constraint policy_coverages_non_negative_amounts check (
    (life_insurance_amount is null or life_insurance_amount >= 0)
    and (accidental_death_amount is null or accidental_death_amount >= 0)
    and (ife_amount is null or ife_amount >= 0)
    and (
      temporary_disability_daily_amount is null
      or temporary_disability_daily_amount >= 0
    )
    and (
      income_loss_daily_amount is null
      or income_loss_daily_amount >= 0
    )
    and (critical_illness_amount is null or critical_illness_amount >= 0)
    and (hospital_daily_allowance is null or hospital_daily_allowance >= 0)
    and (surgical_allowance is null or surgical_allowance >= 0)
  )
);

-- ------------------------------------------------------------
-- 4. ΕΥΡΕΤΗΡΙΑ
-- ------------------------------------------------------------

create index if not exists insureds_owner_last_name_idx
  on public.insureds(owner_id, last_name);

create index if not exists policies_owner_number_idx
  on public.policies(owner_id, policy_number);

create index if not exists policies_insured_id_idx
  on public.policies(insured_id);

create index if not exists policy_coverages_policy_id_idx
  on public.policy_coverages(policy_id);

-- ------------------------------------------------------------
-- 5. ΑΥΤΟΜΑΤΗ ΕΝΗΜΕΡΩΣΗ updated_at
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists insureds_set_updated_at
  on public.insureds;

create trigger insureds_set_updated_at
before update on public.insureds
for each row
execute function public.set_updated_at();

drop trigger if exists policies_set_updated_at
  on public.policies;

create trigger policies_set_updated_at
before update on public.policies
for each row
execute function public.set_updated_at();

drop trigger if exists policy_coverages_set_updated_at
  on public.policy_coverages;

create trigger policy_coverages_set_updated_at
before update on public.policy_coverages
for each row
execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table public.insureds enable row level security;
alter table public.policies enable row level security;
alter table public.policy_coverages enable row level security;

alter table public.hospital_program_options enable row level security;
alter table public.diagnostic_package_options enable row level security;
alter table public.ife_options enable row level security;

revoke all on public.insureds from anon;
revoke all on public.policies from anon;
revoke all on public.policy_coverages from anon;

revoke all on public.hospital_program_options from anon;
revoke all on public.diagnostic_package_options from anon;
revoke all on public.ife_options from anon;

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.insureds, public.policies, public.policy_coverages
to authenticated;

grant select
on public.hospital_program_options,
   public.diagnostic_package_options,
   public.ife_options
to authenticated;

-- Ασφαλισμένοι
drop policy if exists "insureds_select_own" on public.insureds;
create policy "insureds_select_own"
on public.insureds
for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "insureds_insert_own" on public.insureds;
create policy "insureds_insert_own"
on public.insureds
for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "insureds_update_own" on public.insureds;
create policy "insureds_update_own"
on public.insureds
for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "insureds_delete_own" on public.insureds;
create policy "insureds_delete_own"
on public.insureds
for delete to authenticated
using ((select auth.uid()) = owner_id);

-- Συμβόλαια
drop policy if exists "policies_select_own" on public.policies;
create policy "policies_select_own"
on public.policies
for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "policies_insert_own" on public.policies;
create policy "policies_insert_own"
on public.policies
for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "policies_update_own" on public.policies;
create policy "policies_update_own"
on public.policies
for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "policies_delete_own" on public.policies;
create policy "policies_delete_own"
on public.policies
for delete to authenticated
using ((select auth.uid()) = owner_id);

-- Καλύψεις
drop policy if exists "policy_coverages_select_own"
  on public.policy_coverages;

create policy "policy_coverages_select_own"
on public.policy_coverages
for select to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "policy_coverages_insert_own"
  on public.policy_coverages;

create policy "policy_coverages_insert_own"
on public.policy_coverages
for insert to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "policy_coverages_update_own"
  on public.policy_coverages;

create policy "policy_coverages_update_own"
on public.policy_coverages
for update to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "policy_coverages_delete_own"
  on public.policy_coverages;

create policy "policy_coverages_delete_own"
on public.policy_coverages
for delete to authenticated
using ((select auth.uid()) = owner_id);

-- Οι τρεις λίστες είναι κοινές, μόνο για ανάγνωση από συνδεδεμένους χρήστες.
drop policy if exists "hospital_program_options_read"
  on public.hospital_program_options;

create policy "hospital_program_options_read"
on public.hospital_program_options
for select to authenticated
using (true);

drop policy if exists "diagnostic_package_options_read"
  on public.diagnostic_package_options;

create policy "diagnostic_package_options_read"
on public.diagnostic_package_options
for select to authenticated
using (true);

drop policy if exists "ife_options_read"
  on public.ife_options;

create policy "ife_options_read"
on public.ife_options
for select to authenticated
using (true);

commit;

-- ------------------------------------------------------------
-- 7. ΕΛΕΓΧΟΣ ΕΠΙΤΥΧΙΑΣ
-- Θα πρέπει να εμφανιστούν 4 γραμμές.
-- ------------------------------------------------------------

select
  'policy_coverages' as item,
  count(*)::text as result
from public.policy_coverages

union all

select
  'hospital_program_options',
  count(*)::text
from public.hospital_program_options

union all

select
  'diagnostic_package_options',
  count(*)::text
from public.diagnostic_package_options

union all

select
  'ife_options',
  count(*)::text
from public.ife_options;
