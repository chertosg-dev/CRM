-- ============================================================
-- SUPABASE: ΚΑΛΥΠΤΟΜΕΝΑ ΜΕΛΗ ΚΑΙ ΚΑΛΥΨΕΙΣ ΜΕΛΩΝ
--
-- Προϋπόθεση:
-- Έχουν ήδη δημιουργηθεί οι πίνακες:
--   public.policies
--   public.hospital_program_options
--   public.diagnostic_package_options
--   public.ife_options
--
-- Το αρχείο είναι ασφαλές για επανεκτέλεση και δεν διαγράφει
-- ασφαλισμένους, συμβόλαια ή υπάρχουσες καλύψεις.
-- ============================================================

begin;

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 0. ΕΛΕΓΧΟΣ ΠΡΟΫΠΟΘΕΣΕΩΝ
-- ------------------------------------------------------------

do $$
begin
  if to_regclass('public.policies') is null then
    raise exception
      'Λείπει ο πίνακας public.policies. Εκτέλεσε πρώτα τα προηγούμενα SQL αρχεία.';
  end if;

  if to_regclass('public.hospital_program_options') is null then
    raise exception
      'Λείπει ο πίνακας public.hospital_program_options.';
  end if;

  if to_regclass('public.diagnostic_package_options') is null then
    raise exception
      'Λείπει ο πίνακας public.diagnostic_package_options.';
  end if;

  if to_regclass('public.ife_options') is null then
    raise exception
      'Λείπει ο πίνακας public.ife_options.';
  end if;
end
$$;

-- Ο πίνακας policies πρέπει να διαθέτει μοναδικό συνδυασμό
-- (id, owner_id), ώστε τα μέλη να συνδέονται με το σωστό συμβόλαιο
-- και τον σωστό χρήστη.
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
-- 1. ΚΑΛΥΠΤΟΜΕΝΑ ΜΕΛΗ
-- Κάθε εγγραφή ανήκει σε ένα συγκεκριμένο συμβόλαιο.
-- Τα προσωπικά πεδία είναι ίδια με του κύριου ασφαλισμένου.
-- ------------------------------------------------------------

create table if not exists public.covered_members (
  id uuid primary key default gen_random_uuid(),

  owner_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,

  policy_id uuid not null,

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

  -- Το checkbox αφορά μόνο:
  -- οδό, αριθμό, περιοχή και ΤΚ.
  same_address_as_insured boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint covered_members_policy_owner_fkey
    foreign key (policy_id, owner_id)
    references public.policies(id, owner_id)
    on delete cascade,

  -- Απαραίτητο για ασφαλή σύνδεση των καλύψεων
  -- με το μέλος, το συμβόλαιο και τον ιδιοκτήτη.
  constraint covered_members_id_policy_owner_unique
    unique (id, policy_id, owner_id)
);

comment on table public.covered_members is
  'Καλυπτόμενα μέλη ανά ασφαλιστήριο συμβόλαιο.';

comment on column public.covered_members.same_address_as_insured is
  'Όταν είναι true, η εφαρμογή αντιγράφει μόνο οδό, αριθμό, περιοχή και ΤΚ από τον κύριο ασφαλισμένο.';

-- ------------------------------------------------------------
-- 2. ΚΑΛΥΨΕΙΣ ΚΑΛΥΠΤΟΜΕΝΩΝ ΜΕΛΩΝ
-- Μία καρτέλα καλύψεων για κάθε καλυπτόμενο μέλος.
-- ------------------------------------------------------------

