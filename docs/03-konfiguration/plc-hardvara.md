# PLC-hårdvara och nätverk

Efter att du lagt till PLC:n i projektet behöver du konfigurera hårdvaruparametrar och nätverksinställningar. Korrekt konfiguration är avgörande för att PLC:n ska fungera optimalt och kommunicera med andra enheter.

## Öppna hårdvarukonfigurationen

1. I projektträdet, expandera din PLC
2. Dubbelklicka på **Device configuration**
3. Du ser nu CPU:n och eventuella tilläggsmoduler i grafisk vy

## Konfigurera CPU-egenskaper

### Allmänna inställningar

Markera CPU:n i device configuration och öppna **Properties** (längst ner):

#### System och clock memory
1. Under **General** → **System and clock memory**
2. **Clock memory byte** - Aktivera och välj byte (t.ex. %MB0)
   - Ger dig tillgång till blinksignaler (1Hz, 2Hz, etc.)
   - Användbart för blinkande lampor och test
3. **First scan bit** - Biten som är aktiv första cykeln
   - Användbart för initieringsrutiner

#### Startup efter strömavbrott
1. Under **Startup**
2. Välj beteende vid uppstart:
   - **Warm restart** - Behåller remanenta data (rekommenderas)
   - **Cold restart** - Nollställer allt
   - **No restart** - Startar inte automatiskt

### Webserver

Aktivera den inbyggda webbservern för diagnostik:

1. Under **General** → **Web server**
2. Aktivera "Enable web server on this module"
3. Välj säkerhetsalternativ:
   - **Allow access only with HTTPS** (rekommenderas för produktion)
   - Användarnamn och lösenord kan konfigureras

::: tip Tips
Med webbservern kan du öppna diagnostikinformation genom att surfa till PLC:ns IP-adress i en vanlig webbläsare!
:::

### Protection & Security

Skydda ditt program från obehörig åtkomst:

1. Under **Protection & Security** → **Connection mechanisms**
2. **Access levels:**
   - Full access (read/write)
   - Read access
   - HMI access
   - No access (only after reboot)
3. Sätt lösenord för varje nivå efter behov

## Konfigurera Ethernet/IP-adresser

### PROFINET Interface

1. Markera CPU:ns **Ethernet-port** (grön PROFINET-ikon)
2. Under **Properties** → **Ethernet addresses**

#### IP-adress
- **IP address:** `192.168.0.10` (exempel)
- **Subnet mask:** `255.255.255.0` (standard för Class C)
- **Use router:** Aktivera endast om routing behövs
- **Router address:** Gateway-adress (om tillämpligt)

#### Device name (för PROFINET IO)
- Används för PROFINET IO-devices
- Exempel: `plc-main-controller`
- Viktigt för IO-device-identifiering

### DHCP vs Statisk IP

| Metod | Fördelar | Nackdelar |
|-------|----------|----------|
| **Statisk IP** | Enkel, pålitlig, ingen DHCP-server behövs | Manuell konfiguration |
| **DHCP** | Automatisk tilldelning | Kräver DHCP-server, IP kan ändras |

::: info Rekommendation
Använd **statisk IP** för PLC:er i produktion. DHCP kan användas för test och simulering.
:::

## Konfigurera in- och utgångar

### Digitala ingångar (DI)

1. Markera en **digital input module** eller inbyggda DI
2. Under **Properties** → **Inputs**
3. Konfigurera per kanal:
   - **Input delay** - Filtreringstid för debouncing (standard 0.1-10 ms)
   - Viktigt för mekaniska switchar och reläer

### Digitala utgångar (DQ)

1. Markera **digital output module**
2. Under **Properties** → **Outputs**
3. Konfigurera:
   - **Reaction to CPU STOP** - Vad händer vid PLC-stopp?
     - Keep last value (behåll)
     - Set substitute value (0 eller 1)
   - **Diagnostics** - Aktivera för feldetektering (kortslutning, överbelastning)

### Analoga ingångar (AI)

