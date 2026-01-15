# TIA Portal Grundkurs - Innehållschecklista

## Status: 40% färdigt (12 av 29 sektioner)

---

## ✅ FÄRDIGA KAPITEL

### Kapitel 1: Introduktion (3/3 sektioner)
- [x] Vad är TIA Portal? ([vad-ar-tia-portal.md](docs/01-introduktion/vad-ar-tia-portal.md))
- [x] Siemens S7-1200 PLC-system ([s7-1200-plc-system.md](docs/01-introduktion/s7-1200-plc-system.md))
- [x] Jämförelse med GX Works 2 ([jamforelse-gx-works.md](docs/01-introduktion/jamforelse-gx-works.md))

### Kapitel 2: Projektstruktur (2/2 sektioner)
- [x] Skapa nytt projekt ([skapa-projekt.md](docs/02-projektstruktur/skapa-projekt.md))
- [x] Lägg till enheter ([lagg-till-enheter.md](docs/02-projektstruktur/lagg-till-enheter.md))

### Kapitel 3: Grundläggande konfiguration (3/3 sektioner)
- [x] PLC-hårdvara och nätverk ([plc-hardvara.md](docs/03-konfiguration/plc-hardvara.md))
- [x] HMI-inställningar ([hmi-installningar.md](docs/03-konfiguration/hmi-installningar.md))
- [x] Frekvensomriktare via Profinet ([frekvensomriktare-profinet.md](docs/03-konfiguration/frekvensomriktare-profinet.md))

### Kapitel 4: Programmeringsmiljö (3/3 sektioner)
- [x] OB, FB, FC – skillnader ([ob-fb-fc.md](docs/04-programmering/ob-fb-fc.md))
- [x] Språk: LAD, FBD, SCL ([sprak-lad-fbd-scl.md](docs/04-programmering/sprak-lad-fbd-scl.md))
- [x] Enkla logiska funktioner ([logiska-funktioner.md](docs/04-programmering/logiska-funktioner.md))

---

## 📝 ÅTERSTÅENDE KAPITEL

### Kapitel 5: Taggar och datatyper (0/3 sektioner)
- [ ] Globala vs lokala taggar ([globala-lokala.md](docs/05-taggar/globala-lokala.md))
- [ ] Datatyper ([datatyper.md](docs/05-taggar/datatyper.md))
- [ ] Koppling PLC ↔ HMI ([koppling-plc-hmi.md](docs/05-taggar/koppling-plc-hmi.md))

### Kapitel 6: Kommunikation (0/3 sektioner)
- [ ] Profinet-konfiguration ([profinet-konfiguration.md](docs/06-kommunikation/profinet-konfiguration.md))
- [ ] HMI till PLC ([hmi-till-plc.md](docs/06-kommunikation/hmi-till-plc.md))
- [ ] PLC till frekvensomriktare ([plc-till-frekvensomriktare.md](docs/06-kommunikation/plc-till-frekvensomriktare.md))

### Kapitel 7: HMI-design (0/3 sektioner)
- [ ] Skärmbilder ([skarmbilder.md](docs/07-hmi-design/skarmbilder.md))
- [ ] Knappar och indikatorer ([knappar-indikatorer.md](docs/07-hmi-design/knappar-indikatorer.md))
- [ ] Dynamiska objekt ([dynamiska-objekt.md](docs/07-hmi-design/dynamiska-objekt.md))

### Kapitel 8: Frekvensomriktare (0/3 sektioner)
- [ ] Grundparametrar ([grundparametrar.md](docs/08-frekvensomriktare/grundparametrar.md))
- [ ] Start/stop via PLC ([start-stop.md](docs/08-frekvensomriktare/start-stop.md))
- [ ] Hastighetsstyrning ([hastighetsstyrning.md](docs/08-frekvensomriktare/hastighetsstyrning.md))

### Kapitel 9: Test och simulering (0/3 sektioner)
- [ ] PLCSIM ([plcsim.md](docs/09-test-simulering/plcsim.md))
- [ ] HMI-simulering ([hmi-simulering.md](docs/09-test-simulering/hmi-simulering.md))
- [ ] Kommunikationskontroll ([kommunikationskontroll.md](docs/09-test-simulering/kommunikationskontroll.md))

