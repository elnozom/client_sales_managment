<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="false"
      :right="$vuetify.rtl"
      :mini-variant="variant"
      fixed
      app
    >
      <v-list class="pt-0">
        <v-list-item class="h-app-bar justify-between logo">
          <img
            src="~/assets/img/logo.png"
            v-if="!variant"
            class="w-medium"
          />
          <img
            src="~/assets/img/icon.png"
            v-else
            class="w-small"
          />
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="$t(item.title)" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="!$vuetify.rtl"
      :clipped-right="$vuetify.rtl"
      class="bg-gredient"
      fixed
      app
    >
      <v-app-bar-nav-icon
        :class="!variant ? 'm-l-sidebar' : 'm-l-sidebar-variant'"
        color="white"
        @click.stop="variant = !variant"
      />
      <!-- <v-toolbar-title v-text="'El Nozom'" /> -->
      <v-spacer />
      <v-icon
        class="pointer"
        color="white"
        @click.prevent="$store.commit('ui/customerModal' , true)"
        left
      >
        mdi-plus
      </v-icon>
      <!-- <v-btn
        tile
        color="primary"
      >
        {{$t('create_order')}}
      </v-btn> -->
      <v-icon
        class="pointer ml-3"
        color="white "
        @click.prevent="switchLanguage"
      >mdi-earth</v-icon>
      <v-icon
        class="pointer mx-3"
        color="white"
        @click.prevent="switchTheme"
      >mdi-weather-night</v-icon>
      <v-icon
        class="pointer"
        color="white"
        @click.prevent="logout"
      >mdi-logout-variant</v-icon>

    </v-app-bar>
    <!-- <div class="breadcrumbs"></div> -->
  </div>
</template>

<script>
import items from '@/utils/Sidebar.js'
import { switchLanguage } from '@/utils/helpers/Global.js'
export default {
  data() {
    return {
      drawer: true,
      variant: false,
      items
    }
  },
  methods: {
    switchTheme() {
      this.$vuetify.theme.dark
        ? localStorage.setItem('mode', 'light')
        : localStorage.setItem('mode', 'dark')
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    switchLanguage() {
      const locale = this.$vuetify.rtl ? 'en' : 'ar'
      switchLanguage(locale, this)
    },
    logout() {
      this.$store.dispatch('myAuth/unReserve').then(() => {
        localStorage.removeItem('auth._token.local')
        localStorage.removeItem('auth._token.local')
        this.$router.push('/login')
      })
    }
  },
  created() {
    if (this.$route.name != 'login') {
      if (this.$auth.user.FixEmpStore != 0) {
        this.items = items.filter((item) => {
          return item.to === '/orders' ? null : item
        })
      } else {
        if (this.$auth.user.SecLevel < 4) {
          this.items = items.filter((item) => {
            return item.to == '/stock' ||  item.to == '/stock_rpt' ? null : item
          })
        }
      }
    }
  }
}
</script>