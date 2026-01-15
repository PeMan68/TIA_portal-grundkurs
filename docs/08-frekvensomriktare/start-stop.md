# Start/Stop via PLC

Att styra en frekvensomriktare från en PLC ger full kontroll över motorns drift. Här beskrivs hur du kopplar ihop en SINAMICS V20 med en S7-1200 för start/stopp-styrning via USS- eller Modbus-protokoll.

## Styrord (Control Word)

Frekvensomriktaren styrs via ett 16-bitars styrord där varje bit har en specifik funktion:

### Bitstruktur för styrord
| Bit | Funktion | 0 = | 1 = |
|-----|----------|-----|-----|
| 0 | ON/OFF1 | Avstängd | Påslagen |
| 1 | OFF2 | Frirullning | Normal drift |
| 2 | OFF3 | Snabbstopp | Normal drift |
| 3 | Pulsaktivering | Inga pulser | Pulser aktiva |
| 4 | RFG enable | Ramp frysen | Ramp aktiv |
| 5 | RFG start | - | Ramp start |
| 6 | Börvärde aktiv | - | Börvärde gäller |
| 7 | Felkvittering | - | Kvittera fel |
| 10 | Styrning PLC | - | PLC har kontroll |

### Typiska styrvärden
| Värde (hex) | Värde (dec) | Funktion |
|-------------|-------------|----------|
| 0x047E | 1150 | Drift klar, motor stoppad |
| 0x047F | 1151 | Motor kör framåt |
| 0x0C7F | 3199 | Motor kör bakåt |
| 0x04FE | 1278 | Stoppa motor (ramp) |
| 0x04FF | 1279 | Kvittera fel + starta |

## Statusord (Status Word)

Frekvensomriktaren rapporterar sin status via ett 16-bitars statusord:

| Bit | Funktion | Betydelse om 1 |
|-----|----------|----------------|
| 0 | Klar att starta | Redo för ON-kommando |
| 1 | Klar att köra | Redo att accelerera |
| 2 | Drift aktiv | Motor kör |
| 3 | Fel aktivt | Fel har inträffat |
| 4 | OFF2 aktivt | Friruller |
| 5 | OFF3 aktivt | Snabbstoppad |
| 6 | Inkopplingsblockering | Kan ej starta |
| 7 | Varning aktivt | Varning finns |

## USS-kommunikation med S7-1200

### Hårdvarukrav
- S7-1200 CPU med CM1241 kommunikationsmodul (RS485)
- Kabeldragning: Plint 14 (P+) och 15 (N-) på V20

### Parametrering av V20 för USS
```
P0700 = 5     // Styrkälla: USS
P1000 = 5     // Börvärdes-källa: USS
P2010 = 6     // USS baudrate: 9600 bps
P2011 = 0     // USS adress: 0
```

### TIA Portal-programmering
```pascal
// Deklarera variabler
VAR
    USS_Port : USS_PORT_STRUCT;
    USS_Drv  : USS_DRV_STRUCT;
    Styrord  : Word := 16#047E;
    Borvarde : Real := 0.0;
    Statusord : Word;
    Akthast  : Real;
END_VAR

// Anropa USS_PORT för kommunikation
"USS_PORT"(
    PORT := 4,              // CM1241 port
    BAUD := 4,              // 9600 bps
    USS_PORT := USS_Port
);

// Anropa USS_DRV för drivenhet 0
"USS_DRV"(
    RUN := TRUE,
    DIRECTION := 1,         // 1=framåt, 2=bakåt
    SPEED_SP := Borvarde,   // Börvärde 0-100%
    DRIVE := 0,             // USS adress
    USS_PORT := USS_Port,
    STATUS := Statusord,
    SPEED := Akthast,
    USS_DRV := USS_Drv
);
```

## Modbus RTU-kommunikation

### Parametrering av V20 för Modbus
```
P0700 = 6     // Styrkälla: Modbus
P1000 = 6     // Börvärdes-källa: Modbus
P2010 = 6     // Baudrate: 9600 bps
P2021 = 1     // Modbus adress: 1
```

### Modbus-register
| Register | Funktion | Läs/Skriv |
|----------|----------|-----------|
| 40100 | Börvärde (0.01 Hz) | Skriv |
| 40101 | Styrord | Skriv |
| 40110 | Aktuell frekvens | Läs |
| 40111 | Statusord | Läs |

## Säkerhetsöverväganden

::: danger Varning
- Kontrollera alltid att nödstopp fungerar oberoende av PLC
- Använd OFF3 (snabbstopp) för säkerhetskritiska applikationer
- Verifiera att kommunikationsfel ger säkert stopp (timeout)
:::

### Kommunikationstimeout
Konfigurera timeout för att stoppa driften vid kommunikationsfel:

```
P2014 = 100   // Timeout 1000 ms (värde × 10 ms)
P2015 = 0     // Vid timeout: OFF1 (ramp-stopp)
```

### Val av stoppreaktion
| P2015 | Reaktion vid timeout |
|-------|---------------------|
| 0 | OFF1 - Ramp-stopp |
| 1 | OFF2 - Frirullning |
| 2 | OFF3 - Snabbstopp |

## Programmeringsexempel: Start/Stopp med HMI

```pascal
// FC för frekvensomriktarstyrning
FUNCTION "FC_V20_Control" : Void

VAR_INPUT
    Start_Cmd : Bool;      // Startknapp
    Stop_Cmd : Bool;       // Stoppknapp
    Reset_Cmd : Bool;      // Felkvittering
    Speed_SP : Real;       // Börvärde 0-50 Hz
END_VAR

VAR_IN_OUT
    Control_Word : Word;
    Speed_Output : Int;
END_VAR

BEGIN
    // Grundstyrord
    Control_Word := 16#047E;
    
    // Start-sekvens
    IF Start_Cmd AND NOT Stop_Cmd THEN
        Control_Word := 16#047F;  // Kör framåt
    END_IF;
    
    // Felkvittering
    IF Reset_Cmd THEN
        Control_Word := Control_Word OR 16#0080;
    END_IF;
    
    // Skala börvärde för USS
    Speed_Output := REAL_TO_INT((Speed_SP / 50.0) * 16384.0);
END_FUNCTION
```

## Resurser

### Officiell dokumentation
- [SINAMICS V20 Operating Instructions](https://support.industry.siemens.com/cs/document/109977897/sinamics-v20-converter) - Komplett styrordsreferens
- [Speed Control V20 via USS/Modbus with HMI](https://support.industry.siemens.com/cs/document/63696870/sinamics-v-speed-control-of-a-v20-with-s7-1200-(tia-portal)-via-uss-protocol-modbus-rtu-with-hmi) - Komplett applikationsexempel
- [Simple Control V20 via USS](https://support.industry.siemens.com/cs/document/109480894/simple-control-of-a-sinamics-v20-with-a-simatic-s7-1200-1500-via-uss) - Förenklad styrning

## Nästa steg

- [Grundparametrar](./grundparametrar) - Parametrering av V20
- [Hastighetsstyrning](./hastighetsstyrning) - Börvärdeshantering
