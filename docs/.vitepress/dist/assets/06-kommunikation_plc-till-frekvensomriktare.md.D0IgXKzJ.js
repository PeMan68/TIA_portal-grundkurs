import{_ as n,c as s,o as t,ag as e}from"./chunks/framework.CMajxlqO.js";const u=JSON.parse('{"title":"PLC till frekvensomriktare","description":"","frontmatter":{},"headers":[],"relativePath":"06-kommunikation/plc-till-frekvensomriktare.md","filePath":"06-kommunikation/plc-till-frekvensomriktare.md","lastUpdated":1768470446000}'),r={name:"06-kommunikation/plc-till-frekvensomriktare.md"};function p(l,a,i,d,o,c){return t(),s("div",null,[...a[0]||(a[0]=[e(`<h1 id="plc-till-frekvensomriktare" tabindex="-1">PLC till frekvensomriktare <a class="header-anchor" href="#plc-till-frekvensomriktare" aria-label="Permalink to &quot;PLC till frekvensomriktare&quot;">​</a></h1><p>Detta avsnitt beskriver hur du styr och övervakar frekvensomriktare (drives) från PLC:n, med fokus på <strong>Profinet-kommunikation</strong> och <strong>telegram-baserad styrning</strong>.</p><h2 id="kommunikationsoversikt" tabindex="-1">Kommunikationsöversikt <a class="header-anchor" href="#kommunikationsoversikt" aria-label="Permalink to &quot;Kommunikationsöversikt&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[PLC S7-1200/1500]</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>   Profinet</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>[SINAMICS G120/V20]</span></span>
<span class="line"><span>       │</span></span>
<span class="line"><span>       ▼</span></span>
<span class="line"><span>   [Motor]</span></span></code></pre></div><p><strong>Dataflöde:</strong></p><ul><li><strong>PLC → Drive</strong>: Styrord (start/stop), börvärde (hastighet)</li><li><strong>Drive → PLC</strong>: Statusord (ready, running, fault), ärvärde (aktuell hastighet)</li></ul><h2 id="profinet-telegram" tabindex="-1">Profinet-telegram <a class="header-anchor" href="#profinet-telegram" aria-label="Permalink to &quot;Profinet-telegram&quot;">​</a></h2><h3 id="vad-ar-ett-telegram" tabindex="-1">Vad är ett telegram? <a class="header-anchor" href="#vad-ar-ett-telegram" aria-label="Permalink to &quot;Vad är ett telegram?&quot;">​</a></h3><p>Ett <strong>telegram</strong> är en standardiserad datastruktur för utbyte mellan PLC och frekvensomriktare. Siemens använder <strong>PROFIdrive</strong>-profilen.</p><h3 id="standard-telegram" tabindex="-1">Standard-telegram <a class="header-anchor" href="#standard-telegram" aria-label="Permalink to &quot;Standard-telegram&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Telegram</th><th>Data</th><th>Användning</th></tr></thead><tbody><tr><td><strong>Telegram 1</strong></td><td>STW/ZSW + Speed</td><td>Enkel hastighetsstyrning</td></tr><tr><td><strong>Telegram 2</strong></td><td>+ Position</td><td>Positionering</td></tr><tr><td><strong>Telegram 3</strong></td><td>+ Encoder</td><td>Servo-applikationer</td></tr><tr><td><strong>Telegram 20</strong></td><td>Basic positioner</td><td>Grundläggande positionering</td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">Rekommendation</p><p>Använd <strong>Telegram 1</strong> för standardapplikationer med hastighetsstyrning.</p></div><h3 id="telegramstruktur-telegram-1" tabindex="-1">Telegramstruktur (Telegram 1) <a class="header-anchor" href="#telegramstruktur-telegram-1" aria-label="Permalink to &quot;Telegramstruktur (Telegram 1)&quot;">​</a></h3><p><strong>Output (PLC → Drive):</strong></p><table tabindex="0"><thead><tr><th>Byte</th><th>Namn</th><th>Beskrivning</th></tr></thead><tbody><tr><td>0-1</td><td><strong>STW1</strong></td><td>Styrord (Control word)</td></tr><tr><td>2-3</td><td><strong>NSOLL_A</strong></td><td>Börvärde hastighet (0-16384 = 0-100%)</td></tr></tbody></table><p><strong>Input (Drive → PLC):</strong></p><table tabindex="0"><thead><tr><th>Byte</th><th>Namn</th><th>Beskrivning</th></tr></thead><tbody><tr><td>0-1</td><td><strong>ZSW1</strong></td><td>Statusord (Status word)</td></tr><tr><td>2-3</td><td><strong>NIST_A</strong></td><td>Ärvärde hastighet (0-16384 = 0-100%)</td></tr></tbody></table><h2 id="styrord-stw1-detaljerad" tabindex="-1">Styrord (STW1) - Detaljerad <a class="header-anchor" href="#styrord-stw1-detaljerad" aria-label="Permalink to &quot;Styrord (STW1) - Detaljerad&quot;">​</a></h2><p>Styrord (Control Word) styr driftläget för frekvensomriktaren.</p><h3 id="bit-struktur" tabindex="-1">Bit-struktur <a class="header-anchor" href="#bit-struktur" aria-label="Permalink to &quot;Bit-struktur&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Bit</th><th>Namn</th><th>Funktion</th></tr></thead><tbody><tr><td>0</td><td>ON/OFF1</td><td>1 = Redo för drift</td></tr><tr><td>1</td><td>OFF2</td><td>1 = Ingen utrullning (0 = utrullning)</td></tr><tr><td>2</td><td>OFF3</td><td>1 = Ingen snabbstopp (0 = snabbstopp)</td></tr><tr><td>3</td><td>Enable</td><td>1 = Pulsera möjlig</td></tr><tr><td>4</td><td>RFG enable</td><td>1 = Börvärde aktivt</td></tr><tr><td>5</td><td>RFG start</td><td>1 = Starta rampen</td></tr><tr><td>6</td><td>Enable setpoint</td><td>1 = Börvärde gäller</td></tr><tr><td>7</td><td>Fault ack</td><td>1 = Kvittera fel (flank)</td></tr><tr><td>10</td><td>Control by PLC</td><td>1 = PLC styr (inte panel)</td></tr></tbody></table><h3 id="typiska-styrvarden" tabindex="-1">Typiska styrvärden <a class="header-anchor" href="#typiska-styrvarden" aria-label="Permalink to &quot;Typiska styrvärden&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Stopp (säkert läge)</span></span>
<span class="line"><span>STW1 := 16#0000;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Redo för start (driver ej)</span></span>
<span class="line"><span>STW1 := 16#047E;  // Bit 1,2,3,4,5,6,10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Kör (driver)</span></span>
<span class="line"><span>STW1 := 16#047F;  // + Bit 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Kvittera fel</span></span>
<span class="line"><span>STW1 := 16#04FE;  // + Bit 7 (puls)</span></span></code></pre></div><h3 id="startsekvens-i-kod" tabindex="-1">Startsekvens i kod <a class="header-anchor" href="#startsekvens-i-kod" aria-label="Permalink to &quot;Startsekvens i kod&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Funktion: Motor_Start</span></span>
<span class="line"><span>// Denna sekvens följer PROFIdrive-standarden</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CASE iStep OF</span></span>
<span class="line"><span>    0:  // Vänta på enable-signal</span></span>
<span class="line"><span>        IF bEnable THEN</span></span>
<span class="line"><span>            iStep := 10;</span></span>
<span class="line"><span>        END_IF;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    10: // Förbered start</span></span>
<span class="line"><span>        wSTW1 := 16#047E;  // Redo, OFF1=0</span></span>
<span class="line"><span>        IF (wZSW1 AND 16#0001) &lt;&gt; 0 THEN  // Ready to switch on</span></span>
<span class="line"><span>            iStep := 20;</span></span>
<span class="line"><span>        END_IF;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    20: // Start motor</span></span>
<span class="line"><span>        wSTW1 := 16#047F;  // ON + Enable</span></span>
<span class="line"><span>        IF (wZSW1 AND 16#0002) &lt;&gt; 0 THEN  // Running</span></span>
<span class="line"><span>            iStep := 30;</span></span>
<span class="line"><span>        END_IF;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    30: // Drift</span></span>
<span class="line"><span>        IF NOT bEnable THEN</span></span>
<span class="line"><span>            iStep := 40;</span></span>
<span class="line"><span>        END_IF;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    40: // Stopp</span></span>
<span class="line"><span>        wSTW1 := 16#047E;  // OFF1</span></span>
<span class="line"><span>        IF (wZSW1 AND 16#0040) &lt;&gt; 0 THEN  // Standstill</span></span>
<span class="line"><span>            iStep := 0;</span></span>
<span class="line"><span>        END_IF;</span></span>
<span class="line"><span>END_CASE;</span></span></code></pre></div><h2 id="statusord-zsw1-detaljerad" tabindex="-1">Statusord (ZSW1) - Detaljerad <a class="header-anchor" href="#statusord-zsw1-detaljerad" aria-label="Permalink to &quot;Statusord (ZSW1) - Detaljerad&quot;">​</a></h2><p>Statusord (Status Word) visar driftsstatus från frekvensomriktaren.</p><h3 id="bit-struktur-1" tabindex="-1">Bit-struktur <a class="header-anchor" href="#bit-struktur-1" aria-label="Permalink to &quot;Bit-struktur&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Bit</th><th>Namn</th><th>Betydelse vid 1</th></tr></thead><tbody><tr><td>0</td><td>Ready to switch on</td><td>Redo för inkoppling</td></tr><tr><td>1</td><td>Ready to operate</td><td>Redo för drift</td></tr><tr><td>2</td><td>Operation enabled</td><td>Drift möjlig</td></tr><tr><td>3</td><td>Fault</td><td>Fel aktivt</td></tr><tr><td>4</td><td>OFF2 active</td><td>Utrullning ej aktiv</td></tr><tr><td>5</td><td>OFF3 active</td><td>Snabbstopp ej aktiv</td></tr><tr><td>6</td><td>Switch on inhibited</td><td>Inkoppling spärrad</td></tr><tr><td>7</td><td>Warning</td><td>Varning aktiv</td></tr><tr><td>10</td><td>Speed reached</td><td>Börvärde nått</td></tr><tr><td>11</td><td>Current limiting</td><td>Strömgräns aktiv</td></tr></tbody></table><h3 id="utvardera-status-i-plc" tabindex="-1">Utvärdera status i PLC <a class="header-anchor" href="#utvardera-status-i-plc" aria-label="Permalink to &quot;Utvärdera status i PLC&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Läs statusbitar</span></span>
<span class="line"><span>bReady     := (wZSW1 AND 16#0001) &lt;&gt; 0;</span></span>
<span class="line"><span>bRunning   := (wZSW1 AND 16#0004) &lt;&gt; 0;</span></span>
<span class="line"><span>bFault     := (wZSW1 AND 16#0008) &lt;&gt; 0;</span></span>
<span class="line"><span>bWarning   := (wZSW1 AND 16#0080) &lt;&gt; 0;</span></span>
<span class="line"><span>bAtSpeed   := (wZSW1 AND 16#0400) &lt;&gt; 0;</span></span></code></pre></div><h2 id="borvarde-och-skalning" tabindex="-1">Börvärde och skalning <a class="header-anchor" href="#borvarde-och-skalning" aria-label="Permalink to &quot;Börvärde och skalning&quot;">​</a></h2><h3 id="hastighet-0-100" tabindex="-1">Hastighet 0-100% <a class="header-anchor" href="#hastighet-0-100" aria-label="Permalink to &quot;Hastighet 0-100%&quot;">​</a></h3><p>PROFIdrive använder <strong>normaliserad skalning</strong>:</p><ul><li><code>0</code> = 0%</li><li><code>16384</code> (0x4000) = 100% av referensfrekvens (p2000)</li></ul><h3 id="berakna-borvarde" tabindex="-1">Beräkna börvärde <a class="header-anchor" href="#berakna-borvarde" aria-label="Permalink to &quot;Beräkna börvärde&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Önskad hastighet i Hz</span></span>
<span class="line"><span>rSetpointHz : REAL := 35.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Referensfrekvens (parameter p2000)</span></span>
<span class="line"><span>rRefFrequency : REAL := 50.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Beräkna telegram-värde</span></span>
<span class="line"><span>iNSOLL := REAL_TO_INT(</span></span>
<span class="line"><span>    (rSetpointHz / rRefFrequency) * 16384.0</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Resultat: 35 Hz = 11469 (70% av 50 Hz)</span></span></code></pre></div><h3 id="berakna-arvarde" tabindex="-1">Beräkna ärvärde <a class="header-anchor" href="#berakna-arvarde" aria-label="Permalink to &quot;Beräkna ärvärde&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Läst värde från telegram</span></span>
<span class="line"><span>iNIST : INT := 8192;  // 50% signal</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Omvandla till Hz</span></span>
<span class="line"><span>rActualHz := (INT_TO_REAL(iNIST) / 16384.0) * rRefFrequency;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Resultat: 25.0 Hz</span></span></code></pre></div><h2 id="praktiskt-exempel-pumpreglering" tabindex="-1">Praktiskt exempel: Pumpreglering <a class="header-anchor" href="#praktiskt-exempel-pumpreglering" aria-label="Permalink to &quot;Praktiskt exempel: Pumpreglering&quot;">​</a></h2><h3 id="datablock" tabindex="-1">Datablock <a class="header-anchor" href="#datablock" aria-label="Permalink to &quot;Datablock&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DATA_BLOCK &quot;Pump_Drive&quot;</span></span>
<span class="line"><span>{ S7_Optimized_Access := &#39;FALSE&#39; }   // Viktigt för telegram-åtkomst</span></span>
<span class="line"><span>VERSION : 0.1</span></span>
<span class="line"><span>STRUCT</span></span>
<span class="line"><span>    // Output till drive (Telegram 1)</span></span>
<span class="line"><span>    STW1 : WORD;           // Styrord</span></span>
<span class="line"><span>    NSOLL_A : INT;         // Börvärde (0-16384)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Input från drive (Telegram 1)</span></span>
<span class="line"><span>    ZSW1 : WORD;           // Statusord</span></span>
<span class="line"><span>    NIST_A : INT;          // Ärvärde (0-16384)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // HMI/Kontroll</span></span>
<span class="line"><span>    Enable : BOOL;</span></span>
<span class="line"><span>    SpeedSetpoint_Pct : REAL;  // 0-100%</span></span>
<span class="line"><span>    SpeedActual_Pct : REAL;    // 0-100%</span></span>
<span class="line"><span>    Running : BOOL;</span></span>
<span class="line"><span>    Fault : BOOL;</span></span>
<span class="line"><span>END_STRUCT;</span></span>
<span class="line"><span>END_DATA_BLOCK</span></span></code></pre></div><h3 id="styrprogram-ob1" tabindex="-1">Styrprogram (OB1) <a class="header-anchor" href="#styrprogram-ob1" aria-label="Permalink to &quot;Styrprogram (OB1)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Skalning börvärde</span></span>
<span class="line"><span>&quot;Pump_Drive&quot;.NSOLL_A := </span></span>
<span class="line"><span>    REAL_TO_INT(&quot;Pump_Drive&quot;.SpeedSetpoint_Pct * 163.84);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Styrning</span></span>
<span class="line"><span>IF &quot;Pump_Drive&quot;.Enable THEN</span></span>
<span class="line"><span>    &quot;Pump_Drive&quot;.STW1 := 16#047F;</span><span>  // Kör</span></span>
<span class="line"><span>ELSE</span></span>
<span class="line"><span>    &quot;Pump_Drive&quot;.STW1 := 16#047E;</span><span>  // Stopp</span></span>
<span class="line"><span>END_IF;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Läs status</span></span>
<span class="line"><span>&quot;Pump_Drive&quot;.Running := </span></span>
<span class="line"><span>    (&quot;Pump_Drive&quot;.ZSW1 AND 16#0004) &lt;&gt; 0;</span></span>
<span class="line"><span>&quot;Pump_Drive&quot;.Fault := </span></span>
<span class="line"><span>    (&quot;Pump_Drive&quot;.ZSW1 AND 16#0008) &lt;&gt; 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Skalning ärvärde</span></span>
<span class="line"><span>&quot;Pump_Drive&quot;.SpeedActual_Pct := </span></span>
<span class="line"><span>    INT_TO_REAL(&quot;Pump_Drive&quot;.NIST_A) / 163.84;</span></span></code></pre></div><h2 id="felsokning" tabindex="-1">Felsökning <a class="header-anchor" href="#felsokning" aria-label="Permalink to &quot;Felsökning&quot;">​</a></h2><h3 id="drive-startar-inte" tabindex="-1">Drive startar inte <a class="header-anchor" href="#drive-startar-inte" aria-label="Permalink to &quot;Drive startar inte&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Problem</th><th>Kontrollera</th><th>Lösning</th></tr></thead><tbody><tr><td>ZSW1.Bit6 = 1</td><td>Switch on inhibited</td><td>Kör startsekvens korrekt</td></tr><tr><td>ZSW1.Bit3 = 1</td><td>Fault</td><td>Kvittera fel med Bit 7</td></tr><tr><td>Ingen data</td><td>Profinet offline</td><td>Kontrollera IO-system</td></tr></tbody></table><h3 id="hastighet-fel" tabindex="-1">Hastighet fel <a class="header-anchor" href="#hastighet-fel" aria-label="Permalink to &quot;Hastighet fel&quot;">​</a></h3><ul><li>Kontrollera <strong>p2000</strong> (referensfrekvens) i driven</li><li>Verifiera skalning (16384 = 100%)</li><li>Kontrollera <strong>p1082</strong> (maxhastighet)</li></ul><h3 id="kommunikationsfel" tabindex="-1">Kommunikationsfel <a class="header-anchor" href="#kommunikationsfel" aria-label="Permalink to &quot;Kommunikationsfel&quot;">​</a></h3><ol><li>Gå online i TIA Portal</li><li><strong>Diagnostics</strong> → <strong>Profinet IO</strong></li><li>Kontrollera <strong>Data status</strong> för driven</li></ol><h2 id="resurser" tabindex="-1">Resurser <a class="header-anchor" href="#resurser" aria-label="Permalink to &quot;Resurser&quot;">​</a></h2><ul><li><a href="https://support.industry.siemens.com/cs/products?search=profidrive" target="_blank" rel="noreferrer">Siemens: PROFIdrive dokumentation</a></li><li><a href="https://support.industry.siemens.com/cs/products?search=sinamics%20telegram" target="_blank" rel="noreferrer">Siemens: SINAMICS Telegram reference</a></li></ul><hr><p><strong>Relaterat:</strong></p><ul><li><a href="./frekvensomriktare-komm.html">Frekvensomriktare-kommunikation (översikt)</a></li><li><a href="./profinet-konfiguration.html">Profinet-konfiguration</a></li><li><a href="./../08-frekvensomriktare/start-stop.html">Start och stopp av drive</a></li></ul>`,56)])])}const g=n(r,[["render",p]]);export{u as __pageData,g as default};
