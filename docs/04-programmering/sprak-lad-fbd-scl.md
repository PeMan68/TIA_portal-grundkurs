# Programmeringsspråk: LAD, FBD, SCL

TIA Portal stöder flera programmeringsspråk enligt IEC 61131-3-standarden. De tre vanligaste är **LAD (Ladder Diagram)**, **FBD (Function Block Diagram)** och **SCL (Structured Control Language)**. Varje språk har sina för- och nackdelar beroende på applikation och personlig preferens.

## LAD - Ladder Diagram (Stegdiagram)

### Vad är LAD?

LAD är ett **grafiskt språk** som liknar elektriska reläscheman. Det är det mest använda PLC-språket i industrin, särskilt i USA och Asien.

### Struktur

LAD-kod består av:
- **Power rails** (strömskenor) - Vänster och höger sida
- **Rungs** (stegar) - Horisontella rader med logik
- **Contacts** (kontakter) - Representerar villkor (NO/NC)
- **Coils** (spolar) - Representerar utgångar

### Grundläggande element

#### Normally Open (NO) kontakt
```
---| |---    # Stängs när variabel = TRUE
```

#### Normally Closed (NC) kontakt
```
---|/|---    # Stängs när variabel = FALSE
```

#### Output Coil
```
---( )---    # Sätter utgång
```

#### Set/Reset Coils
```
---(S)---    # Sätt (bibehålls)
---(R)---    # Nollställ
```

### Exempel: Enkel start/stopp-logik

```plaintext
Network 1: Start motor
---| Start_Button |------| NOT Stop_Button |------( Motor_Running )---

Network 2: Motor output
---| Motor_Running |------( Motor_Output )---
```

Oversatt till logik:
- Motor startar när Start_Button trycks OCH Stop_Button inte är tryckt
- Motor_Output aktiveras när Motor_Running = TRUE

### Exempel: Självhållning (latching)

```plaintext
Network 1: Motor med självhållning
          Start_Button        Motor_Running      Stop_Button
---| |-------------||--------------| / |--------( Motor_Running )---
         (1)            (2)                (3)
```

Logik:
1. Start_Button aktiverar Motor_Running
2. Motor_Running håller sig själv aktiv (självhållning)
3. Stop_Button bryter kretsen

### Fördelar med LAD

✅ **Intuitivt** - Liknar elektriska scheman
✅ **Visuellt** - Lätt att följa signalflödet
✅ **Branschstandard** - Mest använt i industrin
✅ **Enkel felsökning** - Signal-tracing online

### Nackdelar med LAD

❌ **Komplex matematik** - Svårt att skriva beräkningar
❌ **Strukturerad data** - Svårt med loopar och strukturer
❌ **Tar plats** - Mycket skrollning för stora program

## FBD - Function Block Diagram

### Vad är FBD?

FBD är ett **grafiskt språk** baserat på funktionsblock. Det liknar logikdiagram och används ofta för process- och regleringssystem.

### Struktur

FBD består av:
- **Funktionsblock** - Rutor som representerar funktioner
- **Ingångar** - Till vänster på blocket
- **Utgångar** - Till höger på blocket
- **Kopplingar** - Linjer som förbinder block

### Grundläggande funktionsblock

#### AND-block
```
  Input1  ┌─────┐
─────────┤ AND ├───── Output
  Input2  └─────┘
```

#### OR-block
```
  Input1  ┌────┐
─────────┤ OR ├───── Output
  Input2  └────┘
```

#### NOT-block (inverterare)
```
  Input   ┌─────┐
─────────┤ NOT ├───── Output
          └─────┘
```

### Exempel: Timer med AND-logik

```plaintext
Start_Button ┌─────┐     ┌──────────┐
────────────┤ AND ├─────┤ IN   TON ├─── Motor_Running
  Emergency  └─────┘     │  PT=5s  │
  (NOT)                  └──────────┘
```

Logik: Motor startar om Start_Button = TRUE OCH Emergency = FALSE, fördröjning 5 sekunder.

### Fördelar med FBD

✅ **Tydligt signalflöde** - Vänster till höger
✅ **Bra för matematik** - Enklare än LAD
✅ **Funktionsblock** - Inbyggda funktioner (timers, counters, PID)
✅ **Processindustri** - Vanligt i reglersystem

### Nackdelar med FBD

❌ **Mindre intuitivt** - Kräver mer träning än LAD
❌ **Komplex layout** - Kan bli rörigt vid stora program
❌ **Mindre använt** - Inte lika populärt som LAD/SCL

## SCL - Structured Control Language

### Vad är SCL?

SCL är ett **textbaserat språk** liknande Pascal/C. Det är kraftfullt för komplexa beräkningar, datahantering och strukturerad programmering.

### Struktur

SCL använder standard programmeringsstrukturer:
- **IF-THEN-ELSE** - Villkorssatser
- **CASE** - Switchsatser
- **FOR/WHILE** - Loopar
- **Funktionsanrop** - Likt andra programmeringsspråk

### Grundläggande syntax

#### Tilldelning
```scl
Motor_Output := Start_Button AND NOT Stop_Button;
```

#### IF-sats
```scl
IF Temperature > 80.0 THEN
    Alarm := TRUE;
    Cooling_Valve := TRUE;
ELSIF Temperature < 20.0 THEN
    Heater := TRUE;
ELSE
    Alarm := FALSE;
    Cooling_Valve := FALSE;
    Heater := FALSE;
END_IF;
```

