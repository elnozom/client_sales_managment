<template>
  <v-card>
    <v-card-title class="flex justify-between">
      <div class="right">
        <p class="block">{{$t('customer')}} :{{this.$route.query.customer_name}} / {{this.$route.query.customer_code}} </p>
        <p class="block">{{$t('employee')}} : {{this.$store.state.auth.employee.EmpName}} / {{this.$store.state.auth.employee.EmpCode}}</p>
      </div>
      <div class="middle">
        <p class="block">{{$t('order_number')}} : 1548</p>
        <p class="block">{{$t('date')}} : {{new Date().toISOString().slice(0, 10)}}</p>
      </div>
      <div class="left">
        <v-card>
          <v-card-title class="block">
            <p class="block text-whitte">{{$t('total')}} : EGP{{totals.total}} </p>
            <p class="block text-whitte">{{$t('total_packages')}} : {{totals.packages}}</p>
          </v-card-title>
        </v-card>
      </div>
    </v-card-title>
    <v-card-text>
      <builders-form-builder :opts="formOpts"/>
      <builders-data-table-builder :opts="opts"/>
    </v-card-text>
  </v-card>
</template>

<script>
import DatatableBuilder from '@/utils/builders/DataTableBuilder.js'
import DatatableDirector from '@/utils/directors/DataTableDirector.js'
import FormDirector from '@/utils/directors/FormDirector.js'
import FormBuilder from '@/utils/builders/FormBuilder.js'
import { mapGetters } from 'vuex'
export default {
  watchQuery: ['page'],
  key(route) {
    return route.fullPath
  },
  data() {
    const formOpts = new FormDirector(new FormBuilder()).makeInsertItem()
    const opts = new DatatableDirector(
      new DatatableBuilder(),
      this
    ).makeOrderProducts()
    // // const opts = new DatatableDirector(DatatableBuilder()).makeDocuments()

    return {
      formOpts,
      opts,
      item: ''
    }
  },
  computed: {
    ...mapGetters({
      customer: 'global/customer',
      totals : 'order/totals'
    })
  },
  methods: {
    enter() {
      console.log('enter')
    }
  },
  created(){
    this.$store.dispatch('global/getCustomer' , this.$route.params.customer)
  }
}
</script>