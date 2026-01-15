# HMI-inställningar

En HMI-panel (Human-Machine Interface) är operatörens fönster till din automationslösning. Korrekt konfiguration av HMI:n säkerställer smidig kommunikation med PLC:n och optimal användarupplevelse. Här går vi igenom de grundläggande inställningarna.

## Öppna HMI-konfigurationen

1. I projektträdet, expandera din HMI-panel
2. Dubbelklicka på **Device configuration**
3. Du ser HMI-panelens hårdvarukonfiguration

## Grundläggande inställningar

### Display-inställningar

Markera HMI-panelen och öppna **Properties**:

#### Skärmupplösning och orientering
1. Under **General** → **Display**
2. **Screen orientation:**
   - Landscape (liggande) - standard
   - Portrait (stående) - för vertikala paneler
3. Upplösning är förinställd baserat på panelmodell

#### Bakgrundsbelysning
1. Under **Runtime settings** → **Screens** → **General**
2. **Backlight timing:**
   - Tid innan skärmen dimmas (t.ex. 10 min)
   - Dimningsnivå (20-100%)
   - Användbart för energibesparing
3. **Screen saver:**
   - Aktivera skärmsläckare efter inaktivitet
   - Förhindrar burn-in på skärmen

### Språk och tangentbord

1. Under **Runtime settings** → **Language & Font**
2. **User interface language:** Svenska, Engelska, etc.
3. **Keyboard layout:** Svenska (QWERTY)
4. **Text direction:** Left-to-right (standard)

::: tip Flerspråkighet
TIA Portal stöder flera språk samtidigt! Du kan skapa texter på svenska, engelska och tyska i samma projekt och låta operatören välja.
:::

## Anslutning till PLC

### Skapa/kontrollera connection

HMI:n måste ha en aktiv anslutning till PLC:n:

1. I projektträdet, expandera HMI → **Connections**
2. Du bör se en anslutning till PLC:n (skapas automatiskt vid drag-drop i Network View)
3. Om ingen finns: Högerklicka **Connections** → **Add new connection**

### Konfigurera connection

1. Dubbelklicka på connection
2. **Connection parameters:**
   - **Partner:** Din PLC (ska vara förvald)
   - **Connection type:** S7 connection (standard för S7-1200)
   - **Interface:** PN/IE (PROFINET)
3. **Address details:**
   - Kontrollera att rätt IP-adresser används
   - HMI: `192.168.0.20` → PLC: `192.168.0.10` (exempel)

### Testa anslutningen

1. Gå online med projektet
2. I **Online & Diagnostics** → **Functions** → **Test connection**
3. Välj HMI-anslutning och klicka **Ping**
4. Grön respons = OK, Röd = Problem med nätverk/IP

## Ethernet- och IP-konfiguration

### IP-adress för HMI

1. I Device configuration, markera HMI:ns **Ethernet-port**
2. Under **Properties** → **Ethernet addresses**
3. Konfigurera:
   - **IP address:** `192.168.0.20` (samma subnet som PLC)
   - **Subnet mask:** `255.255.255.0`
   - **Use router:** Endast om routing behövs
   - **Router address:** Gateway (om tillämpligt)

### DHCP eller statisk IP?

| Metod | Fördelar | Användning |
|-------|----------|------------|
| **Statisk IP** | Pålitlig, ingen DHCP-server behövs | Rekommenderas för produktion |
| **DHCP** | Automatisk tilldelning | Test och flexibla installationer |

::: info Rekommendation
Använd **statisk IP** för HMI i produktion. Detta undviker problem med DHCP-lease och säkerställer konsekvent adressering.
:::

## Runtime-inställningar

### Startskärm och uppstart

1. Under **Runtime settings** → **Screens** → **General**
2. **Start screen:** Välj vilken skärm som visas vid uppstart
   - Oftast "Main" eller "Overview"
3. **Login screen:** Aktivera om inloggning krävs

### Larm och händelser

1. Under **Runtime settings** → **Alarms**
2. **Alarm buffering:**
   - Antal larm som sparas (t.ex. 1000)
   - Aktivera "Store alarms persistently" för att behålla vid strömavbrott
3. **Alarm indication:**
   - Ljud vid larm
   - Visuell indikering (blinkande)

### Användaradministration

1. Under **Runtime settings** → **Users**
2. Skapa användargrupper:
   - **Administrators** - Full access
   - **Operators** - Begränsad access
   - **Maintenance** - Diagnostik och inställningar
3. För varje grupp:
   - Definiera behörigheter
   - Sätt lösenord

## Recept och data logging

### Recept (Recipes)

Recept låter operatörer spara och ladda parametrar:

