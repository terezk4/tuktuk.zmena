# Oprava Row Level Security (RLS) chyby pro tabulku challenges

Pokud se při přidávání výzvy zobrazuje chyba typu "row-level security policy" nebo "42501", znamená to, že v Supabase databázi nejsou správně nastavené RLS (Row Level Security) policies pro tabulku `challenges`.

## 🔧 Řešení v Supabase Dashboardu

### Krok 1: Otevřete Supabase SQL Editor

1. Jděte na [supabase.com](https://supabase.com) a přihlaste se
2. Vyberte váš projekt
3. V levém menu klikněte na **SQL Editor**

**📄 NEJLEPŠÍ: Použijte soubor `supabase_challenges_rls.sql`**
- Tento soubor obsahuje čistý SQL kód bez markdown syntaxe
- Otevřete ho v textovém editoru a zkopírujte celý obsah
- Vložte do Supabase SQL Editoru a spusťte

### Krok 2: Smazání starých policies (pokud existují)

Pokud jste už předtím vytvořili policies, smažte je nejdřív:

```sql
-- Smazání starých policies (pokud existují)
DROP POLICY IF EXISTS "Challenges are viewable by authenticated users" ON challenges;
DROP POLICY IF EXISTS "Admins can insert challenges" ON challenges;
DROP POLICY IF EXISTS "Admins can update challenges" ON challenges;
DROP POLICY IF EXISTS "Admins can delete challenges" ON challenges;
DROP FUNCTION IF EXISTS is_admin();
```

### Krok 3: Spusťte nový SQL skript

**Použijte soubor `supabase_challenges_rls.sql`** v kořenovém adresáři projektu:
1. Otevřete soubor `supabase_challenges_rls.sql` v textovém editoru
2. Zkopírujte celý obsah
3. Vložte do Supabase SQL Editoru
4. Spusťte

**Řešení používá PostgreSQL funkci `is_admin()` s `SECURITY DEFINER`, která má oprávnění k přístupu k tabulce `auth.users`.** Tím se vyřeší chyba "permission denied for table users".

### Krok 4: Upravte admin emaily (volitelné)

Pokud máte jiné admin emaily než ty v souboru, upravte je ve funkci `is_admin()` v SQL souboru.

## 🔍 Ověření, že to funguje

1. Zkontrolujte, že jste přihlášeni jako admin v aplikaci
2. Zkuste přidat novou výzvu
3. Pokud stále vidíte chybu, zkontrolujte v konzoli prohlížeče (F12 → Console), kde uvidíte detailnější error message

## 📝 Poznámky

- Pokud chcete, aby **všichni přihlášení uživatelé** mohli přidávat výzvy (ne jen admini), změňte policy z `is_admin()` na `auth.uid() IS NOT NULL`
- Pro **veřejný přístup** (i nepřihlášení) změňte `TO authenticated` na `TO public`
- Policies můžete spravovat také v Supabase Dashboardu: **Authentication** → **Policies** → vyberte tabulku `challenges`

## 🆘 Pokud to stále nefunguje

1. Zkontrolujte v Supabase Dashboardu → **Table Editor** → **challenges**, že tabulka existuje
2. Ověřte strukturu tabulky - měla by mít sloupce: `id`, `title`, `content`, `created_at`
3. Zkontrolujte, že jste přihlášeni správným účtem v aplikaci
4. Zkontrolujte konzoli prohlížeče pro detailnější error zprávy

