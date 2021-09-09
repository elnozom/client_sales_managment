export const state = () => ({
    isLoading: true,
    customerModal: false,
    snackbar : {
        active: false,
        text: '',
    },
    deleteModal: false

})

export const getters = {
    isLoading: state =>  state.isLoading ,
    customerModal: state =>  state.customerModal,
    deleteModal: state =>  state.deleteModal,
    snackbar : state => state.snackbar,
}

export const mutations = {
    appLoaded(state) {
        state.isLoading = false
    },
    setSnackbar(state , payload){
        state.snackbar = payload
    },
    customerModal(state , payload) {
        state.customerModal = payload
    },

    deleteModal(state, payload) {
        state.deleteModal = payload
    }
}
