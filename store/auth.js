import Http from "@/utils/Http.js"

export const state = () => ({
    employee: false,
    loggedIn: false,
    err: ""

})

export const getters = {
    employee: state => state.employee,
    loggedIn: state => state.loggedIn,
    err: state => state.err,
}

export const mutations = {
    employee(state, payload) {
        state.employee = payload
    },
    loggedIn(state, payload) {
        state.loggedIn = payload
    },
    err(state, payload) {
        state.err = payload
    },

}

export const actions = {
    getEmp({ commit }, payload) {
        return new Promise((resolve, reject) => {
            Http.get('employee', payload)
                .then(res => {
                    resolve(res.data)
                    commit('employee', res.data)
                })
                .catch(err => {
                    reject(err.response.data)
                })
        });

    },

    login({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            console.log(state.employee.EmpPassword === payload)
            console.log(payload)
            if (state.employee.EmpPassword === payload) {
                commit('loggedIn', true)
                localStorage.setItem('EmpCode', state.employee.EmpCode)
                resolve(true)
            } else {
                const err = 'password_didnt_match'
                commit('err', err)
                reject(err)
            }
        });

    },
    logout({ commit }) {
        return new Promise((resolve) => {
            commit('loggedIn', false)
            commit('employee', {})
            commit('err', '')
            resolve(true)
        });

    },
}
