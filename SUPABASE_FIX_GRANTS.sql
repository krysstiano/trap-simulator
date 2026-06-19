-- ═══════════════════════════════════════════════════════════════════
-- FIX GRANTS dla player_messages
-- Postgres wymaga GRANT przed RLS policies — Supabase auto-grantuje
-- gdy tabele tworzą się przez dashboard, ale SQL editor tego nie robi.
-- ═══════════════════════════════════════════════════════════════════

GRANT SELECT, INSERT ON public.player_messages TO anon, authenticated;

-- bigserial używa sequence — anon musi mieć dostęp żeby auto-increment id
GRANT USAGE, SELECT ON SEQUENCE public.player_messages_id_seq TO anon, authenticated;
