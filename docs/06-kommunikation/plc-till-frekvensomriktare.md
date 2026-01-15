# PLC till frekvensomriktare

Detta avsnitt beskriver hur du styr och övervakar frekvensomriktare (drives) från PLC:n, med fokus på **Profinet-kommunikation** och **telegram-baserad styrning**.

## Kommunikationsöversikt

```
[PLC S7-1200/1500]
       │
   Profinet
       │
       ▼
[SINAMICS G120/V20]
       │
       ▼
   [Motor]
```

**Dataflöde:**
- **PLC → Drive**: Styrord (start/stop), börvärde (hastighet)
- **Drive → PLC**: Statusord (ready, running, fault), ärvärde (aktuell hastighet)

## Profinet-telegram

### Vad är ett telegram?

Ett **telegram** är en standardiserad datastruktur för utbyte mellan PLC och frekvensomriktare. Siemens använder **PROFIdrive**-profilen.

### Standard-telegram

| Telegram | Data | Användning |
|----------|------|------------|
| **Telegram 1** | STW/ZSW + Speed | Enkel hastighetsstyrning |
| **Telegram 2** | + Position | Positionering |
| **Telegram 3** | + Encoder | Servo-applikationer |
| **Telegram 20** | Basic positioner | Grundläggande positionering |

::: tip Rekommendation
Använd **Telegram 1** för standardapplikationer med hastighetsstyrning.
:::

### Telegramstruktur (Telegram 1)

**Output (PLC → Drive):**
| Byte | Namn | Beskrivning |
|------|------|-------------|
| 0-1 | **STW1** | Styrord (Control word) |
| 2-3 | **NSOLL_A** | Börvärde hastighet (0-16384 = 0-100%) |

**Input (Drive → PLC):**
| Byte | Namn | Beskrivning |
|------|------|-------------|
| 0-1 | **ZSW1** | Statusord (Status word) |
| 2-3 | **NIST_A** | Ärvärde hastighet (0-16384 = 0-100%) |

## Styrord (STW1) - Detaljerad

Styrord (Control Word) styr driftläget för frekvensomriktaren.

### Bit-struktur

| Bit | Namn | Funktion |
|-----|------|----------|
| 0 | ON/OFF1 | 1 = Redo för drift |
| 1 | OFF2 | 1 = Ingen utrullning (0 = utrullning) |
| 2 | OFF3 | 1 = Ingen snabbstopp (0 = snabbstopp) |
| 3 | Enable | 1 = Pulsera möjlig |
| 4 | RFG enable | 1 = Börvärde aktivt |
| 5 | RFG start | 1 = Starta rampen |
| 6 | Enable setpoint | 1 = Börvärde gäller |
| 7 | Fault ack | 1 = Kvittera fel (flank) |
| 10 | Control by PLC | 1 = PLC styr (inte panel) |

### Typiska styrvärden

```
// Stopp (säkert läge)
STW1 := 16#0000;

// Redo för start (driver ej)
STW1 := 16#047E;  // Bit 1,2,3,4,5,6,10

// Kör (driver)
STW1 := 16#047F;  // + Bit 0

// Kvittera fel
STW1 := 16#04FE;  // + Bit 7 (puls)
```

### Startsekvens i kod

```
// Funktion: Motor_Start
// Denna sekvens följer PROFIdrive-standarden

CASE iStep OF
    0:  // Vänta på enable-signal
        IF bEnable THEN
            iStep := 10;
        END_IF;
        
    10: // Förbered start
        wSTW1 := 16#047E;  // Redo, OFF1=0
        IF (wZSW1 AND 16#0001) <> 0 THEN  // Ready to switch on
            iStep := 20;
        END_IF;
        
    20: // Start motor
        wSTW1 := 16#047F;  // ON + Enable
        IF (wZSW1 AND 16#0002) <> 0 THEN  // Running
            iStep := 30;
        END_IF;
        
    30: // Drift
        IF NOT bEnable THEN
            iStep := 40;
        END_IF;
        
    40: // Stopp
        wSTW1 := 16#047E;  // OFF1
        IF (wZSW1 AND 16#0040) <> 0 THEN  // Standstill
            iStep := 0;
        END_IF;
END_CASE;
```

## Statusord (ZSW1) - Detaljerad

Statusord (Status Word) visar driftsstatus från frekvensomriktaren.

### Bit-struktur

