# Jämförelse med Mitsubishi GX Works 2

Om du har erfarenhet av Mitsubishi GX Works 2 kommer du att känna igen många koncept i TIA Portal, men det finns också viktiga skillnader i hur systemen fungerar och är strukturerade. Denna jämförelse hjälper dig att förstå likheter och anpassa dig till TIA Portal.

## Översikt: Grundläggande likheter

Både TIA Portal och GX Works 2 är integrerade utvecklingsmiljöer för industriell automation:
- Båda erbjuder PLC-programmering, HMI-design och nätverkskonfiguration
- Stöd för flera programmeringsspråk (LAD, FBD, ST/SCL)
- Projektbaserad struktur med centraliserad datahållning
- Simuleringsmöjligheter för testning

## Huvudsakliga skillnader

### 1. Användargränssnitt och arbetsflöde

| Aspekt | TIA Portal | GX Works 2 |
|--------|-----------|------------|
| **Projektvy** | Träd-struktur till vänster, arbetsyta till höger | Flik-baserat gränssnitt |
| **Navigation** | Portal-vy med kategorier (PLC, HMI, Network) | Projekt-navigator och separata verktyg |
| **Multitasking** | Flera editorer kan vara öppna samtidigt | En huvudvy i taget |
| **Integration** | HMI-design inbyggd i samma miljö | GT Designer separat verktyg |

### 2. Programmeringsstruktur

**TIA Portal / SIMATIC:**
- **Organization Blocks (OB)** - Huvudprogram och händelser
- **Function Blocks (FB)** - Med instans-databas
- **Functions (FC)** - Återanvändbara funktioner utan minnesområde
- **Data Blocks (DB)** - Strukturerad datalagring

**GX Works 2 / Mitsubishi:**
- **Main Program** - Huvudprogram
- **Subroutines (SUB)** - Återanvändbara program
- **Function Blocks (FB)** - Liknande som Siemens men annan struktur
- **Device Memory** - D-register, M-relä, etc.

::: tip Viktigt att notera
I TIA Portal måste du skapa en instans (DB) för varje FB du använder. I GX Works 2 hanteras detta annorlunda med direkta minnesområden.
:::

### 3. Adressering och taggar

**TIA Portal:**
- Använder **symboliska namn** (taggar) som standard
- Exempel: `Motor_Start`, `Sensor_Temperature`
- Absolut adressering: `%I0.0`, `%Q1.3`, `%MW10`
- Taggtabeller hanterar både namn och adresser

**GX Works 2:**
- Primärt **direkt adressering**
- Exempel: `X0`, `Y10`, `D100`, `M0`
- Kommentarer och etiketter som tillägg
- Global Device Comments för symbolhantering

### 4. Datatyper

| Datatyp | TIA Portal | GX Works 2 |
|---------|-----------|------------|
| Bit | BOOL | Bit Device (X, Y, M) |
| Byte | BYTE (8 bit) | - |
| Word | WORD (16 bit) | Word (D, W) |
| Double Word | DWORD (32 bit) | Double Word (D+1) |
| Integer | INT, DINT | K (decimal), H (hex) |
| Real | REAL | E (scientific notation) |
| String | STRING | String (Special FB) |

### 5. Kommunikation och nätverk

**TIA Portal:**
- **Profinet** som primär standard
- Grafisk nätverkskonfiguration i Portal
- Automatisk konfiguration av telegramstrukturer
- OPC UA-stöd inbyggt

**GX Works 2:**
- **CC-Link** och **CC-Link IE** primärt
- Ethernet-kommunikation (MC Protocol)
- Nätverkskonfiguration via separata verktyg
- Modbus RTU/TCP-stöd

### 6. HMI-integration

**TIA Portal (WinCC):**
- Integrerad i samma projekt
- Taggar delas automatiskt mellan PLC och HMI
- Enkel drag-and-drop från PLC till HMI
- Konsekvent projekthantering

**GX Works 2 (GT Designer3):**
- Separat verktyg (GT Designer3)
- Export/import av devicelistor
- Manuell synkronisering mellan projekt
- Separata projektfiler

## Migreringstips: Från GX Works 2 till TIA Portal

Om du kommer från Mitsubishi-världen:

1. **Lär dig tänka i taggar** - Använd symboliska namn istället för absoluta adresser
2. **Förstå FB-instanser** - Varje FB behöver ett DB (instans-databas)
3. **Utforska projektstrukturen tidigt** - Portal-vyn är din vän
4. **Använd Auto-Hotkeys** - TIA Portal har många tangentbordsgenvägar
5. **Läs Programming Guideline** - Siemens best practices skiljer sig från Mitsubishi

### Vanliga "gotchas"
- **Ingen M-relay direkt** - Använd `%M` (Memory bits) eller taggar
- **OB1 är inte Main** - Det är en cyklisk organisation block
- **Data Blocks krävs** - För FB-instanser och strukturerad data
- **Kompilera ofta** - TIA Portal kräver kompilering för vissa funktioner

## Sammanfattning

| Kriteria | TIA Portal | GX Works 2 |
|----------|-----------|------------|
| **Inlärningskurva** | Medel-Hög | Medel |
| **HMI-integration** | Utmärkt (inbyggd) | Bra (separat) |
| **Dokumentation** | Omfattande | Omfattande |
| **Global spridning** | Mycket stor (Europa) | Stor (Asien) |
| **Pris** | Medel-Högt | Medel |

## Resurser för migrering

- [Siemens vs Mitsubishi Comparison Guide](https://support.industry.siemens.com/cs/ww/en/view/86630375) - Officiell jämförelse
- Sök på YouTube: "TIA Portal for Mitsubishi users"
- Forum: [Siemens Industry Support Forum](https://support.industry.siemens.com/forum/ww/en)

::: info För erfarnade GX Works 2-användare
Det tar vanligtvis 2-4 veckor att känna sig bekväm med TIA Portal om du har god erfarenhet av GX Works 2. Koncepten är liknande, men verktygen och arbetsflödet kräver viss anpassning.
:::
