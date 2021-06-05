const accessService = require('../../axios');

export const state = {
    airports: {},
    airport: {},
    isLoad: false,
    notification: { status: null, message: null },
    isBtnDisabled: false,
    uetdsAirports:[]
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
    setAirports(state, newValue) {
        state.airports = newValue;
    },
    setAirport(state, newValue) {
        state.airport = newValue;
    },
    setUetdsAirports(state, newValue) {
        state.uetdsAirports = newValue;
    },
};

export const actions = {
    async createAirport({ commit }, payload) {
        commit('setBtnDisabled', true);
        console.log("girdi");
        const res = await accessService.default.post("airports", payload);
        console.log(res);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Havalimanı başarı ile kaydedildi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı bir havalimanı giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async updateAirport({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("airports/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Havalimanı başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı bir havalimanı giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async fetchAirports({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("airports?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setAirports', res.data)
        } else {
            commit('setAirports', res.data)
        }
    },

    async fetchAirport({ commit },payload) {
        const res = await accessService.default.get("airports/"+payload);
        if (res.data.success) {
            commit('setAirport', res.data.data)
        } else {
            commit('setAirport', res.data.data)
        }
    },

    async fetchUetdsAirports({ commit }) {
        const res = await accessService.default.get("uetds/airports");
        if (res.data.success) {
            commit('setUetdsAirports', res.data.data)
        } else {
            commit('setUetdsAirports', res.data.data)
        }

        return true
    },
};
