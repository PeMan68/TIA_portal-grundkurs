# Spara och arkivera projekt

Korrekt hantering av TIA Portal-projekt är avgörande för att säkerställa att ditt arbete inte går förlorat och att du kan återskapa system vid behov.

## Spara projekt

### Grundläggande sparning
- **Ctrl+S** - Spara projektet
- **Project > Save** - Samma funktion via menyn
- Autosave kan konfigureras i inställningar

### Var sparas projektet?
TIA Portal-projekt sparas som mappar med filändelsen `.ap18` (för V18):
```
MittProjekt_V18/
├── MittProjekt.ap18
├── AdditionalFiles/
├── UserFiles/
└── [diverse systemfiler]
```

::: tip Tips
Spara ofta! TIA Portal kan krascha vid stora projekt. Aktivera autosave under **Options > Settings > General > Auto save**.
:::

## Arkivera projekt

Arkivering skapar en komprimerad fil som innehåller allt för att återskapa projektet.

### Skapa arkiv
1. Gå till **Project > Archive...**
2. Välj var arkivfilen ska sparas
3. Ange filnamn (t.ex. `MittProjekt_2024-01-15`)
4. Klicka **Archive**

### Arkiveringsalternativ
| Alternativ | Beskrivning |
|------------|-------------|
| Include subprojects | Inkludera länkade delprojekt |
| Include password-protected data | Behåll krypterade block |
| Compress archive | Minska filstorlek (rekommenderas) |

### Arkivformat
Arkivfilen får filändelsen:
- `.zap18` - Komprimerat arkiv (V18)
- `.ap18` - Okomprimerat (vanligt projekt)

## Retrieve (Återskapa) projekt

### Öppna arkiverat projekt
1. Gå till **Project > Retrieve...**
2. Välj arkivfilen (`.zap18`)
3. Ange var projektet ska extraheras
4. Klicka **Retrieve**

### Automatisk extrahering
TIA Portal extraherar arkivet och öppnar projektet automatiskt.

## Projektbibliotek

Spara återanvändbara delar i ett bibliotek:

### Global Library
1. Öppna **Libraries** i sidopanelen
2. Högerklicka i **Global libraries**
3. Välj **Create new global library**
4. Dra block/taggar/typer till biblioteket

### Vad kan sparas i bibliotek?
- Programblock (FB, FC, DB)
- PLC-datatyper (UDT)
- HMI-skärmbilder och objekt
- Taggtabeller
- Hårdvarukonfigurationer

### Använd bibliotekselement
1. Öppna biblioteket
2. Dra elementet till ditt projekt
3. Elementet kopieras (inte länkas)

## Migrera projekt mellan versioner

### Uppgradera projekt
TIA Portal kan öppna projekt från äldre versioner:
1. Öppna äldre projekt
2. TIA Portal frågar om uppgradering
3. Projektet konverteras till ny version

::: warning Obs
Uppgradering är permanent - spara en kopia av originalprojektet först!
:::

### Kompatibilitet
| Från version | Till V18 |
|--------------|----------|
| V17 | ✓ Direkt uppgradering |
| V16 | ✓ Direkt uppgradering |
| V15 | ✓ Kräver mellansteg |
| V14 och äldre | ✓ Stegvis via äldre versioner |

## Best practices för projekthantering

### Namngivning
Använd konsekvent namngivning:
```
[Kundnamn]_[Maskin]_[Version]_[Datum]
Exempel: ABCIndustri_Transportband1_V2_20240115
```

### Mappstruktur
Organisera projekt på disk:
```
Projekt/
├── ABCIndustri/
│   ├── Aktiv/
│   │   └── Transportband1_V18/
│   ├── Arkiv/
│   │   ├── Transportband1_2024-01-10.zap18
│   │   └── Transportband1_2024-01-05.zap18
│   └── Bibliotek/
│       └── StandardBlock.al18
└── XYZFabrik/
    └── ...
```

### Versionsdokumentation
Skapa en versions-logg:
```
Version: 2.0
Datum: 2024-01-15
Ändringar:
- Lade till ny motorstyrning
- Fixade bugg i larmhantering
- Uppdaterade HMI-layout
```

## Resurser

### Officiell dokumentation
- [TIA Portal Documentation Overview](https://support.industry.siemens.com/cs/document/109817218/updates-for-step-7-v18-s7-plcsim-v18-and-wincc-v18) - Uppdateringar och dokumentation

## Nästa steg

- [Backup och versioner](./backup-versioner) - Säkerhetskopiering
- [Exportera taggar](./exportera-taggar) - Arbeta med Excel
