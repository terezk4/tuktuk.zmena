# Průvodce nasazením aplikace na Netlify

Tento průvodce vás provede celým procesem nasazení aplikace "Ťuk ťuk. Změna!" na Netlify.

## 📋 Předpoklady

- Účet na [Netlify](https://www.netlify.com) (registrace zdarma)
- Účet na [Supabase](https://supabase.com) s vytvořeným projektem
- Aplikace by měla být pushnutá do Git repozitáře (GitHub, GitLab nebo Bitbucket)

## 🔧 Krok 1: Příprava lokálního prostředí

### 1.1 Ověřte, že aplikace běží lokálně

```bash
# Nainstalujte závislosti
npm install

# Spusťte vývojový server
npm run dev
```

### 1.2 Vytvořte .env soubor pro lokální vývoj

Vytvořte soubor `.env` v kořenovém adresáři projektu s následujícím obsahem:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Důležité:** Tyto hodnoty najdete v Supabase dashboardu → Settings → API

### 1.3 Otestujte build lokálně

```bash
npm run build
npm run preview
```

Build by měl projít bez chyb a vytvořit složku `dist` s výslednými soubory.

## 📦 Krok 2: Příprava repozitáře

### 2.1 Commitněte všechny změny

```bash
git add .
git commit -m "Připraveno pro nasazení na Netlify"
```

### 2.2 Pushněte do vzdáleného repozitáře

```bash
git push origin main
# nebo
git push origin master
```

**Poznámka:** Ujistěte se, že soubor `.env` **NENÍ** commitnutý (je v `.gitignore`).

## 🌐 Krok 3: Nasazení na Netlify

### 3.1 Přihlášení do Netlify

1. Jděte na [app.netlify.com](https://app.netlify.com)
2. Přihlaste se nebo vytvořte nový účet
3. Pokud se přihlašujete poprvé, můžete použít "Sign up with GitHub/GitLab/Bitbucket"

### 3.2 Vytvoření nového site

1. V Netlify dashboardu klikněte na **"Add new site"** → **"Import an existing project"**
2. Vyberte váš Git provider (GitHub/GitLab/Bitbucket)
3. Autorizujte Netlify přístup k vašim repozitářům
4. Vyberte repozitář s vaší aplikací

### 3.3 Konfigurace build nastavení

Netlify by měl automaticky detekovat nastavení z `netlify.toml`, ale ověřte následující:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** Doporučuji použít Node.js 18 nebo vyšší

V Netlify dashboardu to vypadá takto:

```
Build command: npm run build
Publish directory: dist
```

### 3.4 Nastavení Environment Variables

**DŮLEŽITÉ:** Environment variables musíte nastavit v Netlify!

1. V Netlify dashboardu jděte na váš site
2. Klikněte na **Site settings** → **Environment variables**
3. Přidejte následující proměnné:

| Klíč | Hodnota |
|------|---------|
| `VITE_SUPABASE_URL` | Vaše Supabase URL (začíná na `https://`) |
| `VITE_SUPABASE_ANON_KEY` | Váš Supabase anonymní klíč |

**Poznámka:** 
- V Netlify použijte **přesně tyto názvy** proměnných (včetně prefixu `VITE_`)
- Hodnoty jsou citlivé - nikdy je nesdílejte veřejně
- Po přidání environment variables bude potřeba trigger nový deploy

### 3.5 Trigger prvního deploy

1. Klikněte na **"Deploy site"**
2. Netlify začne build proces
3. Sledujte build logs v reálném čase

### 3.6 Ověření úspěšného nasazení

Po dokončení buildu:
- Měli byste vidět zelený status "Published"
- Kliknutím na **"Preview"** nebo na název vašeho site se otevře aplikace
- Otestujte hlavní funkce aplikace

## ⚙️ Krok 4: Konfigurace DNS a Custom Domain (volitelné)

### 4.1 Přidání vlastní domény

1. V Netlify dashboardu: **Site settings** → **Domain management**
2. Klikněte na **"Add custom domain"**
3. Zadejte vaši doménu (např. `tuk-tuk-zmena.cz`)
4. Postupujte podle instrukcí pro konfiguraci DNS záznamů

### 4.2 SSL Certificate

Netlify automaticky poskytuje SSL certifikáty (HTTPS) pro všechny domény - není potřeba žádná další konfigurace!

## 🔄 Krok 5: Automatické deployy

Netlify automaticky deployuje při každém push do hlavní větve. Můžete:

1. **Automatické deployy:** Každý push do `main`/`master` větve automaticky spustí nový deploy
2. **Deploy previews:** Pull requesty vytvoří preview URL pro testování
3. **Branch deploys:** Můžete deployovat i jiné větve pro testování

## 🐛 Řešení problémů

### Build selhává

1. **Zkontrolujte build logs** v Netlify dashboardu
2. **Ověřte Node.js verzi:** V Netlify settings nastavte Node.js 18 nebo vyšší
3. **Otestujte build lokálně:** `npm run build`
4. **Zkontrolujte environment variables:** Ujistěte se, že jsou všechny nastavené

### Aplikace nefunguje po nasazení

1. **Kontrola environment variables:** Ověřte, že jsou všechny proměnné nastavené správně
2. **Kontrola console v prohlížeči:** Otevřete Developer Tools a zkontrolujte chyby
3. **Kontrola Supabase CORS:** V Supabase dashboardu ověřte, že je vaše Netlify URL povolená
4. **Kontrola redirects:** `netlify.toml` obsahuje správné redirecty pro SPA

### Chyby s environment variables

- Ujistěte se, že proměnné začínají prefixem `VITE_` (pro Vite aplikace)
- Po změně environment variables **vždy trigger nový deploy**
- Environment variables jsou case-sensitive

### Supabase CORS chyby

V Supabase dashboardu:
1. Jděte na **Settings** → **API**
2. V sekci **CORS** přidejte vaši Netlify URL (např. `https://your-site.netlify.app`)

## 📝 Důležité poznámky

1. **Environment Variables:**
   - V Netlify jsou dostupné pouze při buildu
   - Pro runtime access musí začínat prefixem `VITE_` (což už máte správně)

2. **Build Command:**
   - Netlify automaticky detekuje `npm run build` z `netlify.toml`
   - Build vytvoří statické soubory ve složce `dist`

3. **Redirects:**
   - `netlify.toml` obsahuje redirect pro SPA routing
   - Všechny cesty (`/*`) jsou přesměrovány na `/index.html`

4. **Performance:**
   - Netlify automaticky optimalizuje a cachuje vaše soubory
   - Statické soubory jsou servovány z CDN

## ✅ Checklist před nasazením

- [ ] Aplikace běží lokálně (`npm run dev`)
- [ ] Build prochází bez chyb (`npm run build`)
- [ ] Všechny změny jsou commitnuté a pushnuté
- [ ] Environment variables jsou připravené
- [ ] `.env` soubor není commitnutý (je v `.gitignore`)
- [ ] Supabase projekt je vytvořený a konfigurovaný
- [ ] `netlify.toml` je přítomen v projektu

## 📞 Další zdroje

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Supabase Documentation](https://supabase.com/docs)

---

**Úspěšné nasazení! 🚀**

Po dokončení těchto kroků bude vaše aplikace dostupná na veřejné URL a automaticky se bude aktualizovat při každém push do hlavní větve.
