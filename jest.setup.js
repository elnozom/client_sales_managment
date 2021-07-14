import Vue from 'vue'
import Vuetify from 'vuetify'
import { config } from '@vue/test-utils'
// import VueI18n from 'vue-i18n'
// import i18n from '~/config/i18n'
// Vue.config.silent = true
Vue.use(Vuetify)

Vue.prototype.$t = function (key) {
    return 'asd';
  };
Vue.config.ignoredElements = ['router-link']
// Mock Nuxt components
config.stubs.nuxt = { template: '<div />' }
config.stubs['nuxt-link'] = { template: '<a><slot /></a>' }
config.stubs['no-ssr'] = { template: '<span><slot /></span>' }