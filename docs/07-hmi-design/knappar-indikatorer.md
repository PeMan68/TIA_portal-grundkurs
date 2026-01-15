# Knappar och indikatorer

Knappar och indikatorer är **kärnan** i HMI-interaktionen - de låter operatörer styra processen och få omedelbar feedback. Detta avsnitt täcker hur du skapar och konfigurerar interaktiva element i WinCC.

## Knappar (Buttons)

### Lägga till knapp

1. **Öppna skärm** i WinCC-editorn
2. Från **Toolbox** (höger sida): Dra **Button** till skärmen
3. Dubbelklicka för att redigera text: "START"

### Knapp-typer

| Typ | Beteende | Användning |
|-----|----------|------------|
| **Momentary** | Aktiv när hålls nere | Start-knappar, jogg-funktioner |
| **Toggle** | On/Off varje klick | Lampkontakter, låsningar |
| **Two-state** | Följer tagg-värde | Visa motor-status (igång/stopp) |

### Konfigurera knapp-events

**Event-typer:**

#### 1. Click (Klick)
Enklaste eventet - kör funktion vid klick.

**Exempel: Start motor**
1. Markera knappen → **Properties** → **Events**
2. Klicka **[+]** vid **Click**
3. **Function:** SetBit
4. **Tag:** `Motor_Start`

**Resultat:** När knapp klickas, sätts `Motor_Start := TRUE`

#### 2. Press (Nedtryckning)
Aktiveras när knapp **trycks ner** (innan släppt).

**Användning:** Jogg-funktion, manuell matning.

```
Press: SetBit "Conveyor_Forward"
Release: ResetBit "Conveyor_Forward"
```

### Vanliga knapp-funktioner

| Funktion | Beskrivning | Exempel |
|----------|-------------|----------|
| **SetBit** | Sätt tagg till TRUE | Start motor |
| **ResetBit** | Sätt tagg till FALSE | Stopp motor |
| **InvertBit** | Växla TRUE/FALSE | Toggle lampa |
| **SetValue** | Skriv värde till tagg | Sätt hastighet |
| **IncrementValue** | Öka värde | Räknare++ |
| **DecrementValue** | Minska värde | Räknare-- |
| **ActivateScreen** | Byt skärm | Navigation |
| **ShowPopupScreen** | Öppna popup | Dialog |

### Exempel: START/STOP-knappar

**START-knapp:**
```
Text: "▶ START"
Event: Click
Function: SetBit
Tag: Motor_M01_Start
Background: Grön (#00FF00)
```

**STOP-knapp:**
```
Text: "⏹ STOP"
Event: Click
Function: ResetBit
Tag: Motor_M01_Start
Background: Röd (#FF0000)
```

::: warning Säkerhet
Använd alltid bekräftelse för:
- Nödstopp
- Reset av säkerhetsfunktioner
- Radering av data
- Batch-avbrott
:::

## Indikatorer

### Circle (Cirkel-indikator)

Enklaste indikatorn - visar on/off-status med färg.

**Användning:** Lampor, motor-status, ventilpositioner.

