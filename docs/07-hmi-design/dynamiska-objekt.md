# Dynamiska objekt och animationer

**Animationer** gör HMI-skärmar levande och informativa genom att visuellt representera processförändringar i realtid. I WinCC kan du animera färg, storlek, position, synlighet och mycket mer baserat på PLC-värden.

## Översikt: Animations

Varje objekt i WinCC kan ha **animationer** kopplade till egenskaper (properties).

### Animerbara egenskaper

| Egenskap | Vad animeras | Exempel |
|----------|--------------|---------|
| **Visibility** | Visa/dölj objekt | Visa larm endast när aktivt |
| **Background color** | Bakgrundsfärg | Grön=OK, Röd=Fel |
| **Position** | X/Y-koordinater | Flytta ventil-ikon |
| **Size** | Bredd/höjd | Växa tank när fylls |
| **Rotation** | Rotation (grader) | Roterande motor-ikon |
| **Flashing** | Blinka | Blinkandelarm |
| **Text** | Dynamisk text | "Running" / "Stopped" |

## Färganimationer

### Background Color Animation

Den vanligaste animationen - ändra färg baserat på taggvärde.

**Exempel: Motor-status (grön/grå)**

1. Skapa en **Circle** (motor-indikator)
2. **Properties** → **Animations**
3. Klicka **[+]** vid **Appearance**
4. Välj **Background color**
5. **Tag:** `Motor_Running` (BOOL)
6. **Konfiguration:**
   ```
   Type: Binary (2 states)
   0 (FALSE): Grå (#808080)
   1 (TRUE): Grön (#00FF00)
   ```

### Multi-state färganimation

För värden med fler än 2 tillstånd (ex: INT).

**Exempel: Process-status**

```
Tag: Process_State (INT)
0: Grå - Stopped
1: Gul - Starting
2: Grön - Running
3: Orange - Paused
4: Röd - Fault
```

**Konfiguration:**
1. **Animations** → **Background color**
2. **Tag:** `Process_State`
3. **Type:** Range (multiple values)
4. **Ranges:**
   ```
   0-0: #808080 (Grå)
   1-1: #FFFF00 (Gul)
   2-2: #00FF00 (Grön)
   3-3: #FFA500 (Orange)
   4-10: #FF0000 (Röd)
   ```

### Gradient färganimation

För analoga värden (temperatur, tryck).

**Exempel: Temperatur-indikator (gradient)**

```
Tag: Temperature (REAL, 0-100°C)

0°C: Blå (#0000FF)
50°C: Grön (#00FF00)
100°C: Röd (#FF0000)
```

**Konfiguration:**
1. **Type:** Linear (gradient)
2. **Min value:** 0, **Color:** Blå
3. **Mid value:** 50, **Color:** Grön
4. **Max value:** 100, **Color:** Röd

## Visibility Animation (Visa/Dölj)

### Visa objekt när villkor uppfyllt

**Exempel: Visa larmtext endast när larm aktivt**

1. Skapa **Text** med "⚠️ ALARM ACTIVE"
2. **Animations** → **Visibility**
3. **Tag:** `Alarm_Active` (BOOL)
4. **Konfiguration:**
   ```
   Type: Binary
   0 (FALSE): Hidden (osynlig)
   1 (TRUE): Visible (synlig)
   ```

### Växla mellan två objekt

**Exempel: Visa "START" eller "STOP" beroende på motor-status**

**Metod 1: Två objekt**
- **Text "START":** Synlig när `Motor_Running = FALSE`
- **Text "RUNNING":** Synlig när `Motor_Running = TRUE`

**Metod 2: Dynamisk text (bättre)**
- En text med **text list animation** (se nedan)

## Text Animation

### Text List (Textlista)

Visa olika texter baserat på värde.

**Exempel: Motor-status**

1. Skapa **Text field**
2. **Animations** → **Text**
3. **Tag:** `Motor_State` (INT)
4. **Type:** Text list
5. **Text list:**
   ```
   0: "Stopped"
   1: "Starting..."
   2: "Running"
   3: "Stopping..."
   4: "Fault"
   ```

### Dynamisk text med värde

**Exempel: Visa hastighet i text**

```
Text: "Motor speed: [Motor_Speed] rpm"
```

**Konfiguration:**
1. Text field
2. **Text:** "Motor speed: "
3. Lägg till **I/O field** bredvid med tagg `Motor_Speed`

## Position Animation

### Flytta objekt baserat på värde

**Exempel: Ventil öppnas (rör sig från vänster till höger)**

1. Skapa **Rectangle** (ventil-symbolisering)
2. **Animations** → **Position**
3. **Tag:** `Valve_Position` (INT, 0-100%)
4. **Konfiguration:**
   ```
   Type: Linear
   Tag value 0: X = 100 px
   Tag value 100: X = 300 px
   ```

