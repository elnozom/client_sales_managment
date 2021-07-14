<template>
  <v-dialog
    v-model="active"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="close"
        >Cancel</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="remove"
        >OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  computed: {
    active: {
      get() {
        return this.$store.state.ui.deleteModal
      },
      set(value) {
        this.$store.commit('ui/setDeleteModal', value)
      }
    }
  },

  methods: {
    close() {
      this.$store.commit('ui/setDeleteModal', false)
    },
    remove() {
      this.$store.dispatch('global/remove', 'inventory/get').then(() => {
        this.$store.commit('ui/setDeleteModal', false)
        this.$store.dispatch('document/findDoc', this.$route.params.doc)
        this.$emit('deleted')
      })
    }
  }
}
</script>