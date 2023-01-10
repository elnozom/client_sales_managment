import Http from "@/utils/Http.js"

export const state = () => ({
    customer: {},
    posOptions:{}

})

export const getters = {
    customer: state => state.customer,
    posOptions: state => state.posOptions
}

export const mutations = {
    customer(state, payload) {
        state.customer = payload
    },
    posOptions(state, payload) {
        state.posOptions = payload
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
    getStoresQnt({} , payload){
        return new Promise((resolve , reject) => {
            Http.get(`item/balnace/${payload.item}?qnt=${payload.qnt}`)
            .then(res => {
                res.data == null ? resolve([]) : resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
        });
    },
    // getPosOptions({commit}){
    //     return new Promise((resolve , reject) => {
    //         Http.get(`invoice/options`)
    //         .then(res => {
    //             commit("posOptions" , res.data)
    //            resolve(res.data)
    //         })
    //         .catch(err => {
    //             reject(err)
    //         })
    //     });
    // },
}
