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
import { initApp } from '@/utils/helpers/Global.js'
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
