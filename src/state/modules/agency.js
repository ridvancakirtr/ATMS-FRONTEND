const accessService = require('../../axios');

export const state = {
    agencies: {},
    agency: {},
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
    setAgencies(state, newValue) {
        state.agencies = newValue;
    },
    setAgency(state, newValue) {
        state.agency = newValue;
    }
};

export const actions = {
    async createAgency({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.post("agencies", payload);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Acenta başarı ile kaydedildi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı vergi kimlik numarası giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async updateAgency({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("agencies/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Acenta başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı acenta kimlik numarası giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async fetchAgencies({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("agencies?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setAgencies', res.data)
            
        } else {
            commit('setAgencies', res.data)
        }
        return true
    },

    async fetchAgency({ commit },payload) {
        const res = await accessService.default.get("agencies/"+payload);
        if (res.data.success) {
            commit('setAgency', res.data.data)
        } else {
            commit('setAgency', res.data.data)
        }
    }
};
