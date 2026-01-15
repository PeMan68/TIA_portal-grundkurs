# Hastighetsstyrning

Hastighetsstyrning av en frekvensomriktare innebär att kontrollera motorns varvtal genom att ändra utfrekvensen. SINAMICS V20 erbjuder flera sätt att sätta och skala hastighetsvärden.

## Börvärdes-källor (P1000)

Parameter P1000 bestämmer varifrån frekvensomriktaren tar sitt hastighetsvärde:

| P1000 värde | Källa | Användning |
|-------------|-------|------------|
| 0 | Ingen börvärde | - |
| 1 | MOP (BOP potentiometer) | Manuell justering |
| 2 | Analog ingång AI1 | 0-10V eller 4-20mA |
| 3 | Fasta frekvenser | Förprogrammerade steg |
| 5 | USS-protokoll | Kommunikation |
| 6 | Modbus RTU | Kommunikation |

## Analog börvärdes-ingång

### Konfiguration av AI1
Den analoga ingången kan konfigureras för olika signaltyper:

```
P0757 = 0    // 0-10V (standard)
P0757 = 2    // 4-20mA
P0758 = 0    // Skalning: 0V/4mA = 0 Hz
P0760 = 50   // Skalning: 10V/20mA = 50 Hz
```

### Signalskalning
För att skala analog insignal till önskad frekvens:

| Parameter | Funktion |
|-----------|----------|
| P0758 | Lägsta frekvens vid min signal |
| P0760 | Högsta frekvens vid max signal |

::: tip Exempel: Fläktstyrning
För en fläkt som ska gå 20-50 Hz styrd av 0-10V:
- P0758 = 20 (0V = 20 Hz)
- P0760 = 50 (10V = 50 Hz)
:::

## Fasta frekvenser (FF)

Du kan programmera upp till 7 fasta frekvenser som väljs via digitala ingångar:

| Parameter | Funktion |
|-----------|----------|
| P1001 | Fast frekvens 1 |
| P1002 | Fast frekvens 2 |
| P1003 | Fast frekvens 3 |
| ... | ... |
| P1007 | Fast frekvens 7 |

### Kopplingsschema för fasta frekvenser
```
DI1 + DI2 = Frekvensval:
00 = Analog/USS börvärde
01 = FF1 (P1001)
10 = FF2 (P1002)
11 = FF3 (P1003)
```

## Kommunikationsstyrning

### USS-protokoll
Med USS-kommunikation skickas börvärdet som ett 16-bitars värde:

```
Börvärde = (Önskad frekvens / P2000) × 4000 (hex)
```

**Exempel:** För 25 Hz med P2000 = 50:
```
Börvärde = (25 / 50) × 16384 = 8192 = 0x2000
```

### Modbus RTU
Med Modbus skrivs frekvens direkt till register:
- **Register 40100**: Börvärde i 0.01 Hz (2500 = 25.00 Hz)

## Ramper och avrundning

### Grundläggande ramper
| Parameter | Funktion | Typiskt värde |
|-----------|----------|---------------|
| P1120 | Uppramptid | 10s |
| P1121 | Nedramptid | 10s |

### Avrundning (S-kurvor)
För mjukare acceleration/deceleration:

| Parameter | Funktion |
|-----------|----------|
| P1130 | Avrundningstid start av ramp |
| P1131 | Avrundningstid slut av ramp |

::: warning Obs
Undvik avrundningstider vid analog styrning - det kan orsaka oscillationer. Se [Siemens FAQ 109780402](https://support.industry.siemens.com/cs/document/109780402/sinamics-v20-why-does-the-speed-fluctuate-when-i-set-the-setpoint-via-an-analog-input-) för mer information.
:::

## Praktiskt exempel: Hastighetsstyrning från S7-1200

### Datablock för hastighetsvärde
```pascal
// DB för frekvensomriktare
DATA_BLOCK "DB_V20"
    Hastighet_Borvarde : Real;    // Önskad hastighet i Hz
    Hastighet_Aktual : Real;      // Aktuell hastighet i Hz
    Skalad_Output : Int;          // Värde till USS/Modbus
END_DATA_BLOCK
```

### Skalning i SCL
```pascal
// Skala 0-50 Hz till USS-format (0-16384)
"DB_V20".Skalad_Output := 
    REAL_TO_INT(("DB_V20".Hastighet_Borvarde / 50.0) * 16384.0);
```

## Resurser

### Officiell dokumentation
- [SINAMICS V20 Operating Instructions](https://support.industry.siemens.com/cs/document/109977897/sinamics-v20-converter) - Komplett parameterreferens
- [Speed Control V20 with S7-1200 via USS/Modbus](https://support.industry.siemens.com/cs/document/63696870/sinamics-v-speed-control-of-a-v20-with-s7-1200-(tia-portal)-via-uss-protocol-modbus-rtu-with-hmi) - Komplett applikationsexempel med HMI

## Nästa steg

- [Start/Stop via PLC](./start-stop) - Styra körning från PLC
- [Grundparametrar](./grundparametrar) - Grundkonfiguration
