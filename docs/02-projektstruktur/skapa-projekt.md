# Skapa nytt projekt

Att skapa ett nytt projekt i TIA Portal är det första steget i varje automationsprojekt. Ett projekt samlar all information om hårdvara, nätverk, program och HMI på ett ställe. Här går vi igenom hur du skapar och konfigurerar ett nytt projekt från grunden.

## Starta TIA Portal och skapa projekt

### Steg 1: Öppna TIA Portal
1. Starta TIA Portal från Windows startmeny
2. Du möts av **Portal View** - startskärmen
3. Välj "Create new project" eller använd genvägen `Ctrl+N`

### Steg 2: Projektinställningar
I dialogen för nytt projekt anger du:

**Projektnamn:**
- Välj ett beskrivande namn (t.ex. "MittFörstaProjekt" eller "ConveyorSystem_2026")
- Undvik specialtecken och mellanslag
- Använd understreck `_` eller CamelCase

**Projektsökväg:**
- Välj en lämplig plats på din dator
- Undvik nätverksenheter (kan vara långsamt)
- Rekommendation: `C:\TIA_Projects\`

**Författare och kommentar:**
- Fyll i ditt namn som författare
- Lägg till en kort beskrivning av projektet
- Detta hjälper vid dokumentation och arkivering

### Steg 3: Bekräfta och öppna
1. Klicka på "Create"
2. Projektet skapas och öppnas automatiskt
3. Du ser nu **Project View** med projektträdet till vänster

## Projektstruktur i TIA Portal

Ett nyskapat projekt har följande grundstruktur:

```
MittProjekt/
├── Devices & networks     # Hårdvarukonfiguration
├── PLC tags               # Globala taggar (skapas vid PLC-tillägg)
├── Program blocks         # Programkod (skapas vid PLC-tillägg)
├── HMI tags               # HMI-taggar (skapas vid HMI-tillägg)
├── Screens                # HMI-skärmbilder (skapas vid HMI-tillägg)
└── Common data            # Delad information
```

::: tip Tips
Projektträdet visas till vänster. Dubbelklicka på en post för att öppna den i arbetsytan till höger.
:::

## Projektinställningar och konfiguration

### Språk och enheter
1. Högerklicka på projektnamnet i trädet
2. Välj "Properties"
3. Under **Language & Resources**:
   - Välj projektspråk (svenska/engelska)
   - Ställ in standardenheter (metriskt/imperiellt)

### Versionshantering
1. Under "Properties" → **General**
2. Fyll i versionsnummer (t.ex. "1.0.0")
3. Lägg till ändringskommentarer

### Automatisk säkerhetskopiering
TIA Portal kan automatiskt skapa säkerhetskopior:
1. Meny: **Options** → **Settings**
2. Gå till **General** → **Backup**
3. Aktivera "Enable backup"
4. Välj backup-intervall och antal kopior att behålla

## Best Practices för projektnamn

✅ **Bra exempel:**
- `ConveyorLine_Main_v1`
- `PackagingMachine_2026`
- `BuildingHVAC_FloorB`

❌ **Undvik:**
- `Test123` (otydligt)
- `Projekt 1` (mellanslag)
- `äöå-projekt` (specialtecken)
- `C:\Very\Long\Path\Names\...` (för långa sökvägar)

## Nästa steg

När projektet är skapat är nästa steg att:
1. **Lägga till hårdvara** - PLC, HMI, frekvensomriktare
2. **Konfigurera nätverk** - IP-adresser och Profinet
3. **Börja programmera** - Skapa OB, FB, FC

Se nästa avsnitt: [Lägg till enheter](./lagg-till-enheter.md)

## Resurser och videotutorials

### Officiell dokumentation
- [TIA Portal: Creating a Project](https://support.industry.siemens.com/cs/document/109772803) - Siemens guide
- [Siemens: TIA Portal Getting Started](https://support.industry.siemens.com/cs/products?search=tia%20portal%20getting%20started) - Nybörjarguider

### Video-tutorials
- Sök på YouTube: "TIA Portal create new project tutorial"
- Rekommenderad: "TIA Portal V18 - First Steps" på Siemens YouTube-kanal

::: info Tips för nybörjare
Spara projektet ofta med `Ctrl+S`. TIA Portal kan krascha vid stora projekt, så regelbunden sparande är viktigt!
:::
