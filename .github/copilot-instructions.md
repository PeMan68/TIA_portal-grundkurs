# TIA Portal Grundkurs - Copilot Instructions

## Project Overview
Educational web app for learning Siemens TIA Portal v18, built with VitePress. Content is structured according to "Grundkurs TIA Portal v18 – Översikt.md" covering S7-1200 PLC, HMI, and frequency inverters.

## Project Structure
```
docs/                           # VitePress documentation root
├── .vitepress/config.mjs      # Swedish UI, responsive theme
├── index.md                   # Hero landing page
├── oversikt.md                # Course overview
├── 01-introduktion/           # 10 chapters with 2-3 sections each
├── 02-projektstruktur/
└── ... (10 chapters total)
```

## Tech Stack
- **VitePress 1.0** - Static site generator
- **Markdown** - All content in `.md` files
- **Swedish UI** - All navigation and labels in Swedish
- **Responsive** - Mobile and desktop optimized

## Development Commands
```bash
npm run docs:dev      # Start dev server (localhost:5173)
npm run docs:build    # Build for production
npm run docs:preview  # Preview production build
```

## Role-Based Workflows

### When doing research for course content:
1. Search for Swedish resources first, English as fallback
2. Prioritize official Siemens documentation and videos
3. Add findings directly to the relevant `.md` file in `docs/`
4. Use markdown format: headings, bullet points, code blocks
5. Include direct links with descriptive text: `[Siemens TIA Portal Manual](url)`
6. Cite all sources clearly

**Example:**
```markdown
## Vad är TIA Portal?

TIA Portal (Totally Integrated Automation) är Siemens...

### Resurser
- [Officiell Siemens dokumentation](https://support.industry.siemens.com)
- [Video: TIA Portal Introduction](https://youtube.com/...)
```

### When creating/editing course content:
1. Write in Swedish, pedagogical style
2. Structure: clear headings (##, ###), bullet points, examples
3. Replace `::: warning OBS` placeholders with real content
4. Each section should have:
   - Concept explanation
   - Practical examples or use cases
   - Links to videos/documentation (verified as working)
   - (Optional) Code snippets in appropriate syntax blocks
5. Keep sections concise (200-500 words typically)
6. Ask for feedback if scope/depth is unclear
7. **VIKTIGT: Verifiera alla externa länkar innan de läggs till** - använd fetch_webpage för att kontrollera att YouTube-videor och webbsidor är tillgängliga. Lägg aldrig till döda länkar.

**Content Pattern:**
```markdown
# Topic Title

Brief intro paragraph explaining the concept.

## Main Points
- Point 1 with explanation
- Point 2 with explanation

## Practical Example
Step-by-step or code example here.

## Resources
- [Video Tutorial](url)
- [Official Docs](url)
```

### When modifying the web app structure:
1. VitePress config is in `docs/.vitepress/config.mjs`
2. All UI text must be in Swedish
3. Sidebar structure mirrors course chapters - update sidebar array if adding/removing sections
4. For new chapters: create folder `docs/XX-name/`, add markdown files, update config sidebar
5. Theme is responsive by default - test on both desktop and mobile viewport
6. Search is configured for Swedish - keep `translations` in config accurate

**Adding a new section:**
1. Create `docs/0X-chapter/new-section.md`
2. Add to sidebar in config.mjs:
```js
{
  text: 'X. Chapter Name',
  items: [
    { text: 'New Section', link: '/0X-chapter/new-section' }
  ]
}
```

## General Guidelines
- Follow `Grundkurs TIA Portal v18 – Översikt.md` for structure
- All content in Swedish
- Prioritize clarity and pedagogical value
- Always ask for clarification if requirements are ambiguous
- Keep content accessible for beginners while being technically accurate

## Deployment Notes
- Local dev: `npm run docs:dev`
- For GitHub Pages: update `base` in config.mjs to repo name
- All links are relative (portable between local and deployed)
- No hardcoded localhost URLs