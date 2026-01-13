# OB, FB, FC – skillnader

I TIA Portal organiseras PLC-program i olika typer av block: **Organization Blocks (OB)**, **Function Blocks (FB)** och **Functions (FC)**. Att förstå skillnaderna mellan dessa är avgörande för att strukturera din kod korrekt och effektivt.

## Organization Blocks (OB)

### Vad är en OB?

Organization Blocks är **ingångspunkter** för PLC-programmet. De anropas automatiskt av operativsystemet vid specifika händelser.

### Vanliga OB-typer

#### OB1 - Main Cycle (Huvudcykel)
- **Funktion:** Exekveras cykliskt, om och om igen
- **Användning:** Huvudprogrammet - här anropas dina FB och FC
- **Cykeltid:** Typiskt 10-100 ms beroende på programstorlek
- **Obligatorisk:** Ja, varje projekt måste ha minst OB1

```plaintext
[Start] → [OB1] → [Exekvera kod] → [Uppdatera I/O] → [OB1] → ...
```

#### OB100 - Startup (Uppstart)
- **Funktion:** Körs EN GÅNG vid uppstart (Warm restart)
- **Användning:** Initiering av variabler, nollställning, startvärden
- **Exempel:** Sätt standardhastighet, nollställ räknare, ladda recept

#### OB35/OB38 - Cyclic Interrupts (Cykliska avbrott)
- **Funktion:** Körs med **exakt tidsintervall** (t.ex. 100 ms, 1 s)
- **Användning:** Tidskritisk styrning, PID-reglering, samplingmätning
- **Fördel:** Oberoende av OB1:s cykeltid

#### OB82 - Diagnostic Interrupt
- **Funktion:** Anropas vid diagnostiklarm (t.ex. modulfel)
- **Användning:** Felhantering, varningar, säkerhetsåtgärder

#### OB83 - Pull/Plug Interrupt
- **Funktion:** Anropas när modul tas bort eller sätts i (hot-plug)
- **Användning:** Hantera dynamiska hårdvaruändringar

### När ska du använda OB?

✅ **Använd OB:**
- När operativsystemet ska anropa koden automatiskt
- För specifika händelser (startup, errors, cyclic interrupts)
- Som ingångspunkt till ditt program (OB1)

❌ **Använd INTE OB:**
- För återanvändbar kod (använd FB/FC istället)
- För komplex logik (håll OB:er korta och tydliga)

## Function Blocks (FB)

### Vad är en FB?

Function Blocks är **återanvändbara kodblock med eget minne**. Varje FB har en associerad **Instance Data Block (DB)** som lagrar dess data mellan anrop.

### Egenskaper

✅ **Har eget minne** - Data behålls mellan anrop
✅ **Kan ha flera instanser** - Samma FB kan användas för flera objekt
✅ **Stöder komplexa datatyper** - Strukturer, arrayer, timers, counters

### Exempel: Motor-styrning

```scl
FUNCTION_BLOCK "FB_Motor"
{ S7_Optimized_Access := 'TRUE' }
VAR_INPUT
    Start : Bool;      // Startkommando
    Stop : Bool;       // Stoppkommando
    Speed : Int;       // Önskad hastighet (0-100%)
END_VAR

VAR_OUTPUT
    Running : Bool;    // Motor igång
    Fault : Bool;      // Fel
END_VAR

VAR
    RunTimer : TON;    // Timer för uppstartssekven
    RunTime : Time;    // Total körtid
END_VAR

BEGIN
    // Logik för motorstyrning
    IF Start AND NOT Fault THEN
        Running := TRUE;
    END_IF;
    
    IF Stop OR Fault THEN
        Running := FALSE;
    END_IF;
END_FUNCTION_BLOCK
```

### Instansiering i OB1

För att använda en FB måste du skapa en **instans** (Instance DB):

```scl
// I OB1:
"DB_Motor1"(Start := %I0.0,      // Knapp för start
            Stop := %I0.1,        // Knapp för stopp
            Speed := 75);         // 75% hastighet

// Resultat:
%Q0.0 := "DB_Motor1".Running;     // Styr motorutgång
```

### Flera instanser av samma FB

```scl
// Motor 1
"DB_Motor1"(Start := %I0.0, Stop := %I0.1);
%Q0.0 := "DB_Motor1".Running;

// Motor 2 (samma FB, egen data!)
"DB_Motor2"(Start := %I0.2, Stop := %I0.3);
%Q0.1 := "DB_Motor2".Running;
```

### När ska du använda FB?

