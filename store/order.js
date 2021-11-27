import Http from "@/utils/Http.js"
export const state = () => ({
    loading: false,
    totals: {
        TotalCash: null,
        TotalPackages: null
    },
    serial: null
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
    setTotals(state, payload) {
        state.totals = payload
    },
    setTotalsFromResponse(state, res) {
        let totalCash = 0
        let totalPackages = 0
        for (let i = 0; i < res.length; i++) {
            totalCash = totalCash + (res[i].Price * res[i].Qnt)
            totalPackages = totalPackages + res[i].Qnt
        }
        state.totals = {
            TotalCash,
            TotalPackages
        }
    },
    appendTotal(state, payload) {
        state.totals.total = state.totals.total + payload
    },
    // this will be executed when item is deleted and 
    // we want to update the totals after the proced
    deleteFromTotal(state, payload) {
        state.totals.total = state.totals.total - payload
        state.totals.total = state.totals.total - payload
    },
    appendPackages(state, payload) {
        state.totals.packages = state.totals.packages + payload
    },
    serial(state, payload) {
        state.serial = payload
    },
    reset(state) {
        state.totals = {
            total: null,
            packages: null
        }
        state.serial = null
    }
}

export const actions = {
    getOrderNo({ commit }) {
        commit('loading', true)
        const StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve, reject) => {
            Http.get(`orders/no`, { StoreCode })
                .then(res => {
                    resolve(res.data)
                    commit('loading', false)

                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)

                })
        });
    },
    create({ commit, dispatch }, payload) {
        commit('loading', true)
        payload.StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve, reject) => {
            Http.post(`orders`, payload)
                .then(res => {
                    resolve(res.data)
                    commit('serial', res.data.Serial)
                    commit('loading', false)

                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)

                })

        });
    },
    exit({ commit }, payload) {
        commit('loading', true)
        return new Promise((resolve, reject) => {
            Http.post(`orders/exit`, payload)
                .then(res => {
                    resolve(res.data)
                    commit('loading', false)
                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)
                })

        });
    },
    close({ commit, state }, payload) {
        commit('loading', true)
        payload.TotalCash = state.totals.TotalCash
        return new Promise((resolve, reject) => {
            Http.post(`orders/close`, payload)
                .then(res => {
                    commit('datatable/reset', null, { root: true })
                    commit('reset')
                    resolve(res.data)
                    commit('loading', false)
                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)
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
                    const totals = {
                        TotalPackages: res.data.TotalPackages,
                        TotalCash: res.data.TotalCash,
                    }
                    commit('setTotals', totals)
                    commit('loading', false)
                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)
                })
        });
    },
    updateItem({ commit }, payload) {
        commit('loading', true)
        return new Promise((resolve, reject) => {
            Http.put(`orders/item/update`, payload)
                .then(res => {
                    resolve(res.data)
                    commit('setTotals', res.data)
                    commit('datatable/updateOrderItem', payload, { root: true })
                    commit('loading', false)
                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)

                })
        });
    },
    
    updateOrderReserved({ commit }, payload) {
        console.log("asd")
        commit('loading', true)
        return new Promise((resolve, reject) => {
            Http.post(`orders/reserve`, payload)
                .then(res => {
                    resolve(res.data)
                    commit('loading', false)

                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)

                })
        });
    },
    deleteItem({ commit }, payload) {
        commit('loading', true)
        return new Promise((resolve, reject) => {
            Http.post(`orders/item/delete`, payload)
                .then(res => {
                    resolve(res.data)
                    commit('datatable/loading', true, { root: true })
                    commit('datatable/deleteOrderItem', payload.Serial, { root: true })
                    commit('datatable/loading', false, { root: true })
                    commit('setTotals', res.data)
                    commit('loading', false)

                })
                .catch(err => {
                    reject(err)
                    commit('loading', false)
                })
        });
    }
}
