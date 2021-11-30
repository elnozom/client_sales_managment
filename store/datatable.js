
import Http from "@/utils/Http.js"
import {serializeQuery} from '@/utils/helpers/Global.js'
export const state = () => ({
    stockItems: [],
    stockLoading: false,
    orderItemsDatatable: {
        items: [],
        loading: false,
        search: '',
    }
})

export const getters = {
    orderItemsDatatable: state => state.orderItemsDatatable,
    stockItems: state => state.stockItems,
    stockLoading: state => state.stockLoading,
}

export const mutations = {
    stockItems(state, payload) {
        state.stockItems = payload
    },
    stockLoading(state, payload) {
        state.stockLoading = payload
    },
    orderItemsDatatableItems(state, payload) {
        state.orderItemsDatatable.items = payload
    },
    orderItemsLoading(state, payload) {
        state.orderItemsDatatable.loading = payload
    },
    prependOrderItemsDatatable(state, payload) {
        state.orderItemsDatatable.items.unshift(payload)
    },

    updateOrderItem(state, payload) {
        for(let item in state.orderItemsDatatable.items){
            const current = state.orderItemsDatatable.items[[item]]
            if(current.Serial == payload.Serial){
                current.Qnt = payload.Qnt
                current.Price = payload.Price
                current.Total = current.Price * current.Qnt
                break
            }
        }
    },
    deleteOrderItem(state, payload) {
        for (let i = 0; i < state.orderItemsDatatable.items.length; i++) {
            const current = state.orderItemsDatatable.items[i];
            if(current.Serial == payload){
                state.orderItemsDatatable.items.splice(i , 1)
                break
            }
        }
    },
    reset(state) {
        state.orderItemsDatatable = {
            items: [],
            loading: false,
            search: '',
        }
    },
}

export const actions = {
    
    getOrderItems({commit , dispatch} , payload){
        commit('orderItemsLoading' , true)
        payload.StoreCode = parseInt(localStorage.getItem('store'))
        return new Promise((resolve , reject) => {
            Http.get(`orders/items?${serializeQuery(payload)}`)
            .then(res => {
                commit('orderItemsDatatableItems' , res.data.Items)
                commit('orderItemsLoading' , false)
                commit('order/setTotals' ,res.data.Totals , {root:true})
                resolve(res.data)
            })
            .catch(err => {
                commit('orderItemsLoading' , false)
                reject(err)
            })
        });
    },
    // stockItems,stockLoading
    getStock({commit} , serial){
        commit('stockLoading' , true)
        return new Promise((resolve , reject) => {
            Http.get(`item/balnace/${serial}`)
            .then(res => {
                commit('stockItems' , res.data)
                commit('stockLoading' , false)
                resolve(res.data)
            })
            .catch(err => {
                commit('stockLoading' , false)
                reject(err)
            })
        });
    },


   
}