✅ **Använd FB:**
- När du behöver lagra data mellan anrop (timers, counters, tillstånd)
- För objektorienterad programmering (motor, ventil, pump)
- När samma logik behövs på flera ställen (flera motorer, pumpar, etc.)
- För komplex logik med tillståndsmaskiner

## Functions (FC)

### Vad är en FC?

Functions är **återanvändbara kodblock UTAN eget minne**. De fungerar som rena matematiska funktioner - samma ingångar ger alltid samma utgångar.

### Egenskaper

✅ **Inget eget minne** - Endast temporära variabler under exekvering
✅ **Snabbare** - Ingen overhead för instance DB
✅ **Enklare** - Ingen instansiering krävs
❌ **Kan inte lagra data** - Måste använda globala variabler eller DB

### Exempel: Beräkningsfunktion

```scl
FUNCTION "FC_ScaleValue" : Real
{ S7_Optimized_Access := 'TRUE' }
VAR_INPUT
    RawValue : Int;      // Råvärde (0-27648)
    MinScale : Real;     // Min värde (t.ex. 0.0)
    MaxScale : Real;     // Max värde (t.ex. 100.0)
END_VAR

VAR_TEMP
    Result : Real;
END_VAR

BEGIN
    // Skalning 0-27648 till MinScale-MaxScale
    Result := MinScale + (RawValue / 27648.0) * (MaxScale - MinScale);
    "FC_ScaleValue" := Result;  // Returvärde
END_FUNCTION
```

### Anrop av FC

```scl
// I OB1:
#Temperature := "FC_ScaleValue"(
    RawValue := %IW64,      // Analog ingång
    MinScale := 0.0,
    MaxScale := 100.0
);
```

### När ska du använda FC?

✅ **Använd FC:**
- För matematiska beräkningar (skalning, omvandling)
- För enkla logiska operationer (AND, OR med flera ingångar)
- När inget minne behövs mellan anrop
- För "utility functions" (hjälpfunktioner)

## Jämförelse: OB vs FB vs FC

| Egenskap | OB | FB | FC |
|----------|----|----|----|
| **Eget minne** | Nej | Ja (Instance DB) | Nej |
| **Anropas av** | Operativsystem | Användaren | Användaren |
| **Instansiering** | - | Krävs | Ej nödvändig |
| **Timers/Counters** | Nej* | Ja | Nej* |
| **Flera instanser** | Nej | Ja | Nej |
| **Användning** | Ingångspunkter | Objekt med tillstånd | Enkla funktioner |

*Kan använda globala timers/counters i DB

## Programstruktur: Best practices

### Typisk struktur

```plaintext
OB1 (Main Cycle)
  ├─ FB_Motor (Instans: DB_Motor1)
  ├─ FB_Motor (Instans: DB_Motor2)
  ├─ FB_Pump (Instans: DB_Pump1)
  └─ FC_ScaleValue (hjälpfunktion)

OB100 (Startup)
  └─ Initiering av variabler

OB35 (Cyclic 100ms)
  └─ FB_PID_Control (Instans: DB_PID1)
```

### Design-principer

✅ **Håll OB:er korta** - Anropa FB/FC istället för att skriva all logik i OB1
✅ **Använd FB för objekt** - Motor, ventil, pump, etc.
✅ **Använd FC för hjälpfunktioner** - Skalning, omvandling, matematik
✅ **Strukturera i bibliotek** - Gruppera liknande FB/FC

### Exempel: Motor-objekt med FC-hjälp

```scl
// OB1:

// Skala hastighetsvärde från HMI (0-100%) till omriktare (0-16384)
#SpeedScaled := "FC_ScaleValue"(
    RawValue := "HMI_Speed",
    MinScale := 0.0,
    MaxScale := 16384.0
);

// Styr motor med FB
"DB_Motor1"(
    Start := "HMI_Start",
    Stop := "HMI_Stop",
    Speed := INT_TO_INT(#SpeedScaled)
);

// Kopiera resultat till utgångar
%Q0.0 := "DB_Motor1".Running;
```

## Resurser och dokumentation

### Officiell dokumentation
- [S7-1200 Programming Guideline](https://support.industry.siemens.com/cs/ww/en/view/90885040) - Best practices
- [STEP 7 Help: Blocks](https://support.industry.siemens.com/cs/document/36932465) - Detaljerad blockdokumentation

### Video-tutorials
- YouTube: "TIA Portal OB FB FC explained"
- YouTube: "TIA Portal function blocks tutorial"
- YouTube: "S7-1200 program structure best practices"

::: tip Nästa steg
Lär dig mer om programmeringsspråken [LAD, FBD, SCL](./sprak-lad-fbd-scl.md) för att skriva kod i dessa block.
:::
