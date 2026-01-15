# Lägg till enheter

Efter att du skapat ett projekt behöver du lägga till hårdvara - PLC, HMI-panel och eventuellt frekvensomriktare. TIA Portal har en omfattande hårdvarukatalog där du väljer exakt de komponenter du ska använda i ditt projekt.

## Öppna hårdvarukatalogen

Det finns två sätt att komma åt hårdvarukatalogen:

### Metod 1: Via Project View
1. Öppna **Project View** (om du är i Portal View)
2. Dubbelklicka på "Add new device" i projektträdet
3. Hårdvarukatalogen öppnas

### Metod 2: Via Network View
1. Dubbelklicka på "Devices & networks" i projektträdet
2. Klicka på "Add new device" i verktygsfältet
3. Eller dra enheter direkt från katalogen (höger sida)

## Lägga till PLC (S7-1200)

### Steg 1: Välj CPU
1. I hårdvarukatalogen, navigera till:
   - **Controllers** → **SIMATIC S7-1200** → **CPU**
2. Välj din CPU-modell (t.ex. "CPU 1214C DC/DC/DC")
   - **DC/DC/DC** = 24V DC matning, 24V DC in/ut
   - **AC/DC/RLY** = 230V AC matning, relay-utgångar
3. Dra CPU:n till nätverksvyn eller dubbelklicka

### Steg 2: CPU-version och firmware
- Välj rätt firmware-version (helst senaste)
- Om du har fysisk PLC: kontrollera vilken firmware den har
- För simulering: välj senaste versionen

### Steg 3: Namnge PLC:n
1. Klicka på PLC:n i nätverksvyn
2. I "Properties" längst ner, ändra namn till något beskrivande
   - Exempel: `PLC_Main`, `Controller_Line1`
3. Tryck Enter för att bekräfta

### Steg 4: Konfigurera IP-adress
1. Markera CPU:ns **Ethernet-port** (grönt portikonens)
2. Under "Properties" → **Ethernet addresses**
3. Ställ in IP-adress:
   - Exempel: `192.168.0.10`
   - Subnet mask: `255.255.255.0`
4. Aktivera "Set IP address in the project"

## Lägga till tilläggsmoduler (SM)

Om du behöver fler in-/utgångar:

1. I hårdvarukatalogen: **Signal modules**
2. Välj typ:
   - **DI** (Digital Input) - För sensorer
   - **DQ** (Digital Output) - För aktuatorer
   - **AI** (Analog Input) - För temperatur, tryck, etc.
   - **AO** (Analog Output) - För styrning 0-10V, 4-20mA
3. Dra modulen till CPU:ns modulplatser (slot 1, 2, 3...)
4. Modulen konfigureras automatiskt

## Lägga till HMI-panel

### Steg 1: Välj HMI
1. I hårdvarukatalogen: **HMI** → **Comfort Panels**
2. Välj storlek och typ:
   - **KTP700 Basic** - 7" pekskärm, grundläggande
   - **TP900 Comfort** - 9" pekskärm, avancerad
   - **MP277** - 10" multitouch
3. Dra HMI:n till nätverksvyn

### Steg 2: Anslut HMI till PLC
1. Klicka på HMI:ns Ethernet-port
2. Dra en linje till PLC:ns Ethernet-port
3. En **grön linje** = anslutningen skapas automatiskt

### Steg 3: Konfigurera HMI IP-adress
1. Markera HMI:ns Ethernet-port
2. Under "Properties" → **Ethernet addresses**
3. Ställ in IP i samma subnet som PLC:
   - Exempel: `192.168.0.20`
   - Subnet mask: `255.255.255.0`

### Steg 4: Skapa HMI-anslutning
1. Markera HMI:n i projektträdet
2. Under **Connections**, dubbelkolla att anslutning till PLC finns
3. Om inte: högerklicka "Connections" → "Add new connection"

## Lägga till frekvensomriktare via Profinet

### Steg 1: Installera GSD-fil
Frekvensomriktare (t.ex. Sinamics G120) kräver en GSD-fil:

1. Ladda ner GSD-filen från Siemens Support Portal
2. I TIA Portal: **Options** → **Install general station description file (GSD)**
3. Välj nedladdad GSD-fil och installera

### Steg 2: Lägg till frekvensomriktare
1. Efter installation finns omriktaren i hårdvarukatalogen:
   - **Other field devices** → **PROFINET IO** → **Drives** → **Sinamics**
2. Välj din modell (t.ex. "G120 CU250S-2 PN")
3. Dra till nätverksvyn

### Steg 3: Anslut till Profinet
1. Dra en linje från frekvensomriktarens port till PLC:ns Profinet-port
2. Omriktaren blir automatiskt en Profinet IO-device under PLC:n

### Steg 4: Konfigurera enhetsnummer och IP
1. Markera frekvensomriktaren
2. **Properties** → **Device number**: Ange unik adress (t.ex. 10)
3. **Properties** → **Ethernet addresses**: Ställ in IP (t.ex. `192.168.0.30`)

### Steg 5: Konfigurera telegramtyp
1. Under frekvensomriktaren: **Device configuration**
2. Välj lämpligt telegram (t.ex. "Standard telegram 1")
3. Detta bestämmer vilka styrord och processdata som överförs

## Översikt: Typisk projektkonfiguration

```
Nätverk: 192.168.0.0/24
├── PLC (CPU 1214C)        → 192.168.0.10
├── HMI (KTP700 Basic)     → 192.168.0.20
└── Frekvensomriktare (G120) → 192.168.0.30
```

## Verifiera hårdvarukonfigurationen

### Kontrollera nätverksvyn
1. Öppna "Devices & networks"
2. Alla enheter ska vara **gröna** (inga röda varningar)
3. Anslutningar ska visas som **gröna linjer**

### Kompilera hårdvaran
1. Högerklicka på PLC:n
2. Välj "Compile" → "Hardware (rebuild all)"
3. Kontrollera att inga fel uppstår i "Info" → **Compile**-fliken

## Vanliga problem och lösningar

❌ **Problem:** "IP address conflict"
✅ **Lösning:** Kontrollera att alla enheter har unika IP-adresser

❌ **Problem:** "Device not found in catalog"
✅ **Lösning:** Installera GSD-fil för enheten

❌ **Problem:** "Cannot connect HMI to PLC"
✅ **Lösning:** Kontrollera att båda enheterna är i samma subnet

## Resurser och dokumentation

### Officiella guider
- [Siemens: Adding devices to TIA Portal](https://support.industry.siemens.com/cs/products?search=tia%20portal%20adding%20devices) - Guider
- [Configuring PROFINET](https://support.industry.siemens.com/cs/document/49948856) - Profinet-konfiguration
- [Siemens: HMI-PLC Connection](https://support.industry.siemens.com/cs/products?search=hmi%20connection%20plc) - HMI-anslutning

### Video-tutorials
- YouTube: "TIA Portal add devices tutorial"
- YouTube: "TIA Portal PROFINET configuration"
- YouTube: "TIA Portal HMI connection setup"

::: tip Nästa steg
Nu när hårdvaran är konfigurerad kan du börja programmera! Se [Grundläggande konfiguration](../03-konfiguration/plc-hardvara.md) för att konfigurera hårdvaruparametrar.
:::
