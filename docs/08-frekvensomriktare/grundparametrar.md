# Grundparametrar för frekvensomriktare

En frekvensomriktare (VFD - Variable Frequency Drive) måste konfigureras korrekt för att fungera säkert och effektivt med den anslutna motorn. Här går vi igenom de viktigaste grundparametrarna för SINAMICS V20.

## Viktiga parameterkategorier

### Motordata (P0300-serien)
Motordata måste ställas in korrekt för optimal prestanda:

| Parameter | Beskrivning | Typiskt värde |
|-----------|-------------|---------------|
| P0304 | Märkspänning motor [V] | 400 |
| P0305 | Märkström motor [A] | Enligt motorskylt |
| P0307 | Märkeffekt motor [kW] | Enligt motorskylt |
| P0308 | Märkvarvtal motor [rpm] | 1450 / 2900 |
| P0310 | Märkfrekvens motor [Hz] | 50 |
| P0311 | Motor cos φ | Enligt motorskylt |

### Ramp-tider (P1080/P1082)
Ramp-tiderna bestämmer hur snabbt motorn accelererar och bromsar:

- **P1080**: Uppramptid (acceleration) - typiskt 5-30 sekunder
- **P1082**: Nedramptid (deceleration) - typiskt 5-30 sekunder

::: tip Tips
Börja med längre ramptider (t.ex. 10s) och minska gradvis tills du hittar rätt balans mellan snabb respons och jämn drift.
:::

### Frekvens- och hastighetsgränser
| Parameter | Beskrivning | Standardvärde |
|-----------|-------------|---------------|
| P1080 | Minfrekvens [Hz] | 0 |
| P1082 | Maxfrekvens [Hz] | 50 |
| P1135 | OFF3 ramp (snabbstopp) | 5s |

## Driftlägen (Connection Macros)

SINAMICS V20 har fördefinierade anslutnings-makron som förenklar konfigurationen:

- **Cn001**: Standardinställning för fabrik
- **Cn002**: BOP-styrning (operatörspanel)
- **Cn003**: Extern styrning via klämmor
- **Cn005**: USS-kommunikation
- **Cn006**: Modbus RTU-kommunikation

## Grundläggande idrifttagning

### Steg-för-steg med BOP
1. **Ställ in motordata** (P0304-P0311)
2. **Välj styrningskälla** (P0700)
3. **Välj börvärdes-källa** (P1000)
4. **Ställ in ramptider** (P1080/P1082)
5. **Kör motoridentifiering** (P1910) - valfritt men rekommenderat

### Exempel på parametersättning
```
P0304 = 400     // Märkspänning 400V
P0305 = 2.8     // Märkström 2.8A
P0307 = 1.1     // Märkeffekt 1.1kW
P0308 = 1430    // Märkvarvtal 1430 rpm
P0310 = 50      // Märkfrekvens 50Hz
P1080 = 10      // Uppramptid 10s
P1082 = 10      // Nedramptid 10s
```

## Säkerhetsparametrar

Viktiga skyddsparametrar att konfigurera:

| Parameter | Funktion |
|-----------|----------|
| P0290 | Övertemperaturskydd motor |
| P2172 | Överströmsgräns |
| P2181 | Underspänningsgräns |

## Resurser

### Officiell dokumentation
- [SINAMICS V20 Operating Instructions](https://support.industry.siemens.com/cs/document/109977897/sinamics-v20-converter) - Komplett manual med alla parametrar (PDF)
- [Simple Control of SINAMICS V20 with S7-1200/1500 via USS](https://support.industry.siemens.com/cs/document/109480894/simple-control-of-a-sinamics-v20-with-a-simatic-s7-1200-1500-via-uss) - Applikationsexempel

## Nästa steg

När grundparametrarna är konfigurerade kan du gå vidare till:
- [Hastighetsstyrning](./hastighetsstyrning) - Sätta börvärden och skalning
- [Start/Stop via PLC](./start-stop) - Styrning från S7-1200
