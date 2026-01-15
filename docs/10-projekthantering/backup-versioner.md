# Backup och versioner

Regelbunden säkerhetskopiering skyddar ditt arbete mot dataförlust. TIA Portal erbjuder flera sätt att hantera backup och versionshistorik.

## Skapa backup

### Manuell backup via arkivering
Det säkraste sättet att skapa backup:

1. **Project > Archive...**
2. Välj backupmapp
3. Namnge med datum: `Projekt_Backup_20240115.zap18`
4. Klicka **Archive**

### Backup av projektmapp
Du kan också kopiera hela projektmappen:
1. Stäng projektet i TIA Portal
2. Kopiera hela mappen till backupplats
3. Behåll mappstrukturen intakt

::: warning Varning
Kopiera ALDRIG projektmappen medan TIA Portal har projektet öppet - det kan korrumpera filerna!
:::

## Automatisk backup

### Windows schemalagda uppgifter
Skapa automatisk backup med PowerShell-script:

```powershell
# Backup-script.ps1
$source = "C:\TIA_Projekt\MittProjekt_V18"
$dest = "D:\Backup\TIA"
$date = Get-Date -Format "yyyyMMdd"
$backupName = "MittProjekt_$date"

# Skapa ZIP-arkiv
Compress-Archive -Path $source -DestinationPath "$dest\$backupName.zip"

# Behåll endast senaste 10 backup
Get-ChildItem $dest -Filter "MittProjekt_*.zip" | 
    Sort-Object CreationTime -Descending | 
    Select-Object -Skip 10 | 
    Remove-Item
```

Schemalägg i Windows Task Scheduler för daglig körning.

## Versionshantering

### Intern versionshantering
TIA Portal har inbyggd möjlighet att jämföra versioner:

1. **Project > Compare > Offline/offline**
2. Välj två projektversioner
3. Se skillnader grafiskt

### Versionsnumrering
Använd semantisk versionering:
```
Major.Minor.Patch
Exempel: 2.1.3

Major = Stora förändringar
Minor = Nya funktioner
Patch = Buggfixar
```

### Versions-logg i projektet
Skapa ett dokumentblock med ändringshistorik:

```
============================================
Projekt: Transportband ABCIndustri
============================================

Version 2.1.0 (2024-01-15)
- Lade till frekvensomriktarstyrning
- Ny larmhantering

Version 2.0.0 (2024-01-10)
- Omarbetad motorsekvens
- Ny HMI-design

Version 1.0.0 (2024-01-01)
- Första release
============================================
```

## Git för TIA Portal-projekt

### Använda Git med TIA Portal
Git kan användas för avancerad versionshantering:

#### Fördelar:
- Fullständig historik över alla ändringar
- Möjlighet att återgå till vilken version som helst
- Samarbete mellan flera utvecklare
- Branching för parallell utveckling

#### Utmaningar:
- TIA Portal-filer är binära (stora diffar)
- Projektet måste exporteras för meningsfulla diffar

### Git-workflow
1. Arkivera projekt till `.zap18`
2. Lägg till i Git-repository
3. Commit med beskrivande meddelande
4. Push till remote (GitHub, Azure DevOps etc.)

### Exempel .gitignore
```gitignore
# Ignorera TIA Portal temp-filer
*.ap18.lck
UserData/
AdditionalFiles/Thumbnails/
```

## Restore från backup

### Från arkivfil
1. **Project > Retrieve...**
2. Välj backup-filen (`.zap18`)
3. Ange destination för projektet
4. Klicka **Retrieve**

### Från kopierad mapp
1. Kopiera projektmappen till önskad plats
2. Öppna `.ap18`-filen i TIA Portal
3. Projektet öppnas direkt

## Upload från PLC

### Återskapa projekt från PLC
Om du förlorat projektfilen men har en fungerande PLC:

1. Gå online med PLC:n
2. **Online > Upload device as new station**
3. TIA Portal laddar upp konfiguration och program

::: warning Begränsningar
Upload återskapar INTE:
- Kommentarer
- Symboliska namn (taggar)
- HMI-projekt
- Dokumentation
:::

## Best practices för backup

### 3-2-1-regeln
- **3** kopior av datan
- **2** olika lagringsmedia (lokal + extern)
- **1** kopia offsite (molnlagring)

### Backup-schema
| Typ | Frekvens | Behåll |
|-----|----------|--------|
| Daglig | Varje kväll | 7 dagar |
| Veckovis | Fredag | 4 veckor |
| Månadsvis | Sista dagen | 12 månader |
| Vid release | Vid varje version | Permanent |

### Testa backup regelbundet
Minst kvartalsvis:
1. Välj en slumpmässig backup
2. Återställ till testmiljö
3. Verifiera att projektet öppnas
4. Kontrollera att program kan kompileras

### Dokumentera backup-rutiner
```
BACKUP-RUTIN för [Projektnamn]
================================
Ansvarig: [Namn]
Lagringsplats 1: D:\Backup\TIA
Lagringsplats 2: \\Server\Backup\TIA
Lagringsplats 3: OneDrive/TIA_Backup

Frekvens: Daglig kl 18:00
Retention: 30 dagar

Senast testad: 2024-01-01
Testresultat: OK
```

## Resurser

### Officiell dokumentation
- [TIA Portal V18 Updates](https://support.industry.siemens.com/cs/document/109817218/updates-for-step-7-v18-s7-plcsim-v18-and-wincc-v18) - Projekthantering och dokumentation

## Nästa steg

- [Spara och arkivera](./spara-arkivera) - Grundläggande sparning
- [Exportera taggar](./exportera-taggar) - Arbeta med Excel
