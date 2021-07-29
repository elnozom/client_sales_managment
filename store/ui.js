export const state = () => ({
    isLoading: true,
    customerModal: false,
    deleteModal: false

})

export const getters = {
    isLoading: state =>  state.isLoading ,
    customerModal: state =>  state.customerModal,
    deleteModal: state =>  state.deleteModal
}

export const mutations = {
    appLoaded(state) {
        state.isLoading = false
    },
    customerModal(state , payload) {
        state.customerModal = payload
    },

    deleteModal(state, payload) {
        state.deleteModal = payload
    }
}
