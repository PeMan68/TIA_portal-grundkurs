# Globala vs lokala taggar

I TIA Portal använder du **taggar** (variabler) för att lagra data och kommunicera mellan olika delar av programmet. Att förstå skillnaden mellan globala och lokala taggar är avgörande för att strukturera ditt program korrekt.

## Vad är taggar?

Taggar är **symboliska namn** för minnesområden. Istället för `%M0.0` kan du använda `Motor_Start`.

### Fördelar:
- ✅ **Läsbar** kod
- ✅ **Enklare underhåll**
- ✅ **HMI-integration**

## Globala taggar (PLC Tags)

**Tillgängliga överallt** - från alla OB, FB, FC och HMI.

### Användning:
- In/utgångar (`%I`, `%Q`)
- Systemvariabler
- HMI-kommunikation

### Exempel:
| Namn | Typ | Adress | Kommentar |
|------|-----|--------|-----------|
| `Start_Button` | BOOL | %I0.0 | Startknapp |
| `Motor_Output` | BOOL | %Q0.0 | Motorutgång |

## Lokala taggar

**Endast inom ett block** (FB/FC/OB).

### Typer:
- **VAR_INPUT** - Parametrar in
- **VAR_OUTPUT** - Resultat ut  
- **VAR** - Static (FB), behålls mellan anrop
- **VAR_TEMP** - Temporära, nollställs varje cykel

## Jämförelse

| Egenskap | Globala | Lokala |
|----------|---------|--------|
| Synlighet | Hela programmet | Endast inom block |
| HMI-access | Ja | Nej |
| Livslängd | Permanent | Temp/Static |

## Best practices

✅ Använd **PascalCase** eller **Snake_Case**
✅ Tydliga namn: `Emergency_Stop` inte `ES`
❌ Undvik: `m1`, `temp`, `x`

## Resurser

- [S7-1200 Tags Documentation](https://support.industry.siemens.com/cs/document/36932465)
- YouTube: "TIA Portal tags tutorial"

::: tip Nästa steg
Lär dig mer om [Datatyper](./datatyper.md)!
:::