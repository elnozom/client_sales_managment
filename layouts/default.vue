<template>
  <v-app
    dark
    class="relative"
  >
    <layouts-app-loader v-show=" isLoading" />
    <layouts-app-nav v-show=" !isLoading" />
    <!-- <layouts-app-bar   v-show=" !isLoading" /> -->
    <v-main v-show=" !isLoading">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <modals-global-customer/>
    <modals-global-product-stock/>
    <modals-snack-bar/>

    <!-- <layouts-app-footer v-show=" !isLoading" /> -->
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { initApp } from '@/utils/helpers/Global.js'
Vue.filter('price', function (value) {
     if (!value) return ''
     return `EGP${value.toFixed(2)}`
  })
export default {
  
  computed: {
    ...mapGetters({
      isLoading: 'ui/isLoading'
    })
  },
  created() {
    initApp(this).then(() => {})
  }
}
</script>
