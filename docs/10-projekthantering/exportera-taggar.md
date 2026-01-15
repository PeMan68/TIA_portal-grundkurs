# Exportera taggar

TIA Portal låter dig exportera och importera taggar och andra data till Excel-format. Detta förenklar massredigering och dokumentation.

## Exportera PLC-taggar till Excel

### Steg-för-steg export
1. Öppna **PLC tags** i projektträdet
2. Högerklicka på tagg-tabellen du vill exportera
3. Välj **Export...**
4. Välj filformat (Excel, CSV)
5. Ange filnamn och plats
6. Klicka **Export**

### Exportformat
TIA Portal exporterar till `.xlsx`-format med följande kolumner:

| Kolumn | Beskrivning | Exempel |
|--------|-------------|---------|
| Name | Taggnamn | Motor1_Start |
| Path | Sökväg | Default tag table |
| Data Type | Datatyp | Bool |
| Logical Address | Adress | %M0.0 |
| Comment | Kommentar | Startknapp motor 1 |
| Hmi Visible | Synlig i HMI | TRUE/FALSE |
| Hmi Accessible | Tillgänglig i HMI | TRUE/FALSE |

### Exportera alla tabeller
För att exportera flera tabeller samtidigt:
1. Markera **PLC tags**-mappen
2. Högerklicka > **Export...**
3. Alla tabeller exporteras till samma fil

## Redigera i Excel

### Fördelar med Excel-redigering
- Snabb massredigering av många taggar
- Kopiera/klistra in från andra källor
- Sök och ersätt
- Sortera och filtrera
- Formelberäkningar

### Lägga till nya taggar i Excel
```
Exempel: Skapa 10 motortaggar

Name            | Data Type | Address | Comment
----------------|-----------|---------|------------------
Motor1_Start    | Bool      | %M0.0   | Start motor 1
Motor1_Stop     | Bool      | %M0.1   | Stopp motor 1
Motor1_Running  | Bool      | %M0.2   | Motor 1 kör
Motor2_Start    | Bool      | %M0.3   | Start motor 2
...
```

### Tips för effektiv redigering
- Använd Excel-formler för att generera adresser
- Kopiera format från befintliga taggar
- Behåll kolumnordningen exakt

::: warning Varning
Ändra INTE kolumnrubriker eller format - TIA Portal kräver exakt matchning vid import!
:::

## Importera taggar från Excel

### Steg-för-steg import
1. Öppna tagg-tabellen i TIA Portal
2. Högerklicka > **Import...**
3. Välj Excel-filen
4. Granska förhandsvisning
5. Klicka **Import**

### Importalternativ
| Alternativ | Beskrivning |
|------------|-------------|
| Add tags | Lägg till nya taggar |
| Overwrite | Ersätt befintliga med samma namn |
| Compare | Visa skillnader innan import |

### Hantera importfel
Vanliga fel vid import:
- **Duplicate name**: Taggnamn finns redan
- **Invalid data type**: Datatypen stöds ej
- **Address conflict**: Adressen används redan

## Exportera datablock

### DB till Excel
Datablocks exporteras separat:
1. Högerklicka på datablocket
2. Välj **Generate source from blocks**
3. Väljer `.db`-format (textbaserat)

Alternativt för tabelldata:
1. Öppna datablocket
2. Markera data du vill exportera
3. Kopiera (Ctrl+C)
4. Klistra in i Excel

## Exportera HMI-taggar

### HMI Tags
HMI-taggar exporteras på liknande sätt:
1. Öppna HMI-enheten > **HMI tags**
2. Högerklicka > **Export...**
3. Välj filformat och plats

### HMI-specifika fält
HMI-export inkluderar extra kolumner:
- Acquisition cycle (uppdateringsintervall)
- Connection (PLC-anslutning)
- PLC tag (kopplad PLC-tagg)

## Praktiska användningsområden

### 1. Dokumentation
Exportera taggar för att skapa dokumentation:
- Inkludera i teknisk rapport
- Dela med kund eller kollega
- Arkivera för framtida referens

### 2. Massändring
Ändra många taggar effektivt:
```
Scenario: Byt prefix på 100 taggar från "M1_" till "Motor1_"

1. Exportera taggar
2. I Excel: Sök/Ersätt "M1_" → "Motor1_"
3. Importera tillbaka
```

### 3. Kopiera mellan projekt
Återanvänd taggar i nya projekt:
1. Exportera från källprojekt
2. Redigera vid behov
3. Importera till nytt projekt

### 4. Generera från PLC-lista
Om du har en I/O-lista från konstruktion:
1. Formatera listan enligt TIA-export-format
2. Importera direkt till projektet
3. Spara timmar av manuellt arbete

## Exportera andra objekt

### Textuella källor
Programblock kan exporteras som text:
1. Markera block
2. **External source files > Generate source from blocks**
3. Redigera i valfri texteditor
4. Importera tillbaka

### Cross-reference
Exportera korshänvisningar:
1. Öppna Cross-reference-vyn
2. Markera all information
3. Kopiera till Excel

## Tips och tricks

### Skapa mall-fil
1. Exportera en tom eller minimal taggkonfiguration
2. Spara som mall
3. Använd som utgångspunkt för nya projekt

### Validera innan import
```
Kontrollera i Excel innan import:
□ Inga tomma rader
□ Inga duplicerade namn
□ Adresser i rätt format (%M0.0, %Q0.1, etc.)
□ Datatyper matchar (Bool, Int, Real, etc.)
□ Inga specialtecken i namn
```

### Automatisera med VBA
För återkommande uppgifter, skapa Excel-makro:
```vba
Sub FormatagTIA()
    ' Generera sekventiella adresser
    Dim i As Integer
    For i = 1 To 100
        Cells(i + 1, 4).Value = "%M" & (i \ 8) & "." & (i Mod 8)
    Next i
End Sub
```

## Resurser

### Officiell dokumentation
- [TIA Portal V18 Updates](https://support.industry.siemens.com/cs/document/109817218/updates-for-step-7-v18-s7-plcsim-v18-and-wincc-v18) - Import/export-funktioner

## Nästa steg

- [Spara och arkivera](./spara-arkivera) - Projekthantering
- [Backup och versioner](./backup-versioner) - Säkerhetskopiering
