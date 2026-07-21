# KRET-Manufaktur – Website

Next.js 16 (App Router, Tailwind v4) mit öffentlicher Website, Geräte-Katalog und
passwortgeschützter Verwaltung.

> **Vor Änderungen lesen:** Diese Next.js-Version weicht deutlich von älteren ab (siehe
> `AGENTS.md`). Die massgebliche Dokumentation liegt im Projekt unter
> `node_modules/next/dist/docs/` – insbesondere `proxy` (hiess früher `middleware`),
> asynchrone `params`/`cookies` und die Caching-APIs.

## Entwicklung

```bash
npm install
cp .env.example .env.local     # Werte eintragen, siehe unten
npm run dev
```

Website: http://localhost:3000 · Verwaltung: http://localhost:3000/admin

### Umgebungsvariablen

Zugangsdaten erzeugen:

```bash
node scripts/hash-password.mjs "<gewünschtes-passwort>"
```

Das Skript gibt `ADMIN_PASSWORD_HASH` und `SESSION_SECRET` aus. Beide in `.env.local`
(lokal) bzw. in die Serverumgebung übernehmen. Das Klartext-Passwort wird nirgends
gespeichert – geht es verloren, einfach einen neuen Hash erzeugen.

| Variable              | Bedeutung                                               |
| --------------------- | ------------------------------------------------------- |
| `DATABASE_PATH`       | Pfad zur SQLite-Datei, Standard `data/kret.db`           |
| `UPLOAD_PATH`         | Ordner für hochgeladene Dateien, Standard `data/uploads` |
| `ADMIN_PASSWORD_HASH` | scrypt-Hash des Admin-Passworts                          |
| `SESSION_SECRET`      | Signaturschlüssel des Session-Cookies, mind. 32 Zeichen  |
| `COOKIE_SECURE`       | Optional, übersteuert das `Secure`-Flag – siehe Deployment |

## Aufbau

```
src/app/
  (site)/     öffentliche Seiten – Header, Footer, Cookie-Hinweis
    katalog/  Katalogübersicht und Produktseiten
  (admin)/    Verwaltung – eigene Oberfläche, nicht indexiert
  uploads/    liefert hochgeladene Dateien aus
  api/admin/  Upload-Endpunkt
src/lib/
  db/         SQLite-Zugriff (libSQL) inkl. Migrationen
  auth/       Passwortprüfung, Session, Zugriffsschutz
  validation/ Zod-Schemata für alle Formulare
```

Die Route-Gruppen `(site)` und `(admin)` ändern keine URLs – sie trennen nur die Layouts.

### Daten

Produkte und Kategorien liegen in einer SQLite-Datei, angesprochen über `@libsql/client`
(vorkompilierte Binaries, kein Compiler auf dem Zielsystem nötig). Migrationen stehen als
Code in `src/lib/db/migrations.ts` und laufen beim ersten Datenbankzugriff automatisch.
**Migrationen werden nie nachträglich geändert** – Anpassungen kommen als neue Migration
dazu.

Verschachtelte Inhalte (Textblöcke, technische Daten, FAQ, Galerie, Downloads) liegen als
JSON-Spalten. Die Textblöcke nutzen dieselbe Struktur wie die Leistungsseiten und laufen
über denselben Renderer (`src/components/content/ContentBlocks.tsx`).

### Sicherheit

Server Actions und Route Handler sind direkt per POST erreichbar – nicht nur über die
Oberfläche. Deshalb prüft **jede** mutierende Action und **jeder** geschützte Endpunkt die
Anmeldung selbst über `requireAdmin()` bzw. `assertAdmin()`. `src/proxy.ts` leitet nicht
angemeldete Zugriffe auf `/admin/*` zur Anmeldung um – das ist Komfort, keine
Sicherheitsgrenze.

Uploads: Nur JPG, PNG, WebP und PDF, max. 10 MB. Geprüft werden Dateityp **und** die
Signatur am Dateianfang, weil der vom Browser gemeldete Typ fälschbar ist. Der
hochgeladene Dateiname landet nie im Pfad – gespeichert wird unter einer UUID.

## Deployment (eigener Server / VPS)

Voraussetzung: Node.js 20.9 oder neuer.

```bash
npm ci
npm run build
npm start
```

> **TLS ist Pflicht.** Das Session-Cookie wird in der Produktion mit `Secure` gesetzt und
> daher von Browsern nur über HTTPS gesendet. Läuft die Seite über einfaches `http://`,
> kann sich niemand anmelden – die Anmeldung springt kommentarlos zum Formular zurück.
> Deshalb einen Reverse-Proxy (nginx) davorschalten und dort TLS terminieren
> (Let's Encrypt genügt).
>
> Für einen Test ohne TLS – etwa Zugriff über die IP im lokalen Netz – lässt sich das
> Flag mit `COOKIE_SECURE="false"` abschalten. **Nicht für den öffentlichen Betrieb:**
> ohne TLS liest jeder auf dem Netzweg das Session-Cookie mit und ist damit angemeldet.
> Ein anderes Token-Format ändert daran nichts – das Cookie ist ein Bearer-Token, und
> das Passwort selbst geht beim Anmelden ohnehin im Klartext über die Leitung.
> `http://localhost` ist davon nicht betroffen: Browser behandeln es als sicheren
> Kontext und akzeptieren `Secure`-Cookies dort auch ohne TLS.

`npm run build` erzeugt über `next-sitemap` auch `robots.txt` und die Sitemap der
statischen Seiten. Die Produktseiten liefert `/katalog-sitemap.xml` zur Laufzeit aus der
Datenbank; sie ist in der `robots.txt` verlinkt und braucht keinen erneuten Build.

### Backup

Alle veränderlichen Daten liegen bewusst ausserhalb des Repositories:

- `data/kret.db` – Produkte und Kategorien
- `data/uploads/` – hochgeladene Bilder und PDFs

Beide regelmässig sichern. Die Datenbank lässt sich im laufenden Betrieb konsistent
kopieren:

```bash
sqlite3 data/kret.db ".backup 'backup-$(date +%F).db'"
```

## Prüfen

```bash
npx tsc --noEmit   # Typen
npm run lint       # ESLint
npm run build      # Produktionsbuild
```