create table if not exists public.covered_member_coverages (
  id uuid primary key default gen_random_uuid(),

  owner_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,

  policy_id uuid not null,
  covered_member_id uuid not null,

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

  constraint covered_member_coverages_member_policy_owner_fkey
    foreign key (covered_member_id, policy_id, owner_id)
    references public.covered_members(id, policy_id, owner_id)
    on delete cascade,

  -- Κάθε καλυπτόμενο μέλος έχει μία ενεργή καρτέλα καλύψεων.
  constraint covered_member_coverages_one_per_member
    unique (owner_id, covered_member_id),

  constraint covered_member_coverages_ife_fkey
    foreign key (ife_amount)
    references public.ife_options(value),

  constraint covered_member_coverages_hospital_program_fkey
    foreign key (hospital_program)
    references public.hospital_program_options(value),

  constraint covered_member_coverages_diagnostic_package_fkey
    foreign key (diagnostic_package)
    references public.diagnostic_package_options(value),

  constraint covered_member_coverages_non_negative_amounts check (
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

comment on table public.covered_member_coverages is
  'Ξεχωριστές καλύψεις κάθε καλυπτόμενου μέλους ανά συμβόλαιο.';

-- ------------------------------------------------------------
-- 3. ΕΥΡΕΤΗΡΙΑ ΓΙΑ ΓΡΗΓΟΡΗ ΦΟΡΤΩΣΗ
-- ------------------------------------------------------------

create index if not exists covered_members_policy_id_idx
  on public.covered_members(policy_id);

create index if not exists covered_members_owner_policy_idx
  on public.covered_members(owner_id, policy_id);

create index if not exists covered_members_owner_last_name_idx
  on public.covered_members(owner_id, last_name);

create index if not exists covered_member_coverages_member_id_idx
  on public.covered_member_coverages(covered_member_id);

create index if not exists covered_member_coverages_policy_id_idx
  on public.covered_member_coverages(policy_id);

-- ------------------------------------------------------------
-- 4. ΑΥΤΟΜΑΤΗ ΕΝΗΜΕΡΩΣΗ ΤΟΥ updated_at
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

drop trigger if exists covered_members_set_updated_at
  on public.covered_members;

create trigger covered_members_set_updated_at
before update on public.covered_members
for each row
execute function public.set_updated_at();

drop trigger if exists covered_member_coverages_set_updated_at
  on public.covered_member_coverages;

create trigger covered_member_coverages_set_updated_at
before update on public.covered_member_coverages
for each row
execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- Κάθε συνδεδεμένος χρήστης βλέπει και αλλάζει μόνο τα δικά του.
-- ------------------------------------------------------------

alter table public.covered_members enable row level security;
alter table public.covered_member_coverages enable row level security;

revoke all on public.covered_members from anon;
revoke all on public.covered_member_coverages from anon;

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.covered_members, public.covered_member_coverages
to authenticated;

-- Καλυπτόμενα μέλη
drop policy if exists "covered_members_select_own"
  on public.covered_members;

create policy "covered_members_select_own"
on public.covered_members
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "covered_members_insert_own"
  on public.covered_members;

create policy "covered_members_insert_own"
on public.covered_members
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "covered_members_update_own"
  on public.covered_members;

create policy "covered_members_update_own"
on public.covered_members
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "covered_members_delete_own"
  on public.covered_members;

create policy "covered_members_delete_own"
on public.covered_members
for delete
to authenticated
using ((select auth.uid()) = owner_id);

-- Καλύψεις καλυπτόμενων μελών
drop policy if exists "covered_member_coverages_select_own"
  on public.covered_member_coverages;

create policy "covered_member_coverages_select_own"
on public.covered_member_coverages
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "covered_member_coverages_insert_own"
  on public.covered_member_coverages;

create policy "covered_member_coverages_insert_own"
on public.covered_member_coverages
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "covered_member_coverages_update_own"
  on public.covered_member_coverages;

create policy "covered_member_coverages_update_own"
on public.covered_member_coverages
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "covered_member_coverages_delete_own"
  on public.covered_member_coverages;

create policy "covered_member_coverages_delete_own"
on public.covered_member_coverages
for delete
to authenticated
using ((select auth.uid()) = owner_id);

commit;

-- ------------------------------------------------------------
-- 6. ΕΛΕΓΧΟΣ ΕΠΙΤΥΧΙΑΣ
-- Και οι δύο τιμές πρέπει αρχικά να είναι 0.
-- ------------------------------------------------------------

select
  'covered_members' as item,
  count(*)::text as result
from public.covered_members

union all

select
  'covered_member_coverages',
  count(*)::text
from public.covered_member_coverages;
