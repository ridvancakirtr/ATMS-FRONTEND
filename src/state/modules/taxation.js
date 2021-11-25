const accessService = require('../../axios');

export const state = {
    taxation: {},
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
    setTaxation(state, newValue) {
        state.taxation = newValue
    },
};

export const actions = {
    async updateTaxation({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("settings/taxation/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Vergilendirme başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        }
        commit('setBtnDisabled', false)
    },
    
    async fetchTaxation({ commit }) {
        const res = await accessService.default.get("settings/taxation");
        if (res.data.success) {
            commit('setTaxation', res.data.data)
        } else {
            commit('setTaxation', res.data.data)
        }

        return true
    },
    
};
