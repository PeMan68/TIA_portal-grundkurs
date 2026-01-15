# Kommunikationskontroll

Felsökning av kommunikation är en viktig färdighet när du arbetar med TIA Portal. Här lär du dig att diagnostisera nätverksproblem och verifiera kommunikation mellan enheter.

## Diagnostikverktyg i TIA Portal

### Online & Diagnostics
Det primära verktyget för kommunikationsdiagnostik:

1. Markera en enhet i projektträdet
2. Klicka på **Go online** (eller Ctrl+Shift+G)
3. Välj **Diagnostics** i det vänstra menyfältet

### Diagnostic status visas med färger
| Färg | Status |
|------|--------|
| Grön | OK - Ingen fel |
| Gul | Varning - Kontrollera |
| Röd | Fel - Åtgärd krävs |
| Grå | Offline/okänd |

## Nätverksöversikt

### Topology View
Visa nätverkstopologin grafiskt:
1. Gå till **Network view** i projektträdet
2. Klicka på **Topology view** i verktygsfältet
3. Enheter visas med deras fysiska kopplingar

### Kontrollera nätverksstatus
I nätverksvyn kan du se:
- IP-adresser för alla enheter
- Kommunikationsstatus (gröna/röda linjer)
- Enhetstyper och firmware-versioner

## Accessible Devices

### Hitta enheter på nätverket
1. Gå till **Online access** i projektvyn
2. Expandera ditt nätverkskort
3. Klicka **Update accessible devices**
4. Alla enheter på nätverket listas

### Blinka enhet
För att identifiera en fysisk enhet:
1. Högerklicka på enheten
2. Välj **Flash LED**
3. LED:en på enheten blinkar

## Diagnostik av PROFINET

### PROFINET-status
Kontrollera PROFINET-kommunikation:
1. Markera PLC:n
2. Gå online
3. Välj **PROFINET interface**
4. Se anslutna enheter och deras status

### Vanliga PROFINET-fel
| Felindikering | Möjlig orsak | Åtgärd |
|---------------|--------------|--------|
| Station not available | Fel IP-adress | Kontrollera IP-konfiguration |
| Configuration mismatch | Fel GSD-fil | Uppdatera GSD eller omkonfigurera |
| Communication timeout | Kabelproblem | Kontrollera kablar/switchar |
| Submodule missing | Modul saknas | Lägg till eller ta bort i konfig |

### Läs ut diagnostikbuffer
1. Gå till **Online & diagnostics**
2. Välj **Diagnostic buffer**
3. Se listan över händelser med tidsstämplar
4. Dubbelklicka för detaljerad information

## Kommunikation med frekvensomriktare

### USS/Modbus-diagnostik
Vid kommunikationsproblem med V20:

1. **Kontrollera baudrate** - Måste matcha på båda sidor
2. **Verifiera adress** - Unik för varje enhet
3. **Kontrollera kabeldragning** - A/B eller +/-

### Timeout-fel
Om kommunikationen bryts:
```
Symptom: Styrord/börvärde uppdateras inte
Kontrollera:
- P2014 (Timeout tid)
- CM1241 kommunikationsport
- Kabelanslutningar
```

## Felsökningsprotokoll

### Steg-för-steg felsökning
1. **Verifiera fysisk anslutning**
   - Kontrollera kablar och kontakter
   - Verifiera LED-status på enheter

2. **Kontrollera IP-inställningar**
   - Alla enheter i samma subnät?
   - Unika IP-adresser?

3. **Testa grundläggande anslutning**
   - Ping från kommandotolken
   - Accessible devices i TIA Portal

4. **Analysera diagnostikbuffer**
   - Tidpunkt för fel
   - Felkod och beskrivning

### Kommandotolkskommandon
```cmd
# Ping en enhet
ping 192.168.0.1

# Visa ARP-tabell
arp -a

# Visa nätverkskonfiguration
ipconfig /all
```

## Watch table för kommunikation

### Övervaka kommunikationsstatus
Skapa en watch table för kommunikationsdiagnostik:

```
Adress              | Beskrivning
--------------------|------------------
%DB100.DBW0         | USS Statusord
%DB100.DBW2         | USS Felkod
%M100.0             | Kommunikation OK
%MD110              | Timeout-räknare
```

### Diagnostikblock
Använd inbyggda diagnostikblock:

| Block | Funktion |
|-------|----------|
| GET_DIAG | Läs diagnostikdata |
| DeviceStates | Status för DP/PN-enheter |
| ModuleStates | Status för moduler |

## Vanliga kommunikationsfel

### Fel: "No connection to PLC"
**Kontrollera:**
1. Rätt nätverksadapter vald i TIA Portal
2. PLC och dator i samma subnät
3. Brandvägg blockerar ej trafik
4. Ethernet-kabel ansluten

### Fel: "Device not accessible"
**Kontrollera:**
1. Enheten påslagen
2. IP-adress konfigurerad
3. Nätverkskabel inkopplad
4. Switch/router fungerar

### Fel: "Configuration mismatch"
**Kontrollera:**
1. Hårdvarukonfiguration matchar verkligheten
2. GSD-filer uppdaterade
3. Ladda ner konfiguration på nytt

## Tips för stabil kommunikation

### Nätverksdesign
- Använd managed switches för PROFINET
- Separera styrnätverk från kontorsnätverk
- Dokumentera IP-adresser noggrant

### Felhantering i program
```pascal
// Exempel: Kommunikationsövervakning
IF NOT "DB_Comm".Connection_OK THEN
    "DB_Alarm".Comm_Fault := TRUE;
    // Sätt säkert tillstånd
    "DB_Motor".Emergency_Stop := TRUE;
END_IF;
```

## Resurser

### Officiell dokumentation
- [TIA Portal Communication Documentation](https://support.industry.siemens.com/cs/document/90940081/tia-portal-an-overview-of-the-most-important-documents-and-links-communication) - Översikt kommunikationsdokumentation
- [S7-1200 System Manual](https://support.industry.siemens.com/cs/document/109759862/simatic-s7-s7-1200-programmable-controller) - Komplett systemmanual inkl. kommunikation

## Nästa steg

- [PLCSIM](./plcsim) - Testa utan hårdvara
- [HMI-simulering](./hmi-simulering) - Testa operatörspaneler
