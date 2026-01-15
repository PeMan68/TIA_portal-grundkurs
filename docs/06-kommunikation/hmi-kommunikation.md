# HMI-kommunikation med PLC

HMI (Human-Machine Interface) kommunicerar kontinuerligt med PLC:n för att visa processdata och ta emot operatörskommandon. Detta avsnitt fördjupar kommunikationsmekanismerna och optimering.

## Kommunikationstyper

### 1. Profinet (Standard)

Mest vanlig för moderna Siemens HMI-paneler.

**Egenskaper:**
- 📡 Ethernet-baserad (RJ45-kabel)
- ⚡ Snabb: 100 Mbit/s
- 🔄 Cyclic data exchange (kontinuerlig uppdatering)
- ✅ Hot-plug: HMI kan kopplas bort och återanslutas

**Konfiguration i TIA Portal:**
1. HMI → **Connections**
2. **Add new connection** → Välj PLC
3. Typ: **HMI connection**
4. Profinet-interface väljs automatiskt

### 2. Profibus DP

Äldre HMI-paneler och äldre PLC-system.

**Egenskaper:**
- 🔌 Seriell buss (RS-485)
- 🐢 Långsammare: 12 Mbit/s
- 📏 Max 100m (utan repeater)
- ⚠️ Legacy - använd endast för äldre system

### 3. Ethernet/IP (S7-communication)

För icke-Profinet HMI eller SCADA-system.

**Egenskaper:**
- 🌐 Standard TCP/IP
- ✅ Flexibel - kan kommunicera över WAN/Internet
- ⚠️ Kräver manuell konfiguration av S7-anslutning

## Datautbyte: Cyclic vs Acyclic

### Cyclic (Cyklisk)

Kontinuerlig, **automatisk** datautbyte mellan PLC och HMI.

**Använd för:**
- Realtidsvärden (hastighet, tryck, temperatur)
- Status-indikatorer (motor igång, larm aktiva)
- Knapptryckningar

**Exempel:**
```
HMI läser "Motor_Speed" varje 100 ms
PLC skriver nytt värde varje 100 ms
→ HMI visar uppdaterad hastighet 10 gånger per sekund
```

### Acyclic (Acyklisk)

**På begäran** - data överförs endast när HMI eller PLC begär det.

**Använd för:**
- Recept (endast vid laddning/sparning)
- Historiska loggar (läs vid behov)
- Parametrar som sällan ändras

**Fördel:** Minskar nätverksbelastning.

## Kommunikationsoptimering

### Update Cycle (Uppdateringscykel)

Hur ofta HMI läser taggar från PLC.

| Cykel | Användning | Nätverksbelastning |
|-------|------------|-------------------|
| **50 ms** | Snabba processer (motion control) | Hög |
| **100 ms** | Standard (realtidsvärden) | Medel ✅ |
| **500 ms** | Långsamma processer (temperatur) | Låg |
| **1000 ms+** | Loggar, trender | Mycket låg |

**Ställa in update cycle:**
1. HMI tags → Markera taggar
2. **Properties** → **Acquisition cycle**
3. Välj lämplig cykel (default: 100 ms)

::: tip Standard: 100 ms
För de flesta applikationer är **100 ms (10 Hz)** optimal balans mellan respons och nätverksbelastning.
:::

### Acquisition Mode

**Hur** taggar läses från PLC.

| Läge | Beskrivning | Användning |
|------|-------------|------------|
| **Cyclic continuous** | Läser oavsett skärm | Realtid, överallt |
| **Cyclic in operation** | Läser endast på aktiv skärm | Energibesparing |
| **On demand** | Läser endast vid begäran | Recept, sällan data |

**Exempel:**
```
Tag "Motor_Speed" → Cyclic continuous (visas på flera skärmar)
Tag "Recipe_Name" → On demand (läses vid receptladdning)
```

### Tag Grouping (Tagg-gruppering)

Gruppera taggar med **samma update cycle** för effektiv kommunikation.

