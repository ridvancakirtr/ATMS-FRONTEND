const accessService = require('../../axios');
export const state = {
    isLoad: false,
    notification: { status: null, message: null },
    isBtnDisabled: false,
    uetdsResult:{},
    printOutPDF:{},
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
    setUetdsResult(state, newValue){
        state.uetdsResult = newValue
    },
    setPrintOut(state, newValue){
        state.printOutPDF = newValue
    },
};

export const actions = {
    async sendNotification({ commit }, payload) {
        commit('setBtnDisabled', true);
        const res = await accessService.default.post("uetdsnotification/send/"+payload)
        if (res.data.success) {
            commit('setNotification', { status: true, message: "U-ETDS Bildirimi Başarıyla Yapıldı." })
            commit('setUetdsResult', res.data)
            this.commit('rezervation/setUetdsStatus',{uetdsStatus:true,uetdsRefNumber:res.data.data.uetdsSeferRefNo})
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        } else {
            commit('setNotification', { status: false, message: "U-ETDS Bildirimi Sorun Oluştu" })
            commit('setUetdsResult', res.data)
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        }
        commit('setBtnDisabled', false)
        return res.data.success
    },
    async cancelNotification({ commit }, payload) {
        commit('setBtnDisabled', true);
        const res = await accessService.default.post("uetdsnotification/cancel/"+payload)
        if (res.data.success) {
            commit('setNotification', { status: true, message: "U-ETDS Bildirimi İptal Edildi." })
            commit('setUetdsResult', res.data)
            this.commit('rezervation/setUetdsStatus',{uetdsStatus:false,uetdsRefNumber:null})
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
            
        } else {
            commit('setNotification', { status: false, message: "U-ETDS Bildirimi Sorun Oluştu" })
            commit('setUetdsResult', res.data)
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
            
        }
        commit('setBtnDisabled', false)
        return res.data.success
    },
    async printOut({ commit }, payload) {
        commit('setBtnDisabled', true);
        const res = await accessService.default.post("uetdsnotification/printout/"+payload)
        if (res.data.success) {
            commit('setPrintOut', res.data.data)
            //commit('setNotification', { status: true, message: "PDF Çıktısı Başarılı." })
            //setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        } else {
            commit('setPrintOut', res.data)
            commit('setNotification', { status: true, message: "PDF Hatası." })
            setTimeout(function () { commit('setNotification', { status: null, message: null }) }, 5000);
        }
        commit('setBtnDisabled', false)
        return true
    },
};
