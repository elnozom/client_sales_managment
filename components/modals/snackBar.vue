<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="snackbar.active"
      :timeout="3000"
    >
      {{ $t(snackbar.text) }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="close()"
        >
          {{$t('close')}}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters  } from 'vuex';

export default {
    computed: {
      snackbar: {
			get: function() {
				return this.$store.getters['ui/snackbar']
			},
			set: function(value) {
				this.$store.commit('ui/setSnackbar',  {active: false,text: ''})
			}}
    },
    methods:{
      close(){
        this.$store.commit('ui/setSnackbar' , {active: false,text: ''})
      }
    }
}
</script>