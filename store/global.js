import Http from "@/utils/Http.js"

export const state = () => ({
    customer: {},

})

export const getters = {
    customer: state => state.customer,
}

export const mutations = {
    customer(state, payload) {
        state.customer = payload
    },
}

export const actions = {
    getCustomer({ commit }, payload) {
        console.log(payload)
        return new Promise((resolve, reject) => {
            Http.get(`account?Code=${payload}&type=1`)
                .then(res => {
                    resolve(res.data)
                    commit('customer', res.data)
                })
                .catch(err => {
                    reject(err.response.data)
                })
        });

    },
}
