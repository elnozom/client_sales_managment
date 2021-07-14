
<template>
  <v-row>
    <!-- <layouts-page-header :title="'pages.products'"/> -->
    <v-col class="text-center">
      <builders-data-table-builder :opts="opts">
        <!-- <template v-slot:default="slotProps">{{slotProps.item}}</template> -->
      </builders-data-table-builder>
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
    ).makeProducts()
    // // const opts = new DatatableDirector(DatatableBuilder()).makeDocuments()

    return {
      opts
    }
  }
}
</script>