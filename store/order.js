import Http from "@/utils/Http.js"
export const state = () => ({
    loading: false,
    totals: {
        total: null,
        packages: null
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
    totals(state, payload) {
        state.totals = payload
    },
    setTotals(state, payload) {
        state.totals = payload
        console.log(payload)
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
                })
                .catch(err => {
                    reject(err)
                })
        });
    },
    create({ commit, dispatch }, payload) {
        commit('loading', true)
        payload.StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve, reject) => {
            dispatch('getOrderNo').then(res => {
                payload.DocNo = res
                Http.post(`orders`, payload)
                    .then(res => {
                        resolve(res.data)
                        commit('serial', res.data)
                    })
                    .catch(err => {
                        reject(err)
                    })
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
                    const totals = {
                        TotalPackages: res.data.TotalPackages,
                        TotalCash: res.data.TotalCash,
                    }
                    commit('setTotals', totals)
                })
                .catch(err => {
                    reject(err)
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
                })
                .catch(err => {
                    reject(err)
                })
        });
    },
    deleteItem({ commit }, payload) {
        commit('loading', true)
        return new Promise((resolve, reject) => {
            Http.post(`orders/item/delete`, payload)
                .then(res => {
                    resolve(res.data)
                    commit('datatable/loading' , true , {root : true})
                    commit('datatable/deleteOrderItem', payload.Serial, { root: true })
                    commit('datatable/loading' , false , {root : true})
                    commit('setTotals', res.data)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
}