**Resultat:** När `Valve_Position` = 50, är ventilen på X=200 px (mitten).

### Tank-nivå (vertikal position)

**Exempel: Vätska i tank**

1. Skapa **Rectangle** (blå, representerar vätska)
2. Placera i botten av tank-ikon
3. **Animations** → **Size** → **Height**
4. **Tag:** `Tank_Level` (REAL, 0-100%)
5. **Konfiguration:**
   ```
   Type: Linear
   0: Height = 0 px
   100: Height = 200 px
   ```

## Rotation Animation

### Roterande motor/pump

**Exempel: Motor roterar när igång**

1. Skapa **Circle** med pil (motor-ikon)
2. **Animations** → **Rotation**
3. **Tag:** `Motor_Running` (BOOL)
4. **Konfiguration:**
   ```
   Type: Continuous rotation
   Speed: 360° per sekund (1 varv/s)
   Direction: Clockwise
   Condition: Motor_Running = TRUE
   ```

### Rotation baserat på hastighet

**Exempel: Snabbare rotation vid högre hastighet**

```
Tag: Motor_Speed (INT, 0-1500 rpm)

0 rpm: 0°/s (ingen rotation)
1500 rpm: 720°/s (2 varv/s)
```

**Konfiguration:**
1. **Type:** Speed-controlled
2. **Speed calculation:** `(Motor_Speed / 1500) * 720`

## Size Animation (Storlek)

### Växa/krympa objekt

**Exempel: Progressbar för produktion**

1. Skapa **Rectangle**
2. **Animations** → **Size** → **Width**
3. **Tag:** `Production_Progress` (INT, 0-100%)
4. **Konfiguration:**
   ```
   0: Width = 0 px
   100: Width = 400 px
   ```

### Pulsande varning

**Exempel: Larm-ikon växer/krymper**

```
Tag: Alarm_Active (BOOL)
Condition: TRUE → Pulse between 50-100% size
```

## Flashing (Blinkande)

### Enkel blinkning

**Exempel: Kritiskt larm blinkar rött**

1. Skapa **Circle** (röd bakgrund)
2. **Animations** → **Appearance** → **Flashing**
3. **Tag:** `Alarm_Critical` (BOOL)
4. **Konfiguration:**
   ```
   Flash frequency: 2 Hz (2 blinkningar/s)
   Flash when: Alarm_Critical = TRUE
   ```

### Blinkande text

**Exempel: "⚠️ EMERGENCY STOP" blinkar**

