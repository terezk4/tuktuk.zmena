-- Úklid starých policies (spusťte PRVÉ, pokud už máte nějaké policies)
-- Spusťte tento soubor před spuštěním supabase_challenges_rls.sql

-- Smazání starých policies pro challenges (pokud existují)
DROP POLICY IF EXISTS "Challenges are viewable by authenticated users" ON challenges;
DROP POLICY IF EXISTS "Admins can insert challenges" ON challenges;
DROP POLICY IF EXISTS "Admins can update challenges" ON challenges;
DROP POLICY IF EXISTS "Admins can delete challenges" ON challenges;

-- Smazání staré funkce is_admin (pokud existuje)
DROP FUNCTION IF EXISTS is_admin();

