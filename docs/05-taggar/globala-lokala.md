# Globala vs lokala taggar

I TIA Portal använder du **taggar** (variabler) för att lagra data och kommunicera mellan olika delar av programmet. Att förstå skillnaden mellan globala och lokala taggar är avgörande för att strukturera ditt program korrekt och effektivt.

## Vad är taggar?

Taggar är **symboliska namn** för minnesområden i PLC:n. Istället för att skriva `%M0.0` kan du använda `Motor_Start`, vilket gör koden mer läsbar och lättare att underhålla.

### Fördelar med taggar:
- ✅ **Läsbarhet** - `Temperature_Sensor` är tydligare än `%IW64`
- ✅ **Underhåll** - Ändra adress på ett ställe, uppdateras överallt
- ✅ **Dokumentation** - Automatisk beskrivning av vad variabler gör
- ✅ **HMI-integration** - Samma taggar delas mellan PLC och HMI

## Globala taggar (PLC Tags)

### Vad är globala taggar?

Globala taggar definieras i **PLC tag table** och är tillgängliga **överallt** i programmet - från alla OB, FB, FC och HMI.

### Var hittar du dem?

1. I projektträdet: **PLC tags** → **Default tag table**
2. Du kan skapa flera tag tables för organisation

### Användningsområden

✅ **Använd globala taggar för:**
- In- och utgångar (`%I`, `%Q`) - fysiska sensorer och aktuatorer
- Systemvariabler som delas mellan flera block
- HMI-kommunikation (taggar som visas på operatörspanelen)
- Variabler som flera FB/FC behöver läsa/skriva

### Exempel: Global tag table

| Namn | Datatyp | Adress | Kommentar |
|------|---------|--------|----------|
| `Start_Button` | BOOL | %I0.0 | Startknapp på panelen |
| `Motor_Output` | BOOL | %Q0.0 | Motorutgång |
| `Temperature_Sensor` | INT | %IW64 | Temperaturgivare (0-1000°C) |
| `System_Running` | BOOL | %M0.0 | Systemstatus |
| `Alarm_Active` | BOOL | %M0.1 | Aktivt larm |

### Skapa global tagg

1. Öppna **PLC tags** → **Default tag table**
2. Klicka i en tom rad
3. Fyll i:
   - **Name:** `Motor_Speed_Setpoint`
   - **Data type:** `INT`
   - **Address:** Låt TIA Portal tilldela automatiskt (eller ange manuellt)
   - **Comment:** "Motorhastighet 0-100%"
4. Spara med `Ctrl+S`

## Lokala taggar (Local Tags)

### Vad är lokala taggar?

Lokala taggar definieras **inuti** en FB, FC eller OB och är **endast tillgängliga** inom det blocket. De försvinner när blocket inte körs (för temp-variabler).

### Typer av lokala taggar

#### 1. Input (IN)
Parametrar som **skickas in** till blocket.

```scl
FUNCTION_BLOCK "FB_Motor"
VAR_INPUT
    Start : BOOL;      // Kommer från anropande block
    Speed : INT;       // Önskad hastighet
END_VAR
```

#### 2. Output (OUT)
Resultat som **returneras** från blocket.

```scl
VAR_OUTPUT
    Running : BOOL;    // Motorstatus
    Fault : BOOL;      // Felindikering
END_VAR
```

#### 3. InOut
Parametrar som både läses och skrivas (pass-by-reference).

```scl
VAR_IN_OUT
    Counter : INT;     // Räknare som uppdateras
END_VAR
```

#### 4. Static (FB endast)
Variabler som **beh