### Kapitel 10: Projekthantering (0/3 sektioner)
- [ ] Spara och arkivera ([spara-arkivera.md](docs/10-projekthantering/spara-arkivera.md))
- [ ] Exportera taggar ([exportera-taggar.md](docs/10-projekthantering/exportera-taggar.md))
- [ ] Backup och versioner ([backup-versioner.md](docs/10-projekthantering/backup-versioner.md))

---

## 🚀 Så här fortsätter du arbetet

### För att fortsätta generera innehåll:

1. **Öppna projektet i VS Code**
   ```bash
   cd c:\Users\prmm00\dev\TIA-kurs
   code .
   ```

2. **Starta utvecklingsservern** (för att se resultat i browsern)
   ```bash
   npm run docs:dev
   ```

3. **Använd Copilot för att generera innehåll**
   
   Säg till Copilot:
   ```
   Fortsätt generera innehåll enligt TODO.md.
   Börja med kapitel 5: Taggar och datatyper
   ```

   Copilot kommer att:
   - Läsa TODO.md och se var vi är
   - Följa samma struktur och stil som tidigare kapitel
   - Skapa pedagogiskt innehåll på svenska
   - Inkludera tabeller, exempel, tips och länkar
   - Uppdatera TODO.md när sektioner är klara

### Innehållsmönster (för konsistens)

Varje sektion ska innehålla:
- 📚 **Pedagogisk förklaring** - Koncept och teori
- 📊 **Praktiska exempel** - Kod, tabeller, diagram
- 💡 **Tips och varningar** - Best practices
- 🎥 **Resurser** - Länkar till dokumentation och videos
- ➡️ **Nästa steg** - Link till relaterat avsnitt

### Kvalitetskrav

- ✅ All text på **svenska**
- ✅ Använd **markdown-formatering** (rubriker, listor, kodblock)
- ✅ Inkludera **konkreta exempel** från TIA Portal
- ✅ Länka till **officiella Siemens-resurser**
- ✅ Pedagogisk nivå: **nybörjare till medel**
- ✅ Längd per sektion: **200-800 ord** (+ exempel och tabeller)

---

## 📊 Progress tracker

```
Kapitel 1:  ████████████████████ 100% (3/3)
Kapitel 2:  ████████████████████ 100% (2/2)
Kapitel 3:  ████████████████████ 100% (3/3)
Kapitel 4:  ████████████████████ 100% (3/3)
Kapitel 5:  ░░░░░░░░░░░░░░░░░░░░   0% (0/3)
Kapitel 6:  ░░░░░░░░░░░░░░░░░░░░   0% (0/3)
Kapitel 7:  ░░░░░░░░░░░░░░░░░░░░   0% (0/3)
Kapitel 8:  ░░░░░░░░░░░░░░░░░░░░   0% (0/3)
Kapitel 9:  ░░░░░░░░░░░░░░░░░░░░   0% (0/3)
Kapitel 10: ░░░░░░░░░░░░░░░░░░░░   0% (0/3)
────────────────────────────────────
TOTALT:     ████████░░░░░░░░░░░░  40% (12/29)
```

---

## 📝 Anteckningar

### Senaste uppdatering: 2026-01-15

**Vad som gjorts:**
- ✅ Skapade VitePress-struktur med svensk UI
- ✅ Genererade komplett innehåll för kapitel 1-7 (21 sektioner)
- ✅ Fixade alla dead links i byggprocessen
- ✅ Bygget fungerar nu utan fel (exit code 0)
- ✅ GitHub Pages är uppsatt och fungerar
- ✅ URL: https://peman68.github.io/TIA_portal-grundkurs/

**Senaste fix:**
- Korrigerade alla dead links (felaktiga sökvägar)
- Bygget lyckas nu utan varningar
- Committat och pushat till GitHub

**Återstår:**
- Kapitel 8: Frekvensomriktare (3 sektioner) - Placeholder-innehåll finns
- Kapitel 9: Test och simulering (3 sektioner) - Placeholder-innehåll finns  
- Kapitel 10: Projekthantering (3 sektioner) - Placeholder-innehåll finns
- Generera riktigt innehåll för kapitel 8-10
- Bygga och publicera slutlig version

**Tips för framtida arbete:**
- Använd `npm run docs:build` innan push till GitHub
- Kontrollera alltid dead links i build-output
- Testa i browsern efter varje kapitel (localhost:5173)
- Committa regelbundet till git
- dist/-mappen är redan i .gitignore - ignorera ändringar där

---

**Uppdatera denna fil efter varje arbetspass! 📋**
