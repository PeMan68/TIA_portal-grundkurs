# Datatyper och DB

TIA Portal erbjuder ett omfattande system av **datatyper** för att lagra och bearbeta data effektivt. Att förstå rätt datatyp för varje situation är avgörande för minnesoptimering och korrekt programfunktion.

## Grundläggande datatyper

### Booleska typer

| Datatyp | Storlek | Värdeområde | Användning |
|---------|---------|-------------|------------|
| **BOOL** | 1 bit | TRUE / FALSE (1/0) | Digitala in/utgångar, flaggor |
| **BYTE** | 8 bitar | 16#00 till 16#FF | Bitmönster, statusord |
| **WORD** | 16 bitar | 16#0000 till 16#FFFF | Bitmönster, statusregister |
| **DWORD** | 32 bitar | 16#0000_0000 till 16#FFFF_FFFF | Stora bitmönster |

**Exempel:**
```scl
// BOOL för diskret styrning
VAR
    Motor_Running : BOOL;
    Valve_Open : BOOL;
END_VAR

// BYTE för statusbyte från frekvensomriktare
VAR
    Drive_Status : BYTE;  // Bit 0=Ready, Bit 1=Running, etc.
END_VAR
```

### Numeriska typer - Heltal

| Datatyp | Storlek | Värdeområde | Användning |
|---------|---------|-------------|------------|
| **INT** | 16 bit | -32,768 till 32,767 | Standardräknare, temperaturer |
| **DINT** | 32 bit | -2,147,483,648 till 2,147,483,647 | Stora värden, millisekunder |
| **USINT** | 8 bit | 0 till 255 | Små positiva tal |
| **UINT** | 16 bit | 0 till 65,535 | Hastigheter, frekvenser |
| **UDINT** | 32 bit | 0 till 4,294,967,295 | Stora positiva tal |

**Exempel:**
```scl
VAR
    Temperature : INT := 250;        // 25.0°C (skalat x10)
    ProductionCounter : DINT := 0;   // Räknar alla producerade enheter
    DriveSpeed : UINT := 1500;       // Varvtal (rpm)
END_VAR
```

::: tip Minnesoptimering
Använd **INT** som standard för heltal. Använd endast DINT när värden >32,767 behövs, och USINT/UINT för att spara minne i stora arrayer.
:::

### Numeriska typer - Flyttal

| Datatyp | Storlek | Noggrannhet | Användning |
|---------|---------|-------------|------------|
| **REAL** | 32 bit | ~7 decimaler | Analog mätning, PID-reglering |
| **LREAL** | 64 bit | ~15 decimaler | Avancerade beräkningar |

**Exempel:**
```scl
VAR
    FlowRate : REAL := 45.7;         // m³/h
    PressureSetpoint : REAL := 5.5;  // bar
    PreciseCalc : LREAL;             // För vetenskapliga beräkningar
END_VAR

// Beräkning med REAL
FlowRate := (PressureSetpoint * 8.5) + 12.3;
```

::: warning Flyttalsvarning
REAL och LREAL är **inte exakta** - använd dem inte för monetära beräkningar eller exakta jämförelser. För exakta värden, använd INT med skalning (ex: cent istället för kronor).
:::

### Tidsdatatyper

| Datatyp | Storlek | Format | Användning |
|---------|---------|--------|------------|
| **TIME** | 32 bit | T#0ms till T#24d20h31m23s647ms | Tidsintervall, timers |
| **DATE** | 16 bit | D#1990-01-01 till D#2168-12-31 | Datum |
| **TIME_OF_DAY** (TOD) | 32 bit | TOD#00:00:00 till TOD#23:59:59.999 | Klockslag |
| **DATE_AND_TIME** (DT) | 64 bit | DT#1990-01-01-00:00:00 | Datum + tid |

**Exempel:**
```scl
VAR
    CycleTime : TIME := T#500ms;          // Timer-preset
    MaintenanceDate : DATE := D#2024-12-31;
    StartTime : TIME_OF_DAY := TOD#08:00:00;
    LastAlarm : DATE_AND_TIME;
END_VAR

// Användning i timer
#MyTimer(IN := TRUE, PT := CycleTime);
```

### Strängar (Strings)