**Exempel:**
```
Grupp 1 (50 ms):  Position_X, Position_Y, Velocity
Grupp 2 (100 ms): Motor_Speed, Pressure, Temperature
Grupp 3 (500 ms): Tank_Level, Production_Count
```

**Fördel:** PLC kan packa grupperade taggar i **ett** meddelande istället för många små.

## Connection Parameters

### Watchdog Timer

HMI och PLC övervakar anslutningen med **watchdog**.

- Om ingen data tas emot på X sekunder → **Connection fault**
- Standard: 10 sekunder

**Konfigurera:**
1. HMI → Connections → Din PLC-anslutning
2. **Properties** → **Advanced**
3. **Monitoring time:** 10000 ms (10 s)

::: warning Watchdog-timeout
Om HMI visar "Connection error" trots aktiv nätverkskabel, **öka monitoring time** till 20-30 sekunder. Långsamma nätverk kan ge false positives.
:::

### Data Consistency

För kritiska värden, använd **data consistency** för att garantera att alla bits läses samtidigt.

**Exempel:**
```
Motor_Status (WORD):
  Bit 0: Running
  Bit 1: Alarm
  Bit 2: Warning
  
Utan consistency: Kan läsa Running=1, Alarm=0 (mellanstadium)
Med consistency: Läser alla bits atomärt
```

**Aktivera:**
1. PLC tags → Markera tagg → **Properties**
2. **Access** → **Optimized block access: Consistent access**

## Kommunikationsfel och diagnostik

### Vanliga fel

#### 1. "Connection timeout"

**Symptom:** HMI visar "No connection to PLC"

**Orsaker:**
- Nätverkskabel lös eller skadad
- Fel IP-adress på HMI eller PLC
- Profinet-interface inaktiverat
- Brandvägg blockerar port 102 (S7-comm)

**Lösning:**
```
1. Kontrollera grön LED på Ethernet-port (HMI och PLC)
2. Ping PLC från HMI (System diagnostics)
3. Verifiera IP-adresser i TIA Portal
4. Testa med direktkoppling (utan switch)
```

#### 2. "Tag not found"

**Symptom:** HMI visar "#####" eller "Tag error"

**Orsaker:**
- Taggen borttagen från PLC men finns kvar i HMI
- Datatyp ändrad (ex: INT → REAL)
- Tagg inte inkluderad i HMI-anslutning

**Lösning:**
```
1. HMI tags → Update connection (synkronisera med PLC)
2. Kontrollera att taggen finns i PLC tags
3. Verifiera datatyp matchar
```

#### 3. Långsam uppdatering

**Symptom:** HMI-värden uppdateras med flera sekunders fördröjning

**Orsaker:**
- För många taggar med för snabb update cycle
- Nätverksbelastning (andra enheter på samma subnet)
- PLC överbelastad (>80% CPU-användning)

**Lösning:**
```
1. Öka update cycle för icke-kritiska taggar (100→500 ms)
2. Använd tag grouping
3. Separera Profinet-nätverk (dedikerad switch)
4. Optimera PLC-program
```

### Diagnostik-verktyg

#### HMI System Diagnostics

**Tillgång:**
1. På HMI-panelen: System → Diagnostics
2. Eller i Runtime: Settings → Diagnostics

**Information:**
- Connection status (online/offline)
- Network statistics (packet loss, latency)
- Tag update frequency
- Memory usage

#### TIA Portal Online Test

**Användning:**
1. Gå **Online** med HMI
2. **Online & Diagnostics** → **Online access**
3. Välj **Communication**
4. Se aktiva anslutningar och dataflöde

## Avancerade funktioner

### Recipe Management via kommunikation

Recept lagras i HMI och överförs till PLC vid behov.

**Workflow:**
1. Operatör väljer recept på HMI
2. HMI läser receptdata från intern DB
3. HMI skriver värden till PLC-taggar
4. PLC använder värdena för produktion

**Exempel:**
```
Recept "Produkt_A":
  Temperature_Setpoint: 75.0 °C
  Pressure_Setpoint: 5.5 bar
  MixTime: 120 s
  
HMI skriver till:
  "Process_Temperature_SP" := 75.0
  "Process_Pressure_SP" := 5.5
  "Process_MixTime" := 120
```

