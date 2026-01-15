# PLCSIM - PLC-simulering

S7-PLCSIM är ett simuleringsverktyg som ingår i TIA Portal och låter dig testa PLC-program utan fysisk hårdvara. Detta är ovärderligt för att verifiera programlogik innan idrifttagning.

## Vad är S7-PLCSIM?

S7-PLCSIM skapar en virtuell PLC i datorn som beter sig som en riktig S7-1200 eller S7-1500. Du kan:

- Ladda ner och köra program
- Testa logik och sekvenser
- Simulera in- och utgångar
- Använda watch tables för övervakning
- Testa HMI-kopplingar

::: tip Fördelar med simulering
- Ingen risk att skada utrustning
- Testa parallellt med utveckling
- Felsök program innan idrifttagning
- Utbilda personal säkert
:::

## Starta PLCSIM

### Steg 1: Ladda ner projekt
1. Öppna ditt TIA Portal-projekt
2. Markera din PLC i projektträdet
3. Klicka på **Download to device** (eller Ctrl+L)
4. Välj **Start simulation** i dialogrutan

### Steg 2: PLCSIM-gränssnitt
När PLCSIM startar öppnas ett eget fönster med:
- **SIM table** - Simulera in/utgångar
- **Sequence** - Spela in och spela upp sekvenser
- **Control panel** - RUN/STOP-knapp, LED-indikatorer

### Steg 3: Sätt PLC i RUN
1. Klicka på **RUN** i PLCSIM Control Panel
2. Verifiera att RUN-LED lyser grönt
3. Programmet körs nu i simulatorn

## Watch Tables - Övervaka variabler

Watch tables låter dig se och ändra variabelvärden i realtid.

### Skapa en watch table
1. Högerklicka på **Watch and force tables** i projektträdet
2. Välj **Add new watch table**
3. Lägg till de variabler du vill övervaka

### Funktioner i watch table
| Funktion | Beskrivning |
|----------|-------------|
| **Monitor** | Visa aktuella värden |
| **Modify** | Ändra värden tillfälligt |
| **Force** | Tvinga värden (överskrider program) |

### Exempel: Övervaka motorkontroll
```
Adress          | Displayformat | Modifiera
----------------|---------------|----------
%I0.0           | BOOL          | TRUE
%Q0.0           | BOOL          | -
"DB1".Motor_On  | BOOL          | -
"DB1".Hastighet | REAL          | 50.0
```

## Force Values - Tvinga värden

Force är kraftfullt men ska användas med försiktighet:

::: warning Varning
Force-värden överskrider all programlogik! En forcerad utgång förblir i sitt läge oavsett vad programmet gör. Glöm aldrig att ta bort force innan verklig drift.
:::

### Använda Force
1. Högerklicka på värdet i watch table
2. Välj **Force to 1** eller **Force to 0**
3. Forcerade värden visas med speciell ikon
4. Ta bort med **Delete force** eller **Stop forcing**

## SIM Table - Simulera I/O

SIM table låter dig simulera ingångar som om de vore riktiga sensorer.

### Lägga till ingångar
1. Klicka i **Address**-kolumnen
2. Skriv adressen (t.ex. `%I0.0`)
3. Klicka på checkboxen för att ändra värde

### Simulera analoga ingångar
För analoga värden (t.ex. temperatur):
1. Lägg till adressen `%IW64` (analogt inords)
2. Ange värdet i decimalformat
3. Programmet läser det simulerade värdet

## Debugging-funktioner

### Breakpoints
Du kan pausa programmet vid specifika instruktioner:
1. Öppna programblocket
2. Klicka i marginalen vid önskad rad
3. En röd punkt markerar breakpoint
4. Programmet stannar när det når denna punkt

### Single Step
Stega igenom programmet rad för rad:
1. Sätt en breakpoint
2. När programmet pausar, använd **Step Into** (F11)
3. Analysera variabelvärden mellan varje steg

### Call Hierarchy
Se vilka block som anropas:
1. Högerklicka på ett block
2. Välj **Show call structure**
3. Diagrammet visar anropskedjan

## Tips för effektiv simulering

### Förbereda för test
1. Skapa en **testplan** med scenarion att verifiera
2. Dokumentera förväntade resultat
3. Använd descriptive taggnamn för enklare övervakning

### Vanliga testfall
| Scenario | Vad testa |
|----------|-----------|
| Normal drift | Sekvens fungerar korrekt |
| Felfall | Larm och säkerhetsstopp |
| Gränsvärden | Min/max-värden hanteras |
| Timeout | Tidövervakning fungerar |

### Spara testsekvenser
PLCSIM kan spara och spela upp ingångssekvenser:
1. Gå till **Sequence** i PLCSIM
2. Klicka **Record**
3. Utför sekvensen manuellt
4. Klicka **Stop** och **Save**
5. Spela upp med **Play**

## PLCSIM vs PLCSIM Advanced

| Funktion | PLCSIM | PLCSIM Advanced |
|----------|--------|-----------------|
| Ingår i TIA Portal | Ja | Separat licens |
| S7-1200 | Ja | Ja |
| S7-1500 | Ja | Ja |
| Flera instanser | Nej | Ja |
| OPC UA | Nej | Ja |
| Virtual Ethernet | Nej | Ja |
| Webserver | Nej | Ja |

## Resurser

### Officiell dokumentation
- [S7-PLCSIM Advanced V4.0](https://support.industry.siemens.com/cs/document/109795016/simatic-s7-plcsim-advanced-v4.0-download-incl.-trial-license) - Trial-nedladdning och dokumentation
- [TIA Portal V18 Updates](https://support.industry.siemens.com/cs/document/109817218/updates-for-step-7-v18-s7-plcsim-v18-and-wincc-v18) - Uppdateringar för TIA V18 och PLCSIM

## Nästa steg

- [HMI-simulering](./hmi-simulering) - Testa operatörspaneler
- [Kommunikationskontroll](./kommunikationskontroll) - Diagnostisera kommunikation