1. Markera **analog input module**
2. Under **Properties** → **Inputs**
3. Konfigurera per kanal:
   - **Measurement type:** Voltage (0-10V), Current (4-20mA), Resistance, Thermocouple
   - **Measurement range:** T.ex. 0-10V, 4-20mA
   - **Smoothing:** Medelvärdesfilter (None, Weak, Medium, Strong)
   - **Enable limit monitoring:** Larm vid över-/underskridning

### Analoga utgångar (AO)

1. Markera **analog output module**
2. Konfigurera:
   - **Output type:** Voltage (0-10V) eller Current (4-20mA)
   - **Reaction to CPU STOP:** Substitute value vid PLC-stopp
   - **Diagnostics:** Övervaka kabelbr ott och kortslutning

## Konfigurera höghastighetsingångar

För räknare och pulsutgångar:

1. Under CPU → **Properties** → **High-speed counters (HSC)**
2. Aktivera önskade HSC (HSC1, HSC2, etc.)
3. Konfigurera:
   - **Mode:** Single-phase, Two-phase, A/B counter
   - **Frequency:** Max frekvens (upp till 100 kHz)
   - **Hardware inputs:** Vilka ingångar som används

## Cycle time och watchdog

### Cycletid

1. Under CPU → **Properties** → **Cycle**
2. **Minimum cycle time:** Minsta cykeltid (standard: 1 ms)
3. **Maximum cycle time:** Watchdog-gräns (standard: 150 ms)
   - PLC går i STOP om denna överskrids
4. **Scan cycle monitoring time:** Övervaknings-timeout

::: warning Observera
Om din cykeltid närmar sig max-värdet, optimera programmet eller öka watchdog-tiden.
:::

## Kompilera och ladda ner konfiguration

### Kompilera hårdvaran

1. Högerklicka på PLC:n i projektträdet
2. Välj **Compile** → **Hardware (rebuild all)**
3. Kontrollera **Info**-fönstret för fel och varningar
4. Åtgärda eventuella fel

### Ladda ner till PLC

1. Anslut PC till PLC via Ethernet-kabel
2. Klicka på **Online** → **Download to device**
3. Välj PLC (eller **Show all accessible devices** för att söka)
4. Markera vad som ska laddas:
   - Hardware configuration
   - PLC program blocks
   - HMI
5. Klicka **Load**
6. Bekräfta och vänta på överföringen
7. PLC startar om och går i RUN-läge

## Diagnostik och felsökning

### Onlinevy

1. Klicka **Go online** (ikon i verktygsfältet)
2. Du ser nu realtidsstatus:
   - **Gröna** moduler = OK
   - **Röda** moduler = Fel
3. Dubbelklicka på modul för detaljerad diagnostik

### Diagnostikbuffert

1. PLC → **Online & diagnostics** → **Diagnostics**
2. **Diagnostic buffer** visar alla händelser:
   - Uppstart/stopp
   - Kommunikationsfel
   - Hårdvarufel
3. Användbart för felsökning

## Best practices

✅ **Använd konsekvent IP-adressering**
- PLC:er: `.10-.19`
- HMI: `.20-.29`
- Frekvensomriktare: `.30-.39`

✅ **Dokumentera hårdvaruinställningar**
- Skriv kommentarer i projektets Properties
- Exportera konfiguration regelbundet

✅ **Testa webservern**
- Öppna `http://192.168.0.10` (din PLC-IP) i webbläsaren
- Verifiera att diagnostik fungerar

✅ **Sätt rimliga watchdog-tider**
- För enkla program: 150 ms (default)
- För komplexa: 300-500 ms

## Resurser och dokumentation

### Officiell dokumentation
- [S7-1200 Hardware Configuration](https://support.industry.siemens.com/cs/document/36912030) - System Manual
- [PROFINET IO Configuration](https://support.industry.siemens.com/cs/document/49948856) - Profinet Guide

### Video-tutorials
- YouTube: "TIA Portal S7-1200 hardware configuration"
- YouTube: "TIA Portal IP address setup"
- YouTube: "TIA Portal analog input configuration"

::: tip Nästa steg
Nu när PLC:n är konfigurerad, fortsätt med [HMI-inställningar](./hmi-installningar.md) för att konfigurera din operatörspanel.
:::
