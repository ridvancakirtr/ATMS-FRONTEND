const accessService = require('../../axios');
export const state = {
    tempEmployee: [],
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
    updateVehicleOfRezervation(state, newValue) {
        state.rezervations.data[newValue.i].vehicle = newValue.vehicle;
    },
    updateEmployeesOfRezervation(state, newValue) {
        state.rezervations.data[newValue.i].employee = newValue.employee;
    },
    setRezervation(state, newValue) {
        state.rezervation = newValue;
    },
    setTempEmployees(state,index){
        state.tempEmployee = state.rezervations.data[index].employee
    },
    removeItemTempEmployees(state,employee){
        state.tempEmployee.splice( state.tempEmployee.findIndex( item => item._id == employee._id ), 1 );
    },
    pushTempEmployees(state,employee){
        state.tempEmployee.push(employee);
    },
    setUetdsStatus(state,newValue){
        state.rezervation.uetdsStatus=newValue.uetdsStatus;
        state.rezervation.uetdsRefNumber=newValue.uetdsRefNumber;
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
        return true
    },
    
    async updateRezervation({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("rezervations/" + payload.id, payload.form);
        if (res.data.success) {
            commit('setRezervation', res.data.data)
            commit('setNotification', { status: true, message: "Rezervasyon başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        } else {
            commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        }
        commit('setBtnDisabled', false)
        return res.data.success
    },

    async updateVehicleOfRezervation({ commit }, payload) {
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("rezervations/" + payload.id + "/vehicle", payload.form);
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Rezervasyon Transfer Aracı başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);

            //state deki rezervastions arrayindaki vehicle objesini gunceller
            commit('updateVehicleOfRezervation', { i: payload.index, vehicle: payload.vehicle })
        } else {
            commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        }
        commit('setBtnDisabled', false)
    },

    async setEmployeeOfRezervation({ commit, state }, payload) {
        if (state.rezervations.data[payload.index].employee != null) {
            commit('setTempEmployees', payload.index)
        }
        
        commit('pushTempEmployees', payload.employee)

        commit('setBtnDisabled', true)
        const res = await accessService.default.put("rezervations/" + payload.id + "/employee", { employee:state.tempEmployee });
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Rezervasyon Transfer Aracı başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
            //state deki rezervastions arrayindaki employees objesini gunceller
            commit('updateEmployeesOfRezervation', { i: payload.index, employee: state.tempEmployee })
        } else {
            commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        }
        commit('setBtnDisabled', false)
        
    },

    async removeEmployeeOfRezervation({ commit, state }, payload) {
        //Rezervations daki employees leri yedekliyoruz
        commit('setTempEmployees', payload.index)

        //payloadan gelen id ile eslestirip, siliyoruz
        commit('removeItemTempEmployees', payload.employee)
        
        commit('setBtnDisabled', true)
        const res = await accessService.default.put("rezervations/" + payload.id + "/employee", { employee:state.tempEmployee });
        if (res.data.success) {
            commit('setNotification', { status: true, message: "Rezervasyon Transfer Aracı başarı ile güncellendi." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);

            //state deki rezervastions arrayindaki employees objesini gunceller
            commit('updateEmployeesOfRezervation', { i: payload.index, employee: state.tempEmployee })
        } else {
            commit('setNotification', { status: false, message: "Bilinmeyen bir hata oluştu." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 3000);
        }
        commit('setBtnDisabled', false)
        
    },

    async fetchRezervations({ commit }, payload) {
        commit('setisLoad', false)
        const res = await accessService.default.get("rezervations?page=" + payload.page + "&limit=" + payload.limit + "&search=" + payload.search);
        if (res.data.success) {
            commit('setisLoad', true)
            commit('setRezervations', res.data)
        } else {
            commit('setRezervations', res.data)
        }

    },

    async fetchRezervation({ commit }, payload) {
        const res = await accessService.default.get("rezervations/" + payload);
        if (res.data.success) {
            commit('setRezervation', res.data.data)
        } else {
            commit('setRezervation', res.data.data)
        }
    }
};
