<template>
  <v-dialog
    v-model="active"
    max-width="500px"
  >
    <v-card>
      <v-card-title>{{$t('choose_customer')}}</v-card-title>
      <v-card-text>
        <builders-form-builder :opts="opts"/>
      </v-card-text>
     
    </v-card>
  </v-dialog>
</template>
<script>
import FormDirector from '@/utils/directors/FormDirector.js'
import FormBuilder from '@/utils/builders/FormBuilder.js'
export default {
  data() {
    const opts = new FormDirector(new FormBuilder()).makeCustomer()
    return {
      opts
    }
  },
  computed: {
    active: {
      get() {
        return this.$store.state.ui.customerModal
      },
      set(value) {
        this.$store.commit('ui/customerModal', value)
      }
    }
  },

  methods: {
    close() {
      this.$store.commit('ui/customerModal', false)
    },
    
  }
}
</script>