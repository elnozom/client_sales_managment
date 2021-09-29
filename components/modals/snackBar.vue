<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="active"
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
export default {
  data(){
    return {
      active : false,
    }
  },
    computed: {
      snackbar: {
			get: function() {
        const sb = this.$store.getters['ui/snackbar']
        this.active = sb.active
				return sb
			},
			set: function(value) {
				this.$store.commit('ui/setSnackbar',  {active: value,text: ''})
			}}
    },
    methods:{
      close(){
        this.$store.commit('ui/setSnackbar' , {active: false,text: ''})
      }
    }
}
</script>