### Alarm System

HMI kan läsa och visa larm från PLC automatiskt.

**Setup:**
1. I PLC: Använd **Program alarms** eller **System diagnostics**
2. I HMI: **Alarms** → **Configure alarm classes**
3. Koppla till PLC-anslutning
4. HMI hanterar automatiskt:
   - Larmpresentation (lista, popup)
   - Kvittering
   - Historik

**Exempel PLC-larm:**
```scl
// I PLC-program
IF "Temperature" > 850 THEN
    // Trigga larm
    "Alarm_HighTemp".SIG := TRUE;
END_IF;
```

**HMI visar automatiskt:**
```
Alarm: "Övertemperatur i zon 1"
Time: 2024-01-15 14:32:15
Status: Active (blinkar)
→ Operatör kvitterar → Status: Acknowledged
```

### Data Logging

HMI kan logga PLC-data för historisk analys.

**Konfiguration:**
1. HMI → **Logs**
2. **Add new log** → Välj taggar att logga
3. **Storage:** Intern HMI-minne eller USB
4. **Trigger:** Cyclic (ex: varje 1 min) eller event-driven

**Exempel:**
```
Log "Production_Data":
  Interval: 60 s
  Tags: Production_Count, Temperature, Pressure
  Storage: USB stick (CSV-format)
```

**Resultat:** CSV-fil för analys i Excel/BI-verktyg.

## Best practices

::: tip Rekommendationer
1. **Profinet för nya system:** Snabbt och standardiserat
2. **Update cycle 100 ms:** Optimal för de flesta fall
3. **Tag grouping:** Gruppera taggar med samma uppdateringsbehov
4. **Watchdog 10-20 s:** Undvik false connection errors
5. **Consistent access:** För kritiska multi-bit-värden (WORD, DWORD)
6. **Minimize tag count:** Använd endast nödvändiga taggar i HMI
7. **Diagnostics always on:** Aktivera Profinet-diagnostik
8. **Network separation:** Dedikerad Profinet-nätverk för kritiska system
9. **Test connection:** Använd ping och System Diagnostics regelbundet
10. **Document:** Dokumentera IP-adresser, device names och update cycles
:::

## Prestandaexempel

### Bra setup (optimerad)

```
Network: Dedikerad Profinet (192.168.0.x)
PLC: S7-1200 (192.168.0.1)
HMI: KTP700 (192.168.0.10)

Tags:
  Grupp 1 (50 ms):  10 taggar (motion control)
  Grupp 2 (100 ms): 50 taggar (standard process)
  Grupp 3 (500 ms): 30 taggar (slow values)
  
Total nätverksbelastning: ~5% (margin för störningar)
Respons: <100 ms för knapptryckningar
Stabilitet: 99.9% uptime
```

### Dålig setup (ej optimerad)

```
Network: Delat kontorsnätverk (10.0.0.x)
PLC: S7-1200 (10.0.0.50)
HMI: KTP700 (10.0.0.75)

Tags:
  200 taggar alla med 50 ms update cycle
  
Total nätverksbelastning: 60-80% (överbelastat)
Respons: 500-2000 ms fördröjning
Stabilitet: Frekventa connection timeouts
```

## Resurser

- [Siemens: HMI Communication dokumentation (sökresultat)](https://support.industry.siemens.com/cs/products?search=hmi%20communication%20configuration)
- [Video: Optimizing HMI-PLC Communication](https://www.youtube.com/watch?v=FpZyD6F9PSQ)
- [Video: HMI Diagnostics and Troubleshooting](https://www.youtube.com/watch?v=xT8v4WlM3bU)
- [Nästa: Frekvensomriktare-kommunikation →](./frekvensomriktare-komm.md)

---
**Relaterat:**
- [Koppling PLC↔HMI](../05-taggar/koppling-plc-hmi.md)
- [Profinet-kommunikation](./profinet.md)
- [HMI-design](../07-hmi-design/skarmbilder.md)