| Datatyp | Max längd | Användning |
|---------|-----------|------------|
| **STRING** | 254 tecken | HMI-text, meddelanden |
| **WSTRING** | Unicode-stöd | Internationella tecken |
| **CHAR** | 1 tecken | Enskilt tecken |

**Exempel:**
```scl
VAR
    AlarmMessage : STRING := 'Motor övertemperatur';
    Operator : STRING[20] := 'Anna Svensson';  // Max 20 tecken
    StatusCode : CHAR := 'A';
END_VAR
```

## Sammansatta datatyper

### ARRAY (Fält)

Array låter dig lagra **flera värden** av samma typ under ett namn.

**Syntax:**
```scl
VAR
    Temperatures : ARRAY[1..10] OF INT;      // 10 temperaturer
    Outputs : ARRAY[0..15] OF BOOL;          // 16 digitala utgångar
    Matrix : ARRAY[1..3, 1..4] OF REAL;      // 2D-array (3x4)
END_VAR

// Användning
Temperatures[1] := 250;              // Första elementet
Temperatures[5] := Temperatures[1] + 10;

FOR i := 1 TO 10 DO
    IF Temperatures[i] > 800 THEN
        AlarmActive := TRUE;
    END_IF;
END_FOR;
```

::: tip Array-indexering
TIA Portal använder **1-baserade** arrayer som standard (första elementet är [1], inte [0]). Du kan dock definiera valfri startindex.
:::

### STRUCT (Struktur)

Struct låter dig gruppera **olika datatyper** under ett namn.

**Exempel:**
```scl
TYPE "Motor_Data"
STRUCT
    Running : BOOL;
    Speed : INT;
    Current : REAL;
    Temperature : INT;
    AlarmCode : WORD;
END_STRUCT;
END_TYPE

VAR
    Motor1 : "Motor_Data";
    Motor2 : "Motor_Data";
END_VAR

// Användning
Motor1.Running := TRUE;
Motor1.Speed := 1450;
Motor1.Temperature := 650;  // 65.0°C

IF Motor1.Temperature > 800 THEN
    Motor1.Running := FALSE;
END_IF;
```

### UDT (User-Defined Type)

UDT är **återanvändbara strukturer** som du definierar en gång och använder på många ställen.

**Skapa UDT:**
1. Högerklicka **PLC data types** → **Add new data type**
2. Namn: `Motor_Type`
3. Definiera struktur (som STRUCT ovan)

**Fördelar:**
- ✅ Konsistens - samma struktur överallt
- ✅ Underhåll - ändra på ett ställe, uppdateras överallt
- ✅ Dokumentation - tydlig datastruktur

## Data Blocks (DB)

Data blocks är **minnesblock** för att lagra data permanent.

### Typer av DB

#### 1. Global DB
Delade data som alla block kan läsa/skriva.

**Skapa Global DB:**
1. Högerklicka **Program blocks** → **Add new block** → **Data block**
2. Namn: `System_Data`
3. Type: **Global DB**
4. Lägg till variabler:

```scl
DATA_BLOCK "System_Data"
{ S7_Optimized_Access := 'TRUE' }
NON_RETAIN
VAR
    ProductionCount : DINT := 0;
    ShiftNumber : INT := 1;
    OperatorName : STRING[30] := 'Not logged in';
    LastMaintenance : DATE_AND_TIME;
END_VAR
```

**Användning:**
```scl
// Läsa från Global DB
#CurrentCount := "System_Data".ProductionCount;

// Skriva till Global DB
"System_Data".ProductionCount := #CurrentCount + 1;
"System_Data".OperatorName := 'Anna Svensson';
```

#### 2. Instance DB
Automatiskt skapad för varje **FB-instans** - lagrar Static-variabler.

```scl
// När du skapar FB-instans
"Motor1_DB"(
    Enable := TRUE,
    Speed := 1500
);

// Instance DB "Motor1_DB" innehåller alla Static-variabler från FB
```

::: tip Optimized vs Standard Access
- **Optimized:** Modern standard, snabbare, TIA Portal hanterar adresser automatiskt
- **Standard:** Äldre, manuell adressering, använd endast för kompatibilitet
:::

### RETAIN variabler

RETAIN betyder att värdet **sparas** även efter strömavbrott.

