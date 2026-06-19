-- ═══════════════════════════════════════════════════════════════════
-- SUPABASE PATCH — IG Community (Faza AO.3 + AO.6)
-- Created: 2026-05-29
-- Purpose: Real Players Tab "📸 Społeczność" w Instagram apce
-- ═══════════════════════════════════════════════════════════════════
-- WKLEJ CALOSC do Supabase SQL Editor → Run → Refresh REST schema
-- ═══════════════════════════════════════════════════════════════════

-- ── 1) ig_photos: zdjęcia wrzucane przez graczy (1×/realny dzień) ──
CREATE TABLE IF NOT EXISTS public.ig_photos (
  id                 BIGSERIAL PRIMARY KEY,
  player_uuid        UUID NOT NULL,
  player_nick        TEXT NOT NULL,
  day_real           TEXT NOT NULL,                  -- new Date().toDateString() (anti-spam 1/day)
  caption            TEXT DEFAULT '',
  bg_choice          TEXT DEFAULT 'traphouse',       -- IG_BACKGROUNDS key
  filter_choice      TEXT DEFAULT 'normal',          -- IG_FILTERS key
  has_dog            BOOLEAN DEFAULT FALSE,
  character_snapshot JSONB DEFAULT '{}'::jsonb,      -- {cloth, hair, skin, pants, shoes}
  likes              INTEGER NOT NULL DEFAULT 0,
  comments_count     INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index na feed query (ORDER BY created_at DESC LIMIT 50)
CREATE INDEX IF NOT EXISTS ig_photos_created_at_idx
  ON public.ig_photos (created_at DESC);

-- Index na anti-spam check (1 photo per player per real day)
CREATE INDEX IF NOT EXISTS ig_photos_player_day_idx
  ON public.ig_photos (player_uuid, day_real);

-- ── 2) ig_comments: komentarze pod zdjęciami ──
CREATE TABLE IF NOT EXISTS public.ig_comments (
  id          BIGSERIAL PRIMARY KEY,
  photo_id    BIGINT NOT NULL REFERENCES public.ig_photos(id) ON DELETE CASCADE,
  author_uuid UUID NOT NULL,
  author_nick TEXT NOT NULL,
  text        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ig_comments_photo_idx
  ON public.ig_comments (photo_id, created_at ASC);

-- ── 3) ig_likes: lajki (UNIQUE photo+player anti-double) ──
CREATE TABLE IF NOT EXISTS public.ig_likes (
  id           BIGSERIAL PRIMARY KEY,
  photo_id     BIGINT NOT NULL REFERENCES public.ig_photos(id) ON DELETE CASCADE,
  player_uuid  UUID NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(photo_id, player_uuid)
);

CREATE INDEX IF NOT EXISTS ig_likes_photo_idx
  ON public.ig_likes (photo_id);

-- ── 4) Triggers: auto-increment likes/comments_count na ig_photos ──
CREATE OR REPLACE FUNCTION public.ig_after_like_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ig_photos SET likes = COALESCE(likes,0) + 1 WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ig_likes_after_insert ON public.ig_likes;
CREATE TRIGGER ig_likes_after_insert
  AFTER INSERT ON public.ig_likes
  FOR EACH ROW EXECUTE FUNCTION public.ig_after_like_insert();

CREATE OR REPLACE FUNCTION public.ig_after_comment_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ig_photos SET comments_count = COALESCE(comments_count,0) + 1 WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ig_comments_after_insert ON public.ig_comments;
CREATE TRIGGER ig_comments_after_insert
  AFTER INSERT ON public.ig_comments
  FOR EACH ROW EXECUTE FUNCTION public.ig_after_comment_insert();

-- ── 5) RLS: Public read + Public insert ──
ALTER TABLE public.ig_photos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ig_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ig_likes    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ig_photos_read   ON public.ig_photos;
CREATE POLICY ig_photos_read   ON public.ig_photos   FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS ig_photos_insert ON public.ig_photos;
CREATE POLICY ig_photos_insert ON public.ig_photos   FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS ig_comments_read   ON public.ig_comments;
CREATE POLICY ig_comments_read   ON public.ig_comments FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS ig_comments_insert ON public.ig_comments;
CREATE POLICY ig_comments_insert ON public.ig_comments FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS ig_likes_read   ON public.ig_likes;
CREATE POLICY ig_likes_read   ON public.ig_likes    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS ig_likes_insert ON public.ig_likes;
CREATE POLICY ig_likes_insert ON public.ig_likes    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ── 6) GRANTS dla anon role (apka działa bez login) ──
GRANT SELECT, INSERT ON public.ig_photos   TO anon, authenticated;
GRANT SELECT, INSERT ON public.ig_comments TO anon, authenticated;
GRANT SELECT, INSERT ON public.ig_likes    TO anon, authenticated;
GRANT USAGE, SELECT  ON SEQUENCE public.ig_photos_id_seq   TO anon, authenticated;
GRANT USAGE, SELECT  ON SEQUENCE public.ig_comments_id_seq TO anon, authenticated;
GRANT USAGE, SELECT  ON SEQUENCE public.ig_likes_id_seq    TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- DONE. After Run → Settings → API → Reload REST schema cache.
-- ═══════════════════════════════════════════════════════════════════
