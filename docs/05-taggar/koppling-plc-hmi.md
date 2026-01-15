# Koppling PLC ↔ HMI

En av de mest kraftfulla funktionerna i TIA Portal är den **integrerade** kopplingen mellan PLC och HMI. Detta avsnitt förklarar hur du delar taggar och data mellan programlogik och operatörspanel.

## Översikt: PLC- och HMI-taggar

### Tre typer av taggar i TIA Portal

| Tagg-typ | Var definieras | Var används | Kommunikation |
|----------|----------------|-------------|---------------|
| **PLC tags** | I PLC:n | PLC-program | Delas automatiskt till HMI |
| **HMI tags** | I HMI:n | Endast HMI-skärmar | Lokala variabler i HMI |
| **External tags** | Referens till PLC tags | HMI → PLC | Live-koppling till PLC-minne |

::: tip Bästa praxis
**Använd alltid PLC tags som "External tags" i HMI** - då har du en gemensam tagg-databas och undviker synkroniseringsproblem.
:::

## Steg-för-steg: Koppla PLC till HMI

### 1. Skapa PLC-taggar

Först definierar du taggarna i PLC:n.

**I PLC tags:**
```
Namn                Datatyp    Adress    Kommentar
---------------------------------------------------
M01_Motor_Start     BOOL       %M0.0     Startkommando till motor 1
M01_Motor_Running   BOOL       %M0.1     Motor 1 körstatus
M01_Motor_Speed     INT        %MW10     Motor 1 hastighet (rpm)
Tank_Level          REAL       %MD20     Tanknivå (liter)
Alarm_Active        BOOL       %M1.0     Aktivt larm
```

### 2. Lägg till HMI i projektet

Om du inte redan har en HMI:
1. Högerklicka **Add new device** → **HMI** → Välj modell (ex: KTP700 Basic)
2. Konfigurera **Connection** mellan PLC och HMI (Profinet PN/IE)

### 3. Importera PLC-taggar till HMI

**Automatisk import:**
1. I HMI-projektträdet, gå till **HMI tags**
2. Högerklicka **Connections** → Välj din PLC-koppling
3. Markera **Default tag table** i PLC
4. Dra och släpp till HMI-tag-området

**Resultat:** Alla PLC-taggar visas nu som **External tags** i HMI:n.

### 4. Använd taggar i HMI-skärm

**Exempel: Knapp för motorstart**

1. Öppna en HMI-skärm
2. Lägg till en **Button**
3. Konfigurera Events:
   - **Event:** Press
   - **Function:** SetBit
   - **Tag:** `M01_Motor_Start`
4. Konfigurera Animation:
   - **Property:** Background color
   - **Tag:** `M01_Motor_Running`
   - TRUE = Grön, FALSE = Grå

**Exempel: Textfält för hastighetsvisning**

1. Lägg till **I/O Field**
2. Konfigurera:
   - **Tag:** `M01_Motor_Speed`
   - **Format:** Numeric, 4 digits
   - **Unit:** "rpm"

## Tagg-uppdateringslägen

### Acquisition Mode

Hur ofta HMI läser värden från PLC:n.

| Läge | Beskrivning | Användning |
|------|-------------|------------|
| **Cyclic continuous** | Läser kontinuerligt | Realtidsvärden (hastighet, tryck) |
| **Cyclic in operation** | Läser endast när skärm är aktiv | Energibesparing |
| **On demand** | Läser endast när begärt | Sällan ändrade värden |

**Sätta acquisition mode:**
1. HMI tags → Högerklicka tagg → **Properties**
2. **General** → **Acquisition mode**

::: tip Standard: Cyclic continuous
För de flesta fall, använd **Cyclic continuous** för snabb respons. Optimera endast om du har prestandaproblem.
:::

### Update Cycle

Hur ofta värden uppdateras (millisekunder).

- **Standard:** 100 ms (10 Hz)
- **Snabb:** 50 ms (20 Hz) - för snabba processer
- **Långsam:** 500-1000 ms - för trender och loggning

**Sätta update cycle:**
1. HMI tags → Markera taggar
2. Högerklicka → **Properties** → **Acquisition cycle:** 100 ms

## Datatyper och skalning

### Direkt koppling

Datatyper som fungerar direkt mellan PLC och HMI:

| PLC-typ | HMI-typ | Exempel |
|---------|---------|---------|
| BOOL | Bool | Knappar, lampor |
| INT | Int | Hastighet, temperatur |
| REAL | Real | Flöde, tryck |
| STRING | String | Meddelanden, operatörsnamn |

### Skalning för analoga värden

Om PLC använder INT (ex: 0-27648 för 0-100%) måste du skala i HMI.

**Exempel: Analog ingång 0-27648 → 0-100%**

**I HMI:**
1. Skapa **Internal tag:** `Tank_Level_Percent` (REAL)
2. I screen script eller cyclic update:
```vbs
' Skala 0-27648 till 0-100
Tag("Tank_Level_Percent") = (Tag("Tank_Level_Raw") / 27648.0) * 100.0
```

**Eller använd Linear Scaling:**
1. I/O Field → **Properties** → **Representation**
2. **Linear scaling:**
   - Process value min: 0
   - Process value max: 27648
   - Display value min: 0.0
   - Display value max: 100.0

## Synkronisering och konsistens

### Problem: Dubbla taggar

