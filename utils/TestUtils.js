import { createLocalVue } from '@vue/test-utils';
import VueI18n from 'vue-i18n'
import i18n from '~/config/i18n'

import Vuetify from 'vuetify';

export const vuetify = new Vuetify();

// Use a local vue
const localVue = createLocalVue()
localVue.use(VueI18n)

// Create new i18n instance
module.exports = {
  localVue,
  i18n: new VueI18n({
    vueI18nLoader: true,
    strategy : 'no_prefix',
    defaultLocale: 'ar',
    locales: [
      {
        code: 'en',
        name: 'لانجليزية'
      },
      {
        code: 'ar',
        name: 'arabic'
      }
    ],
    vueI18n: i18n
  })
}