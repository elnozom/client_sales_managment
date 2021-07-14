<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <builders-form-builder :opts="opts" />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import FormDirector from '@/utils/directors/FormDirector.js'
import FormBuilder from '@/utils/builders/FormBuilder.js'
export default {
   layout:"auth",
  data() {
    const opts = new FormDirector(new FormBuilder()).makeLogin()
    return {
      opts
    }
  }
}
</script>
