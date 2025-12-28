-- RLS Policies pro tabulku challenges
-- Spusťte tento soubor v Supabase SQL Editoru

-- Zapněte RLS pro tabulku challenges (pokud ještě není zapnuté)
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Vytvořte funkci pro kontrolu admin práv (má přístup k auth.users díky SECURITY DEFINER)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email IN (
      'admin@tuktukzmena.cz',
      'producer@tuktukzmena.cz',
      'demo@user.com',
      'tuktuk.zmena@gmail.com'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy pro SELECT - všichni přihlášení uživatelé mohou číst výzvy
CREATE POLICY "Challenges are viewable by authenticated users"
ON challenges
FOR SELECT
TO authenticated
USING (true);

-- Policy pro INSERT - pouze admini mohou přidávat výzvy
CREATE POLICY "Admins can insert challenges"
ON challenges
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Policy pro UPDATE - pouze admini mohou upravovat výzvy
CREATE POLICY "Admins can update challenges"
ON challenges
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Policy pro DELETE - pouze admini mohou mazat výzvy
CREATE POLICY "Admins can delete challenges"
ON challenges
FOR DELETE
TO authenticated
USING (is_admin());

