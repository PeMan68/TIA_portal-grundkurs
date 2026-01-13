# Enkla logiska funktioner

Grunden i all PLC-programmering är logiska funktioner. Här lär du dig de mest grundläggande operationerna som används i nästan varje PLC-program: AND, OR, NOT, timers, counters och Set/Reset-logik.

## Grundläggande logiska operationer

### AND-operation

AND-operation ger TRUE endast när **alla** ingångar är TRUE.

**Sanningstabell:**
| A | B | A AND B |
|---|---|---------|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**LAD-exempel:**
```plaintext
---| Input_A |---| Input_B |---( Output )---
```

**SCL-exempel:**
```scl
Output := Input_A AND Input_B;
```

**Praktiskt exempel:** Motor startar endast om både startknapp är tryckt OCH inget larm är aktivt.

```scl
Motor_Start := Start_Button AND NOT Alarm;
```

### OR-operation

OR-operation ger TRUE när **minst en** ingång är TRUE.

**Sanningstabell:**
| A | B | A OR B |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

**LAD-exempel (parallellkoppling):**
```plaintext
      | Input_A |
------|         |------( Output )---
      | Input_B |
```

**SCL-exempel:**
```scl
Output := Input_A OR Input_B;
```

**Praktiskt exempel:** Larm aktiveras om ANTINGEN övertemperatur ELLER övertryck detekteras.

```scl
Alarm := (Temperature > Max_Temp) OR (Pressure > Max_Pressure);
```

### NOT-operation (invertering)

NOT-operation **inverterar** ett värde: TRUE blir FALSE, FALSE blir TRUE.

**Sanningstabell:**
| A | NOT A |
|---|-------|
| 0 | 1 |
| 1 | 0 |

**LAD-exempel (normalt stängd kontakt):**
```plaintext
---|/Emergency_Stop/|---( Motor_Enable )---
```

**SCL-exempel:**
```scl
Motor_Enable := NOT Emergency_Stop;
```

**Praktiskt exempel:** Motor kör så länge nödstoppknappen INTE är tryckt.

### XOR-operation (exklusiv OR)

XOR ger TRUE när ingångarna har **olika** värden.

**Sanningstabell:**
| A | B | A XOR B |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**SCL-exempel:**
```scl
Output := Input_A XOR Input_B;
```

**Praktiskt exempel:** Larm när endast EN av två sensorer detekterar produkt (felaktig detektion).

## Selvhållning (Latching)

Selvhållning gör att en utgång behåller sitt tillstånd tills den explicit nollställs.

### LAD med selvhållning

```plaintext
Network 1: Start/Stop med selvhållning
          Start_Button     Motor_Running      Stop_Button
---| |-------------||-----------| / |--------( Motor_Running )---
```

**Förklaring:**
1. Start_Button startar motorn (sätter Motor_Running = TRUE)
2. Motor_Running håller sig själv aktiv via parallellkoppling
3. Stop_Button bryter kretsen (nollställer Motor_Running)

### SCL med selvhållning

```scl
// Start-logik
IF Start_Button AND NOT Stop_Button THEN
    Motor_Running := TRUE;
END_IF;

// Stopp-logik
IF Stop_Button THEN
    Motor_Running := FALSE;
END_IF;
```

### Set/Reset-instruktioner

TIA Portal har dedikerade Set- och Reset-instruktioner:

**LAD:**
```plaintext
Network 1: Set motor
---| Start_Button |---(S Motor_Running)---

Network 2: Reset motor
---| Stop_Button |---(R Motor_Running)---
```

**SCL med SR flipflop:**
```scl
"SR_Motor"(
    S1 := Start_Button,
    R := Stop_Button
);
Motor_Running := "SR_Motor".Q1;
```

::: warning Prioritet
Om både Set och Reset är aktiva samtidigt, avgör ordningen i programmet vad som händer. Vanligtvis ges Reset högre prioritet (säkerhet).
:::

## Timers (Tidur)

Timers är avgörande för att skapa fördröjningar och tidssekvenser.

### TON - Timer On-Delay

TON aktiverar utgången efter en **fördröjning**.

**Beteende:**
- Input = TRUE → Timer börjar räkna
- Efter PT-tid → Output = TRUE
- Input = FALSE → Timer nollställs, Output = FALSE

**LAD-exempel:**
```plaintext
Network 1: Fördröjd start
           ┌──────────────┐
---| Start |----┤ TON          ├--- Motor_Delayed
           │ IN    Q  OUT  │
  T#5s     │ PT    ET      │
-----------┤               │
           └──────────────┘
```

**SCL-exempel:**
```scl
"Delay_Timer"(
    IN := Start_Button,
    PT := T#5S
);
Motor_Delayed := "Delay_Timer".Q;
```

**Praktiskt exempel:** Fördröjd motorstart för mjukstart.

### TOF - Timer Off-Delay

TOF håller utgången aktiv en stund efter att ingången släckts.

**Beteende:**
- Input = TRUE → Output = TRUE omedelbart
- Input = FALSE → Timer börjar räkna
- Efter PT-tid → Output = FALSE

**SCL-exempel:**
```scl
"Off_Delay_Timer"(
    IN := Presence_Sensor,
    PT := T#30S
);
Light_Output := "Off_Delay_Timer".Q;
```

**Praktiskt exempel:** Belysning som stannar på 30 sekunder efter att någon lämnat rummet.

### TP - Timer Pulse

TP genererar en puls med fix längd.

