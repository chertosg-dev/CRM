-- TSERTOS Insurance CRM – canonical coverage fields
-- Safe to run more than once.
BEGIN;
ALTER TABLE public.policy_coverages
  ADD COLUMN IF NOT EXISTS investment_capital NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS doa NUMERIC(14,2);
ALTER TABLE public.covered_member_coverages
  ADD COLUMN IF NOT EXISTS investment_capital NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS doa NUMERIC(14,2);
COMMIT;
