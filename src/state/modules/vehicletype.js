const accessService = require('../../axios');

export const state = {
    vehicleTypes: {},
    vehicleType: {},
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
    setVehicleTypes(state, newValue) {
        state.vehicleTypes = newValue;
    },
    setVehicleType(state, newValue) {
        state.vehicleType = newValue;
    }
};

export const actions = {
    async createVehicleType({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.post("vehicletypes", payload);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Araç tipi başarı ile kaydedildi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı bir sıra numarası giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async updateVehicleType({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("vehicletypes/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Araç tipi başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı bir sıra numarası giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async fetchVehicleTypes({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("vehicletypes?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setVehicleTypes', res.data)
        } else {
            commit('setVehicleTypes', res.data)
        }
        return true
    },

    async fetchVehicleType({ commit },payload) {
        commit('setisLoadCustomer', false)
        const res = await accessService.default.get("vehicletypes/"+payload);
        if (res.data.success) {
            commit('setisLoadCustomer', true)
            commit('setVehicleType', res.data.data)
        } else {
            commit('setVehicleType', res.data.data)
        }

    }
};