1. Under **Runtime settings** → **Recipes**
2. Aktivera "Enable recipes"
3. Konfigurera:
   - **Storage location:** SD-kort eller intern minne
   - **Number of recipes:** Max antal recept
   - **Data records per recipe:** Antal parametrar

### Data logging (Trends)

För att logga processdata över tid:

1. Under **Runtime settings** → **Data logs**
2. Aktivera "Enable data logs"
3. Konfigurera:
   - **Log interval:** Hur ofta data sparas (1s, 10s, 1min, etc.)
   - **Storage location:** SD-kort rekommenderas
   - **Buffer size:** Minnesanvändning

## Prestanda och minneshantering

### Update cycle

1. Under **Runtime settings** → **Performance**
2. **Screen update cycle:** Hur ofta skärmen uppdateras (standard 1s)
   - Kortare = snabbare respons, högre CPU-belastning
   - Längre = lägre belastning, långsammare respons
3. **Tag update cycle:** Hur ofta taggar läses från PLC (standard 1s)

### Minne och lagring

1. Kontrollera tillgängligt minne:
   - **Online & Diagnostics** → **Memory**
2. För KTP/TP-paneler med begränsat minne:
   - Begränsa antal skärmbilder
   - Använd komprimerade bilder (PNG istället för BMP)
   - Undvik för många animationer

## Säkerhet och backup

### Projektskydd

1. Under **Protection** → **Password**
2. Sätt lösenord för:
   - **Full access** - Alla ändringar
   - **Read-only access** - Endast visa/diagnostik

### Backup till SD-kort

För att automatiskt backupa HMI-projekt:

1. Sätt in SD-kort i HMI-panelen
2. Under **Runtime settings** → **Backup/Restore**
3. Aktivera "Automatic backup to SD card"
4. Välj intervall (dagligen, veckovis, etc.)

## Kompilera och ladda ner HMI

### Kompilera HMI-projekt

1. Högerklicka på HMI i projektträdet
2. Välj **Compile** → **Software (rebuild all)**
3. Kontrollera **Info**-fönstret för fel
4. Åtgärda eventuella fel

### Ladda ner till HMI-panel

1. Anslut PC till HMI via Ethernet
2. Alternativt: Använd USB-kabel (för direktanslutning)
3. **Online** → **Download to device**
4. Välj HMI-panel
5. Markera:
   - ☑ Hardware configuration
   - ☑ Software (screens, scripts, etc.)
6. **Load**
7. HMI startar om automatiskt efter nedladdning

## Diagnostik och felsökning

### Online-diagnostik

1. **Go online** med HMI
2. **Online & Diagnostics** → **General**
3. Status-information:
   - Firmware-version
   - Minnesanvändning
   - Nätverksstatus
   - Anslutningar

### Vanliga problem

❌ **Problem:** HMI kan inte ansluta till PLC
✅ **Lösning:** 
- Kontrollera IP-adresser (samma subnet?)
- Pinga PLC från HMI-diagnostik
- Kontrollera brandvägg på PC

❌ **Problem:** "Memory full"
✅ **Lösning:**
- Ta bort oanvända skärmbilder
- Komprimera bilder
- Öka clearing-intervall för larm

❌ **Problem:** Långsam uppdatering
✅ **Lösning:**
- Öka update cycle-tid
- Reducera antal aktiva taggar
- Använd "Update on change" istället för cyklisk uppdatering

## Best practices

✅ **Strukturera ditt HMI-projekt**
- Skapa en logisk skärmhierarki
- Använd globala skärmmallar (templates)
- Konsekvent färgschema och knapputseende

✅ **Optimera prestanda**
- Använd bara nödvändiga taggar
- Begränsa antal aktiva animationer
- Cachea bilder och grafikelement

✅ **Säkerhet**
- Aktivera användaradministration
- Sätt lösenord på kritiska funktioner
- Logga användaråtgärder

## Resurser och dokumentation

### Officiell dokumentation
- [WinCC Comfort/Advanced System Manual](https://support.industry.siemens.com/cs/document/108716692) - Komplett manual
- [Siemens: HMI-PLC Connection](https://support.industry.siemens.com/cs/products?search=hmi%20connection%20s7-1200) - Anslutningsguider

### Video-tutorials
- YouTube: "TIA Portal HMI configuration"
- YouTube: "WinCC HMI connection setup"
- YouTube: "TIA Portal HMI download"

::: tip Nästa steg
Nu när HMI är konfigurerad, fortsätt med [Frekvensomriktare via Profinet](./frekvensomriktare-profinet.md) för att lära dig styra frekvensomriktare.
:::
