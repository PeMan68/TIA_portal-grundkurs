# Profinet-kommunikation

**Profinet** (Process Field Net) är Siemens industriella Ethernet-standard för realtidskommunikation mellan PLC, HMI, I/O-moduler och fältenheter som frekvensomriktare. Det är ryggraden i moderna TIA Portal-system.

## Vad är Profinet?

Profinet är en **industriell Ethernet-protokoll** baserad på standard TCP/IP som tillåter:
- ⚡ **Realtidskommunikation** - deterministisk dataöverföring
- 🔌 **Plug & Play** - automatisk enhetsidentifiering
- 🌐 **Ethernet-baserad** - använder standard nätverkskablar (Cat5e/Cat6)
- 🔧 **Flexibel topologi** - linjär, stjärna eller ring

### Profinet vs andra protokoll

| Protokoll | Hastighet | Användning | TIA Portal-stöd |
|-----------|-----------|------------|-----------------|
| **Profinet** | 100 Mbit/s | Moderna system, realtid | ✅ Primärt |
| **Profibus DP** | 12 Mbit/s | Äldre system, fältbuss | ⚠️ Legacy |
| **Ethernet/IP** | 100 Mbit/s | Rockwell/Allen-Bradley | ❌ Ej native |
| **Modbus TCP** | 100 Mbit/s | Öppen standard | ✅ Via FB |

## Profinet-komponenter

### 1. IO Controller (PLC)
Master som **styr** kommunikationen - din S7-1200/1500.

### 2. IO Device
Slav-enheter som **svarar** på IO Controller:
- I/O-moduler (ET 200SP, ET 200MP)
- Frekvensomriktare (Sinamics G120)
- Fjärr-I/O
- Tredjepartsenhe ter

### 3. IO Supervisor
Enheter för **diagnostik och konfiguration** (ex: engineering station, HMI).

## Profinet-adressering

### IP-adresser

Varje Profinet-enhet behöver en **IP-adress** på samma subnät.

**Exempel:**
```
PLC (S7-1200):           192.168.0.1 / 255.255.255.0
HMI (KTP700):            192.168.0.10 / 255.255.255.0
Frekvensomriktare:       192.168.0.20 / 255.255.255.0
ET 200SP I/O:            192.168.0.30 / 255.255.255.0
```

::: tip Subnät
Använd privat subnät (192.168.x.x eller 10.0.x.x) och **planera IP-adresser** från början. Dokumentera alla adresser!
:::

### Device Name

Varje enhet har också ett **unikt enhetsnamn** (ex: `plc-main-01`, `drive-m01`).

**Tilldela device name:**
1. I TIA Portal, markera enheten i **Device view**
2. **Properties** → **Profinet interface**
3. **Device name:** Skriv unikt namn (ingen mellanslag)

## Skapa Profinet-nätverk i TIA Portal

### Steg 1: Konfigurera PLC:ns Profinet-interface

1. Markera din PLC i **Project tree**
2. Öppna **Device configuration**
3. Markera **Profinet interface** (grönt kort)
4. I **Properties**:
   - **IP address:** 192.168.0.1
   - **Subnet mask:** 255.255.255.0
   - **Device name:** `plc-main-01`

### Steg 2: Lägg till Profinet-enheter

**Exempel: Lägg till ET 200SP I/O-modul**

1. Öppna **Hardware catalog** (högerkant i Device view)
2. Sök efter din modul (ex: `ET 200SP`)
3. Dra modulen till **Network view**
4. Konfigurera modulen:
   - IP-adress: 192.168.0.30
   - Device name: `io-station-01`

### Steg 3: Skapa Profinet-anslutning

1. I **Network view**, dra en linje från PLC:ns Profinet-port till I/O-modulens port
2. TIA Portal skapar automatiskt en **Profinet-subnet** (grön linje)
3. Alternativt: Högerklicka PLC → **Assign device** → Välj enhet

### Steg 4: Konfigurera I/O-adresser

När Profinet-enheten är ansluten, visas dess I/O i **Device view**.

**Exempel: ET 200SP med 8DI + 8DQ-modul**
```
Digital inputs:  %I64.0 - %I64.7
Digital outputs: %Q64.0 - %Q64.7
```

Du kan ändra startadress genom att högerklicka modulen → **Properties** → **I/O addresses**.

## Diagnostik och felsökning

### Online-diagnostik

1. Koppla PLC till datorn (Ethernet)
2. Gå **Online** i TIA Portal
3. Öppna **Online & Diagnostics**
4. Välj **Accessible devices** för att se alla Profinet-enheter

### Vanliga problem

#### Problem 1: "Device not found"

**Checklista:**
- ✅ Är kabeln inkopplad korrekt? (grön LED på port)
- ✅ Är IP-adresserna på samma subnät?
- ✅ Har du tilldelat ett device name till enheten?
- ✅ Blockerar brandväggen kommunikationen?

**Lösning:**
Använd **Assign device name** i TIA Portal:
1. Online & Diagnostics → **Assign device name**
2. Välj enhet från listan (MAC-adress visas)
3. Tilldela device name

#### Problem 2: "Communication error"

