
<template>
  <v-dialog
    v-model="active"
    class="balance"
    max-width="900px"
  >
    <v-card class='mt-6'>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
    >
    </v-data-table>
  </v-card>
  </v-dialog>
</template>

<script>

export default {
  name:'productStock',
  data() {
   return {
     headers: [
            { text: this.$t('columns.code'), value: 'StoreCode', align: "center" },
            { text: this.$t('columns.name'), value: 'StoreName', align: "center" },
            { text: this.$t('columns.qnt'), value: 'Raseed', align: "center" },
            { text: this.$t('columns.qntReserved'), value: 'RaseedReserved', align: "center" },
            { text: this.$t('columns.qntNet'), value: 'RaseedNet', align: "center" },
            { text: this.$t('columns.AnQnt'), value: 'AnRaseed', align: "center" },
            { text: this.$t('columns.AnQntReserved'), value: 'AnRaseedReserved', align: "center" },
            { text: this.$t('columns.AnQntNet'), value: 'AnRaseedNet', align: "center" },
        ],
   }
  },
  computed: {
    active: {
      get() {
        return this.$store.state.ui.stockModal
      },
      set(value) {
        this.$store.commit('ui/stockModal', value)
      }
    },
    items:{
        get() {
        return this.$store.getters['datatable/stockItems']
      },
    }
  },
 
 
}
</script>

<style>
.v-data-table-header{
  background: var(--main-gredient) !important;
}
</style>