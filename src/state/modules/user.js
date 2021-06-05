const accessService = require('../../axios');

export const state = {
    users: {},
    user: {},
    isLoad: false,
    isLoadCustomer: false,
    notification: { status: null, message: null },
    isBtnDisabled: false
};


export const mutations = {
    setNotification(state, newValue) {
        state.notification = newValue
    },
    setBtnDisabled(state, newValue) {
        state.isBtnDisabled = newValue
    },
    setisLoad(state, newValue) {
        state.isLoad = newValue
    },
    setisLoadCustomer(state, newValue) {
        state.isLoad = newValue
    },
    setUsers(state, newValue) {
        state.users = newValue;
    },
    setUser(state, newValue) {
        state.user = newValue;
    }
};

export const actions = {
    async createUser({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.post("users", payload);
        console.log(res);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Kullanıcı başarı ile kaydedildi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı bir eposta adresi giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async updateUser({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("users/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Kullanıcı başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı bir eposta adresi giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async fetchUsers({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("users?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setUsers', res.data)
        } else {
            commit('setUsers', res.data)
        }

    },

    async fetchUser({ commit },payload) {
        commit('setisLoadCustomer', false)
        const res = await accessService.default.get("users/"+payload);
        if (res.data.success) {
            commit('setisLoadCustomer', true)
            commit('setUser', res.data.data)
        } else {
            commit('setUser', res.data.data)
        }

    }
};
