import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import {
  VAlert,
  VApp,
  VAvatar,
  VBtn,
  VCard,
  VCardText,
  VChip,
  VDivider,
  VForm,
  VIcon,
  VMain,
  VSnackbar,
  VTextField,
} from 'vuetify/components'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const components = {
  VAlert,
  VApp,
  VAvatar,
  VBtn,
  VCard,
  VCardText,
  VChip,
  VDivider,
  VForm,
  VIcon,
  VMain,
  VSnackbar,
  VTextField,
}

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
