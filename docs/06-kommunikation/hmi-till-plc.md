# HMI till PLC kommunikation

Detta avsnitt beskriver hur HMI-panelen kommunicerar med PLC:n - från grundläggande konfiguration till optimering och felsökning.

## Skapa HMI-anslutning till PLC

### Steg 1: Lägg till HMI i projektet

1. Högerklicka på projektet → **Add new device**
2. Välj **HMI** → **SIMATIC Basic Panel** (eller Comfort)
3. Välj panelmodell, ex: **KTP700 Basic PN**
4. **HMI device wizard** startar automatiskt

### Steg 2: Konfigurera PLC-anslutning

I wizarden:

1. **PLC connections**: Klicka **Browse** → Välj din PLC
2. Anslutningstyp: **HMI connection** (standard)
3. Interface: Profinet väljs automatiskt
4. Klicka **Finish**

::: tip Manuell anslutning
Om du hoppade över wizarden:
1. HMI → **Connections** → **Add new connection**
2. Välj **S7-1200** eller **S7-1500**
3. Konfigurera IP-adress manuellt
:::

### Steg 3: Verifiera i Network view

1. **Device & Networks** → **Network view**
2. Kontrollera att en **lila linje** finns mellan HMI och PLC
3. Lila = HMI-connection (data exchange)

## Anslutningsparametrar

### Connection settings

I HMI → **Connections** → Dubbelklicka på anslutningen:

| Parameter | Beskrivning | Rekommenderat |
|-----------|-------------|---------------|
| **Cycle time** | Uppdateringsintervall | 100-500 ms |
| **Connection timeout** | Max väntetid | 10 sekunder |
| **Keep alive** | Håll anslutning aktiv | ✅ Aktiverad |

### Access Point

**Access Point** definierar vilka taggar PLC:n exponerar för HMI.

1. I PLC:n, öppna **PLC tags** eller **DB**
2. Markera tagg → **Properties** → **HMI accessible** ✅
3. Endast markerade taggar kan läsas/skrivas från HMI

::: warning Säkerhet
Aktivera **inte** HMI-åtkomst för känsliga taggar som säkerhetskritiska värden eller systemparametrar.
:::

## Dataöverföring: HMI → PLC

### Skriva värden (Setpoints)

När operatören matar in ett värde på HMI:

```
[HMI Input Field] ──(Tag-koppling)──> [PLC Tag/DB]
```

**Exempel i WinCC:**
1. Lägg till **I/O Field** på skärm
2. **Properties** → **Process** → **Tag**
3. Välj PLC-tagg, ex: `Motor_Data.Speed_Setpoint`
4. **Mode**: Input/Output

### Trigga funktioner (Knappar)

```
[HMI Button Press] ──(Event)──> [SetBit på PLC-tagg]
```

**Konfiguration:**
1. Lägg till **Button** på skärm
2. **Events** → **Press**
3. Lägg till funktion: **SetBit** eller **SetBitWhileKeyPressed**
4. Välj tagg: `Control.Start_Button`

### Skicka kommandoord

För mer komplex styrning, använd ett **kommandoord** (Command word):

```
// PLC-sida (DB)
Command_Word : WORD;   // Bits för olika kommandon
//  Bit 0 = Start
//  Bit 1 = Stop
//  Bit 2 = Reset
//  Bit 3 = Manual mode
```

HMI skriver till Command_Word med **SetBit/ResetBit** funktioner.

## Dataöverföring: PLC → HMI

### Visa processdata

```
[PLC Tag/DB] ──(Cyklisk läsning)──> [HMI Display Field]
```

**Exempel:**
1. Lägg till **I/O Field** med mode **Output**
2. Koppla till PLC-tagg: `Sensors.Temperature_Actual`
3. Formatering: Decimal, enhet °C

### Statusindikering

```
[PLC Bool-tagg] ──(Trigger)──> [HMI Symbol/Färgändring]
```

**Konfiguration:**
1. Lägg till **Circle** eller **Rectangle**
2. **Animations** → **Appearance**
3. Tagg: `Motor.Running`
4. **TRUE** = Grön, **FALSE** = Grå

### Alarm och händelser

PLC skickar larm via **HMI Alarms**:

1. HMI → **Alarms** → **Discrete alarms**
2. Lägg till larm → Koppla till PLC-tagg
3. Tagg TRUE = Larm aktivt

## Optimera kommunikationen

### 1. Använd acquisition cycle

Sätt olika uppdateringshastigheter för olika taggar:

| Typ av data | Acquisition cycle |
|-------------|-------------------|
| Kritiska larm | 100 ms |
| Processtatus | 250 ms |
| Trender | 1000 ms |
| Statiska värden | On demand |

**Konfiguration:**
- Tagg → **Properties** → **Acquisition cycle**

### 2. Gruppera taggar i DB

```
// Bra: En sammanhängande DB
"HMI_Interface" [DB10]
├── Setpoints (STRUCT)
├── Actuals (STRUCT)
├── Status (STRUCT)
└── Commands (STRUCT)

// Dåligt: Spridda taggar överallt
```

Sammanhängande minne = effektivare läsning!

### 3. Undvik onödig polling

- Använd **Events** istället för cyklisk polling för knappar
- Sätt **On change** för värden som sällan ändras
- Minimera antal synliga taggar per skärm

## Felsökning

### Anslutningsproblem

| Symptom | Möjlig orsak | Lösning |
|---------|--------------|---------|
| "Connection interrupted" | Nätverksfel | Kontrollera kabel, ping PLC |
| Taggar visar "###" | Fel taggkoppling | Verifiera taggnamn och typ |
| Långsam uppdatering | För kort cycle time | Öka acquisition cycle |
| HMI fryser | CPU-överbelastning | Minska antal taggar/skärm |

### Diagnostikverktyg

1. **HMI Runtime** → **System diagnostics**
   - Visar anslutningsstatus
   - Kommunikationsstatistik

2. **TIA Portal Online**
   - Gå online med HMI
   - **Diagnostics** → Se aktiva fel

3. **Ping-test**
   - Från PC: `ping 192.168.0.10` (HMI IP)
   - Från HMI: **Control Panel** → **Network** → Test

### Logga kommunikation

För avancerad felsökning:
1. HMI → **Runtime settings** → **Logging**
2. Aktivera **Communication log**
3. Analysera loggfil för timeout/fel

## Resurser

- [Siemens: HMI-PLC Communication (sökresultat)](https://support.industry.siemens.com/cs/products?search=hmi%20plc%20communication%20tia%20portal)
- [Siemens: WinCC Comfort/Advanced konfiguration](https://support.industry.siemens.com/cs/products?search=wincc%20connection%20configuration)

---
**Relaterat:**
- [HMI-kommunikation (fördjupning)](./hmi-kommunikation.md)
- [Koppling PLC↔HMI (taggar)](../05-taggar/koppling-plc-hmi.md)
- [Skärmbilder och layout](../07-hmi-design/skarmbilder.md)
