# Kommunikation med frekvensomriktare

Frekvensomriktare (drives) är en central komponent i många automationssystem. I TIA Portal kommunicerar du med frekvensomriktare via **Profinet** eller **Profibus**, och styr hastighet, start/stopp och läser statusdata.

## Vanliga frekvensomriktare från Siemens

| Serie | Effekt | Kommunikation | Användning |
|-------|--------|---------------|------------|
| **Sinamics G120** | 0.37 - 250 kW | Profinet, Profibus | Standard industriapplikationer |
| **Sinamics G120C** | 0.55 - 18.5 kW | Profinet, Profibus | Kompakt version |
| **Sinamics V20** | 0.12 - 30 kW | USS, Modbus RTU | Enkel styrning utan Profinet |
| **Sinamics S120** | 0.55 kW - MW | Profinet (hög prestanda) | Motion control, synkronisering |

::: tip Val av drive
För TIA Portal-integration, välj **G120** eller **G120C** med **Profinet-modul** (CU250S-2 PN). Detta ger full integration och enkel konfiguration.
:::

## Profinet-kommunikation med G120

### Förberedelser

#### 1. Installera GSDML-fil

GSDML (Generic Station Description Markup Language) är en XML-fil som beskriver drivet för TIA Portal.

**Ladda ner:**
1. Gå till [Siemens Support Portal](https://support.industry.siemens.com)
2. Sök efter "G120 GSDML"
3. Ladda ner senaste versionen (ex: `GSDML-V2.4-Siemens-SINAMICS_G-20231215.xml`)

**Installera i TIA Portal:**
1. **Options** → **Install GSD file**
2. Bläddra till nedladdad XML
3. Installera → G120 visas nu i Hardware catalog

#### 2. Fysisk anslutning

```
[PLC Profinet-port] ────(Cat5e/Cat6)──── [G120 CU250S-2 PN port X150]
```

**Strömanslutning:**
- L1, L2, L3 (3-fas 400V)
- Motor U, V, W
- 24V DC för styrning (ström från PLC eller extern)

### Konfiguration i TIA Portal

#### Steg 1: Lägg till G120 i projektet

1. Öppna **Device view**
2. Från **Hardware catalog**, sök "G120"
3. Välj rätt modell och CU (ex: **G120 CU250S-2 PN**)
4. Dra till **Network view**

#### Steg 2: Konfigurera IP-adress

1. Markera G120 i Device view
2. **Properties** → **Profinet interface**
3. **IP address:** 192.168.0.20 (eller enligt din plan)
4. **Device name:** `drive-m01`

#### Steg 3: Anslut till PLC

1. I **Network view**, dra linje från PLC till G120
2. Profinet-anslutning skapas automatiskt

#### Steg 4: Välj Telegram

**Telegram** definierar vilka styrord och statusord som utbyts mellan PLC och drive.

**Vanliga telegram:**

| Telegram | Styrord | Statusord | Användning |
|----------|---------|-----------|------------|
| **1 (Standard)** | 2 ord | 2 ord | Start/stopp, hastighet |
| **2** | 2 ord | 2 ord | + ramp-tid |
| **3** | 4 ord | 4 ord | + mer status |
| **20 (SINAMICS)** | 6 ord | 6 ord | Full funktionalitet |

**Välj telegram:**
1. Markera G120 → **Properties**
2. **Configuration** → **Telegram:** Välj **Telegram 1** (standard)

::: tip Standard: Telegram 1
För enkel styrning (start/stopp + hastighet), använd **Telegram 1**. Det täcker 90% av användningsfallen.
:::

#### Steg 5: Tilldela I/O-adresser

När G120 är konfigurerad, skapar TIA Portal automatiskt I/O-adresser.

**Exempel (Telegram 1):**
```
Styrord (Control Word):     %QW100   (WORD till drive)
Hastighetsvärde (Setpoint): %QW102   (INT till drive)
Statusord (Status Word):    %IW100   (WORD från drive)
Faktisk hastighet:          %IW102   (INT från drive)
```

Du kan ändra adresser via: Högerklicka G120 → **Properties** → **I/O addresses**

## Styra frekvensomriktare från PLC

### Styrord (Control Word)

Styrord är ett **WORD (16 bitar)** som skickar kommandon till drivet.

**Viktigaste bitar (Telegram 1):**

| Bit | Namn | Funktion |
|-----|------|----------|
| **0** | ON/OFF1 | 1 = Tillåt körning, 0 = Stopp |
| **2** | Quick stop | 1 = Normal, 0 = Snabbstopp |
| **3** | Enable operation | 1 = Aktivera drift |
| **6** | Ramp function generator | 1 = Aktivera hastighetsramp |
| **7** | Fault acknowledge | 1 = Kvittera fel |
| **10** | Control via PLC | 1 = PLC-styrning, 0 = Lokal styrning |

**Standardvärde för körning:**
```
Binärt:  0000 0100 0100 0111 = 16#047E
```

### Hastighetsvärde (Speed Setpoint)

Hastighetsvärdet är ett **INT** som anger önskad hastighet.

**Skalning:**
- **0** = 0% hastighet
- **16384** (16#4000) = 100% hastighet (rated speed)
- **32767** = 200% (om överhastigheit tillåten)

**Exempel:**
```
1500 rpm motor, vill köra 50%:
Setpoint = 16384 * 0.50 = 8192
```

### PLC-program: Grundläggande styrning

```scl
// Variabler (PLC tags)
VAR
    Drive_Enable : BOOL;           // Från HMI eller knapp
    Drive_SpeedPercent : REAL;     // Hastighet i % (0-100)
    Drive_ControlWord : WORD;      // Till %QW100
    Drive_SpeedSetpoint : INT;     // Till %QW102
    Drive_StatusWord : WORD;       // Från %IW100
    Drive_ActualSpeed : INT;       // Från %IW102
    Drive_Running : BOOL;          // Status: Motor igång
    Drive_Fault : BOOL;            // Status: Fel aktivt
END_VAR

// Program (i OB1)
// ======================================
// Skapa styrord
// ======================================
IF Drive_Enable THEN
    // Starta motor: Sätt ON, Enable, Ramp
    Drive_ControlWord := 16#047F;  // 0000 0100 0111 1111
ELSE
    // Stoppa motor: Nollställ ON-bit
    Drive_ControlWord := 16#047E;  // 0000 0100 0111 1110
END_IF;

// ======================================
// Beräkna hastighetsvärde
// ======================================
// Skala % till INT (0-100% → 0-16384)
Drive_SpeedSetpoint := REAL_TO_INT(Drive_SpeedPercent * 163.84);

// ======================================
// Skriv till drive
// ======================================
%QW100 := Drive_ControlWord;
%QW102 := Drive_SpeedSetpoint;

// ======================================
// Läs status från drive
// ======================================
Drive_StatusWord := %IW100;
Drive_ActualSpeed := %IW102;

// Tolka statusord
Drive_Running := (Drive_StatusWord.%X2);      // Bit 2: Drive följer referens
Drive_Fault := (Drive_StatusWord.%X3);        // Bit 3: Fel aktivt
```

### HMI-integration

**På HMI:**
- **Button "Start":** Sätter `Drive_Enable := TRUE`
- **Button "Stop":** Sätter `Drive_Enable := FALSE`
- **Slider "Hastighet":** Skriver till `Drive_SpeedPercent` (0-100)
- **Gauge "Verklig hastighet":** Visar `Drive_ActualSpeed` (skalat till rpm)

## Statusord (Status Word)

Statusord är ett **WORD** från drivet som anger dess tillstånd.

**Viktigaste bitar:**

| Bit | Namn | Beskrivning |
|-----|------|-------------|
| **0** | Ready to switch on | Drive redo att aktiveras |
| **1** | Ready to operate | Drive redo att köra |
| **2** | Operation enabled | Drive kör |
| **3** | Fault | Fel aktivt |
| **6** | Switch on inhibited | Körning blockerad |
| **7** | Warning | Varning (ej kritiskt) |
| **13** | Motor rotating | Motor roterar |

**Exempel - tolka statusord:**
```scl
IF (Drive_StatusWord AND 16#0004) <> 0 THEN
    // Bit 2 är satt → Motor kör
    Drive_Running := TRUE;
END_IF;

IF (Drive_StatusWord AND 16#0008) <> 0 THEN
    // Bit 3 är satt → Fel aktivt
    Drive_Fault := TRUE;
    Drive_FaultCode := %IW104;  // Läs felkod (om telegram tillåter)
END_IF;
```

## Felhantering

### Vanliga felkoder

| Felkod | Beskrivning | Åtgärd |
|--------|-------------|--------|
| **F0001** | Överström | Kontrollera motor och last |
| **F0002** | Överspänning | Kontrollera nätspänning |
| **F0003** | Övertemperatur | Kontrollera kylning, minska last |
| **F0011** | Motor överbelastad | Minska last eller öka motor |
| **F7010** | Communication fault | Kontrollera Profinet-kabel |
| **F7011** | Telegram error | Verifiera telegram-typ i TIA Portal |

### Kvittera fel från PLC

```scl
// Kvittera fel genom att pulsa bit 7 i Control Word
IF Drive_Fault AND #AckButton THEN
    Drive_ControlWord.%X7 := TRUE;   // Sätt Fault Ack
    #AckTimer(IN := TRUE, PT := T#500ms);
    
    IF #AckTimer.Q THEN
        Drive_ControlWord.%X7 := FALSE;  // Återställ efter 500ms
        #AckTimer(IN := FALSE);
    END_IF;
END_IF;
```

## Avancerad styrning

### PID-reglering av hastighet

För applikationer som kräver exakt hastighetshållning (ex: matning, pump):

```scl
// PID-regler för hastighet
"PID_Speed"(
    Setpoint := #DesiredSpeed,       // Önskad hastighet (rpm)
    Input := #Drive_ActualSpeed,     // Verklig hastighet från drive
    Output => #PID_Output            // PID-utgång (0-16384)
);

// Skicka PID-utgång till drive
Drive_SpeedSetpoint := #PID_Output;
```

### Ramptid

Ramptid kontrollerar hur snabbt motorn accelererar/bromsar.

**Sätt i drive (via HMI eller Startdrive):**
- Parameter **p1120** (Ramp-up time): 5.0 s
- Parameter **p1121** (Ramp-down time): 10.0 s

**Eller från PLC via PROFIdrive:**
```scl
// Skriv ramp-tid (kräver Telegram 20+)
%QW104 := 5000;   // Ramp-up: 5.0 s (millisekunder)
%QW106 := 10000;  // Ramp-down: 10.0 s
```

### Multi-motor setup

För system med flera motorer:

**Metod 1: Separata drives**
```scl
// Motor 1
%QW100 := Drive1_ControlWord;
%QW102 := Drive1_SpeedSetpoint;

// Motor 2
%QW110 := Drive2_ControlWord;
%QW112 := Drive2_SpeedSetpoint;

// Motor 3
%QW120 := Drive3_ControlWord;
%QW122 := Drive3_SpeedSetpoint;
```

**Metod 2: Array-baserad**
```scl
TYPE "Drive_Type"
STRUCT
    ControlWord : WORD;
    SpeedSetpoint : INT;
    StatusWord : WORD;
    ActualSpeed : INT;
END_STRUCT;
END_TYPE

VAR
    Drives : ARRAY[1..3] OF "Drive_Type";
END_VAR

// Loop igenom drives
FOR i := 1 TO 3 DO
    // Skriv till drive
    MOVE_BLK_VARIANT(
        SRC := Drives[i].ControlWord,
        DEST := %QW(100 + (i-1)*10)
    );
END_FOR;
```

## Best practices

::: tip Rekommendationer
1. **Använd Telegram 1:** Räcker för de flesta applikationer
2. **IP-planering:** Dokumentera IP-adresser för alla drives
3. **Device names:** Ge drives beskrivande namn (`drive-m01`, `drive-pump-01`)
4. **Felhantering:** Implementera automatisk felkvittering med timer
5. **HMI-indikering:** Visa tydligt motor-status (igång, fel, varning)
6. **Ramptider:** Sätt lämpliga ramptider för att skydda mekanik
7. **Överströmsskydd:** Konfigurera korrekt motorström i drive-parametrar
8. **Test:** Testa alltid manuell körning innan PLC-styrning
9. **Dokumentation:** Dokumentera telegram-typ och I/O-adresser
10. **Firmware:** Håll drive-firmware uppdaterad
:::

## Felsökning

### Problem: Drive svarar inte

**Checklista:**
- ✅ Grön LED på X150 (Profinet-port)?
- ✅ Rätt IP-adress och device name?
- ✅ GSDML-fil installerad i TIA Portal?
- ✅ Telegram-typ korrekt konfigurerad?
- ✅ 24V DC till drive?

### Problem: Motor startar inte

**Checklista:**
- ✅ Control Word bit 0 (ON) satt?
- ✅ Control Word bit 3 (Enable operation) satt?
- ✅ Status Word visar "Ready to operate"?
- ✅ Ingen felindikering (bit 3 i Status Word)?
- ✅ Motorparametrar korrekta (p0304, p0305, p0307)?

### Problem: Felhastighet

**Checklista:**
- ✅ Skalning korrekt (0-16384 = 0-100%)?
- ✅ Parameter p2000 (referensfrekvens) satt korrekt?
- ✅ Maxhastighet (p1082) korrekt?

## Resurser

- [Siemens: G120 Operating Instructions (PDF)](https://support.industry.siemens.com/cs/document/36042711/sinamics-g120-operating-instructions)
- [Video: G120 Profinet Setup](https://www.youtube.com/watch?v=cN5NvZlGLYc)
- [Video: PLC to Drive Communication](https://www.youtube.com/watch?v=Vt4TFlA3Pv0)
- [Startdrive Configuration Tool](https://support.industry.siemens.com/cs/products?search=startdrive) (för avancerad drive-konfiguration)
- [Nästa: Test och simulering →](../09-test/plcsim.md)

---
**Relaterat:**
- [Profinet-kommunikation](./profinet.md)
- [Konfiguration av Profinet-enheter](../03-konfiguration/profinet-enheter.md)
- [Frekvensomriktare-parametrar](../08-frekvens/parametrar.md)
