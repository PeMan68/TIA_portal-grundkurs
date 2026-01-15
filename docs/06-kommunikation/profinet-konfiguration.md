# Profinet-konfiguration i TIA Portal

Profinet-konfiguration i TIA Portal handlar om att skapa ett **IO-system** där din PLC (IO Controller) kommunicerar med enheter (IO Devices) som HMI, frekvensomriktare och fjärr-I/O-moduler.

## Steg-för-steg: Konfigurera Profinet

### 1. Öppna Network view

1. Dubbelklicka på **Device & Networks** i projektträdet
2. Välj **Network view** (eller tryck Ctrl+Shift+N)
3. Här ser du alla enheter och deras nätverksanslutningar

### 2. Konfigurera PLC:ns IP-adress

1. Dubbelklicka på PLC:n → **Device view**
2. Klicka på **Profinet-porten** (grön kontakt)
3. I **Properties** → **Ethernet addresses**:
   - **IP address**: `192.168.0.1`
   - **Subnet mask**: `255.255.255.0`
   - **Use router**: Markera om du har gateway

::: tip Standard IP-schema
| Enhetstyp | IP-intervall |
|-----------|--------------|
| PLC | 192.168.0.1 - 192.168.0.9 |
| HMI | 192.168.0.10 - 192.168.0.19 |
| Drives | 192.168.0.20 - 192.168.0.29 |
| Fjärr-I/O | 192.168.0.30 - 192.168.0.39 |
:::

### 3. Lägg till enheter

#### Från Hardware catalog:

1. Öppna **Hardware catalog** (höger sida)
2. Navigera till önskad enhet, ex:
   - **HMI** → Basic Panels → KTP700 Basic
   - **Distributed I/O** → ET 200SP
   - **Drives** → SINAMICS G120
3. **Dra och släpp** enheten till Network view
4. Konfigurera IP-adress för varje enhet

#### Importera via GSDML:

För tredjepartsenheter eller specifika moduler:

1. **Options** → **Manage general station description files (GSD)**
2. Klicka **Installed GSDs** → **Install**
3. Bläddra till `.xml` eller `.gsdml`-fil
4. Enheten visas nu i Hardware catalog

### 4. Skapa Profinet-anslutningar

1. I **Network view**, håll musen över PLC:ns Profinet-port
2. En **grön pil** visas
3. **Dra** från PLC till enhetens Profinet-port
4. En **grön linje** skapas = IO-relation etablerad

```
    [PLC S7-1200]
         |
    [Profinet Switch]
    /    |    \
[HMI] [G120] [ET200SP]
```

### 5. Tilldela IO Device-namn

Varje IO Device måste ha ett **unikt enhetsnamn** (Device name) som matchar konfigurationen.

1. Markera enheten i Network view
2. **Properties** → **General** → **Name**
3. Ange namn, ex: `hmi-panel-1`, `drive-pump-01`

::: warning Viktigt
Device name är **skiftlägeskänsligt** och måste vara exakt samma som det som tilldelas fysiskt till enheten!
:::

## Tilldela Device name till fysisk enhet

### Metod 1: Via TIA Portal (Online)

1. **Online** → **Accessible devices**
2. Klicka **Update** för att skanna nätverket
3. Markera enheten (identifieras via MAC-adress)
4. Klicka **Assign name** → Ange Device name
5. Klicka **Assign IP address** → Ange IP-konfiguration

### Metod 2: Via Siemens PRONETA

1. Ladda ner **PRONETA Basic** (gratis) från Siemens
2. Kör **Network scan**
3. Högerklicka på enhet → **Assign device name**
4. Använd samma namn som i TIA Portal

## IO-adressering

När du lägger till en IO Device tilldelas automatiskt **I/O-adresser**.

### Kontrollera adresser:

1. Dubbelklicka på enheten → **Device view**
2. Varje modul visar **I address** och **Q address**
3. Dessa används i PLC-programmet

**Exempel för ET 200SP:**
```
DI 8x24V:     I0.0 - I0.7
DO 8x24V:     Q0.0 - Q0.7
AI 4x16bit:   IW64 - IW70
```

### Ändra startadress:

1. Markera modulen i Device view
2. **Properties** → **I/O addresses**
3. Ändra **Start address**

::: tip Adressplanering
Planera I/O-adresser tidigt i projektet. Använd ett konsekvent schema, ex:
- **IB0-IB99**: Lokala I/O på PLC
- **IB100-IB199**: ET 200SP station 1
- **IB200-IB299**: ET 200SP station 2
:::

## Kompilera och ladda ner

### 1. Kompilera hårdvarukonfiguration

1. Högerklicka på PLC → **Compile** → **Hardware (rebuild all)**
2. Kontrollera att inga fel visas
3. Varningar om "Not assigned" kan ignoreras tillfälligt

### 2. Ladda ner till PLC

1. **Online** → **Download to device** → **Hardware configuration**
2. Välj anslutningstyp (Profinet, USB)
3. Klicka **Load**
4. Välj **Start all** om du vill starta modulerna direkt

### 3. Ladda ner till IO Devices

För HMI och vissa IO Devices:
1. Högerklicka på enheten
2. **Download to device** → **Hardware and software**

## Diagnostik och felsökning

### Online-status i TIA Portal

1. Klicka **Go online** (grön pil i toolbar)
2. Enheter visar status med färgkodning:
   - 🟢 **Grön**: OK, kommunicerar
   - 🟡 **Gul**: Varning (ex: diagnostik aktiv)
   - 🔴 **Röd**: Fel (ex: ingen anslutning)

### Diagnostikbuffert

1. **Online** → **Accessible devices**
2. Dubbelklicka på enhet
3. **Diagnostics** → **Diagnostic buffer**
4. Här ser du felhistorik och varningar

### Vanliga Profinet-fel

| Fel | Orsak | Lösning |
|-----|-------|---------|
| **BF LED blinkar** | Fel enhetsnamn | Tilldela korrekt Device name |
| **SF LED lyser** | Systemfel | Kontrollera diagnostikbuffert |
| **Ingen kommunikation** | IP-konflikt | Verifiera IP-adresser |
| **Timeout** | Kabelfel | Kontrollera kablar och switch |

### Profinet-statistik

1. Markera PLC online
2. **Diagnostics** → **Profinet IO** → **IO system**
3. Visa:
   - **Cycle time** (bör vara stabil)
   - **Jitter** (variation, bör vara låg)
   - **Data status** (valid/invalid)

## Resurser

- [Siemens: PROFINET konfiguration (sökresultat)](https://support.industry.siemens.com/cs/products?search=profinet%20configuration%20tia%20portal)
- [PRONETA - Network Analysis Tool](https://support.industry.siemens.com/cs/products?search=proneta)

---
**Relaterat:**
- [Profinet-kommunikation](./profinet.md)
- [HMI-kommunikation](./hmi-kommunikation.md)
- [Frekvensomriktare-kommunikation](./frekvensomriktare-komm.md)
