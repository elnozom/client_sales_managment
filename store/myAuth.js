import Http from "@/utils/Http.js"

export const state = () => ({
    employee: {},
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
    getEmp({ commit , dispatch }, payload) {
        console.log(payload)
        return new Promise((resolve, reject) => {
            
            Http.get(`employee?EmpCode=${payload.code}`)
                .then(res => {
                    const data = res.data
                    commit('employee', data)
                    console.log(payload)
                    if (data.EmpPassword === payload.password) {
                        commit('loggedIn', true)
                        localStorage.setItem('EmpCode', data.EmpCode)
                    }
                    resolve(data)

                })
                .catch(err => {
                    reject(err.response.data)
                })
        });

    },
    unReserve() {
        return new Promise((resolve) => {
            Http.put(`unreserve`).then(resolve)
        })
    },
    
    login({ commit, state , dispatch }, payload) {
        return new Promise((resolve, reject) => {
            if (state.employee.EmpPassword === payload.password) {
                commit('loggedIn', true)
                localStorage.setItem('EmpCode', state.employee.EmpCode)
                resolve(true)
            }  else if(state.employee != {}) {
                dispatch('getEmp' , payload).then(()=> resolve(true))
            } else {
                const err = 'password_didnt_match'
                commit('err', err)
                reject(err)
            }
            this.unReserve()
        });

    },
    logout({ commit }) {
        this.unReserve()
        return new Promise((resolve) => {
            commit('loggedIn', false)
            commit('employee', {})
            commit('err', '')
            resolve(true)
        });

    },
}
