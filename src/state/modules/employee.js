const accessService = require('../../axios');

export const state = {
    employees: {},
    employee: {},
    isLoad: false,
    notification: { status: null, message: null },
    isBtnDisabled: false,
    countries:[]
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
    setEmployees(state, newValue) {
        state.employees = newValue;
    },
    setEmployee(state, newValue) {
        state.employee = newValue;
    },
    setCountries(state, newValue) {
        state.countries = newValue
    },
};

export const actions = {
    async createVehicle({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.post("vehicles", payload);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Araç başarı ile kaydedildi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı plaka giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async updateEmployee({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("employees/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Personel başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        } else {
            if (res.data.error.code == "11000") {
                commit('setNotification', { status: false, message: "Lütfen farklı bir telefon numarası giriniz." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            } else {
                commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
                setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            }
        }
        commit('setBtnDisabled', false)
    },

    async fetchEmployees({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("employees?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setEmployees', res.data)
        } else {
            commit('setEmployees', res.data)
        }

    },

    async fetchEmployee({ commit },payload) {
        const res = await accessService.default.get("employees/"+payload);
        if (res.data.success) {
            commit('setEmployee', res.data.data)
        } else {
            commit('setEmployee', res.data.data)
        }
    },

    async fetchCountries({ commit }) {
        const res = await accessService.default.get("uetds/countries");
        if (res.data.success) {
            commit('setCountries', res.data.data)
        } else {
            commit('setCountries', res.data.data)
        }

        return true
    },
};