❌ **Fel:** Skapa samma tagg i både PLC och HMI separat
```
PLC tags: Motor_Speed (INT)
HMI tags: Motor_Speed (Int) - INTERN KOPIA
```
**Resultat:** Värden synkas inte automatiskt!

✅ **Rätt:** Använd PLC tags som External tags
```
PLC tags: Motor_Speed (INT)
HMI external tags: Motor_Speed → PLC:Motor_Speed
```

### Automatisk uppdatering

När du ändrar en PLC-tagg (namn, datatyp, kommentar):
1. **Högerklicka** i HMI tags → **Update connection**
2. TIA Portal synkroniserar automatiskt

::: warning OBS
Om du tar bort en PLC-tagg som används i HMI får du **kompileringsfel**. Uppdatera alltid HMI efter PLC-ändringar!
:::

## Riktning: Read/Write-åtkomst

### Read-only taggar

För säkerhet, gör vissa taggar **read-only** i HMI.

**Exempel:** Tanknivå får inte skrivas från HMI (endast läsas).

1. HMI tags → Tagg `Tank_Level` → Properties
2. **Access mode:** Read

### Write-only taggar

För känsliga värden (lösenord, parametrar).

1. HMI tags → Tagg → Properties
2. **Access mode:** Write

::: tip Standardinställning
Om inget anges är taggar **Read/Write**. Sätt restriktioner där det behövs för säkerhet.
:::

## Exempel: Komplett motorstyrning

### PLC tags (i PLC)
```
M01_Start_Button     BOOL   %I0.0   "Fysisk startknapp"
M01_Stop_Button      BOOL   %I0.1   "Fysisk stoppknapp"
M01_Running          BOOL   %Q0.0   "Motorutgång"
M01_Speed_Setpoint   INT    %MW10   "Hastighetsvärde från HMI (rpm)"
M01_Speed_Actual     INT    %MW12   "Faktisk hastighet från givare"
M01_Alarm            BOOL   %M1.0   "Motorlarm"
```

### HMI-skärm

**Objekt 1: Startknapp**
- Type: Button
- Event: Press → SetBit `M01_Start_Button`
- Animation: `M01_Running` → Grön (TRUE), Grå (FALSE)

**Objekt 2: Stoppknapp**
- Type: Button
- Event: Press → SetBit `M01_Stop_Button`
- Animation: Fast röd färg

**Objekt 3: Hastighetsinställning**
- Type: I/O Field
- Tag: `M01_Speed_Setpoint`
- Input: Enabled (användaren kan ändra)
- Range: 0-1500 rpm

**Objekt 4: Faktisk hastighet**
- Type: I/O Field
- Tag: `M01_Speed_Actual`
- Input: Disabled (Read-only)
- Format: "0000 rpm"

**Objekt 5: Larmindikator**
- Type: Circle
- Animation: `M01_Alarm` → Röd blinkande (TRUE), Osynlig (FALSE)

### PLC-program (i OB1)
```scl
// Motorlogik (förenklad)
IF "M01_Start_Button" AND NOT "M01_Alarm" THEN
    "M01_Running" := TRUE;
END_IF;

IF "M01_Stop_Button" OR "M01_Alarm" THEN
    "M01_Running" := FALSE;
END_IF;

// Hastighetsreglering (förenklad)
IF "M01_Running" THEN
    // Använd hastighetsvärde från HMI
    "M01_Speed_Actual" := "M01_Speed_Setpoint";
END_IF;
```

## Best practices

::: tip Rekommendationer
1. **Alltid PLC tags som källa:** Definiera taggar i PLC, importera till HMI
2. **Konsekvent namngivning:** `Device_Function_Property` (ex: `M01_Motor_Speed`)
3. **Kommentera allt:** Kommentarer i PLC visas automatiskt i HMI
4. **Gruppera taggar:** Använd flera tag tables (Inputs, Outputs, HMI_Variables)
5. **Update cycle:** 100 ms för realtid, 500-1000 ms för loggning
6. **Read-only där möjligt:** Lås taggar som HMI inte ska ändra
7. **Testa koppling:** Använd **Online & Diagnostics** för att verifiera kommunikation
:::

## Felsökning: Kommunikationsproblem

### Problem: Taggar uppdateras inte

**Checklista:**
1. ✅ Är HMI och PLC **online**? (Grön ikon i projektträdet)
2. ✅ Är **connection** korrekt konfigurerad? (Profinet/Ethernet)
3. ✅ Har du **uppdaterat HMI tags** efter PLC-ändringar?
4. ✅ Är acquisition mode **Cyclic continuous**?
5. ✅ Kör programmet både i PLC och HMI? (Download till båda)

### Problem: Fel datatyp

```
PLC: Motor_Speed (REAL)
HMI: Motor_Speed (Int)
```
**Lösning:** Uppdatera HMI tags eller konvertera i PLC/HMI.

## Resurser

- [Siemens: PLC-HMI Communication dokumentation (sökresultat)](https://support.industry.siemens.com/cs/products?search=plc%20hmi%20communication%20tia%20portal)
- [Video: Connecting HMI to PLC](https://www.youtube.com/watch?v=n3QbOk7nP3Y)
- [Video: HMI Tag Management](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
- [Nästa: Profinet-kommunikation →](../06-kommunikation/profinet.md)

---
**Relaterat:**
- [HMI-design och skärmar](../07-hmi-design/skarmbilder.md)
- [Globala vs lokala taggar](./globala-lokala.md)
- [Konfiguration av HMI](../03-konfiguration/hmi-installningar.md)
