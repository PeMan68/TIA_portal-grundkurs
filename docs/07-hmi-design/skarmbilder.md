# Skärmbilder och HMI-layout

HMI-skärmar (screens) är operatörens fönster till automationssystemet. I TIA Portal skapar du intuitivé, funktionella skärmar med WinCC (Windows Control Center) - HMI-redigeraren.

## Översikt: WinCC i TIA Portal

**WinCC** är Siemens HMI-mjukvara, integrerad i TIA Portal för:
- 📺 **HMI-paneler** (KTP, TP, MP-serien)
- 💻 **PC-baserade HMI** (WinCC Runtime Advanced/Professional)
- 📱 **Web-baserade HMI** (WinCC Unified)

### HMI-projekt-struktur

```
HMI_1 [KTP700 Basic]
├── Screens
│   ├── Root screen (Startskärm)
│   ├── Overview (Översikt)
│   ├── Motor_Control
│   ├── Alarms
│   └── Settings
├── HMI tags
├── Connections (till PLC)
└── Alarms
```

## Skapa ny skärm

### Steg-för-steg

1. **Öppna HMI-projektet**
   - I Project tree: HMI_1 → **Screens**

2. **Lägg till ny skärm**
   - Högerklicka **Screens** → **Add new screen**
   - Namn: `Overview`
   - Typ: **Standard screen** (default)
   - Klicka **OK**

3. **Öppna skärmen**
   - Dubbelklicka `Overview` → Öppnas i WinCC editor

### Skärm-typer

| Typ | Användning | Storlek |
|-----|------------|--------|
| **Standard screen** | Normal processida | Hela skärmen |
| **Popup screen** | Larm, dialogrutor | Anpassningsbar (ex: 400x300) |
| **Slide-in screen** | Snabbmeny, inställningar | Delvis skärm (slide från kant) |
| **Template screen** | Återanvändbar layout | Bas för andra skärmar |

## Skärm-layout och design

### Rekommenderade zoner

```
┌─────────────────────────────────────┐
│  Header: Titel, datum, tid          │ ← 10% av skärmen
├─────────────────────────────────────┤
│                                     │
│  Main Area: Process-grafik          │ ← 70%
│  Knappar, värden, animationer       │
│                                     │
├─────────────────────────────────────┤
│  Footer: Navigation, larmstatus     │ ← 20%
└─────────────────────────────────────┘
```

### Header-sektion (exempel)

**Objekt:**
- **Text field:** Skärmtitel ("Motor Control")
- **Date/Time:** Systemdatum och tid
- **Button:** Hem-knapp (tillbaka till översikt)

**Layout:**
```
[🏠 Home]  Motor Control System       [📅 2024-01-15  🕐 14:32:15]
```

### Main Area

Huvudområde för:
- Process-grafik (tankar, motorer, ventiler)
- Realtidsvärden (temperatur, tryck, hastighet)
- Kontrollknappar (start/stopp)
- Status-indikatorer

### Footer-sektion

**Objekt:**
- **Navigation buttons:** Länkar till andra skärmar
- **Alarm indicator:** Visar antal aktiva larm
- **User info:** Inloggad operatör

**Layout:**
```
[Overview] [Motors] [Tanks] [Settings]    ⚠️ 2 Alarms    👤 User: Anna
```

## Navigation mellan skärmar

### Metod 1: Knapp med "ActivateScreen"

1. **Lägg till Button** på skärmen
2. **Konfigurera Events:**
   - **Event:** Click
   - **Function:** ActivateScreen
   - **Screen name:** `Motor_Control`

**Resultat:** När operatör klickar knappen, öppnas `Motor_Control`-skärmen.

### Metod 2: Navigation bar

Skapa en återanvändbar navigationsmeny (template).

**Template "NavBar":**
```
[Overview] [Motors] [Tanks] [Alarms] [Settings]
```

**Lägg till i alla skärmar:**
1. Skapa template "NavBar"
2. Lägg till knappar med ActivateScreen för varje skärm
3. I varje skärm: **Insert** → **Template** → `NavBar`

::: tip Template-fördel
Ändra NavBar-templaten → alla skärmar uppdateras automatiskt!
:::

### Metod 3: Programmatisk navigation från PLC

PLC kan tvinga HMI att byta skärm (ex: vid larm).

**I HMI:**
1. Skapa **HMI tag:** `Screen_Number` (INT)
2. Lägg till script i **Root screen:**

```vbs
' VB Script i Root screen (Cyclic)
If Tag("Screen_Number") = 1 Then
    ActivateScreen "Overview"
ElseIf Tag("Screen_Number") = 2 Then
    ActivateScreen "Motor_Control"
ElseIf Tag("Screen_Number") = 10 Then
    ActivateScreen "Alarms"
End If
```

**I PLC:**
```scl
// Tvinga skärmbyte vid larm
IF "Alarm_Critical" THEN
    "HMI_Screen_Number" := 10;  // Öppna Alarm-skärm
END_IF;
```

## Organisera skärmar

