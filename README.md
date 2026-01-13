# TIA Portal Grundkurs

En interaktiv dokumentationssida för att lära sig Siemens TIA Portal v18.

## Kom igång

### Installation

```bash
npm install
```

### Starta utvecklingsserver

```bash
npm run docs:dev
```

Öppna sedan din webbläsare på `http://localhost:5173`

### Bygga för produktion

```bash
npm run docs:build
```

### Förhandsgranska produktionsbygge

```bash
npm run docs:preview
```

## Projektstruktur

```
TIA-kurs/
├── docs/                          # Dokumentationsroten
│   ├── .vitepress/
│   │   └── config.mjs            # VitePress konfiguration
│   ├── index.md                  # Startsida
│   ├── oversikt.md               # Kursöversikt
│   ├── 01-introduktion/          # Kapitel 1
│   ├── 02-projektstruktur/       # Kapitel 2
│   ├── 03-konfiguration/         # Kapitel 3
│   ├── 04-programmering/         # Kapitel 4
│   ├── 05-taggar/                # Kapitel 5
│   ├── 06-kommunikation/         # Kapitel 6
│   ├── 07-hmi-design/            # Kapitel 7
│   ├── 08-frekvensomriktare/     # Kapitel 8
│   ├── 09-test-simulering/       # Kapitel 9
│   └── 10-projekthantering/      # Kapitel 10
├── .github/
│   └── copilot-instructions.md   # AI agent instruktioner
├── research-agent.md             # Research agent instruktioner
├── content-generation-agent.md   # Content agent instruktioner
├── web-app-development-agent.md  # Development agent instruktioner
└── package.json

```

## Arbetsflöde för innehållsskapande

Se [TODO.md](TODO.md) för detaljerad checklista över färdiga och återstående kapitel.

**Aktuell status: 40% färdigt (12 av 29 sektioner)**

1. **Research Agent** söker och samlar information för varje kapitel
2. **Content Generation Agent** skapar pedagogiskt innehåll baserat på research
3. **Web App Development Agent** uppdaterar och underhåller webbappens struktur

Se `.github/copilot-instructions.md` för AI-agentinstruktioner.

## Publicering till GitHub Pages

1. Bygg projektet: `npm run docs:build`
2. Uppdatera `base` i `.vitepress/config.mjs` till ditt repo-namn
3. Pusha till GitHub
4. Aktivera GitHub Pages i repo-inställningar (använd `/docs` som källa)

## Teknisk stack

- **VitePress** - Statisk site generator för dokumentation
- **Vue 3** - Framework (används av VitePress)
- **Markdown** - Innehållsformat

## Licens

Detta är ett utbildningsmaterial för internt bruk.
