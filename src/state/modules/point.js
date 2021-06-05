const accessService = require('../../axios');

export const state = {
    points: {},
    point: {},
    isLoad: false,
    notification: { status: null, message: null },
    isBtnDisabled: false,
    cities:[]
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
    setPoints(state, newValue) {
        state.points = newValue;
    },
    setPoint(state, newValue) {
        state.point = newValue;
    },
    setCities(state, newValue) {
        state.cities = newValue
    },
};

export const actions = {
    async createPoint({ commit }, payload) {
        commit('setBtnDisabled', true);
        console.log("girdi");
        const res = await accessService.default.post("points", payload);
        console.log(res);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Lokasyon başarı ile kaydedildi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı lokasyon giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async updatePoint({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("points/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Konum başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı lokasyon giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async fetchPoints({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("points?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setPoints', res.data)
        } else {
            commit('setPoints', res.data)
        }

    },

    async fetchPoint({ commit },payload) {
        const res = await accessService.default.get("points/"+payload);
        if (res.data.success) {
            commit('setPoint', res.data.data)
        } else {
            commit('setPoint', res.data.data)
        }
    },

    async fetchCities({ commit }) {
        const res = await accessService.default.get("uetds/cities");
        if (res.data.success) {
            commit('setCities', res.data.data)
        } else {
            commit('setCities', res.data.data)
        }

        return true
    },
};
