import{_ as n,c as s,o as t,ag as e}from"./chunks/framework.CMajxlqO.js";const u=JSON.parse('{"title":"Datatyper och DB","description":"","frontmatter":{},"headers":[],"relativePath":"05-taggar/datatyper.md","filePath":"05-taggar/datatyper.md","lastUpdated":1768462574000}'),p={name:"05-taggar/datatyper.md"};function r(l,a,i,o,d,c){return t(),s("div",null,[...a[0]||(a[0]=[e(`<h1 id="datatyper-och-db" tabindex="-1">Datatyper och DB <a class="header-anchor" href="#datatyper-och-db" aria-label="Permalink to &quot;Datatyper och DB&quot;">​</a></h1><p>TIA Portal erbjuder ett omfattande system av <strong>datatyper</strong> för att lagra och bearbeta data effektivt. Att förstå rätt datatyp för varje situation är avgörande för minnesoptimering och korrekt programfunktion.</p><h2 id="grundlaggande-datatyper" tabindex="-1">Grundläggande datatyper <a class="header-anchor" href="#grundlaggande-datatyper" aria-label="Permalink to &quot;Grundläggande datatyper&quot;">​</a></h2><h3 id="booleska-typer" tabindex="-1">Booleska typer <a class="header-anchor" href="#booleska-typer" aria-label="Permalink to &quot;Booleska typer&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Datatyp</th><th>Storlek</th><th>Värdeområde</th><th>Användning</th></tr></thead><tbody><tr><td><strong>BOOL</strong></td><td>1 bit</td><td>TRUE / FALSE (1/0)</td><td>Digitala in/utgångar, flaggor</td></tr><tr><td><strong>BYTE</strong></td><td>8 bitar</td><td>16#00 till 16#FF</td><td>Bitmönster, statusord</td></tr><tr><td><strong>WORD</strong></td><td>16 bitar</td><td>16#0000 till 16#FFFF</td><td>Bitmönster, statusregister</td></tr><tr><td><strong>DWORD</strong></td><td>32 bitar</td><td>16#0000_0000 till 16#FFFF_FFFF</td><td>Stora bitmönster</td></tr></tbody></table><p><strong>Exempel:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// BOOL för diskret styrning</span></span>
<span class="line"><span>VAR</span></span>
<span class="line"><span>    Motor_Running : BOOL;</span></span>
<span class="line"><span>    Valve_Open : BOOL;</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// BYTE för statusbyte från frekvensomriktare</span></span>
<span class="line"><span>VAR</span></span>
<span class="line"><span>    Drive_Status : BYTE;  // Bit 0=Ready, Bit 1=Running, etc.</span></span>
<span class="line"><span>END_VAR</span></span></code></pre></div><h3 id="numeriska-typer-heltal" tabindex="-1">Numeriska typer - Heltal <a class="header-anchor" href="#numeriska-typer-heltal" aria-label="Permalink to &quot;Numeriska typer - Heltal&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Datatyp</th><th>Storlek</th><th>Värdeområde</th><th>Användning</th></tr></thead><tbody><tr><td><strong>INT</strong></td><td>16 bit</td><td>-32,768 till 32,767</td><td>Standardräknare, temperaturer</td></tr><tr><td><strong>DINT</strong></td><td>32 bit</td><td>-2,147,483,648 till 2,147,483,647</td><td>Stora värden, millisekunder</td></tr><tr><td><strong>USINT</strong></td><td>8 bit</td><td>0 till 255</td><td>Små positiva tal</td></tr><tr><td><strong>UINT</strong></td><td>16 bit</td><td>0 till 65,535</td><td>Hastigheter, frekvenser</td></tr><tr><td><strong>UDINT</strong></td><td>32 bit</td><td>0 till 4,294,967,295</td><td>Stora positiva tal</td></tr></tbody></table><p><strong>Exempel:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VAR</span></span>
<span class="line"><span>    Temperature : INT := 250;        // 25.0°C (skalat x10)</span></span>
<span class="line"><span>    ProductionCounter : DINT := 0;   // Räknar alla producerade enheter</span></span>
<span class="line"><span>    DriveSpeed : UINT := 1500;       // Varvtal (rpm)</span></span>
<span class="line"><span>END_VAR</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">Minnesoptimering</p><p>Använd <strong>INT</strong> som standard för heltal. Använd endast DINT när värden &gt;32,767 behövs, och USINT/UINT för att spara minne i stora arrayer.</p></div><h3 id="numeriska-typer-flyttal" tabindex="-1">Numeriska typer - Flyttal <a class="header-anchor" href="#numeriska-typer-flyttal" aria-label="Permalink to &quot;Numeriska typer - Flyttal&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Datatyp</th><th>Storlek</th><th>Noggrannhet</th><th>Användning</th></tr></thead><tbody><tr><td><strong>REAL</strong></td><td>32 bit</td><td>~7 decimaler</td><td>Analog mätning, PID-reglering</td></tr><tr><td><strong>LREAL</strong></td><td>64 bit</td><td>~15 decimaler</td><td>Avancerade beräkningar</td></tr></tbody></table><p><strong>Exempel:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VAR</span></span>
<span class="line"><span>    FlowRate : REAL := 45.7;         // m³/h</span></span>
<span class="line"><span>    PressureSetpoint : REAL := 5.5;  // bar</span></span>
<span class="line"><span>    PreciseCalc : LREAL;             // För vetenskapliga beräkningar</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Beräkning med REAL</span></span>
<span class="line"><span>FlowRate := (PressureSetpoint * 8.5) + 12.3;</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">Flyttalsvarning</p><p>REAL och LREAL är <strong>inte exakta</strong> - använd dem inte för monetära beräkningar eller exakta jämförelser. För exakta värden, använd INT med skalning (ex: cent istället för kronor).</p></div><h3 id="tidsdatatyper" tabindex="-1">Tidsdatatyper <a class="header-anchor" href="#tidsdatatyper" aria-label="Permalink to &quot;Tidsdatatyper&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Datatyp</th><th>Storlek</th><th>Format</th><th>Användning</th></tr></thead><tbody><tr><td><strong>TIME</strong></td><td>32 bit</td><td>T#0ms till T#24d20h31m23s647ms</td><td>Tidsintervall, timers</td></tr><tr><td><strong>DATE</strong></td><td>16 bit</td><td>D#1990-01-01 till D#2168-12-31</td><td>Datum</td></tr><tr><td><strong>TIME_OF_DAY</strong> (TOD)</td><td>32 bit</td><td>TOD#00:00:00 till TOD#23:59:59.999</td><td>Klockslag</td></tr><tr><td><strong>DATE_AND_TIME</strong> (DT)</td><td>64 bit</td><td>DT#1990-01-01-00:00:00</td><td>Datum + tid</td></tr></tbody></table><p><strong>Exempel:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VAR</span></span>
<span class="line"><span>    CycleTime : TIME := T#500ms;          // Timer-preset</span></span>
<span class="line"><span>    MaintenanceDate : DATE := D#2024-12-31;</span></span>
<span class="line"><span>    StartTime : TIME_OF_DAY := TOD#08:00:00;</span></span>
<span class="line"><span>    LastAlarm : DATE_AND_TIME;</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Användning i timer</span></span>
<span class="line"><span>#MyTimer(IN := TRUE, PT := CycleTime);</span></span></code></pre></div><h3 id="strangar-strings" tabindex="-1">Strängar (Strings) <a class="header-anchor" href="#strangar-strings" aria-label="Permalink to &quot;Strängar (Strings)&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Datatyp</th><th>Max längd</th><th>Användning</th></tr></thead><tbody><tr><td><strong>STRING</strong></td><td>254 tecken</td><td>HMI-text, meddelanden</td></tr><tr><td><strong>WSTRING</strong></td><td>Unicode-stöd</td><td>Internationella tecken</td></tr><tr><td><strong>CHAR</strong></td><td>1 tecken</td><td>Enskilt tecken</td></tr></tbody></table><p><strong>Exempel:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VAR</span></span>
<span class="line"><span>    AlarmMessage : STRING := &#39;Motor övertemperatur&#39;;</span></span>
<span class="line"><span>    Operator : STRING[20] := &#39;Anna Svensson&#39;;  // Max 20 tecken</span></span>
<span class="line"><span>    StatusCode : CHAR := &#39;A&#39;;</span></span>
<span class="line"><span>END_VAR</span></span></code></pre></div><h2 id="sammansatta-datatyper" tabindex="-1">Sammansatta datatyper <a class="header-anchor" href="#sammansatta-datatyper" aria-label="Permalink to &quot;Sammansatta datatyper&quot;">​</a></h2><h3 id="array-falt" tabindex="-1">ARRAY (Fält) <a class="header-anchor" href="#array-falt" aria-label="Permalink to &quot;ARRAY (Fält)&quot;">​</a></h3><p>Array låter dig lagra <strong>flera värden</strong> av samma typ under ett namn.</p><p><strong>Syntax:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VAR</span></span>
<span class="line"><span>    Temperatures : ARRAY[1..10] OF INT;      // 10 temperaturer</span></span>
<span class="line"><span>    Outputs : ARRAY[0..15] OF BOOL;          // 16 digitala utgångar</span></span>
<span class="line"><span>    Matrix : ARRAY[1..3, 1..4] OF REAL;      // 2D-array (3x4)</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Användning</span></span>
<span class="line"><span>Temperatures[1] := 250;              // Första elementet</span></span>
<span class="line"><span>Temperatures[5] := Temperatures[1] + 10;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FOR i := 1 TO 10 DO</span></span>
<span class="line"><span>    IF Temperatures[i] &gt; 800 THEN</span></span>
<span class="line"><span>        AlarmActive := TRUE;</span></span>
<span class="line"><span>    END_IF;</span></span>
<span class="line"><span>END_FOR;</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">Array-indexering</p><p>TIA Portal använder <strong>1-baserade</strong> arrayer som standard (första elementet är [1], inte [0]). Du kan dock definiera valfri startindex.</p></div><h3 id="struct-struktur" tabindex="-1">STRUCT (Struktur) <a class="header-anchor" href="#struct-struktur" aria-label="Permalink to &quot;STRUCT (Struktur)&quot;">​</a></h3><p>Struct låter dig gruppera <strong>olika datatyper</strong> under ett namn.</p><p><strong>Exempel:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TYPE &quot;Motor_Data&quot;</span></span>
<span class="line"><span>STRUCT</span></span>
<span class="line"><span>    Running : BOOL;</span></span>
<span class="line"><span>    Speed : INT;</span></span>
<span class="line"><span>    Current : REAL;</span></span>
<span class="line"><span>    Temperature : INT;</span></span>
<span class="line"><span>    AlarmCode : WORD;</span></span>
<span class="line"><span>END_STRUCT;</span></span>
<span class="line"><span>END_TYPE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VAR</span></span>
<span class="line"><span>    Motor1 : &quot;Motor_Data&quot;;</span></span>
<span class="line"><span>    Motor2 : &quot;Motor_Data&quot;;</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Användning</span></span>
<span class="line"><span>Motor1.Running := TRUE;</span></span>
<span class="line"><span>Motor1.Speed := 1450;</span></span>
<span class="line"><span>Motor1.Temperature := 650;  // 65.0°C</span></span>
<span class="line"><span></span></span>
<span class="line"><span>IF Motor1.Temperature &gt; 800 THEN</span></span>
<span class="line"><span>    Motor1.Running := FALSE;</span></span>
<span class="line"><span>END_IF;</span></span></code></pre></div><h3 id="udt-user-defined-type" tabindex="-1">UDT (User-Defined Type) <a class="header-anchor" href="#udt-user-defined-type" aria-label="Permalink to &quot;UDT (User-Defined Type)&quot;">​</a></h3><p>UDT är <strong>återanvändbara strukturer</strong> som du definierar en gång och använder på många ställen.</p><p><strong>Skapa UDT:</strong></p><ol><li>Högerklicka <strong>PLC data types</strong> → <strong>Add new data type</strong></li><li>Namn: <code>Motor_Type</code></li><li>Definiera struktur (som STRUCT ovan)</li></ol><p><strong>Fördelar:</strong></p><ul><li>✅ Konsistens - samma struktur överallt</li><li>✅ Underhåll - ändra på ett ställe, uppdateras överallt</li><li>✅ Dokumentation - tydlig datastruktur</li></ul><h2 id="data-blocks-db" tabindex="-1">Data Blocks (DB) <a class="header-anchor" href="#data-blocks-db" aria-label="Permalink to &quot;Data Blocks (DB)&quot;">​</a></h2><p>Data blocks är <strong>minnesblock</strong> för att lagra data permanent.</p><h3 id="typer-av-db" tabindex="-1">Typer av DB <a class="header-anchor" href="#typer-av-db" aria-label="Permalink to &quot;Typer av DB&quot;">​</a></h3><h4 id="_1-global-db" tabindex="-1">1. Global DB <a class="header-anchor" href="#_1-global-db" aria-label="Permalink to &quot;1. Global DB&quot;">​</a></h4><p>Delade data som alla block kan läsa/skriva.</p><p><strong>Skapa Global DB:</strong></p><ol><li>Högerklicka <strong>Program blocks</strong> → <strong>Add new block</strong> → <strong>Data block</strong></li><li>Namn: <code>System_Data</code></li><li>Type: <strong>Global DB</strong></li><li>Lägg till variabler:</li></ol><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DATA_BLOCK &quot;System_Data&quot;</span></span>
<span class="line"><span>{ S7_Optimized_Access := &#39;TRUE&#39; }</span></span>
<span class="line"><span>NON_RETAIN</span></span>
<span class="line"><span>VAR</span></span>
<span class="line"><span>    ProductionCount : DINT := 0;</span></span>
<span class="line"><span>    ShiftNumber : INT := 1;</span></span>
<span class="line"><span>    OperatorName : STRING[30] := &#39;Not logged in&#39;;</span></span>
<span class="line"><span>    LastMaintenance : DATE_AND_TIME;</span></span>
<span class="line"><span>END_VAR</span></span></code></pre></div><p><strong>Användning:</strong></p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Läsa från Global DB</span></span>
<span class="line"><span>#CurrentCount := &quot;System_Data&quot;.ProductionCount;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Skriva till Global DB</span></span>
<span class="line"><span>&quot;System_Data&quot;.ProductionCount := #CurrentCount + 1;</span></span>
<span class="line"><span>&quot;System_Data&quot;.OperatorName := &#39;Anna Svensson&#39;;</span></span></code></pre></div><h4 id="_2-instance-db" tabindex="-1">2. Instance DB <a class="header-anchor" href="#_2-instance-db" aria-label="Permalink to &quot;2. Instance DB&quot;">​</a></h4><p>Automatiskt skapad för varje <strong>FB-instans</strong> - lagrar Static-variabler.</p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// När du skapar FB-instans</span></span>
<span class="line"><span>&quot;Motor1_DB&quot;(</span></span>
<span class="line"><span>    Enable := TRUE,</span></span>
<span class="line"><span>    Speed := 1500</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Instance DB &quot;Motor1_DB&quot; innehåller alla Static-variabler från FB</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">Optimized vs Standard Access</p><ul><li><strong>Optimized:</strong> Modern standard, snabbare, TIA Portal hanterar adresser automatiskt</li><li><strong>Standard:</strong> Äldre, manuell adressering, använd endast för kompatibilitet</li></ul></div><h3 id="retain-variabler" tabindex="-1">RETAIN variabler <a class="header-anchor" href="#retain-variabler" aria-label="Permalink to &quot;RETAIN variabler&quot;">​</a></h3><p>RETAIN betyder att värdet <strong>sparas</strong> även efter strömavbrott.</p><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DATA_BLOCK &quot;Production_Data&quot;</span></span>
<span class="line"><span>NON_RETAIN</span></span>
<span class="line"><span>VAR</span></span>
<span class="line"><span>    TotalCount : DINT := 0;           // NON_RETAIN (raderas vid omstart)</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span>VAR RETAIN</span></span>
<span class="line"><span>    LifetimeCount : DINT := 0;        // RETAIN (sparas vid omstart)</span></span>
<span class="line"><span>    LastStopTime : DATE_AND_TIME;     // RETAIN</span></span>
<span class="line"><span>END_VAR</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">RETAIN-begränsningar</p><p>S7-1200 har begränsat RETAIN-minne (~10 KB). Använd endast för kritiska värden som måste överleva strömavbrott.</p></div><h2 id="datakonvertering" tabindex="-1">Datakonvertering <a class="header-anchor" href="#datakonvertering" aria-label="Permalink to &quot;Datakonvertering&quot;">​</a></h2><h3 id="explicita-konverteringar" tabindex="-1">Explicita konverteringar <a class="header-anchor" href="#explicita-konverteringar" aria-label="Permalink to &quot;Explicita konverteringar&quot;">​</a></h3><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>VAR</span></span>
<span class="line"><span>    IntValue : INT := 100;</span></span>
<span class="line"><span>    RealValue : REAL;</span></span>
<span class="line"><span>    DintValue : DINT;</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// INT → REAL</span></span>
<span class="line"><span>RealValue := INT_TO_REAL(IntValue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// INT → DINT</span></span>
<span class="line"><span>DintValue := INT_TO_DINT(IntValue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// REAL → INT (avrundar)</span></span>
<span class="line"><span>IntValue := REAL_TO_INT(RealValue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// STRING → INT (parse)</span></span>
<span class="line"><span>IntValue := STRING_TO_INT(&#39;1234&#39;);</span></span></code></pre></div><h3 id="vanliga-konverteringsfunktioner" tabindex="-1">Vanliga konverteringsfunktioner <a class="header-anchor" href="#vanliga-konverteringsfunktioner" aria-label="Permalink to &quot;Vanliga konverteringsfunktioner&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Funktion</th><th>Beskrivning</th></tr></thead><tbody><tr><td><code>INT_TO_REAL()</code></td><td>INT → REAL</td></tr><tr><td><code>REAL_TO_INT()</code></td><td>REAL → INT (avrundar)</td></tr><tr><td><code>DINT_TO_REAL()</code></td><td>DINT → REAL</td></tr><tr><td><code>INT_TO_DINT()</code></td><td>INT → DINT</td></tr><tr><td><code>WORD_TO_INT()</code></td><td>WORD → INT (reinterpret)</td></tr><tr><td><code>STRING_TO_INT()</code></td><td>STRING → INT (parse)</td></tr></tbody></table><div class="warning custom-block"><p class="custom-block-title">Överflöde</p><p>Konvertering från större till mindre typ (ex: DINT → INT) kan ge <strong>överflöde</strong> om värdet är för stort. Kontrollera alltid gränser!</p></div><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best practices&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">Rekommendationer</p><ol><li><strong>Välj minsta lämpliga typ:</strong> INT för räknare, BOOL för flaggor</li><li><strong>Använd UDT:</strong> För återkommande strukturer (motorer, ventiler, etc.)</li><li><strong>Global DB för delade data:</strong> Systemvariabler, produktionssiffror</li><li><strong>Instance DB för FB:</strong> Automatisk, en per FB-instans</li><li><strong>RETAIN sparsamt:</strong> Endast kritiska värden</li><li><strong>Kommentera datatyper:</strong> Förklara enheter (°C, bar, rpm, etc.)</li><li><strong>Skalning för REAL:</strong> Använd INT x10 eller x100 för exakthet när möjligt</li></ol></div><h2 id="praktiskt-exempel-temperaturreglering" tabindex="-1">Praktiskt exempel: Temperaturreglering <a class="header-anchor" href="#praktiskt-exempel-temperaturreglering" aria-label="Permalink to &quot;Praktiskt exempel: Temperaturreglering&quot;">​</a></h2><div class="language-scl vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scl</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// UDT för temperaturzon</span></span>
<span class="line"><span>TYPE &quot;Temperature_Zone&quot;</span></span>
<span class="line"><span>STRUCT</span></span>
<span class="line"><span>    SensorValue : INT;           // Råvärde från sensor (0-27648)</span></span>
<span class="line"><span>    ScaledTemp : REAL;           // Skalad temperatur (°C)</span></span>
<span class="line"><span>    Setpoint : REAL;             // Börvärde (°C)</span></span>
<span class="line"><span>    HeaterOutput : REAL;         // Värmeutgång (%)</span></span>
<span class="line"><span>    AlarmHigh : BOOL;</span></span>
<span class="line"><span>    AlarmLow : BOOL;</span></span>
<span class="line"><span>END_STRUCT;</span></span>
<span class="line"><span>END_TYPE</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Global DB med 4 zoner</span></span>
<span class="line"><span>DATA_BLOCK &quot;Temperature_Data&quot;</span></span>
<span class="line"><span>NON_RETAIN</span></span>
<span class="line"><span>VAR</span></span>
<span class="line"><span>    Zone : ARRAY[1..4] OF &quot;Temperature_Zone&quot;;</span></span>
<span class="line"><span>    SystemEnable : BOOL := TRUE;</span></span>
<span class="line"><span>END_VAR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Användning i program</span></span>
<span class="line"><span>&quot;Temperature_Data&quot;.Zone[1].ScaledTemp := </span></span>
<span class="line"><span>    INT_TO_REAL(&quot;Temperature_Data&quot;.Zone[1].SensorValue) * 0.01;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>IF &quot;Temperature_Data&quot;.Zone[1].ScaledTemp &gt; 85.0 THEN</span></span>
<span class="line"><span>    &quot;Temperature_Data&quot;.Zone[1].AlarmHigh := TRUE;</span></span>
<span class="line"><span>END_IF;</span></span></code></pre></div><h2 id="resurser" tabindex="-1">Resurser <a class="header-anchor" href="#resurser" aria-label="Permalink to &quot;Resurser&quot;">​</a></h2><ul><li><a href="https://support.industry.siemens.com/cs/document/109742654/data-types-in-tia-portal" target="_blank" rel="noreferrer">Siemens: Data Types Overview (PDF)</a></li><li><a href="https://www.youtube.com/watch?v=Hk7X3dLPV1k" target="_blank" rel="noreferrer">Video: Working with Data Blocks</a></li><li><a href="https://www.youtube.com/watch?v=8FH4d7pJTQc" target="_blank" rel="noreferrer">Video: Arrays and Structures in SCL</a></li><li><a href="./koppling-plc-hmi.html">Nästa: Koppling PLC↔HMI →</a></li></ul><hr><p><strong>Relaterat:</strong></p><ul><li><a href="./globala-lokala.html">Globala vs lokala taggar</a></li><li><a href="./../04-programmering/sprak-lad-fbd-scl.html">Programmering i SCL</a></li><li><a href="./../07-hmi-design/skarmbilder.html">HMI-design och taggar</a></li></ul>`,74)])])}const h=n(p,[["render",r]]);export{u as __pageData,h as default};
