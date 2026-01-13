import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TIA Portal Grundkurs',
  description: 'Grundkurs i Siemens TIA Portal v18',
  lang: 'sv-SE',
  
  themeConfig: {
    nav: [
      { text: 'Hem', link: '/' },
      { text: 'Kursöversikt', link: '/oversikt' }
    ],

    sidebar: [
      {
        text: 'Kursöversikt',
        items: [
          { text: 'Översikt', link: '/oversikt' }
        ]
      },
      {
        text: '1. Introduktion',
        collapsed: false,
        items: [
          { text: 'Vad är TIA Portal?', link: '/01-introduktion/vad-ar-tia-portal' },
          { text: 'Siemens S7-1200 PLC-system', link: '/01-introduktion/s7-1200-plc-system' },
          { text: 'Jämförelse med GX Works 2', link: '/01-introduktion/jamforelse-gx-works' }
        ]
      },
      {
        text: '2. Projektstruktur',
        collapsed: true,
        items: [
          { text: 'Skapa nytt projekt', link: '/02-projektstruktur/skapa-projekt' },
          { text: 'Lägg till enheter', link: '/02-projektstruktur/lagg-till-enheter' }
        ]
      },
      {
        text: '3. Grundläggande konfiguration',
        collapsed: true,
        items: [
          { text: 'PLC-hårdvara och nätverk', link: '/03-konfiguration/plc-hardvara' },
          { text: 'HMI-inställningar', link: '/03-konfiguration/hmi-installningar' },
          { text: 'Frekvensomriktare via Profinet', link: '/03-konfiguration/frekvensomriktare-profinet' }
        ]
      },
      {
        text: '4. Programmeringsmiljö',
        collapsed: true,
        items: [
          { text: 'OB, FB, FC – skillnader', link: '/04-programmering/ob-fb-fc' },
          { text: 'Språk: LAD, FBD, SCL', link: '/04-programmering/sprak-lad-fbd-scl' },
          { text: 'Enkla logiska funktioner', link: '/04-programmering/logiska-funktioner' }
        ]
      },
      {
        text: '5. Taggar och datatyper',
        collapsed: true,
        items: [
          { text: 'Globala vs lokala taggar', link: '/05-taggar/globala-lokala' },
          { text: 'Datatyper', link: '/05-taggar/datatyper' },
          { text: 'Koppling PLC ↔ HMI', link: '/05-taggar/koppling-plc-hmi' }
        ]
      },
      {
        text: '6. Kommunikation',
        collapsed: true,
        items: [
          { text: 'Profinet-konfiguration', link: '/06-kommunikation/profinet-konfiguration' },
          { text: 'HMI till PLC', link: '/06-kommunikation/hmi-till-plc' },
          { text: 'PLC till frekvensomriktare', link: '/06-kommunikation/plc-till-frekvensomriktare' }
        ]
      },
      {
        text: '7. HMI-design',
        collapsed: true,
        items: [
          { text: 'Skärmbilder', link: '/07-hmi-design/skarmbilder' },
          { text: 'Knappar och indikatorer', link: '/07-hmi-design/knappar-indikatorer' },
          { text: 'Dynamiska objekt', link: '/07-hmi-design/dynamiska-objekt' }
        ]
      },
      {
        text: '8. Frekvensomriktare',
        collapsed: true,
        items: [
          { text: 'Grundparametrar', link: '/08-frekvensomriktare/grundparametrar' },
          { text: 'Start/stop via PLC', link: '/08-frekvensomriktare/start-stop' },
          { text: 'Hastighetsstyrning', link: '/08-frekvensomriktare/hastighetsstyrning' }
        ]
      },
      {
        text: '9. Test och simulering',
        collapsed: true,
        items: [
          { text: 'PLCSIM', link: '/09-test-simulering/plcsim' },
          { text: 'HMI-simulering', link: '/09-test-simulering/hmi-simulering' },
          { text: 'Kommunikationskontroll', link: '/09-test-simulering/kommunikationskontroll' }
        ]
      },
      {
        text: '10. Projekthantering',
        collapsed: true,
        items: [
          { text: 'Spara och arkivera', link: '/10-projekthantering/spara-arkivera' },
          { text: 'Exportera taggar', link: '/10-projekthantering/exportera-taggar' },
          { text: 'Backup och versioner', link: '/10-projekthantering/backup-versioner' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/tia-kurs' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Sök',
            buttonAriaLabel: 'Sök'
          },
          modal: {
            noResultsText: 'Inga resultat för',
            resetButtonTitle: 'Rensa sökning',
            footer: {
              selectText: 'välj',
              navigateText: 'navigera',
              closeText: 'stäng'
            }
          }
        }
      }
    },

    outline: {
      label: 'På denna sida',
      level: [2, 3]
    },

    docFooter: {
      prev: 'Föregående',
      next: 'Nästa'
    },

    lastUpdated: {
      text: 'Senast uppdaterad'
    }
  }
})