#### CASE-sats
```scl
CASE Operating_Mode OF
    0:  // Manual mode
        Motor_Speed := Manual_Setpoint;
    1:  // Automatic mode
        Motor_Speed := Auto_Setpoint;
    2:  // Maintenance mode
        Motor_Speed := 0;
END_CASE;
```

#### FOR-loop
```scl
FOR i := 0 TO 9 DO
    Sensor_Average := Sensor_Average + Sensor_Array[i];
END_FOR;
Sensor_Average := Sensor_Average / 10.0;
```

### Exempel: Motorstyrning med logik

```scl
// Motor start-logik
IF Start_Button AND NOT Emergency_Stop THEN
    IF Temperature < Max_Temp AND NOT Fault THEN
        Motor_Enable := TRUE;
        Status_LED := TRUE;
    ELSE
        Motor_Enable := FALSE;
        Fault_LED := TRUE;
    END_IF;
END_IF;

// Stopp-logik
IF Stop_Button OR Emergency_Stop OR Fault THEN
    Motor_Enable := FALSE;
    Status_LED := FALSE;
END_IF;

// Hastighetsberäkning
IF Motor_Enable THEN
    Motor_Speed := (Speed_Setpoint * 16384.0) / 100.0;  // Skala 0-100% till 0-16384
ELSE
    Motor_Speed := 0;
END_IF;
```

### Fördelar med SCL

✅ **Kraftfullt** - Komplex logik och beräkningar
✅ **Kompakt** - Mindre kod än LAD/FBD
✅ **Strukturerat** - Loopar, funktioner, strukturer
✅ **Bekant** - Liknar C/Pascal för programmerare

### Nackdelar med SCL

❌ **Inlärningskurva** - Kräver programmeringskunskap
❌ **Felsökning** - Svårare än LAD att följa online
❌ **Mindre visuellt** - Inte lika intuitivt som grafiska språk

## Jämförelse: LAD vs FBD vs SCL

| Aspekt | LAD | FBD | SCL |
|--------|-----|-----|-----|
| **Typ** | Grafiskt | Grafiskt | Text |
| **Inlärningskurva** | Låg | Medel | Hög |
| **Matematik** | Svårt | Medel | Enkelt |
| **Loopar** | Nej | Begränsat | Ja |
| **Felsökning** | Utmärkt | Bra | Medel |
| **Kodlängd** | Lång | Medel | Kort |
| **Bransch** | Tillverkning | Process | Avancerade system |
| **Hastighet** | Samma | Samma | Samma |

## När ska du använda vilket språk?

### Använd LAD för:

✅ Enkel logik (start/stopp, interlocks)
✅ Relay-replacement (ersätta relästyrning)
✅ När elektrikerbakgrund finns i teamet
✅ Quick troubleshooting på plats

### Använd FBD för:

✅ Processstyrning och reglering
✅ Tidskritiska sekvenser
✅ När signalflöde är viktigt
✅ Visualisering av logikblock

### Använd SCL för:

✅ Komplexa beräkningar (trigonometri, statistik)
✅ Datahantering (arrayer, strukturer)
✅ Algoritmer (sortering, sökning)
✅ Code reuse och bibliotek
✅ När du har programmerarbakgrund

## Kombinera språk i samma projekt

TIA Portal tillåter att blanda språk:

```plaintext
OB1 (LAD)
  ├─ FB_Motor (LAD) - Enkel start/stopp
  ├─ FB_PID (FBD) - Reglerloop
  └─ FC_Calculate (SCL) - Avancerad matematik
```

### Best practice: Använd rätt verktyg för rätt jobb

✅ **OB1 i LAD** - Huvudprogram, enkel struktur
✅ **FB för maskinlogik i LAD** - Intuitivt
✅ **FC för matematik i SCL** - Effektivt
✅ **FB för PID/reglering i FBD** - Tydligt

## Praktiskt exempel: Alla tre språken

### Problem: Styr motor baserat på temperatur

**LAD-version (OB1):**
```plaintext
Network 1: Temperature check
---| Temp > 50.0 |------( Overheat_Alarm )---

Network 2: Motor control
---| Start_Btn |---| NOT Overheat_Alarm |---( Motor_Run )---
```

**FBD-version:**
```plaintext
Temp ┌──────┐     ┌─────┐
─────┤ >50  ├─────┤ NOT ├────┐   ┌─────┐
     └──────┘     └─────┘    ├───┤ AND ├─── Motor_Run
Start                        │   └─────┘
──────────────────────────────┘
```

**SCL-version:**
```scl
// Temperaturövervakning
IF Temperature > 50.0 THEN
    Overheat_Alarm := TRUE;
ELSE
    Overheat_Alarm := FALSE;
END_IF;

// Motorstyrning
Motor_Run := Start_Button AND NOT Overheat_Alarm;
```

Alla tre ger samma resultat - välj det du tycker är tydligast!

## Resurser och dokumentation

### Officiell dokumentation
- [S7-1200 Programming Languages](https://support.industry.siemens.com/cs/document/36932465) - Språkreferens
- [STEP 7 Programming Guideline](https://support.industry.siemens.com/cs/ww/en/view/90885040) - Best practices
- [Comparison List for Programming Languages](https://support.industry.siemens.com/cs/ww/en/view/86630375) - Jämförelse

### Video-tutorials
- YouTube: "TIA Portal LAD programming tutorial"
- YouTube: "TIA Portal FBD programming tutorial"
- YouTube: "TIA Portal SCL programming tutorial"
- YouTube: "When to use LAD vs FBD vs SCL"

::: tip Nästa steg
Nu när du förstår språken, lär dig skapa [Enkla logiska funktioner](./logiska-funktioner.md) i praktiken!
:::
