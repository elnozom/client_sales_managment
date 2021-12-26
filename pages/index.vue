
<template>
  <v-row>
    <!-- <layouts-page-header :title="'pages.products'"/> -->
    <v-col class="text-center">
      <builders-data-table-builder @update="update" :opts="opts">
        <!-- <template v-slot:default="slotProps">{{slotProps.item}}</template> -->
      </builders-data-table-builder>
      
    </v-col>
  </v-row>
</template>

<script>
import DatatableBuilder from '@/utils/builders/DataTableBuilder.js'
import DatatableDirector from '@/utils/directors/DataTableDirector.js'
import {checkLoggedIn} from '@/utils/helpers/Global.js'
import items from '@/utils/Sidebar.js'

export default {
  name:"produts",
  data() {
    const opts = new DatatableDirector(
      new DatatableBuilder(),
      this
    ).makeProducts()
    // // const opts = new DatatableDirector(DatatableBuilder()).makeDocuments()

    return {
      opts,
      items
    }
  },
  methods:{
    update(payload){
      this.$store.dispatch('item/update' , payload)
    }
  },
  created(){
    checkLoggedIn(this)
    if(this.$auth.user.FixEmpStore != 0){
        this.items = items.filter(item => {
          return item.to === '/orders' ? null : item
          })
          } else {
            this.items = items.filter(item => {
            return item.to == '/stock' ? null : item
          })

        }
  }
}
</script>