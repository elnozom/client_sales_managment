<template>
  <v-app>
    <layouts-app-loader v-show="isLoading" />
    <v-main v-show="!isLoading">
      <nuxt />
    </v-main>
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