**Skapa cirkel-indikator:**
1. Toolbox → **Basic objects** → **Circle**
2. Rita cirkel (50x50 px)
3. **Properties** → **Animations**
4. Klicka **[+]** vid **Appearance**
5. **Type:** Visibility eller Background color
6. **Tag:** `Motor_Running`
7. **Range:**
   - TRUE: Grön (#00FF00)
   - FALSE: Grå (#808080)

### Text-indikatorer

Visa status med text istället för färg.

**Exempel:**
1. Lägg till **Text field**
2. **Properties** → **Text list**
3. Koppla till `Motor_Status` (INT)
4. **Text list:**
   - 0: "Stopped"
   - 1: "Starting"
   - 2: "Running"
   - 3: "Stopping"
   - 4: "Fault"

## I/O Fields (In-/utmatningsfält)

### Read-only field (visa värde)

Visa realtidsvärden från PLC.

**Exempel: Visa motorhastighet**
1. Toolbox → **I/O field**
2. Placera på skärmen
3. **Properties** → **General**
4. **Tag:** `Motor_Speed` (INT)
5. **Mode:** Input/Output (men HMI-tag är Read-only)
6. **Format:** "0000 rpm"

### Input field (skriv värde)

Låt operatör skriva värde.

**Exempel: Hastighetsinställning**
1. I/O field
2. **Tag:** `Motor_Speed_Setpoint`
3. **Mode:** Input/Output
4. **Keyboard:** Numeric (vid klick visas numeriskt tangentbord)
5. **Limits:** Min: 0, Max: 1500

::: tip Input-validering
Använd **Limits** för att förhindra ogiltiga värden. HMI varnar om värde utanför tillåtet område.
:::

### Format och enheter

**Format-strängar:**

| Format | Exempel-värde | Visning |
|--------|---------------|----------|
| `0000` | 125 | `0125` |
| `####` | 125 | `125` |
| `0.00` | 12.5 | `12.50` |
| `#.#` | 12.5 | `12.5` |

**Enheter:**
```
Format: "0.0 °C"    → 25.5 °C
Format: "#### rpm"  → 1450 rpm
Format: "#.## bar" → 5.75 bar
```

## Sliders (Skjutreglage)

För enkel justering av värden.

### Skapa slider

1. Toolbox → **Slider**
2. Placera på skärmen (horisontell eller vertikal)
3. **Properties:**
   - **Tag:** `Motor_Speed_Setpoint`
   - **Min value:** 0
   - **Max value:** 1500
   - **Orientation:** Horizontal

**Resultat:** Operatör drar slider → `Motor_Speed_Setpoint` uppdateras (0-1500).

## Gauges (Mätare)

Visuella mätare för analoga värden.

### Typer av gauges

| Typ | Stil | Användning |
|-----|------|------------|
| **Bar gauge** | Horisontell/vertikal balk | Tanknivå, tryck |
| **Circular gauge** | Cirkulär mätare (hastighetsmätare) | Hastighet, temperatur |

### Skapa bar gauge

1. Toolbox → **Gauges** → **Bar**
2. **Properties:**
   - **Tag:** `Tank_Level` (REAL)
   - **Min value:** 0.0
   - **Max value:** 100.0
   - **Orientation:** Vertical
3. **Appearance:**
   - **Color ranges:**
     - 0-20: Röd (låg nivå)
     - 20-80: Grön (normal)
     - 80-100: Gul (hög nivå)

## Lampor och blinkande indikatorer

### Enkel lampa

**Circle med animation:**
```
Circle (30x30 px)
Animation: Background color
  Tag: Alarm_Active
  TRUE: Röd (#FF0000)
  FALSE: Grå (#404040)
```

### Blinkande larm

För kritiska larm, använd blinkande animation.

**Metod 1: WinCC blink-funktion**
1. Circle → **Animations** → **Appearance**
2. **Blink:** Enable
3. **Blink frequency:** 2 Hz (2 blinkningar/sekund)
4. **Tag:** `Alarm_Critical`

## Best practices

::: tip Designrekommendationer

**Knappar:**
1. **Storlek:** Minst 50x50 px för touch-paneler (fingerstorlek)
2. **Avstånd:** 10 px mellan knappar för att undvika felklick
3. **Färgkodning:**
   - 🟢 Grön: START, OK, Aktivera
   - 🔴 Röd: STOP, Fel, Nöd
   - 🟡 Gul: Varning, Paus
   - 🔵 Blå: Information, Navigation
4. **Etiketter:** Tydliga, korta (max 10 tecken)
5. **Feedback:** Knapp ska ändra utseende vid klick

**Indikatorer:**
1. **Konsistens:** Samma färger överallt (grön = ok, röd = fel)
2. **Gruppering:** Placera relaterade indikatorer nära varandra
3. **Läsbarhet:** Stor text (min 12 pt) för värden
4. **Enheter:** Visa alltid enhet (rpm, °C, bar, %)
5. **Uppdateringsfrekvens:** 100 ms för realtid, 500 ms för långsamma värden
:::

## Exempel: Motorstyrningspanel

### Layout

```
┌──────────────────────────────────┐
│  Motor M01                       │
├──────────────────────────────────┤
│                                  │
│  🟢 Running     🔴 Fault        │  ← Cirkel-indikatorer
│                                  │
│  Speed:    [1450] rpm            │  ← I/O field (read-only)
│  Current:  [12.5] A              │
│  Temp:     [65] °C               │
│                                  │
│  [▶ START]      [⏹ STOP]        │  ← Knappar
│                                  │
│  Setpoint: [____] rpm            │  ← I/O field (input)
│  [===|=========] 0-1500          │  ← Slider
│                                  │
│  Speed: [████████░░] 60%         │  ← Bar gauge
│                                  │
└──────────────────────────────────┘
```

## Resurser

- [Siemens: HMI Controls and Indicators Guide (PDF)](https://support.industry.siemens.com/cs/document/109747812/hmi-controls-guide)
- [Video: Creating Buttons and Indicators](https://www.youtube.com/watch?v=dKl5Z6kJ9tU)
- [Video: I/O Fields and Data Entry](https://www.youtube.com/watch?v=Xy-8FcN4p9g)
- [Nästa: Dynamiska objekt →](./dynamiska-objekt.md)

---
**Relaterat:**
- [Skärmbilder och layout](./skarmbilder.md)
- [Dynamiska objekt och animationer](./dynamiska-objekt.md)
- [Koppling PLC↔HMI](../05-taggar/koppling-plc-hmi.md)
