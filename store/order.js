import Http from "@/utils/Http.js"
export const state = () => ({
    loading: false,
    totals:{
        total : null,
        packages : null
    },
    serial : null
})

export const getters = {
    loading: state => state.loading,
    totals: state => state.totals,
    serial: state => state.serial,
}

export const mutations = {
    loading(state, payload) {
        state.loading = payload
    },
    totals(state, payload) {
        state.totals = payload
    },

    appendTotal(state, payload) {
        state.totals.total = state.totals.total + payload
    },
    appendPackages(state, payload) {
        state.totals.packages = state.totals.packages + payload
    },
    serial(state, payload) {
        state.serial = payload
    },
}

export const actions = {
    create({ commit }, payload) {
        commit('loading', true)
        payload.StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve, reject) => {
            Http.post(`orders`, payload)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        });
    },


    insertItem({ commit }, payload) {
        commit('loading', true)
        payload.StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve, reject) => {
            Http.post(`orders/item`, payload)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }


}
