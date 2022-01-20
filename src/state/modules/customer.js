const accessService = require('../../axios');

export const state = {
    customers: {},
    customer: {},
    isLoad: false,
    isLoadCustomer: false,
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
    setisLoadCustomer(state, newValue) {
        state.isLoad = newValue
    },
    setCustomers(state, newValue) {
        state.customers = newValue;
    },
    setCustomer(state, newValue) {
        state.customer = newValue;
    },
    setCountries(state, newValue) {
        state.countries = newValue
    },
};

export const actions = {
    async createCustomer({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.post("customers", payload);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Müşteri başarı ile kaydedildi." })
            commit('setCustomer', res.data.data)
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

    async updateCustomer({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("customers/"+payload.id, payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Müşteri başarı ile güncellendi." })
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

    async fetchCustomers({ commit },payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("customers?page="+payload.page+"&limit="+payload.limit+"&search="+payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setCustomers', res.data)
        } else {
            commit('setCustomers', res.data)
        }

    },

    async fetchCustomer({ commit },payload) {
        commit('setisLoadCustomer', false)
        const res = await accessService.default.get("customers/"+payload);
        if (res.data.success) {
            commit('setisLoadCustomer', true)
            commit('setCustomer', res.data.data)
        } else {
            commit('setCustomer', res.data.data)
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
