# HMI-simulering

TIA Portal innehåller en inbyggd HMI-simulator som låter dig testa operatörspaneler utan fysisk hårdvara. Genom att kombinera PLCSIM med HMI-simulatorn kan du testa hela systemet virtuellt.

## Starta HMI Runtime Simulation

### Från TIA Portal
1. Markera din HMI-enhet i projektträdet
2. Klicka på **Start simulation** i verktygsfältet (eller tryck Ctrl+Shift+X)
3. Simuleringsfönstret öppnas med din HMI-applikation

### Alternativ: Kompilera först
Om du gjort ändringar:
1. Högerklicka på HMI-enheten
2. Välj **Compile > Software (rebuild all)**
3. Starta sedan simulering

## Kombinera med PLCSIM

För fullständig systemtest:

### Steg 1: Starta PLCSIM först
1. Ladda ner PLC-projektet till PLCSIM
2. Sätt PLC:n i RUN-läge
3. Verifiera att programmet körs

### Steg 2: Starta HMI-simulering
1. Starta HMI-simuleringen
2. HMI:n ansluter automatiskt till PLCSIM
3. Kommunikationsstatus visas i statusfältet

### Verifiering av anslutning
I HMI-simuleringen:
- Grönt statusfält = ansluten till PLC
- Rött statusfält = kommunikationsfel
- Varningstriangel = delvis anslutning

## Testa skärmbilder

### Navigation
- Klicka på knappar för att navigera mellan skärmar
- Testa alla navigationslänkar
- Verifiera att rätt skärm visas

### Inmatningsfält
1. Klicka i ett inmatningsfält
2. Ange ett värde med tangentbordet
3. Tryck Enter för att bekräfta
4. Verifiera att värdet uppdateras i PLC:n (via watch table)

### Knappar och styrning
| Testfall | Förväntat resultat |
|----------|-------------------|
| Tryck Startknapp | Motor startar, indikator blir grön |
| Tryck Stoppknapp | Motor stannar, indikator blir grå |
| Ange börvärde | Värde skickas till PLC |
| Kvitteringsknapp | Larm kvitteras |

## Testa dynamiska objekt

### Indikatorer och lampor
Verifiera att lampor ändrar färg korrekt:
1. Tvinga motsvarande variabel i PLCSIM
2. Observera att lampan ändrar utseende
3. Testa alla tillstånd (normal, aktiv, fel)

### Stapeldiagram (Bar graphs)
1. Ändra det analoga värdet i watch table
2. Verifiera att stapeln ändrar höjd
3. Testa min- och max-gränser

### Trender
1. Låt simulering köra en stund
2. Öppna trendskärmen
3. Verifiera att data loggas korrekt
4. Testa zoomfunktioner

## Testa larmsystem

### Generera testlarm
1. I PLCSIM watch table, sätt villkoret för ett larm
2. Verifiera att larmet visas i HMI:ns larmlista
3. Kontrollera att rätt text och prioritet visas

### Kvittera larm
1. Klicka på larmet i larmlistan
2. Tryck kvitteringsknappen
3. Verifiera att larmstatus uppdateras

### Larmhistorik
1. Generera och kvittera några larm
2. Öppna larmhistoriken
3. Verifiera att alla larm loggats med rätt tidsstämpel

## Felsökning av HMI

### Vanliga problem

| Problem | Möjlig orsak | Lösning |
|---------|--------------|---------|
| Inga värden visas | Kommunikationsfel | Kontrollera PLC-anslutning |
| Knapp reagerar inte | Fel taggkoppling | Verifiera tagg i properties |
| Fel färg på indikator | Fel appearance-inställning | Kontrollera animations-settings |
| Navigation fungerar inte | Saknad skärm | Verifiera Screen change-event |

### Aktivera diagnostik
1. Gå till **Runtime settings** i HMI-egenskaperna
2. Aktivera **Diagnostics** (om tillgängligt)
3. Kontrollera diagnostikfönstret för felmeddelanden

## Simulering på dator vs panel

### Skillnader att vara medveten om
| Aspekt | Simulering | Riktig panel |
|--------|------------|--------------|
| Pekskärm | Musklick | Touch |
| Prestanda | Datorns hastighet | Panelens CPU |
| Minne | Obegränsat | Begränsat |
| Script | Full support | Kan variera |

### Begränsningar i simulering
- Extern USB-kommunikation fungerar ej
- Skrivarfunktioner begränsade
- Vissa systemfunktioner ej tillgängliga

## Tips för effektiv HMI-testning

### Checklista för testning
- [ ] Alla skärmbilder kan nås
- [ ] Alla knappar fungerar
- [ ] Inmatningsfält validerar korrekt
- [ ] Indikatorer visar rätt status
- [ ] Larm genereras och visas korrekt
- [ ] Trender visar data
- [ ] Användarnivåer fungerar (om implementerat)

### Dokumentera testresultat
Skapa ett testprotokoll:
```
Datum: 2024-01-15
Testare: [Namn]

Testfall 1: Navigation
- Huvudskärm → Motorskärm: OK
- Motorskärm → Larmskärm: OK
- Tillbaka-knapp: OK

Testfall 2: Motorstyrning
- Start motor 1: OK
- Stopp motor 1: OK
- Hastighetsjustering: OK
```

## Resurser

### Officiell dokumentation
- [TIA Portal V18 Updates](https://support.industry.siemens.com/cs/document/109817218/updates-for-step-7-v18-s7-plcsim-v18-and-wincc-v18) - Uppdateringar inkl. WinCC

## Nästa steg

- [PLCSIM](./plcsim) - PLC-simulering
- [Kommunikationskontroll](./kommunikationskontroll) - Nätverksdiagnostik