```scl
DATA_BLOCK "Production_Data"
NON_RETAIN
VAR
    TotalCount : DINT := 0;           // NON_RETAIN (raderas vid omstart)
END_VAR
VAR RETAIN
    LifetimeCount : DINT := 0;        // RETAIN (sparas vid omstart)
    LastStopTime : DATE_AND_TIME;     // RETAIN
END_VAR
```

::: warning RETAIN-begränsningar
S7-1200 har begränsat RETAIN-minne (~10 KB). Använd endast för kritiska värden som måste överleva strömavbrott.
:::

## Datakonvertering

### Explicita konverteringar

```scl
VAR
    IntValue : INT := 100;
    RealValue : REAL;
    DintValue : DINT;
END_VAR

// INT → REAL
RealValue := INT_TO_REAL(IntValue);

// INT → DINT
DintValue := INT_TO_DINT(IntValue);

// REAL → INT (avrundar)
IntValue := REAL_TO_INT(RealValue);

// STRING → INT (parse)
IntValue := STRING_TO_INT('1234');
```

### Vanliga konverteringsfunktioner

| Funktion | Beskrivning |
|----------|-------------|
| `INT_TO_REAL()` | INT → REAL |
| `REAL_TO_INT()` | REAL → INT (avrundar) |
| `DINT_TO_REAL()` | DINT → REAL |
| `INT_TO_DINT()` | INT → DINT |
| `WORD_TO_INT()` | WORD → INT (reinterpret) |
| `STRING_TO_INT()` | STRING → INT (parse) |

::: warning Överflöde
Konvertering från större till mindre typ (ex: DINT → INT) kan ge **överflöde** om värdet är för stort. Kontrollera alltid gränser!
:::

## Best practices

::: tip Rekommendationer
1. **Välj minsta lämpliga typ:** INT för räknare, BOOL för flaggor
2. **Använd UDT:** För återkommande strukturer (motorer, ventiler, etc.)
3. **Global DB för delade data:** Systemvariabler, produktionssiffror
4. **Instance DB för FB:** Automatisk, en per FB-instans
5. **RETAIN sparsamt:** Endast kritiska värden
6. **Kommentera datatyper:** Förklara enheter (°C, bar, rpm, etc.)
7. **Skalning för REAL:** Använd INT x10 eller x100 för exakthet när möjligt
:::

## Praktiskt exempel: Temperaturreglering

```scl
// UDT för temperaturzon
TYPE "Temperature_Zone"
STRUCT
    SensorValue : INT;           // Råvärde från sensor (0-27648)
    ScaledTemp : REAL;           // Skalad temperatur (°C)
    Setpoint : REAL;             // Börvärde (°C)
    HeaterOutput : REAL;         // Värmeutgång (%)
    AlarmHigh : BOOL;
    AlarmLow : BOOL;
END_STRUCT;
END_TYPE

// Global DB med 4 zoner
DATA_BLOCK "Temperature_Data"
NON_RETAIN
VAR
    Zone : ARRAY[1..4] OF "Temperature_Zone";
    SystemEnable : BOOL := TRUE;
END_VAR

// Användning i program
"Temperature_Data".Zone[1].ScaledTemp := 
    INT_TO_REAL("Temperature_Data".Zone[1].SensorValue) * 0.01;

IF "Temperature_Data".Zone[1].ScaledTemp > 85.0 THEN
    "Temperature_Data".Zone[1].AlarmHigh := TRUE;
END_IF;
```

## Resurser

- [Siemens: Data Types Overview (PDF)](https://support.industry.siemens.com/cs/document/109742654/data-types-in-tia-portal)
- [Video: Working with Data Blocks](https://www.youtube.com/watch?v=Hk7X3dLPV1k)
- [Video: Arrays and Structures in SCL](https://www.youtube.com/watch?v=8FH4d7pJTQc)
- [Nästa: Koppling PLC↔HMI →](./koppling-plc-hmi.md)

---
**Relaterat:**
- [Globala vs lokala taggar](./globala-lokala.md)
- [Programmering i SCL](../04-programmering/sprak-lad-fbd-scl.md)
- [HMI-design och taggar](../07-hmi-design/skarmbilder.md)
