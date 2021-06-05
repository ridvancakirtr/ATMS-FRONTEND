const accessService = require('../../axios');

export const state = {
    vehicles: {},
    vehicle: {},
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
    setVehicles(state, newValue) {
        state.vehicles = newValue;
    },
    setVehicle(state, newValue) {
        state.vehicle = newValue;
    }
};

export const actions = {
    async createVehicle({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.post("vehicles", payload);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Personel başarı ile kaydedildi." })
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

    async updateVehicle({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("vehicles/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Araç başarı ile güncellendi." })
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

    async fetchVehicles({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("vehicles?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setVehicles', res.data)
        } else {
            commit('setVehicles', res.data)
        }

    },

    async fetchVehicle({ commit },payload) {
        const res = await accessService.default.get("vehicles/"+payload);
        if (res.data.success) {
            commit('setVehicle', res.data.data)
        } else {
            commit('setVehicle', res.data.data)
        }
    }
};
