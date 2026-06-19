-- ═══════════════════════════════════════════════════════════════════
-- MINIMALNY SKRYPT — tylko dodaje brakującą tabelę player_messages
-- ZERO DROP, ZERO ostrzeżeń — bezpieczny do uruchomienia.
-- Pozostałe 3 tabele (leaderboard, nick_claims, friendships) już istnieją, są nietknięte.
-- ═══════════════════════════════════════════════════════════════════

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

ALTER TABLE public.player_messages ENABLE ROW LEVEL SECURITY;

-- Policies bez DROP — używamy DO bloku żeby sprawdzić czy istnieją.
-- (Postgres nie ma CREATE POLICY IF NOT EXISTS, więc tak.)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='player_messages' AND policyname='pm_select_all') THEN
    CREATE POLICY pm_select_all ON public.player_messages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='player_messages' AND policyname='pm_insert_anon') THEN
    CREATE POLICY pm_insert_anon ON public.player_messages FOR INSERT WITH CHECK (true);
  END IF;
END $$;
