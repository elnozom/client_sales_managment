export const state = () => ({
    isLoading: true,
    deleteModal: false

})

export const getters = {
    isLoading: state =>  state.isLoading ,

    deleteModal: state =>  state.deleteModal
}

export const mutations = {
    appLoaded(state) {
        state.isLoading = false
    },

    deleteModal(state, payload) {
        state.deleteModal = payload
    }
}