| Bit | Namn | Betydelse vid 1 |
|-----|------|-----------------|
| 0 | Ready to switch on | Redo för inkoppling |
| 1 | Ready to operate | Redo för drift |
| 2 | Operation enabled | Drift möjlig |
| 3 | Fault | Fel aktivt |
| 4 | OFF2 active | Utrullning ej aktiv |
| 5 | OFF3 active | Snabbstopp ej aktiv |
| 6 | Switch on inhibited | Inkoppling spärrad |
| 7 | Warning | Varning aktiv |
| 10 | Speed reached | Börvärde nått |
| 11 | Current limiting | Strömgräns aktiv |

### Utvärdera status i PLC

```
// Läs statusbitar
bReady     := (wZSW1 AND 16#0001) <> 0;
bRunning   := (wZSW1 AND 16#0004) <> 0;
bFault     := (wZSW1 AND 16#0008) <> 0;
bWarning   := (wZSW1 AND 16#0080) <> 0;
bAtSpeed   := (wZSW1 AND 16#0400) <> 0;
```

## Börvärde och skalning

### Hastighet 0-100%

PROFIdrive använder **normaliserad skalning**:
- `0` = 0%
- `16384` (0x4000) = 100% av referensfrekvens (p2000)

### Beräkna börvärde

```
// Önskad hastighet i Hz
rSetpointHz : REAL := 35.0;

// Referensfrekvens (parameter p2000)
rRefFrequency : REAL := 50.0;

// Beräkna telegram-värde
iNSOLL := REAL_TO_INT(
    (rSetpointHz / rRefFrequency) * 16384.0
);

// Resultat: 35 Hz = 11469 (70% av 50 Hz)
```

### Beräkna ärvärde

```
// Läst värde från telegram
iNIST : INT := 8192;  // 50% signal

// Omvandla till Hz
rActualHz := (INT_TO_REAL(iNIST) / 16384.0) * rRefFrequency;

// Resultat: 25.0 Hz
```

## Praktiskt exempel: Pumpreglering

### Datablock

```
DATA_BLOCK "Pump_Drive"
{ S7_Optimized_Access := 'FALSE' }   // Viktigt för telegram-åtkomst
VERSION : 0.1
STRUCT
    // Output till drive (Telegram 1)
    STW1 : WORD;           // Styrord
    NSOLL_A : INT;         // Börvärde (0-16384)
    
    // Input från drive (Telegram 1)
    ZSW1 : WORD;           // Statusord
    NIST_A : INT;          // Ärvärde (0-16384)
    
    // HMI/Kontroll
    Enable : BOOL;
    SpeedSetpoint_Pct : REAL;  // 0-100%
    SpeedActual_Pct : REAL;    // 0-100%
    Running : BOOL;
    Fault : BOOL;
END_STRUCT;
END_DATA_BLOCK
```

### Styrprogram (OB1)

```
// Skalning börvärde
"Pump_Drive".NSOLL_A := 
    REAL_TO_INT("Pump_Drive".SpeedSetpoint_Pct * 163.84);

// Styrning
IF "Pump_Drive".Enable THEN
    "Pump_Drive".STW1 := 16#047F;  // Kör
ELSE
    "Pump_Drive".STW1 := 16#047E;  // Stopp
END_IF;

// Läs status
"Pump_Drive".Running := 
    ("Pump_Drive".ZSW1 AND 16#0004) <> 0;
"Pump_Drive".Fault := 
    ("Pump_Drive".ZSW1 AND 16#0008) <> 0;

// Skalning ärvärde
"Pump_Drive".SpeedActual_Pct := 
    INT_TO_REAL("Pump_Drive".NIST_A) / 163.84;
```

## Felsökning

### Drive startar inte

| Problem | Kontrollera | Lösning |
|---------|-------------|---------|
| ZSW1.Bit6 = 1 | Switch on inhibited | Kör startsekvens korrekt |
| ZSW1.Bit3 = 1 | Fault | Kvittera fel med Bit 7 |
| Ingen data | Profinet offline | Kontrollera IO-system |

### Hastighet fel

- Kontrollera **p2000** (referensfrekvens) i driven
- Verifiera skalning (16384 = 100%)
- Kontrollera **p1082** (maxhastighet)

### Kommunikationsfel

1. Gå online i TIA Portal
2. **Diagnostics** → **Profinet IO**
3. Kontrollera **Data status** för driven

## Resurser

- [Siemens: PROFIdrive dokumentation](https://support.industry.siemens.com/cs/products?search=profidrive)
- [Siemens: SINAMICS Telegram reference](https://support.industry.siemens.com/cs/products?search=sinamics%20telegram)

---
**Relaterat:**
- [Frekvensomriktare-kommunikation (översikt)](./frekvensomriktare-komm.md)
- [Profinet-konfiguration](./profinet-konfiguration.md)
- [Start och stopp av drive](../08-frekvensomriktare/start-stop.md)
