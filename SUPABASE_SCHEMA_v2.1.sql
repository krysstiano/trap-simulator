-- ═══════════════════════════════════════════════════════════════════
-- TRAP SIMULATOR — Supabase Schema v2.1.0
-- Wklej do Supabase SQL Editor: https://supabase.com/dashboard/project/hscprggvkooyqjrrqhsc/sql
-- ═══════════════════════════════════════════════════════════════════
-- ROZSZERZA istniejący schemat z v2.0.30:
--   ✅ leaderboard       — bez zmian
--   ✅ nick_claims       — bez zmian
--   🔧 friendships       — DODAJEMY kolumnę 'status' (pending/accepted/rejected)
--   ✅ player_messages   — bez zmian
--   ➕ crews             — NOWA tabela (paczki)
--   ➕ crew_members      — NOWA tabela (członkowie crew)
--   ➕ crew_invites      — NOWA tabela (zaproszenia do crew, pending/accepted/rejected)
--   ➕ crew_messages     — NOWA tabela (group chat per crew)
--   ➕ crew_challenges   — NOWA tabela (tygodniowe wyzwania)
--
-- SAFE-TO-RERUN — używa IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. FRIENDSHIPS — dodaj status ───────────────────────────────────
-- Stare rekordy (jednostronne dodania z v2.0.x) auto-akceptowane (default 'accepted'),
-- nowe zaproszenia powstaną ze statusem 'pending' i czekają na akceptację odbiorcy.
ALTER TABLE public.friendships
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'accepted'
    CHECK (status IN ('pending','accepted','rejected'));

-- Index na status żeby szybko fetchować pending invites dla danego usera
CREATE INDEX IF NOT EXISTS idx_fr_status ON public.friendships (to_user_id, status);

-- UPDATE musi być dozwolone (wcześniej tylko SELECT/INSERT/DELETE — teraz akceptacja zmienia status)
DROP POLICY IF EXISTS fr_update_anon ON public.friendships;
CREATE POLICY fr_update_anon ON public.friendships FOR UPDATE USING (true) WITH CHECK (true);
GRANT UPDATE ON public.friendships TO anon, authenticated;

