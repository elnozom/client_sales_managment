<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        sm8
        md4
      > 
      <!-- {{$auth.loggedIn}} -->
      <builders-form-builder :opts="opts">
          <template v-slot:numberInput>
            <span v-if="employee">{{employee.EmpName}}</span>

          </template>
        </builders-form-builder>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import FormDirector from '@/utils/directors/FormDirector.js'
import FormBuilder from '@/utils/builders/FormBuilder.js'
import { mapGetters } from 'vuex'
export default {
  layout: 'auth',
  computed: {
    ...mapGetters({
      employee: 'myAuth/employee'
    })
  },
  data() {
    const opts = new FormDirector(new FormBuilder()).makeLogin()
    return {
      opts
    }
  }
}
</script>
