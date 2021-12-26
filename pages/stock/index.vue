
<template>
  <v-row>
    <!-- <layouts-page-header :title="'pages.products'"/> -->
    <v-col class="text-center">
      <builders-data-table-builder :opts="opts" />
      
    </v-col>
  </v-row>
</template>

<script>
import DatatableBuilder from '@/utils/builders/DataTableBuilder.js'
import DatatableDirector from '@/utils/directors/DataTableDirector.js'
export default {
  data() {
    const opts = new DatatableDirector(
      new DatatableBuilder(),
      this
    ).makeStock()
    // // const opts = new DatatableDirector(DatatableBuilder()).makeDocuments()

    return {
      opts
    }
  },
  
}
</script>