**Orsaker:**
- Nätverkskabel skadad eller för lång (>100m utan switch)
- IP-konflikt (två enheter med samma IP)
- Fel GSDML-fil (för tredjepartsutrustning)

**Lösning:**
- Testa kabel med **ping** från datorn
- Scanna nätverket för IP-konflikter
- Ladda ner senaste GSDML-fil från tillverkaren

#### Problem 3: Intermittent kommunikation

**Orsaker:**
- Dålig kabel eller connector
- EMI-störning (kablar nära kraftkablar)
- För hög processorbelastning på PLC

**Lösning:**
- Använd skärmad Cat5e/Cat6-kabel
- Separera Profinet-kablar från kraftkablar (>20 cm)
- Optimera PLC-program (undvik längre loopar i OB1)

## Profinet IRT (Isochronous Real-Time)

För **mycket snabba applikationer** (motion control, synkronisering), använd **Profinet IRT**.

### RT vs IRT

| Läge | Cykeltid | Jitter | Användning |
|------|----------|--------|------------|
| **RT (Real-Time)** | ~1-10 ms | ±1 ms | Standard I/O, drives |
| **IRT (Isochronous)** | ~250 µs - 4 ms | <1 µs | Motion control, synkronisering |

**Aktivera IRT:**
1. Device view → Profinet interface → Properties
2. **Real-time settings** → **IRT**
3. Ställ in **Send clock:** (ex: 1 ms)

::: warning IRT-krav
IRT kräver **S7-1500** (inte 1200) och speciella **IRT-capable** switches. Använd endast när extremt hög precision krävs.
:::

## Profinet Topology

### Linjär topologi
Enheter kopplade i serie (daisy-chain).

```
[PLC] ─── [Switch] ─── [I/O] ─── [Drive] ─── [HMI]
```

**Fördelar:**
- ✅ Enkel kabeldragning
- ✅ Mindre kablar

**Nackdelar:**
- ❌ En enhet som fallerar kan bryta kedjan
- ❌ Svårare felsökning

### Stjärntopologi
Alla enheter ansluter till central switch.

```
         [Switch]
        /  |  |  \
      /    |  |    \
  [PLC] [I/O] [Drive] [HMI]
```

**Fördelar:**
- ✅ Enkel felsökning
- ✅ Redundans (en enhet påverkar inte andra)

**Nackdelar:**
- ❌ Mer kabeldragning
- ❌ Kräver industrial switch

### Ring-topologi (MRP)
Profinet MRP (Media Redundancy Protocol) ger redundans.

```
   [PLC]
   /    \
[I/O]   [Drive]
   \    /
  [Switch]
```

**Fördelar:**
- ✅ Hög tillgänglighet (auto-recovery vid kabelbrott)
- ✅ <200 ms återställningstid

**Nackdelar:**
- ❌ Kräver MRP-capable enheter
- ❌ Mer komplex konfiguration

## Best practices

::: tip Rekommendationer
1. **Planera IP-adresser:** Dokumentera alla enheter i Excel/tabell
2. **Använd device names:** Förenklar felsökning
3. **Skärmade kablar:** Cat5e/Cat6 med skärmning för industrimiljö
4. **Industrial switches:** Använd **Scalance X-series** för stora nätverk
5. **Diagnostik:** Aktivera Profinet-diagnostik i alla enheter
6. **Firmware:** Håll all firmware uppdaterad
7. **Dokumentera topologi:** Rita nätverkskarta över fysisk layout
8. **Redundans:** Använd MRP-ring för kritiska system
:::

## Praktiskt exempel: Profinet-system

### System med PLC + HMI + Drive

```
Enhet                 IP-adress         Device name        Funktion
-----------------------------------------------------------------------------
S7-1200 PLC           192.168.0.1       plc-main          IO Controller
KTP700 HMI            192.168.0.10      hmi-panel         Operatörspanel
Sinamics G120         192.168.0.20      drive-m01         Motor 1
ET 200SP I/O          192.168.0.30      io-remote-01      Fjärr-I/O
```

**TIA Portal-konfiguration:**
1. Konfigurera PLC Profinet-interface (192.168.0.1)
2. Lägg till HMI med Profinet-anslutning
3. Lägg till G120 från Hardware catalog (installera GSDML först)
4. Lägg till ET 200SP och montera I/O-moduler
5. Skapa kopplingar i Network view
6. Tilldela device names till alla enheter
7. Ladda ner till PLC och testa kommunikation

## Resurser

- [Siemens: Profinet System Description (PDF)](https://support.industry.siemens.com/cs/document/19289930/profinet-system-description)
- [Video: Profinet Basics and Configuration](https://www.youtube.com/watch?v=lQG8qlnPJY4)
- [Video: Profinet Topology Options](https://www.youtube.com/watch?v=A4eMVuOpNJ0)
- [Nästa: HMI-kommunikation →](./hmi-kommunikation.md)

---
**Relaterat:**
- [Konfiguration av Profinet-enheter](../03-konfiguration/profinet-enheter.md)
- [Frekvensomriktare-kommunikation](./frekvensomriktare-komm.md)
- [HMI-koppling till PLC](../05-taggar/koppling-plc-hmi.md)
