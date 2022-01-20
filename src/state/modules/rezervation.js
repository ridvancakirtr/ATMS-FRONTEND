const accessService = require('../../axios');

export const state = {
    rezervations: {},
    rezervation: {},
    isLoad: false,
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
    setRezervations(state, newValue) {
        state.rezervations = newValue;
    },
    setRezervation(state, newValue) {
        state.rezervation = newValue;
    }
};

export const actions = {
    async createRezervation({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.post("rezervations", payload);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Rezervasyon başarı ile kaydedildi." })
            commit('setRezervation', res.data)
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        } else {
            commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        }
        commit('setBtnDisabled', false)
    },

    async updateRezervation({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("rezervations/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Rezervasyon başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı araç plakası giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async fetchRezervations({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("rezervations?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setRezervations', res.data)
        } else {
            commit('setRezervations', res.data)
        }

    },

    async fetchRezervation({ commit },payload) {
        const res = await accessService.default.get("rezervations/"+payload);
        if (res.data.success) {
            commit('setRezervation', res.data.data)
        } else {
            commit('setRezervation', res.data.data)
        }
    }
};
