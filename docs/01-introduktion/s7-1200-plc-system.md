# Siemens S7-1200 PLC-system

SIMATIC S7-1200 är Siemens kompakta PLC-familj designad för små till medelstora automationslösningar. S7-1200 erbjuder hög prestanda och flexibilitet i ett kostnadseffektivt paket, perfekt för maskinstyrning och processautomation.

## Översikt S7-1200 familjen

### Huvudkomponenter
S7-1200 systemet består av:
- **CPU** - Centralenheten med processor, minne och inbyggda I/O
- **Signal Modules (SM)** - Tilläggsmoduler för digitala och analoga signaler
- **Signal Boards (SB)** - Kompakta moduler som monteras direkt på CPU:n
- **Communication Modules (CM)** - För utökad kommunikation (RS232, RS485, etc.)
- **SIMATIC HMI** - Operatörspaneler för visualisering

### CPU-varianter
S7-1200 finns i flera CPU-varianter:

| CPU | Arbetsminne | Integrerade I/O | Expanderbarhet |
|-----|-------------|-----------------|----------------|
| CPU 1211C | 50 KB | 6 DI / 4 DQ / 2 AI | 3 moduler |
| CPU 1212C | 75 KB | 8 DI / 6 DQ / 2 AI | 8 moduler |
| CPU 1214C | 125 KB | 14 DI / 10 DQ / 2 AI | 8 moduler |
| CPU 1215C | 150 KB | 14 DI / 10 DQ / 2 AI / 2 AO | 8 moduler |
| CPU 1217C | 150 KB | 10 DI / 8 DQ / 2 AI / 2 AO | 8 moduler |

## Tekniska specifikationer

### Prestanda
- **Cykeltid:** Snabb exekvering (typiskt < 0.1 ms för 1000 instruktioner)
- **Kommunikation:** Profinet, Ethernet TCP/IP, Modbus TCP
- **Programminne:** 50-150 KB arbetsminne beroende på CPU
- **Dataminne:** 50-100 KB remanent minne
- **Matningsspänning:** 24V DC eller 85-264V AC (beroende på modell)

### Integrerade funktioner
- **Pulsutgångar** - För stegmotorstyrning och hastighetsreglering (upp till 100 kHz)
- **Höghastighetsingångar** - Räknare och frekvensmätning
- **PID-reglering** - Inbyggda PID-funktioner för processreglering
- **Motion Control** - Grundläggande positionering (med teknologiobjekt)
- **Webbserver** - För diagnostik och övervakning via webbläsare

## Programmeringsmiljö

S7-1200 programmeras i **TIA Portal** med STEP 7 Basic eller Professional:

### Programmeringsspråk
- **LAD (Ladder Diagram)** - Stegdiagram, populärt i industrin
- **FBD (Function Block Diagram)** - Funktionsblockschema
- **SCL (Structured Control Language)** - Textbaserat språk liknande Pascal

### Minnesområden
- **I (Input)** - Ingångssignaler från sensorer
- **Q (Output)** - Utgångssignaler till aktuatorer
- **M (Memory)** - Internminne för mellanresultat
- **DB (Data Blocks)** - Strukturerad datalagring

## Applikationsområden

S7-1200 används i många olika branscher:
- Maskinstyrning och förpackningsmaskiner
- Transportband och material handling
- Byggautomation (HVAC, belysning)
- Vattenrening och processtyrning
- Små produktionslinjer

## Resurser och dokumentation

### Officiella dokument
- [S7-1200 System Manual](https://support.industry.siemens.com/cs/document/36912030/simatic-s7-1200-system-manual?dti=0&lc=en-WW) - Komplett systemdokumentation
- [S7-1200 Easy Book](https://support.industry.siemens.com/cs/document/109476369/getting-started-with-s7-1200?dti=0&lc=en-WW) - Nybörjarguide
- [S7-1200 Programming Guideline](https://support.industry.siemens.com/cs/ww/en/view/90885040) - Best practices för programmering

### Video-tutorials
- Sök på YouTube: "Siemens S7-1200 tutorial" för omfattande videogenomgångar
- [SLIO Academy](https://www.youtube.com/@SiemensIndustry) - Siemens officiella YouTube-kanal

### Katalog och datablad
- [SIMATIC S7-1200 Catalog](https://mall.industry.siemens.com/mall/en/WW/Catalog/Products/10345783) - Produktkatalog med tekniska data

::: tip Tips för nybörjare
Börja med CPU 1214C - den har bra balans mellan pris, prestanda och I/O-kapacitet för de flesta lärandeprojekt.
:::
