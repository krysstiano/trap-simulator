-- ═══════════════════════════════════════════════════════════════════
-- TRAP SIMULATOR — Supabase Schema (v2.0.30)
-- Wklej do Supabase SQL Editor: https://supabase.com/dashboard/project/hscprggvkooyqjrrqhsc/sql
-- ═══════════════════════════════════════════════════════════════════
-- AKTUALNY STAN (sprawdzony przez REST API z anon key):
--   ✅ leaderboard      — istnieje (HTTP 200)
--   ✅ nick_claims      — istnieje (HTTP 200, są już dane: 'balamut' itd.)
--   ✅ friendships      — istnieje (HTTP 200)
--   ❌ player_messages  — BRAKUJE (HTTP 404 — PGRST205) ← TO trzeba utworzyć
--
-- Skrypt jest SAFE-TO-RERUN — używa CREATE TABLE IF NOT EXISTS i nie tknie istniejących danych.
-- Możesz wkleić CAŁY plik do Supabase SQL Editor i uruchomić — pomyślnie pominie istniejące tabele.
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. LEADERBOARD ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leaderboard (
  user_id      text   NOT NULL,
  nick         text   NOT NULL DEFAULT 'Player',
  category     text   NOT NULL,                    -- 'money', 'fans', 'level', 'achievements', 'casino', 'speedrun'
  period_key   text   NOT NULL,                    -- 'alltime', '2026-W20', '2026-05', etc.
  score        bigint NOT NULL DEFAULT 0,
  country      text   DEFAULT 'PL',
  game_day     integer DEFAULT 0,
  avatar       jsonb,                              -- {skin, hair, cloth}
  title        text,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, category, period_key)
);
CREATE INDEX IF NOT EXISTS idx_lb_category_period_score ON public.leaderboard (category, period_key, score DESC);
CREATE INDEX IF NOT EXISTS idx_lb_user_id ON public.leaderboard (user_id);
CREATE INDEX IF NOT EXISTS idx_lb_updated_at ON public.leaderboard (updated_at DESC);
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lb_select_all ON public.leaderboard;
DROP POLICY IF EXISTS lb_insert_anon ON public.leaderboard;
DROP POLICY IF EXISTS lb_update_anon ON public.leaderboard;
CREATE POLICY lb_select_all  ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY lb_insert_anon ON public.leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY lb_update_anon ON public.leaderboard FOR UPDATE USING (true) WITH CHECK (true);

-- ─── 2. NICK_CLAIMS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.nick_claims (
  nick_lower text PRIMARY KEY,
  user_id    text NOT NULL,
  claimed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nc_user_id ON public.nick_claims (user_id);
ALTER TABLE public.nick_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nc_select_all ON public.nick_claims;
DROP POLICY IF EXISTS nc_insert_anon ON public.nick_claims;
DROP POLICY IF EXISTS nc_update_anon ON public.nick_claims;
CREATE POLICY nc_select_all  ON public.nick_claims FOR SELECT USING (true);
CREATE POLICY nc_insert_anon ON public.nick_claims FOR INSERT WITH CHECK (true);
CREATE POLICY nc_update_anon ON public.nick_claims FOR UPDATE USING (true) WITH CHECK (true);

-- ─── 3. FRIENDSHIPS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.friendships (
  from_user_id text NOT NULL,
  to_user_id   text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (from_user_id, to_user_id)
);
CREATE INDEX IF NOT EXISTS idx_fr_to_user ON public.friendships (to_user_id);
CREATE INDEX IF NOT EXISTS idx_fr_from_user ON public.friendships (from_user_id);
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fr_select_all ON public.friendships;
DROP POLICY IF EXISTS fr_insert_anon ON public.friendships;
DROP POLICY IF EXISTS fr_delete_anon ON public.friendships;
CREATE POLICY fr_select_all  ON public.friendships FOR SELECT USING (true);
CREATE POLICY fr_insert_anon ON public.friendships FOR INSERT WITH CHECK (true);
CREATE POLICY fr_delete_anon ON public.friendships FOR DELETE USING (true);

-- ─── 4. PLAYER_MESSAGES (SMS in-game) — TO BRAKUJE ──────────────────
CREATE TABLE IF NOT EXISTS public.player_messages (
  id           bigserial PRIMARY KEY,
  from_user_id text NOT NULL,
  to_user_id   text NOT NULL,
  from_nick    text DEFAULT 'Player',
  text         text NOT NULL CHECK (length(text) <= 200),
  day          integer DEFAULT 0,
  sent_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pm_to_user_sent ON public.player_messages (to_user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_pm_from_user ON public.player_messages (from_user_id);
-- GRANT konieczne — SQL editor nie auto-grantuje jak dashboard
GRANT SELECT, INSERT ON public.player_messages TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.player_messages_id_seq TO anon, authenticated;
ALTER TABLE public.player_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pm_select_all ON public.player_messages;
DROP POLICY IF EXISTS pm_insert_anon ON public.player_messages;
CREATE POLICY pm_select_all  ON public.player_messages FOR SELECT USING (true);
CREATE POLICY pm_insert_anon ON public.player_messages FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
-- KONIEC. Po uruchomieniu sprawdź w Table Editor czy 4 tabele są.
-- Toast "Brak połączenia" zniknie po pierwszym pomyślnym requeście.
-- ═══════════════════════════════════════════════════════════════════
