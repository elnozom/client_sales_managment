import Http from "@/utils/Http.js"
import { serializeQuery } from '@/utils/helpers/Global.js'
export const state = () => ({
    loading: false,
    items:[],
})

export const getters = {
    loading: state => state.loading,
    items: state => state.items,
}

export const mutations = {
    loading(state, payload) {
        state.loading = payload
    },
    items(state, payload) {
        state.items = payload
    },
}

export const actions = {
    update({ commit }, payload) {
        commit('loading', true)
        return new Promise(() => {
            Http.put(`item/update`, payload)
        });
    },
    get({ commit }, payload) {
        commit('loading', true)
        payload.StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve, reject) => {
            Http.get(`items?${serializeQuery(payload)}`)
                .then(res => {
                    commit('loading', false)
                    commit('items', res.data)
                    resolve(res.data)
                })
                .catch(err => {
                    commit('loading', false)
                    reject(err)
                })
        });
    },

    find({ commit }, payload) {
        commit('loading', true)
        payload.StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve, reject) => {
            Http.get(`item?${serializeQuery(payload)}`)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        });
    }


}
