import colors from 'vuetify/es5/util/colors'
import i18n from './config/i18n'
import ar from 'vuetify/lib/locale/ar'
import en from 'vuetify/lib/locale/en'
// import config from './config'
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,


  env :{
    apiUrl:"http://localhost:8586/api/",
    storeCode:1,
  },
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - client_dashboard',
    title: 'client_dashboard',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/global.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/bus.js',
    { src: '@/plugins/vue-html2pdf', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [

    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    
    ['nuxt-i18n',
      {
        vueI18nLoader: true,
        strategy : 'no_prefix',
        defaultLocale: 'ar',
        locales: [
          {
            code: 'en',
            name: 'الانجليزية'
          },
          {
            code: 'ar',
            name: 'arabic'
          }
        ],
        vueI18n: i18n
      }]
  ],

  server :{
    host: "192.168.1.40",
    port: "3001"
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    rtl : true,
    lang: {
      locales: { ar, en },
      current: 'ar',
    },
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  

  auth: {
    strategies: {
      local: {
        token: {
          property: 'Token',
          required: true,
          type: 'Bearer'
        },
        redirect: {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/'
        },
        user: {
          property: false,
          autoFetch: true
        },
        
        endpoints: {   
          login: { url: `http://localhost:8586/api/login`, method: `post` },
          logout: { url: `http://localhost:8586/api/employee/logout`, method: `post` },
          user: { url: `http://localhost:8586/api/employee`, method: `get` }
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