1. Text field
2. **Animations** → **Flashing**
3. **Flash colors:**
   - State 1: Röd text (#FF0000)
   - State 2: Svart text (#000000)
4. **Frequency:** 2 Hz

::: warning Använd blinkning sparsamt
För mycket blinkande kan distrahera och ge huvudvärk. Använd endast för **kritiska** larm.
:::

## Kombinerade animationer

### Exempel: Komplett motor-indikator

En cirkel som visar motor-status med flera animationer:

**Objekt:** Circle (60x60 px)

**Animationer:**
1. **Background color:**
   - `Motor_Running = FALSE`: Grå
   - `Motor_Running = TRUE`: Grön
   - `Motor_Fault = TRUE`: Röd

2. **Rotation:**
   - Roterar när `Motor_Running = TRUE`
   - Hastighet: 360°/s

3. **Flashing:**
   - Blinkar när `Motor_Fault = TRUE`
   - Frekvens: 2 Hz

**Resultat:**
- **Stopped:** Grå cirkel, stillastående
- **Running:** Grön cirkel, roterar
- **Fault:** Röd cirkel, roterar inte, blinkar

## Grafik och bilder

### Importera bilder

**Använd bilder för:**
- Process-scheman (P&ID)
- Produkt-foton
- Företagslogotyper
- Ikoner

**Importera bild:**
1. **Task cards** → **Graphics**
2. **Import** → Välj bild (PNG, JPG, SVG)
3. Dra bild till skärm

### Vector Graphics (SVG)

**Fördelar:**
- Skalar utan kvalitetsförlust
- Kan animeras (färg, storlek)
- Mindre filstorlek

**Använd SVG för:**
- Motorer, pumpar, ventiler
- Process-scheman
- Ikoner

### Animera bilder

**Exempel: Ventil öppen/stängd (två bilder)**

1. Importera två bilder: `valve_open.png`, `valve_closed.png`
2. Placera båda på samma position
3. **Visibility animation:**
   - `valve_open.png`: Synlig när `Valve_Open = TRUE`
   - `valve_closed.png`: Synlig när `Valve_Open = FALSE`

## Faceplate (Återanvändbara komponenter)

### Vad är Faceplate?

**Faceplate** är en återanvändbar HMI-komponent (template) med egna animationer och parametrar.

**Exempel:** En "Motor_Faceplate" med:
- Motor-ikon (animerad)
- START/STOP-knappar
- Hastighets-indikator
- Larm-indikator

### Skapa Faceplate

1. **HMI** → **Faceplates** → **Add new faceplate**
2. Namn: `Motor_Control_FP`
3. Designa faceplate (knappar, animationer)
4. **Lägg till parametrar:**
   - `Motor_Start` (BOOL, In/Out)
   - `Motor_Running` (BOOL, In)
   - `Motor_Speed` (INT, In)

### Använda Faceplate

1. Dra `Motor_Control_FP` från **Faceplates** till skärm
2. **Instance properties:**
   - `Motor_Start` → `M01_Start`
   - `Motor_Running` → `M01_Running`
   - `Motor_Speed` → `M01_Speed`

**Fördel:** En faceplate → 10 motorer med samma utseende!

## Best practices

::: tip Animationsrekommendationer
1. **Subtilt, inte distraherande:** Använd mjuka övergångar
2. **Färgkonsistens:** Grön=OK, Röd=Fel, Gul=Varning överallt
3. **Prestanda:** Max 50-100 animerade objekt per skärm
4. **Blinkfrekvens:** 1-2 Hz för larm (inte snabbare)
5. **Smooth animations:** Använd "Linear" för mjuka rörelser
6. **Gruppera:** Använd Faceplates för återkommande element
7. **Test på panel:** Animationer kan se olika ut på faktisk HMI jämfört med simulator
8. **CPU-belastning:** För många komplexa animationer kan göra HMI långsam
:::

## Praktiskt exempel: Tanksystem

### Process-beskrivning

**System:**
- Tank med nivåsensor (0-100%)
- Inloppsventil (öppen/stängd)
- Utloppsventil (öppen/stängd)
- Pump (igång/stopp)

### HMI-design

```
┌────────────────────────────────┐
│  Tank System                   │
├────────────────────────────────┤
│                                │
│      [Inlopp ↓]                │  ← Animerad pil (synlig när ventil öppen)
│         │                      │
│     ┌───────┐                  │
│     │▓▓▓▓▓▓▓│  75%             │  ← Tank med animerad nivå
│     │▓▓▓▓▓▓▓│                  │
│     │░░░░░░░│                  │
│     └───┬───┘                  │
│         │                      │
│      [Utlopp ↓]                │  ← Animerad pil
│         │                      │
│        🔵 Pump                 │  ← Roterande ikon när igång
│                                │
│  [Fyll Tank]  [Töm Tank]       │  ← Knappar
│                                │
└────────────────────────────────┘
```

### Animationer

| Objekt | Animation | Tagg | Konfiguration |
|--------|-----------|------|---------------|
| **Tank-nivå** | Rectangle height | `Tank_Level` (0-100%) | 0%=0px, 100%=200px |
| **Nivå-färg** | Background color | `Tank_Level` | 0-20: Röd, 20-80: Grön, 80-100: Gul |
| **Inlopps-pil** | Visibility | `Valve_Inlet_Open` | TRUE=Synlig |
| **Utlopps-pil** | Visibility | `Valve_Outlet_Open` | TRUE=Synlig |
| **Pump-ikon** | Rotation | `Pump_Running` | 360°/s när TRUE |
| **Pump-färg** | Background | `Pump_Running` | TRUE=Grön, FALSE=Grå |
| **Nivå-text** | Text | `Tank_Level` | "75 %" |

### PLC-taggar

```
Tank_Level : REAL := 0.0;           // 0-100%
Valve_Inlet_Open : BOOL := FALSE;
Valve_Outlet_Open : BOOL := FALSE;
Pump_Running : BOOL := FALSE;
```

## Resurser

- [Siemens: WinCC Animation dokumentation (sökresultat)](https://support.industry.siemens.com/cs/products?search=wincc%20animation)
- [Video: Creating Dynamic HMI Objects](https://www.youtube.com/watch?v=ZP8i3VoS1_w)
- [Video: Faceplates and Reusable Components](https://www.youtube.com/watch?v=x_dN8cPkYnM)
- [Video: Process Graphics in WinCC](https://www.youtube.com/watch?v=lKjM8mQ6rY8)

---
**Relaterat:**
- [Skärmbilder och layout](./skarmbilder.md)
- [Knappar och indikatorer](./knappar-indikatorer.md)
- [Koppling PLC↔HMI](../05-taggar/koppling-plc-hmi.md)