### Använd mappar

För stora projekt, organisera skärmar i mappar.

**Struktur:**
```
Screens
├── 00_Main
│   ├── Root_Screen
│   └── Overview
├── 01_Motors
│   ├── Motor_M01
│   ├── Motor_M02
│   └── Motor_M03
├── 02_Tanks
│   ├── Tank_T01
│   └── Tank_T02
└── 99_System
    ├── Alarms
    └── Settings
```

**Skapa mapp:**
1. Högerklicka **Screens** → **Add new folder**
2. Namn: `01_Motors`

### Namnkonvention

::: tip Rekommendation
Använd prefix för sortering:
- `00_` - Huvud/root-skärmar
- `01_` - Process-skärmar (motorer)
- `02_` - Process-skärmar (tankar)
- `99_` - System (larm, inställningar)
:::

## Popup-skärmar

### När använda popups

✅ **Använd för:**
- Larmbekräftelse
- Snabba inställningar
- "Är du säker?"-dialoger
- Detaljerad information (klicka för mer info)

❌ **Använd INTE för:**
- Huvudprocess-vyer
- Navigation (använd standard screens)

### Skapa popup

1. **Add new screen** → Type: **Popup screen**
2. Storlek: 400x300 px (anpassas efter behov)
3. **Properties:**
   - **Title bar:** Visa/dölj
   - **Close button:** Tillåt stängning
   - **Modal:** Blockera bakgrund (ja/nej)

### Öppna popup från knapp

**Event:**
- Event: Click
- Function: **ShowPopupScreen**
- Screen: `Popup_MotorSettings`
- Position: Center

## Responsive design

### Landskap vs Porträtt

Siemens HMI-paneler är oftast **landskap** (800x480, 1024x768), men mobila HMI kan vara **porträtt**.

**Tips:**
- Designa för målpanelens upplösning
- Använd **grouping** för att hålla objekt tillsammans vid storleksändring

### Multi-resolution support

För projekt med olika paneler (ex: KTP700 + TP1200):

1. Skapa **separate screen folders** för varje upplösning
2. Eller: Använd **VectorGraphics** som skalar automatiskt

## Best practices

::: tip Designrekommendationer
1. **Konsistens:** Samma layout, färger och typsnitt på alla skärmar
2. **Enkelhet:** Max 10-15 knappar per skärm - undvik information overload
3. **Hierarki:** Overview → Detail - börja med översikt, gå djupare vid behov
4. **Färgkodning:**
   - 🟢 Grön: Kör/OK
   - 🔴 Röd: Stopp/Fel
   - 🟡 Gul: Varning
   - ⚪ Grå: Inaktiv
5. **Läsbarhet:** Stora knappar (min 50x50 px), tydliga etiketter
6. **Navigation:** Max 3 klick från översikt till valfri funktion
7. **Templates:** Återanvänd header/footer för konsekvens
8. **Test:** Testa på faktisk panel, inte bara i simulator
:::

## Exempel: Motorstyrnings-skärm

### Layout

```
┌──────────────────────────────────────┐
│ [🏠] Motor M01 Control  📅 2024-01-15 │
├──────────────────────────────────────┤
│                                      │
│    🔵 Motor M01                      │
│    ════════════                      │
│                                      │
│    Speed: [1450] rpm                 │
│    Current: [12.5] A                 │
│    Temp: [65] °C                     │
│                                      │
│    [▶ START]  [⏹ STOP]              │
│                                      │
│    Speed setpoint: [____] rpm        │
│    [  slider  ]                      │
│                                      │
├──────────────────────────────────────┤
│ [Overview] [Motors] [Alarms]     👤  │
└──────────────────────────────────────┘
```

### Objekt-lista

| Objekt | Typ | Funktion |
|--------|-----|----------|
| Motor ikon | Circle | Animation: Grön (igång), Grå (stopp) |
| Speed-värde | I/O Field | Visa `Motor_Speed` (read-only) |
| START-knapp | Button | Event: SetBit `Motor_Start` |
| STOP-knapp | Button | Event: ResetBit `Motor_Start` |
| Speed setpoint | I/O Field | Skriv till `Motor_Speed_Setpoint` |
| Slider | Slider | Kontroll för hastighet (0-1500) |

## Resurser

- [Siemens: WinCC HMI Design dokumentation (sökresultat)](https://support.industry.siemens.com/cs/products?search=wincc%20hmi%20design%20best%20practices)
- [Video: Creating HMI Screens in TIA Portal](https://www.youtube.com/watch?v=qZuWhPk1yQo)
- [Video: HMI Navigation and Popups](https://www.youtube.com/watch?v=3DtZ8n-7ycA)
- [Nästa: Knappar och indikatorer →](./knappar-indikatorer.md)

---
**Relaterat:**
- [HMI-konfiguration](../03-konfiguration/hmi-installningar.md)
- [Koppling PLC↔HMI](../05-taggar/koppling-plc-hmi.md)
- [Dynamiska objekt och animationer](./dynamiska-objekt.md)
