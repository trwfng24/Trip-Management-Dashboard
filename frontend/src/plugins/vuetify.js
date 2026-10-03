import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const vuetify = createVuetify({
  components,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'tripTheme',
    themes: {
      tripTheme: {
        dark: false,
        colors: {
          primary: '#0f766e',
          secondary: '#0f2a43',
          success: '#047857',
        },
      },
    },
  },
})
