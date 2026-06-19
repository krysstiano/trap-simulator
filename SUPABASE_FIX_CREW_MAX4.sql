-- ═══════════════════════════════════════════════════════════════════
-- FIX v2.1.0 → max_members 5 → 4 dla tabeli crews
-- POPRAWIONA KOLEJNOŚĆ — najpierw UPDATE, potem CHECK constraint.
-- Wklej do Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════

-- 1. Usuń stary CHECK (żeby UPDATE nie wybuchł przy konflikcie)
ALTER TABLE public.crews DROP CONSTRAINT IF EXISTS crews_max_members_check;

-- 2. Update istniejące rekordy 5 → 4 (PRZED dodaniem nowego CHECKa)
UPDATE public.crews SET max_members=4 WHERE max_members>4;

-- 3. Zmień DEFAULT z 5 na 4
ALTER TABLE public.crews ALTER COLUMN max_members SET DEFAULT 4;

-- 4. Dodaj nowy CHECK (BETWEEN 2 AND 4) — teraz przejdzie bo nie ma już rekordów >4
ALTER TABLE public.crews ADD CONSTRAINT crews_max_members_check CHECK (max_members BETWEEN 2 AND 4);

-- KONIEC
