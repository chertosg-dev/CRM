-- ============================================================
-- TSERTOS INSURANCE CRM
-- MIGRATION 006
-- Επείγοντα περιστατικά και ΑΙΒ κάλυψη
-- ============================================================

begin;

-- Κύριος ασφαλισμένος
alter table public.policy_coverages
  add column if not exists emergency_incidents_amount numeric(14,2);

alter table public.policy_coverages
  add column if not exists aib_coverage boolean default false;

-- Καλυπτόμενα μέλη
alter table public.covered_member_coverages
  add column if not exists emergency_incidents_amount numeric(14,2);

alter table public.covered_member_coverages
  add column if not exists aib_coverage boolean default false;

-- Επιτρεπτές τιμές για τα επείγοντα: μόνο 600€ ή 1.000€.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'policy_coverages_emergency_incidents_allowed'
      and conrelid = 'public.policy_coverages'::regclass
  ) then
    alter table public.policy_coverages
      add constraint policy_coverages_emergency_incidents_allowed
      check (
        emergency_incidents_amount is null
        or emergency_incidents_amount in (600, 1000)
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'member_coverages_emergency_incidents_allowed'
      and conrelid = 'public.covered_member_coverages'::regclass
  ) then
    alter table public.covered_member_coverages
      add constraint member_coverages_emergency_incidents_allowed
      check (
        emergency_incidents_amount is null
        or emergency_incidents_amount in (600, 1000)
      );
  end if;
end
$$;

comment on column public.policy_coverages.emergency_incidents_amount
  is 'Κάλυψη επειγόντων περιστατικών: 600€ ή 1.000€.';

comment on column public.policy_coverages.aib_coverage
  is 'ΑΙΒ κάλυψη: Ναι/Όχι.';

comment on column public.covered_member_coverages.emergency_incidents_amount
  is 'Κάλυψη επειγόντων περιστατικών: 600€ ή 1.000€.';

comment on column public.covered_member_coverages.aib_coverage
  is 'ΑΙΒ κάλυψη: Ναι/Όχι.';

commit;

select
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('policy_coverages', 'covered_member_coverages')
  and column_name in ('emergency_incidents_amount', 'aib_coverage')
order by table_name, column_name;
