(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0da7d0"],{"6c8e":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Layout",[a("PageHeader",{attrs:{title:e.title,items:e.items}}),a("div",{staticClass:"row"},[a("div",{staticClass:"col-lg-12"},[1==this.$store.state.customer.notification.status?a("b-alert",{attrs:{show:"",dismissible:"",variant:"success"}},[a("i",{staticClass:"mdi mdi-check-all me-2"}),e._v(e._s(this.$store.state.customer.notification.message)+" ")]):e._e(),0==this.$store.state.customer.notification.status?a("b-alert",{attrs:{show:"",dismissible:"",variant:"danger"}},[a("i",{staticClass:"mdi mdi-close-circle-outline me-2"}),e._v(e._s(this.$store.state.customer.notification.message)+" ")]):e._e(),a("div",{staticClass:"card"},[a("div",{staticClass:"card-body"},[e.isLoading?a("h4",{staticClass:"card-title mb-4"},[e._v("Yeni Müşteri Oluştur")]):e._e(),e.isLoading?a("p",{staticClass:"card-title-desc"},[e._v("Bu alandan kolaylıkla müşteri oluşturabilirsiniz.")]):e._e(),a("div",{staticClass:"text-center"},[e.isLoading?e._e():a("b-spinner",{staticClass:"m-2",attrs:{type:"grow",variant:"primary",role:"status"}})],1),e.isLoading?a("form",{attrs:{action:"#"},on:{submit:function(t){return t.preventDefault(),e.submitForm(t)}}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-sm-6"},[a("div",{staticClass:"mb-3"},[a("label",{attrs:{for:"tcknOrPassport"}},[e._v("TC veya Pasaport Numarası")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.tcknOrPassport,expression:"form.tcknOrPassport"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.tcknOrPassport.$error},attrs:{id:"tcknOrPassport",name:"tcknOrPassport",type:"number",placeholder:"Lütfen TC veya Pasaport numarasını giriniz..."},domProps:{value:e.form.tcknOrPassport},on:{input:function(t){t.target.composing||e.$set(e.form,"tcknOrPassport",t.target.value)}}}),e.formsubmit&&e.$v.form.tcknOrPassport.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.form.tcknOrPassport.required?e._e():a("span",[e._v("Bu alan gereklidir.")]),e.$v.form.tcknOrPassport.maxLength?e._e():a("span",[e._v("Bu alana maksimum 11 karakter girilebilir.")]),e.$v.form.tcknOrPassport.minLength?e._e():a("span",[e._v("Bu alana minimum 7 karakter giriniz.")])]):e._e()]),a("div",{staticClass:"mb-3"},[a("label",{attrs:{for:"name"}},[e._v("Adı")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.name,expression:"form.name"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.name.$error},attrs:{id:"name",name:"name",type:"text",placeholder:"Lütfen müşteri adını giriniz..."},domProps:{value:e.form.name},on:{input:function(t){t.target.composing||e.$set(e.form,"name",t.target.value)}}}),e.formsubmit&&e.$v.form.name.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.form.name.required?e._e():a("span",[e._v("Bu alan gereklidir.")]),e.$v.form.name.maxLength?e._e():a("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()]),a("div",{staticClass:"mb-3"},[a("label",{attrs:{for:"surname"}},[e._v("Soyadı")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.surname,expression:"form.surname"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.surname.$error},attrs:{id:"surname",name:"surname",type:"text",placeholder:"Lütfen müşteri soyadını giriniz..."},domProps:{value:e.form.surname},on:{input:function(t){t.target.composing||e.$set(e.form,"surname",t.target.value)}}}),e.formsubmit&&e.$v.form.surname.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.form.surname.required?e._e():a("span",[e._v("Bu alan gereklidir.")]),e.$v.form.surname.maxLength?e._e():a("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()]),a("div",{staticClass:"mb-3"},[a("label",{staticClass:"control-label"},[e._v("Uyruk")]),a("multiselect",{class:{"is-invalid":e.formsubmit&&e.$v.form.nationality.$error},attrs:{options:this.countries,searchable:!0,placeholder:"Seçiniz",selectLabel:"Seçiniz",deselectLabel:"Seçimi Kaldır",selectedLabel:"Seçilen","custom-label":e.countriesObject},model:{value:e.form.nationality,callback:function(t){e.$set(e.form,"nationality",t)},expression:"form.nationality"}},[a("span",{attrs:{slot:"noResult"},slot:"noResult"},[e._v("Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.")])]),e.formsubmit&&e.$v.form.nationality.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.form.nationality.required?e._e():a("span",[e._v("Bu alan gereklidir.")])]):e._e()],1)]),a("div",{staticClass:"col-sm-6"},[a("div",{staticClass:"mb-3"},[a("label",{attrs:{for:"email"}},[e._v("Email")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.email,expression:"form.email"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.email.$error},attrs:{id:"email",name:"email",type:"email",placeholder:"ornek@mail.com"},domProps:{value:e.form.email},on:{input:function(t){t.target.composing||e.$set(e.form,"email",t.target.value)}}}),e.formsubmit&&e.$v.form.email.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.form.email.required?e._e():a("span",[e._v("Bu alan gereklidir.")]),!e.$v.form.email.email&&e.$v.form.email.required?a("span",[e._v("Bu alana geçerli email adresi giriniz.")]):e._e(),!e.$v.form.email.maxlength&&e.$v.form.email.required&&e.$v.form.email.email?a("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")]):e._e()]):e._e()]),a("div",{staticClass:"mb-3"},[a("label",{attrs:{for:"phone"}},[e._v("Telefon")]),a("VuePhoneNumberInput",{class:{"is-invalid":e.formsubmit&&e.$v.phoneNumber.$error},attrs:{id:"authorizedPhone","default-country-code":"TR",translations:{countrySelectorLabel:"Ülke Kodu",countrySelectorError:"Ülke Kodu Seçiniz",phoneNumberLabel:"Telefon Numarası",example:"Örnek :"}},on:{update:function(t){e.results=t}},model:{value:e.phoneNumber,callback:function(t){e.phoneNumber=t},expression:"phoneNumber"}}),e.formsubmit&&e.$v.phoneNumber.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.phoneNumber.required?e._e():a("span",[e._v("Bu alan gereklidir.")]),e.$v.phoneNumber.maxLength?e._e():a("span",[e._v("Bu alana maksimum 50 karakter girilebilir.")])]):e._e()],1),a("div",{staticClass:"mb-3"},[a("label",{staticClass:"control-label"},[e._v("Cinsiyet")]),a("multiselect",{class:{"is-invalid":e.formsubmit&&e.$v.form.gender.$error},attrs:{options:e.gender,placeholder:"Seçiniz",selectLabel:"Seçiniz",deselectLabel:"Seçimi Kaldır",selectedLabel:"Seçilen"},model:{value:e.form.gender,callback:function(t){e.$set(e.form,"gender",t)},expression:"form.gender"}}),e.formsubmit&&e.$v.form.gender.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.form.gender.required?e._e():a("span",[e._v("Bu alan gereklidir.")])]):e._e()],1)])]),a("div",{staticClass:"mt-2"},[a("button",{staticClass:"btn btn-success",attrs:{type:"submit",disabled:this.$store.state.customer.isBtnDisabled}},[this.$store.state.customer.isBtnDisabled?a("i",{staticClass:"bx bx-loader bx-spin font-size-16 align-middle me-2"}):e._e(),e._v(" Müşteri Oluştur ")]),a("button",{staticClass:"btn btn-secondary ms-1",attrs:{type:"reset"}},[e._v(" Temizle ")])])]):e._e()])])],1)])],1)},i=[],s=a("1da1"),n=a("5530"),o=(a("96cf"),a("99af"),a("444f")),l=a("2579"),m=a("8e5f"),u=a.n(m),c=a("7bec"),d=a.n(c),f=(a("4413"),a("b5ae")),v=a("4d77"),b={page:{title:"Yeni Müşteri Oluştur"},components:{Layout:o["a"],PageHeader:l["a"],Multiselect:u.a,VuePhoneNumberInput:d.a},data:function(){return{title:"Yeni Oluştur",items:[{text:"Müşteri",href:"/"},{text:"Yeni Oluştur",active:!0}],form:{tcknOrPassport:null,name:null,surname:null,email:null,phone:{countryCode:null,nationalNumber:null,countryCallingCode:null,formattedNumber:null,phoneNumber:null},gender:null,nationality:{code:null,countryName:null}},formsubmit:!1,gender:["E","K"],phoneNumber:null,results:null,isLoading:!1}},watch:{resetForm:function(e){e&&this.$v.$reset()},results:function(e){this.form.phone.countryCode=e.countryCode,this.form.phone.nationalNumber=e.nationalNumber,this.form.phone.countryCallingCode=e.countryCallingCode,this.form.phone.formattedNumber=e.formattedNumber,this.form.phone.phoneNumber=e.phoneNumber}},computed:{resetForm:function(){return this.$store.state.customer.notification.status},countries:function(){return this.$store.state.customer.countries}},methods:Object(n["a"])({submitForm:function(){this.formsubmit=!0,this.$v.$touch(),this.$v.$invalid||this.createCustomer(this.form)},countriesObject:function(e){var t=e.countryName,a=e.code;return"".concat(t," — [").concat(a,"]")}},v["d"]),validations:{form:{tcknOrPassport:{required:f["required"],minLength:Object(f["minLength"])(7),maxLength:Object(f["maxLength"])(11)},name:{required:f["required"],maxLength:Object(f["maxLength"])(50)},surname:{required:f["required"],maxLength:Object(f["maxLength"])(50)},email:{required:f["required"],email:f["email"],maxLength:Object(f["maxLength"])(50)},gender:{required:f["required"]},nationality:{required:f["required"]}},phoneNumber:{required:f["required"],maxLength:Object(f["maxLength"])(50)}},mounted:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.fetchCountries();case 2:e.isLoading=!0,e.form.nationality=e.countries[3];case 4:case"end":return t.stop()}}),t)})))()}},p=b,h=a("2877"),g=Object(h["a"])(p,r,i,!1,null,null,null);t["default"]=g.exports}}]);
//# sourceMappingURL=chunk-2d0da7d0.ed63ea41.js.map