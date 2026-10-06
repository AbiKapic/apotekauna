# Herba storefront

Za pokretanje instalirajte Node.js 22.12+ i pnpm, zatim:

    pnpm install
    pnpm dev

Za produkciju: pnpm build. Objavite sadržaj direktorija dist.
Za novi export nakon izmjena: pnpm export.

src/app/App.tsx: React Router stranice, pretraga, detalji i korpa.
public/catalog.json: demonstracijski sadržaj; fotografije nisu fotografije stvarnih proizvoda.
src/styles/fonts.css: Google font DM Sans.
src/styles/theme.css: Tailwind boje i tipografija.

BACKEND
Sve kartice čitaju se preko fetch zahtjeva, nisu ugrađene u JSX.
Za svoj backend postavite VITE_CATALOG_URL=https://vas-backend.ba/api/catalog u .env.local.
Endpoint mora vratiti JSON prema strukturi public/catalog.json: products, categories,
advice, hero i contact. ID-jevi moraju biti stabilni, category je ID kategorije,
cijene su brojevi u KM, a image je URL slike iz vašeg backenda.
Kod različitih domena omogućite CORS za domenu aplikacije. Ne stavljajte tajne API ključeve u VITE varijable.
Backend nije implementiran u ovom projektu; lokalni JSON služi samo demonstraciji.
Korpa čuva stavke i količine u localStorage. Plaćanje i slanje narudžbi nisu povezani.
Za produkciju provjeravajte cijene i zalihe na serveru, ne vjerujte podacima korpe iz preglednika.
Kontakt podaci su primjeri; zamijenite ih kroz API prije objave.
Hosting mora preusmjeravati nepostojeće putanje na index.html za React Router.

CODEX I FIGMA MCP
Ovaj projekt već je React; preuzeti arhiv raspakujte i otvorite u Codexu.
Pokrenite pnpm install i pnpm dev.
Za povezivanje Figma MCP servera u Codex CLI pokrenite:

    codex mcp add figma --url https://mcp.figma.com/mcp
    codex mcp login figma

Zatim otvorite Codex u direktoriju projekta i dostavite Figma Design URL s node-id.
Primjer zahtjeva: Koristi Figma MCP da implementiraš ovaj čvor u postojećem React
projektu. Sačuvaj rute, korpu i učitavanje podataka iz VITE_CATALOG_URL.
MCP pristupa dizajnu; arhiv sadrži stvarni izvorni React kod i ne zahtijeva MCP za pokretanje.

## Apoteka development workspace

The complete Herba project is preserved here. The original Desktop/herba folder remains a backup. Git has not been initialized.

Use Node.js 22.12+ (Node 24 is supported) and pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm preview
```

`pnpm check` runs strict TypeScript checking and the production build. `pnpm format` formats the project; `pnpm format:check` checks formatting. The committed lockfile should be used for reproducible dependency installation.

Copy `.env.example` to `.env.local` only if you need a backend catalog URL. Frontend VITE variables are public, so never place credentials there.

See [docs/DESIGN-INVENTORY.md](docs/DESIGN-INVENTORY.md) for all preserved pages, design files, external assets and remaining product work. Both the active storefront and the earlier standalone design component are retained.

`pnpm export` packages source, public assets, configuration, documentation and the lockfile; it excludes dependencies, build output and private environment files. Generate the export before building if you want the download link included in the deployed site.
