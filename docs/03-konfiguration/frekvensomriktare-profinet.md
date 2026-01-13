# Frekvensomriktare via Profinet

Att styra en frekvensomriktare (VFD - Variable Frequency Drive) via Profinet ger dig fullständig kontroll över motorhastighet, riktning och övervakningsparametrar direkt från PLC-programmet. Här lär du dig konfigurera en Sinamics frekvensomriktare i TIA Portal.

## Förutsättningar

Innan du börjar, se till att du har:
- ✅ PLC (S7-1200/1500) konfigurerad med Profinet
- ✅ Sinamics frekvensomriktare (t.ex. G120, G120C, V20)
- ✅ GSD-fil för din frekvensomriktare
- ✅ Ethernet-kablar för Profinet-anslutning

## Steg 1: Installera GSD-fil

GSD (General Station Description) är en enhetsbeskrivning som TIA Portal behöver för att känna igen frekvensomriktaren.

### Ladda ner GSD-fil

1. Gå till [Siemens Support Portal](https://support.industry.siemens.com)
2. Sök efter din frekvensomriktare (t.ex. "Sinamics G120 GSD")
3. Ladda ner senaste GSDML-filen (XML-format)
4. Spara filen på din dator

### Installera GSD i TIA Portal

1. I TIA Portal: **Options** → **Install general station description file (GSD)**
2. Klicka **Browse** och välj nedladdad GSD-fil
3. Klicka **Install**
4. Vänta på installation (kan ta 1-2 minuter)
5. Bekräfta att installation lyckades
6. Starta om TIA Portal för att aktivera GSD-filen

::: tip Tips
GSD-filer är kompatibla mellan många Siemens-produkter. En GSD för G120 fungerar ofta för flera G120-varianter.
:::

## Steg 2: Lägg till frekvensomriktare i projektet

### Hitta i hårdvarukatalogen

1. Öppna **Devices & Networks**
2. Öppna hårdvarukatalogen (höger sida)
3. Navigera till:
   - **Other field devices**
   - **PROFINET IO**
   - **Drives**
   - **Siemens AG**
   - **SINAMICS**
4. Välj din modell (t.ex. "SINAMICS G120 CU250S-2 PN")

### Dra till nätverksvyn

1. Dra frekvensomriktaren till Network View
2. Placera den nära PLC:n visuellt
3. Enheten visas som en grå/gul box

## Steg 3: Anslut till Profinet-nätverket

### Skapa Profinet IO-system

1. Dra en linje från frekvensomriktarens **PN-port** till PLC:ns **PROFINET-interface**
2. En grön linje skapas = anslutningen är aktiv
3. Frekvensomriktaren blir nu en **IO-Device** under PLC:n (IO-Controller)

### Konfigurera enhetsnummer

1. Markera frekvensomriktaren i Network View
2. Under **Properties** → **General**
3. **Device number:** Ange ett unikt nummer (t.ex. `10`)
   - Varje Profinet-enhet måste ha unikt device number
   - Använd logisk numrering: 10-19 för drives, 20-29 för I/O, etc.

### Konfigurera IP-adress

1. Under **Properties** → **Ethernet addresses**
2. **IP address:** `192.168.0.30` (samma subnet som PLC)
3. **Subnet mask:** `255.255.255.0`
4. **Device name:** `g120-drive01` (valfritt men rekommenderat)

::: warning Viktigt
Kontrollera att IP-adressen inte krockar med andra enheter! PLC och HMI måste ha unika IP:er i samma subnet.
:::

## Steg 4: Konfigurera telegram (styrord och processdata)

Telegram definierar vilken data som utbyts mellan PLC och omriktare.

### Välj telegramtyp

1. Markera frekvensomriktaren i Device Configuration
2. I katalogen (höger sida), expandera enhetens **Modules**
3. Välj lämpligt telegram och dra till frekvensomriktarens **slot**:

#### Standard telegrams (vanligaste)

| Telegram | Beskrivning | Användning |
|----------|-------------|------------|
| **Telegram 1** | Grundläggande styrning | Start/stopp, hastighet | 
| **Telegram 3** | Utökad med PZD | Styrning + extra parametrar |
| **Telegram 20** | PROFIDRIVE | Avancerad motion control |
| **Telegram 111** | Standard Speed Control | Rekommenderas för nybörjare |

::: tip Rekommendation
Börja med **Telegram 1** eller **Telegram 111** för grundläggande hastighetsreglering.
:::

### Förståelse av telegram-struktur

Ett telegram består av:
- **STW (Steuerwort / Control Word)** - Styrord från PLC till omriktare
- **ZSW (Zustandswort / Status Word)** - Statusord från omriktare till PLC
- **NSOLL (Speed Setpoint)** - Önskad hastighet från PLC
- **NIST (Actual Speed)** - Verklig hastighet från omriktare
- **PZD (Process Data)** - Ytterligare parametrar

### Tilldela I/O-adresser

1. Efter att du valt telegram visas **Input** och **Output** områden
2. TIA Portal tilldelar automatiskt adresser:
   - **Output (från PLC):** t.ex. `%QW100` (Control Word), `%QW102` (Setpoint)
   - **Input (till PLC):** t.ex. `%IW100` (Status Word), `%IW102` (Actual Speed)
3. Notera dessa adresser - du behöver dem i programmeringen!

## Steg 5: Konfigurera frekvensomriktaren

### Online-konfiguration

Efter att hårdvaran är konfigurerad i TIA Portal måste du konfigurera frekvensomriktaren själv.

#### Via Starter / Startdrive

1. Öppna **SINAMICS Startdrive** (integrerat i TIA Portal)
2. Eller använd standalone **Starter**-verktyget
3. Anslut online till omriktaren
4. Kör **Quick Commissioning Wizard**:
   - Motor-parametrar (effekt, ström, spänning)
   - Ramp-tider (acceleration/deceleration)
   - Gräns hastigheter (min/max)
   - Kommunikationsinställningar

#### Grundparametrar att sätta

| Parameter | Beskrivning | Exempel |
|-----------|-------------|----------|
| **P0010** | Commissioning mode | `1` = Quick commissioning |
| **P0304** | Rated motor voltage | `400V` |
| **P0305** | Rated motor current | `5A` |
| **P0307** | Rated motor power | `2.2 kW` |
| **P1080** | Min frequency | `0 Hz` |
| **P1082** | Max frequency | `50 Hz` |
| **P1120** | Ramp-up time | `5 s` |
| **P1121** | Ramp-down time | `5 s` |
| **P2009** | Profinet device number | `10` (samma som i TIA) |

::: warning OBS
Motorparametrarna måste matcha din motor! Felaktiga parametrar kan skada motor eller omriktare.
:::

## Steg 6: Tilldela device name via TIA Portal

Profinet-enheter identifieras via device name (inte bara IP).

### Online-tilldelning

1. I TIA Portal: **Online** → **Assign device name**
2. TIA Portal söker efter åtkomliga enheter
3. Välj din frekvensomriktare (visas med MAC-adress)
4. Klicka **Assign name**
5. Enheten får nu det device name du angav i konfigurationen

### Alternativ: Via webbgränssnitt

Många Sinamics har inbyggd webbserver:
1. Öppna webbläsare
2. Gå till omriktarens IP (t.ex. `http://192.168.0.30`)
3. Logga in (default: `admin`/`admin` eller inget lösenord)
4. Navigera till **Network settings** → **Device name**
5. Ange device name manuellt

## Steg 7: Kompilera och ladda ner

### Kompilera hårdvarekonfiguration

1. Högerklicka på PLC i projektträdet
2. **Compile** → **Hardware (rebuild all)**
3. Kontrollera att inga fel uppstår
4. Särskilt viktigt att Profinet-konfigurationen är korrekt

### Ladda ner till PLC

1. Anslut PC till PLC via Ethernet
2. **Online** → **Download to device**
3. Ladda ner:
   - ☑ Hardware configuration
   - ☑ PLC program (om du redan programmerat styrning)
4. PLC startar om och etablerar Profinet-kommunikation

## Steg 8: Verifiera Profinet-anslutning

### Kontrollera i TIA Portal

1. Gå **Online** med PLC
2. Öppna **Device View** → **Online & Diagnostics**
3. Expandera **PROFINET interface** → **IO-devices**
4. Frekvensomriktaren ska visas som:
   - ✅ **Grön** = Kommunikation OK
   - ⚠️ **Gul** = Konfigureringsfel
   - ❌ **Röd** = Ingen kommunikation

### LED-indikering på frekvensomriktaren

| LED | Färg | Status |
|-----|------|--------|
| **PN** | Grön | Profinet OK |
| **PN** | Gul blinkande | Väntar på konfiguration |
| **PN** | Röd | Kommunikationsfel |

## Vanliga problem och lösningar

❌ **Problem:** "IO-device not accessible"
✅ **Lösningar:**
- Kontrollera att frekvensomriktaren är påslagen
- Verifiera Ethernet-kabel (ska vara CAT5e eller bättre)
- Kontrollera att IP-adresser är i samma subnet
- Assign device name om det inte är gjort

❌ **Problem:** "Telegram configuration error"
✅ **Lösningar:**
- Kontrollera att rätt telegram är valt i både TIA och omriktare
- Verifiera parameter P2009 (device number) i omriktaren

❌ **Problem:** "Device name conflict"
✅ **Lösningar:**
- Kontrollera att device name är unikt i nätverket
- Reset omriktaren till fabriksinställningar och konfigurera om

## Nästa steg

Nu när Profinet-kommunikationen fungerar kan du:
1. Programmera PLC-kod för att styra omriktaren (se [Start/stop via PLC](../08-frekvensomriktare/start-stop.md))
2. Skapa HMI-kontroller för hastighetsreglering
3. Implementera övervakningsfunktioner

## Resurser och dokumentation

### Officiell dokumentation
- [PROFINET Configuration Manual](https://support.industry.siemens.com/cs/document/49948856) - Profinet guide
- [Sinamics G120 Manual](https://support.industry.siemens.com/cs/document/109476700) - G120 manual
- [Sinamics Startdrive Manual](https://support.industry.siemens.com/cs/document/109749880) - Startdrive guide

### GSD-filer och firmware
- [Sinamics GSD Files](https://support.industry.siemens.com/cs/ww/en/ps/13483/dl) - Nedladdningscenter

### Video-tutorials
- YouTube: "TIA Portal PROFINET configuration"
- YouTube: "Sinamics G120 TIA Portal setup"
- YouTube: "TIA Portal drive commissioning"

::: tip Tips för avancerade användare
Utforska **PROFIdrive-profilen** för avancerad motion control med positionering, hastighetsramper och synkronisering av flera axlar.
:::