**Beteende:**
- Positiv flank på Input → Output = TRUE i PT-tid
- Output = FALSE efter PT-tid
- Nya pulser under pågående puls ignoreras

**SCL-exempel:**
```scl
"Pulse_Timer"(
    IN := Trigger_Button,
    PT := T#2S
);
Valve_Pulse := "Pulse_Timer".Q;
```

**Praktiskt exempel:** Kortvarig öppning av ventil vid knapptryck.

### TONR - Timer On-Delay Retentive

TONR är en ackumulerande timer som behåller sin tid mellan avbrott.

**SCL-exempel:**
```scl
"Accumulating_Timer"(
    IN := Motor_Running,
    R := Reset_Timer,
    PT := T#100H
);
Maintenance_Due := "Accumulating_Timer".Q;
```

**Praktiskt exempel:** Totaltid för motoranvändning, för underhållsplanering.

## Counters (Räknare)

Counters används för att räkna händelser.

### CTU - Count Up

CTU räknar uppåt.

**LAD-exempel:**
```plaintext
Network 1: Räkna produkter
           ┌──────────────┐
---| Sensor |---┤ CTU          ├--- Batch_Complete
           │ CU    Q  OUT  │
---| Reset  |---┤ R     CV      ├--- Current_Count
           │ PV           │
  100      -----┤               │
           └──────────────┘
```

**SCL-exempel:**
```scl
"Product_Counter"(
    CU := Product_Sensor,  // Räkna vid positiv flank
    R := Reset_Counter,
    PV := 100
);
Batch_Complete := "Product_Counter".Q;
Current_Count := "Product_Counter".CV;
```

**Praktiskt exempel:** Räkna 100 produkter, sedan stoppa produktionen.

### CTD - Count Down

CTD räknar neråt.

**SCL-exempel:**
```scl
"Countdown_Counter"(
    CD := Dispense_Pulse,  // Räkna ner vid varje puls
    LOAD := Load_Counter,
    PV := 50
);
Empty := "Countdown_Counter".Q;  // TRUE när CV <= 0
```

**Praktiskt exempel:** Räkna ner antal kvarvarande enheter i magasin.

### CTUD - Count Up/Down

CTUD kombinerar upp- och nedräkning.

**SCL-exempel:**
```scl
"Updown_Counter"(
    CU := Entry_Sensor,    // Räkna upp när någon går in
    CD := Exit_Sensor,     // Räkna ner när någon går ut
    R := Reset_Counter,
    LOAD := FALSE,
    PV := 0
);
People_Inside := "Updown_Counter".CV;
Max_Reached := "Updown_Counter".QU;  // TRUE när CV >= PV
```

**Praktiskt exempel:** Räkna antal personer i ett rum.

## Flanktriggning (Edge Detection)

Flankdetektering används för att trigga en händelse vid signaländring.

### P_TRIG - Positive Edge (Stigande flank)

```scl
"Edge_Detect"(
    CLK := Button_Input
);
IF "Edge_Detect".Q THEN
    Counter := Counter + 1;  // Räkna endast vid knapptryck (inte när knapp hålls ned)
END_IF;
```

### N_TRIG - Negative Edge (Fallande flank)

```scl
"Falling_Edge"(
    CLK := Signal_Input
);
IF "Falling_Edge".Q THEN
    // Utför något vid signalens fallande flank
END_IF;
```

## Praktiskt exempel: Komplett motorstyrning

Kombinera flera logiska funktioner:

```scl
// Flanktriggning för start/stopp-knappar
"Start_Edge"(CLK := Start_Button);
"Stop_Edge"(CLK := Stop_Button);

// Selvhållning med prioritet för stopp
IF "Start_Edge".Q AND NOT Emergency_Stop THEN
    Motor_Enable := TRUE;
END_IF;

IF "Stop_Edge".Q OR Emergency_Stop THEN
    Motor_Enable := FALSE;
END_IF;

// Fördröjd start (mjukstart)
"Start_Delay"(
    IN := Motor_Enable,
    PT := T#2S
);

// Motor output
Motor_Output := "Start_Delay".Q AND NOT Overload_Alarm;

// Körtidsräknare (för underhåll)
"Runtime_Counter"(
    IN := Motor_Output,
    R := FALSE,
    PT := T#500H
);
Maintenance_Due := "Runtime_Counter".Q;
```

## Best practices

✅ **Använd beskrivande namn** - `Motor_Start` istället för `M0.0`
✅ **Dokumentera komplexa villkor** - Kommentarer i koden
✅ **Prioritera säkerhet** - Emergency Stop ska alltid ha högst prioritet
✅ **Testa flanktriggring** - Använd P_TRIG/N_TRIG för knappar
✅ **Timeout-skydd** - Använd timers för att detektera fastnade processer

## Resurser och dokumentation

### Officiell dokumentation
- [S7-1200 Instruction List](https://support.industry.siemens.com/cs/document/36932465) - Alla instruktioner
- [Programming Guideline](https://support.industry.siemens.com/cs/ww/en/view/90885040) - Best practices
- [Timers and Counters](https://support.industry.siemens.com/cs/document/109476369) - Timer/counter manual

### Video-tutorials
- YouTube: "TIA Portal timers tutorial"
- YouTube: "TIA Portal counters tutorial"
- YouTube: "TIA Portal logic functions LAD"
- YouTube: "TIA Portal edge detection"

::: tip Nästa steg
Nu när du behärskar logiska funktioner, lär dig arbeta med [Taggar och datatyper](../05-taggar/globala-lokala.md) för att organisera dina variabler effektivt!
:::
