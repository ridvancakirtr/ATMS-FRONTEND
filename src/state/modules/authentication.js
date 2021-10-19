const accessService = require('../../axios');
export const state = {
    isLogIn:false,
    loginButonLoader:false
}

export const mutations = {
    IS_LOGIN(state, isLogIn){
        state.isLogIn=isLogIn
    },
    LOGIN_BUTON_LOADER(state, loginButonLoader){
        state.loginButonLoader=loginButonLoader
    }
}

export const actions = {
    async login({commit}, payload) {
        commit('LOGIN_BUTON_LOADER', true);
        const res =  await accessService.default.post("/auth/login", payload);
        if (res.status == 200) {
            if (res.data.success) {
                localStorage.setItem('TOKEN', JSON.stringify(res.data.token));
                localStorage.setItem('LOGGED', true);
                commit('IS_LOGIN', true);
                commit('LOGIN_BUTON_LOADER', false);
                console.log(res.data.token);
                return res.data
            }
        }
    }
}