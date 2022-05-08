(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0bd78b"],{"2baf":function(e,a,t){"use strict";t.r(a);var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("Layout",[t("PageHeader",{attrs:{title:e.title,items:e.items}}),t("div",{staticClass:"row"},[t("div",{staticClass:"col-lg-12"},[1==this.$store.state.agency.notification.status?t("b-alert",{attrs:{show:"",dismissible:"",variant:"success"}},[t("i",{staticClass:"mdi mdi-check-all me-2"}),e._v(e._s(this.$store.state.agency.notification.message)+" ")]):e._e(),0==this.$store.state.agency.notification.status?t("b-alert",{attrs:{show:"",dismissible:"",variant:"danger"}},[t("i",{staticClass:"mdi mdi-close-circle-outline me-2"}),e._v(e._s(this.$store.state.agency.notification.message)+" ")]):e._e(),t("div",{staticClass:"card"},[t("div",{staticClass:"card-body"},[e.isLoading?t("h4",{staticClass:"card-title mb-4"},[e._v("Yeni Acenta Oluştur")]):e._e(),e.isLoading?t("p",{staticClass:"card-title-desc"},[e._v("Bu alandan kolaylıkla acenta oluşturabilirsiniz.")]):e._e(),t("div",{staticClass:"text-center"},[e.isLoading?e._e():t("b-spinner",{staticClass:"m-2",attrs:{type:"grow",variant:"primary",role:"status"}})],1),e.isLoading?t("form",{attrs:{action:"#"},on:{submit:function(a){return a.preventDefault(),e.submitForm(a)}}},[t("div",{staticClass:"row"},[t("div",{staticClass:"col-sm-6"},[t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"companyName"}},[e._v("Acenta Ünvanı")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.form.companyName,expression:"form.companyName"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.companyName.$error},attrs:{id:"companyName",name:"companyName",type:"text",placeholder:"Lütfen acenta ünvanını giriniz..."},domProps:{value:e.form.companyName},on:{input:function(a){a.target.composing||e.$set(e.form,"companyName",a.target.value)}}}),e.formsubmit&&e.$v.form.companyName.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.form.companyName.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.form.companyName.maxLength?e._e():t("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()]),t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"taxAdministration"}},[e._v("Vergi Dairesi")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.form.taxAdministration,expression:"form.taxAdministration"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.taxAdministration.$error},attrs:{id:"taxAdministration",name:"taxAdministration",type:"text",placeholder:"Lütfen vergi dairesini giriniz..."},domProps:{value:e.form.taxAdministration},on:{input:function(a){a.target.composing||e.$set(e.form,"taxAdministration",a.target.value)}}}),e.formsubmit&&e.$v.form.taxAdministration.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.form.taxAdministration.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.form.taxAdministration.maxLength?e._e():t("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()]),t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"taxNumber"}},[e._v("Vergi Kimlik No")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.form.taxNumber,expression:"form.taxNumber"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.taxNumber.$error},attrs:{id:"taxNumber",name:"taxNumber",type:"number",placeholder:"Lütfen vergi numarasını giriniz..."},domProps:{value:e.form.taxNumber},on:{input:function(a){a.target.composing||e.$set(e.form,"taxNumber",a.target.value)}}}),e.formsubmit&&e.$v.form.taxNumber.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.form.taxNumber.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.form.taxNumber.maxLength?e._e():t("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")]),e.$v.form.taxNumber.numeric?e._e():t("span",[e._v("Bu alana sadece sayı girilebilir.")])]):e._e()]),t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"authorizedEmail"}},[e._v("Email")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.form.authorizedEmail,expression:"form.authorizedEmail"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.authorizedEmail.$error},attrs:{id:"authorizedEmail",name:"authorizedEmail",type:"text",placeholder:"Lütfen email numarasını giriniz..."},domProps:{value:e.form.authorizedEmail},on:{input:function(a){a.target.composing||e.$set(e.form,"authorizedEmail",a.target.value)}}}),e.formsubmit&&e.$v.form.authorizedEmail.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.form.authorizedEmail.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.form.authorizedEmail.maxLength?e._e():t("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")]),e.$v.form.authorizedEmail.email?e._e():t("span",[e._v("Bu alana geçerli bir email adresi giriniz.")])]):e._e()])]),t("div",{staticClass:"col-sm-6"},[t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"authorizedName"}},[e._v("Yetkili Ad")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.form.authorizedName,expression:"form.authorizedName"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.authorizedName.$error},attrs:{id:"authorizedName",name:"authorizedName",type:"text",placeholder:"Lütfen yetkili adını giriniz..."},domProps:{value:e.form.authorizedName},on:{input:function(a){a.target.composing||e.$set(e.form,"authorizedName",a.target.value)}}}),e.formsubmit&&e.$v.form.authorizedName.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.form.authorizedName.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.form.authorizedName.maxLength?e._e():t("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()]),t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"authorizedSurname"}},[e._v("Yetkili Soyad")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.form.authorizedSurname,expression:"form.authorizedSurname"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.authorizedSurname.$error},attrs:{id:"authorizedSurname",name:"authorizedSurname",type:"text",placeholder:"Lütfen yetkili soyadını giriniz..."},domProps:{value:e.form.authorizedSurname},on:{input:function(a){a.target.composing||e.$set(e.form,"authorizedSurname",a.target.value)}}}),e.formsubmit&&e.$v.form.authorizedSurname.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.form.authorizedSurname.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.form.authorizedSurname.maxLength?e._e():t("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()]),t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"authorizedPhone"}},[e._v("Yetkili Telefon")]),t("VuePhoneNumberInput",{class:{"is-invalid":e.formsubmit&&e.$v.phoneNumber.$error},attrs:{id:"authorizedPhone","default-country-code":"TR",translations:{countrySelectorLabel:"Ülke Kodu",countrySelectorError:"Ülke Kodu Seçiniz",phoneNumberLabel:"Telefon Numarası",example:"Örnek :"}},on:{update:function(a){e.results=a}},model:{value:e.phoneNumber,callback:function(a){e.phoneNumber=a},expression:"phoneNumber"}}),e.formsubmit&&e.$v.phoneNumber.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.phoneNumber.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.phoneNumber.maxLength?e._e():t("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()],1),t("div",{staticClass:"mb-3"},[t("label",{attrs:{for:"address"}},[e._v("Adres")]),t("textarea",{directives:[{name:"model",rawName:"v-model",value:e.form.address,expression:"form.address"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.address.$error},attrs:{rows:"3",id:"address",name:"address",type:"text",placeholder:"Lütfen adres giriniz..."},domProps:{value:e.form.address},on:{input:function(a){a.target.composing||e.$set(e.form,"address",a.target.value)}}}),e._v(" "),e.formsubmit&&e.$v.form.address.$error?t("div",{staticClass:"invalid-feedback"},[e.$v.form.address.required?e._e():t("span",[e._v("Bu alan gereklidir.")]),e.$v.form.address.maxLength?e._e():t("span",[e._v("Bu alana maksimum 255 karakter girilebilir.")])]):e._e()])])]),t("div",{staticClass:"mt-2"},[t("button",{staticClass:"btn btn-success",attrs:{type:"submit",disabled:this.$store.state.agency.isBtnDisabled}},[this.$store.state.agency.isBtnDisabled?t("i",{staticClass:"bx bx-loader bx-spin font-size-16 align-middle me-2"}):e._e(),e._v(" Acenta Güncelle ")])])]):e._e()])])],1)])],1)},i=[],o=t("1da1"),n=t("5530"),s=(t("96cf"),t("444f")),m=t("2579"),u=t("7bec"),l=t.n(u),d=(t("4413"),t("b5ae")),c=t("4d77"),h={page:{title:"Yeni Acenta Oluştur"},components:{Layout:s["a"],PageHeader:m["a"],VuePhoneNumberInput:l.a},data:function(){return{title:"Yeni Oluştur",items:[{text:"Acenta",href:"/"},{text:"Yeni Oluştur",active:!0}],form:{companyName:null,taxAdministration:null,taxNumber:null,address:null,authorizedName:null,authorizedSurname:null,authorizedPhone:{countryCode:null,nationalNumber:null,countryCallingCode:null,formattedNumber:null,phoneNumber:null},authorizedEmail:null},results:null,phoneNumber:"",isLoading:!1,formsubmit:!1}},watch:{phoneNumber:function(){this.form.authorizedPhone.countryCode=this.agency.authorizedPhone.countryCode,this.form.authorizedPhone.nationalNumber=this.agency.authorizedPhone.nationalNumber,this.form.authorizedPhone.countryCallingCode=this.agency.authorizedPhone.countryCallingCode,this.form.authorizedPhone.formattedNumber=this.agency.authorizedPhone.formattedNumber,this.form.authorizedPhone.phoneNumber=this.agency.authorizedPhone.phoneNumber},results:function(e){this.form.authorizedPhone.countryCode=e.countryCode,this.form.authorizedPhone.nationalNumber=e.nationalNumber,this.form.authorizedPhone.countryCallingCode=e.countryCallingCode,this.form.authorizedPhone.formattedNumber=e.formattedNumber,this.form.authorizedPhone.phoneNumber=e.phoneNumber}},computed:{resetForm:function(){return this.$store.state.agency.notification.status},agency:function(){return this.$store.state.agency.agency}},methods:Object(n["a"])({submitForm:function(){this.formsubmit=!0,this.$v.$touch(),this.$v.$invalid||this.updateAgency({id:this.$route.params.id,form:this.form})},setAgency:function(){this.form.companyName=this.agency.companyName,this.form.taxAdministration=this.agency.taxAdministration,this.form.taxNumber=this.agency.taxNumber,this.form.address=this.agency.address,this.form.authorizedName=this.agency.authorizedName,this.form.authorizedSurname=this.agency.authorizedSurname,this.form.authorizedEmail=this.agency.authorizedEmail,this.phoneNumber=this.agency.authorizedPhone.nationalNumber}},c["a"]),validations:{form:{companyName:{required:d["required"],maxLength:Object(d["maxLength"])(50)},taxAdministration:{required:d["required"],maxLength:Object(d["maxLength"])(50)},taxNumber:{required:d["required"],numeric:d["numeric"],maxLength:Object(d["maxLength"])(50)},address:{required:d["required"],maxLength:Object(d["maxLength"])(255)},authorizedName:{required:d["required"],maxLength:Object(d["maxLength"])(50)},authorizedSurname:{required:d["required"],maxLength:Object(d["maxLength"])(50)},authorizedEmail:{required:d["required"],email:d["email"],maxLength:Object(d["maxLength"])(50)}},phoneNumber:{required:d["required"],maxLength:Object(d["maxLength"])(50)}},mounted:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,e.fetchAgency(e.$route.params.id);case 2:e.setAgency(),e.isLoading=!0;case 4:case"end":return a.stop()}}),a)})))()}},f=h,v=t("2877"),b=Object(v["a"])(f,r,i,!1,null,null,null);a["default"]=b.exports}}]);
//# sourceMappingURL=chunk-2d0bd78b.369a2d1c.js.map