-- ─── 2. CREWS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crews (
  id           bigserial PRIMARY KEY,
  name         text NOT NULL CHECK (length(name) >= 2 AND length(name) <= 30),
  leader_uuid  text NOT NULL,
  leader_nick  text DEFAULT 'Leader',
  max_members  integer NOT NULL DEFAULT 5 CHECK (max_members BETWEEN 2 AND 5),
  created_at   timestamptz NOT NULL DEFAULT now(),
  -- Tag (anty-duplikat): leader_uuid może mieć max 1 active crew (gdy disbanded — usuwamy rekord)
  CONSTRAINT crews_one_per_leader UNIQUE (leader_uuid)
);
CREATE INDEX IF NOT EXISTS idx_crews_leader ON public.crews (leader_uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crews TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.crews_id_seq TO anon, authenticated;
ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS crews_select_all ON public.crews;
DROP POLICY IF EXISTS crews_insert_anon ON public.crews;
DROP POLICY IF EXISTS crews_update_anon ON public.crews;
DROP POLICY IF EXISTS crews_delete_anon ON public.crews;
CREATE POLICY crews_select_all  ON public.crews FOR SELECT USING (true);
CREATE POLICY crews_insert_anon ON public.crews FOR INSERT WITH CHECK (true);
CREATE POLICY crews_update_anon ON public.crews FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY crews_delete_anon ON public.crews FOR DELETE USING (true);

-- ─── 3. CREW_MEMBERS ─────────────────────────────────────────────────
-- Lista członków per crew (włącznie z liderem). Każdy gracz może być w MAX 1 crew naraz.
CREATE TABLE IF NOT EXISTS public.crew_members (
  crew_id      bigint NOT NULL REFERENCES public.crews(id) ON DELETE CASCADE,
  member_uuid  text NOT NULL,
  member_nick  text DEFAULT 'Member',
  role         text NOT NULL DEFAULT 'member' CHECK (role IN ('leader','member')),
  joined_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (crew_id, member_uuid),
  CONSTRAINT cm_one_crew_per_player UNIQUE (member_uuid)
);
CREATE INDEX IF NOT EXISTS idx_cm_member ON public.crew_members (member_uuid);
CREATE INDEX IF NOT EXISTS idx_cm_crew ON public.crew_members (crew_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crew_members TO anon, authenticated;
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cm_select_all ON public.crew_members;
DROP POLICY IF EXISTS cm_insert_anon ON public.crew_members;
DROP POLICY IF EXISTS cm_update_anon ON public.crew_members;
DROP POLICY IF EXISTS cm_delete_anon ON public.crew_members;
CREATE POLICY cm_select_all  ON public.crew_members FOR SELECT USING (true);
CREATE POLICY cm_insert_anon ON public.crew_members FOR INSERT WITH CHECK (true);
CREATE POLICY cm_update_anon ON public.crew_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY cm_delete_anon ON public.crew_members FOR DELETE USING (true);

-- ─── 4. CREW_INVITES ─────────────────────────────────────────────────
-- Zaproszenia do crew (od lidera do innego gracza), z statusem.
CREATE TABLE IF NOT EXISTS public.crew_invites (
  id           bigserial PRIMARY KEY,
  crew_id      bigint NOT NULL REFERENCES public.crews(id) ON DELETE CASCADE,
  from_uuid    text NOT NULL,
  to_uuid      text NOT NULL,
  crew_name    text DEFAULT '',
  from_nick    text DEFAULT 'Leader',
  status       text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','rejected')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  -- Anty-duplikat: ta sama crew nie może zapraszać tego samego gracza 2 razy w pending state
  CONSTRAINT ci_unique_pending UNIQUE (crew_id, to_uuid)
);
CREATE INDEX IF NOT EXISTS idx_ci_to_status ON public.crew_invites (to_uuid, status);
CREATE INDEX IF NOT EXISTS idx_ci_crew ON public.crew_invites (crew_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crew_invites TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.crew_invites_id_seq TO anon, authenticated;
ALTER TABLE public.crew_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ci_select_all ON public.crew_invites;
DROP POLICY IF EXISTS ci_insert_anon ON public.crew_invites;
DROP POLICY IF EXISTS ci_update_anon ON public.crew_invites;
DROP POLICY IF EXISTS ci_delete_anon ON public.crew_invites;
CREATE POLICY ci_select_all  ON public.crew_invites FOR SELECT USING (true);
CREATE POLICY ci_insert_anon ON public.crew_invites FOR INSERT WITH CHECK (true);
CREATE POLICY ci_update_anon ON public.crew_invites FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY ci_delete_anon ON public.crew_invites FOR DELETE USING (true);

-- ─── 5. CREW_MESSAGES (group chat) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crew_messages (
  id           bigserial PRIMARY KEY,
  crew_id      bigint NOT NULL REFERENCES public.crews(id) ON DELETE CASCADE,
  from_uuid    text NOT NULL,
  from_nick    text DEFAULT 'Member',
  text         text NOT NULL CHECK (length(text) >= 1 AND length(text) <= 200),
  sent_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cmsg_crew_sent ON public.crew_messages (crew_id, sent_at DESC);
GRANT SELECT, INSERT ON public.crew_messages TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.crew_messages_id_seq TO anon, authenticated;
ALTER TABLE public.crew_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cmsg_select_all ON public.crew_messages;
DROP POLICY IF EXISTS cmsg_insert_anon ON public.crew_messages;
CREATE POLICY cmsg_select_all  ON public.crew_messages FOR SELECT USING (true);
CREATE POLICY cmsg_insert_anon ON public.crew_messages FOR INSERT WITH CHECK (true);

-- ─── 6. CREW_CHALLENGES (tygodniowe wyzwania) ────────────────────────
-- Jedno wyzwanie per crew per tydzień. progress = suma kontrybucji członków.
CREATE TABLE IF NOT EXISTS public.crew_challenges (
  id             bigserial PRIMARY KEY,
  crew_id        bigint NOT NULL REFERENCES public.crews(id) ON DELETE CASCADE,
  week_key       text NOT NULL,    -- np. '2026-W20'
  type           text NOT NULL,    -- 'earn_money', 'play_concerts', 'gain_fans', 'record_tracks'
  emoji          text DEFAULT '🎯',
  title          text NOT NULL,    -- np. 'Zarobcie razem 100 000 zł'
  target         bigint NOT NULL DEFAULT 0,
  progress       bigint NOT NULL DEFAULT 0,
  reward_xp      integer DEFAULT 500,
  reward_money   integer DEFAULT 1000,
  completed      boolean NOT NULL DEFAULT false,
  completed_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cc_unique_crew_week UNIQUE (crew_id, week_key)
);
CREATE INDEX IF NOT EXISTS idx_cc_crew ON public.crew_challenges (crew_id);
CREATE INDEX IF NOT EXISTS idx_cc_week ON public.crew_challenges (week_key);
GRANT SELECT, INSERT, UPDATE ON public.crew_challenges TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.crew_challenges_id_seq TO anon, authenticated;
ALTER TABLE public.crew_challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cc_select_all ON public.crew_challenges;
DROP POLICY IF EXISTS cc_insert_anon ON public.crew_challenges;
DROP POLICY IF EXISTS cc_update_anon ON public.crew_challenges;
CREATE POLICY cc_select_all  ON public.crew_challenges FOR SELECT USING (true);
CREATE POLICY cc_insert_anon ON public.crew_challenges FOR INSERT WITH CHECK (true);
CREATE POLICY cc_update_anon ON public.crew_challenges FOR UPDATE USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════
-- KONIEC. Po uruchomieniu sprawdź w Table Editor:
--   - friendships ma teraz kolumnę 'status'
--   - widzisz nowe tabele: crews, crew_members, crew_invites, crew_messages, crew_challenges
-- W razie błędu — pokaż mi co Supabase zwrócił.
-- ═══════════════════════════════════════════════════════════════════
