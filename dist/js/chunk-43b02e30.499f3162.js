(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-43b02e30"],{1331:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=(0,r.regex)("integer",/(^[0-9]*$)|(^-[0-9]+$)/);t.default=n},"2a12":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"maxLength",max:e},(function(t){return!(0,r.req)(t)||(0,r.len)(t)<=e}))};t.default=n},3360:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,r.withParams)({type:"and"},(function(){for(var e=this,a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return t.length>0&&t.reduce((function(t,a){return t&&a.apply(e,r)}),!0)}))};t.default=n},"3a54":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=(0,r.regex)("alphaNum",/^[a-zA-Z0-9]*$/);t.default=n},"45b8":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=(0,r.regex)("numeric",/^[0-9]*$/);t.default=n},"46bc":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"maxValue",max:e},(function(t){return!(0,r.req)(t)||(!/\s/.test(t)||t instanceof Date)&&+t<=+e}))};t.default=n},"5d75":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=/^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,i=(0,r.regex)("email",n);t.default=i},"5db3":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"minLength",min:e},(function(t){return!(0,r.req)(t)||(0,r.len)(t)>=e}))};t.default=n},6235:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=(0,r.regex)("alpha",/^[a-zA-Z]*$/);t.default=n},6417:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"not"},(function(t,a){return!(0,r.req)(t)||!e.call(this,t,a)}))};t.default=n},"772d":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i,i=(0,r.regex)("url",n);t.default=i},"78ef":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"withParams",{enumerable:!0,get:function(){return r.default}}),t.regex=t.ref=t.len=t.req=void 0;var r=n(a("8750"));function n(e){return e&&e.__esModule?e:{default:e}}function i(e){return i="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i(e)}var o=function(e){if(Array.isArray(e))return!!e.length;if(void 0===e||null===e)return!1;if(!1===e)return!0;if(e instanceof Date)return!isNaN(e.getTime());if("object"===i(e)){for(var t in e)return!0;return!1}return!!String(e).length};t.req=o;var u=function(e){return Array.isArray(e)?e.length:"object"===i(e)?Object.keys(e).length:String(e).length};t.len=u;var s=function(e,t,a){return"function"===typeof e?e.call(t,a):a[e]};t.ref=s;var f=function(e,t){return(0,r.default)({type:e},(function(e){return!o(e)||t.test(e)}))};t.regex=f},8750:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r="web"===Object({NODE_ENV:"production",VUE_APP_APIKEY:"",VUE_APP_APPId:"",VUE_APP_AUTHDOMAIN:"",VUE_APP_DATABASEURL:"",VUE_APP_DEFAULT_AUTH:"fakebackend",VUE_APP_I18N_FALLBACK_LOCALE:"en",VUE_APP_I18N_LOCALE:"en",VUE_APP_MEASUREMENTID:"",VUE_APP_MESSAGINGSENDERID:"",VUE_APP_PROJECTId:"",VUE_APP_STORAGEBUCKET:"",VUE_APP_URL:"http://localhost:8080",BASE_URL:"/"}).BUILD?a("cb69").withParams:a("0234").withParams,n=r;t.default=n},"91d3":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:":";return(0,r.withParams)({type:"macAddress"},(function(t){if(!(0,r.req)(t))return!0;if("string"!==typeof t)return!1;var a="string"===typeof e&&""!==e?t.split(e):12===t.length||16===t.length?t.match(/.{2}/g):null;return null!==a&&(6===a.length||8===a.length)&&a.every(i)}))};t.default=n;var i=function(e){return e.toLowerCase().match(/^[0-9a-f]{2}$/)}},aa82:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"requiredIf",prop:e},(function(t,a){return!(0,r.ref)(e,this,a)||(0,r.req)(t)}))};t.default=n},acbf:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Layout",[a("PageHeader",{attrs:{title:e.title,items:e.items}}),a("div",{staticClass:"row"},[a("div",{staticClass:"col-lg-12"},[1==this.$store.state.taxation.notification.status?a("b-alert",{attrs:{show:"",dismissible:"",variant:"success"}},[a("i",{staticClass:"mdi mdi-check-all me-2"}),e._v(e._s(this.$store.state.taxation.notification.message)+" ")]):e._e(),0==this.$store.state.taxation.notification.status?a("b-alert",{attrs:{show:"",dismissible:"",variant:"danger"}},[a("i",{staticClass:"mdi mdi-close-circle-outline me-2"}),e._v(e._s(this.$store.state.taxation.notification.message)+" ")]):e._e(),a("div",{staticClass:"card"},[a("div",{staticClass:"card-body"},[e.isLoading?a("h4",{staticClass:"card-title mb-4"},[e._v("Vergilendirme")]):e._e(),e.isLoading?a("p",{staticClass:"card-title-desc"},[e._v("Tahsil edeceğiniz tüm ödemeler için vergilendirme uygulayabilirsiniz. Vergi hesaplama türünü isteğe bağlı olarak fiyatın içinde ve dışında olacak şekilde tanımlayabilirsiniz. ")]):e._e(),a("div",{staticClass:"text-center"},[e.isLoading?e._e():a("b-spinner",{staticClass:"m-2",attrs:{type:"grow",variant:"primary",role:"status"}})],1),e.isLoading?a("form",{attrs:{action:"#"},on:{submit:function(t){return t.preventDefault(),e.submitForm(t)}}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-sm-6"},[a("label",{staticClass:"mb-1 mt-3 fw-medium"},[e._v("Vergilendirme")]),a("div",{staticClass:"mb-3"},[a("div",{staticClass:"form-check form-switch mb-3"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.isTaxation,expression:"form.isTaxation"}],staticClass:"form-check-input",attrs:{type:"checkbox",id:"taxation",checked:""},domProps:{checked:Array.isArray(e.form.isTaxation)?e._i(e.form.isTaxation,null)>-1:e.form.isTaxation},on:{change:function(t){var a=e.form.isTaxation,r=t.target,n=!!r.checked;if(Array.isArray(a)){var i=null,o=e._i(a,i);r.checked?o<0&&e.$set(e.form,"isTaxation",a.concat([i])):o>-1&&e.$set(e.form,"isTaxation",a.slice(0,o).concat(a.slice(o+1)))}else e.$set(e.form,"isTaxation",n)}}}),a("label",{staticClass:"form-check-label",attrs:{for:"taxation"}},[e._v(" Tüm finansal işlemler için vergilendirmeyi aktif et. ")])])])])]),a("div",{staticClass:"row"},[a("label",{staticClass:"mb-1 mt-3 fw-medium"},[e._v("Vergilendirme Türü")]),a("div",{staticClass:"col-sm-6"},[a("div",{staticClass:"form-check form-check-left mb-3"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.typeOfTaxation,expression:"form.typeOfTaxation"}],staticClass:"form-check-input",attrs:{type:"radio",id:"taxExcluded",name:"taxgroup"},domProps:{value:!1,checked:this.form.typeOfTaxation,checked:e._q(e.form.typeOfTaxation,!1)},on:{change:function(t){return e.$set(e.form,"typeOfTaxation",!1)}}}),a("label",{staticClass:"form-check-label",attrs:{for:"taxExcluded"}},[e._v("Vergi Hariç")]),a("p",{staticClass:"text-muted font-10"},[e._v("KDV, tanımladığınız fiyatın dışında olacak şekilde hesaplanır. Tüm fiyatlar kdv hariç olarak görünür.")])])]),a("div",{staticClass:"col-sm-6"},[a("div",{staticClass:"form-check form-check-left mb-3"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.typeOfTaxation,expression:"form.typeOfTaxation"}],staticClass:"form-check-input",attrs:{type:"radio",id:"taxIncluded",name:"taxgroup"},domProps:{value:!0,checked:this.form.typeOfTaxation,checked:e._q(e.form.typeOfTaxation,!0)},on:{change:function(t){return e.$set(e.form,"typeOfTaxation",!0)}}}),a("label",{staticClass:"form-check-label",attrs:{for:"taxIncluded"}},[e._v("Vergi Dahil")]),a("p",{staticClass:"text-muted font-10"},[e._v("KDV, tanımladığınız fiyatın içerisinde olacak şekilde hesaplanır. Tüm fiyatlar kdv dahil olarak görünür.")])])])]),a("div",{staticClass:"row"},[a("div",{staticClass:"col-sm-6"},[a("label",{attrs:{for:"localTaxRate"}},[e._v("Yerel Vergi Oranı (%)")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.localTaxRate,expression:"form.localTaxRate"}],staticClass:"form-control",class:{"is-invalid":e.formsubmit&&e.$v.form.localTaxRate.$error},attrs:{id:"localTaxRate",name:"hotel",type:"number",placeholder:"Lütfen vergi oranı giriniz..."},domProps:{value:e.form.localTaxRate},on:{input:function(t){t.target.composing||e.$set(e.form,"localTaxRate",t.target.value)}}}),e.formsubmit&&e.$v.form.localTaxRate.$error?a("div",{staticClass:"invalid-feedback"},[e.$v.form.localTaxRate.required?e._e():a("span",[e._v("Bu alan gereklidir.")]),e.$v.form.localTaxRate.maxLength?e._e():a("span",[e._v("Bu alana maksimum 2 karakter girilebilir.")])]):e._e()])]),a("div",{staticClass:"mt-2"},[a("button",{staticClass:"btn btn-success",attrs:{type:"submit",disabled:this.$store.state.taxation.isBtnDisabled}},[this.$store.state.taxation.isBtnDisabled?a("i",{staticClass:"bx bx-loader bx-spin font-size-16 align-middle me-2"}):e._e(),e._v(" Ayarları Kaydet ")])])]):e._e()])])],1)])],1)},n=[],i=a("1da1"),o=a("5530"),u=(a("96cf"),a("444f")),s=a("2579"),f=a("b5ae"),l=a("4d77"),c={page:{title:"Yeni Havalimanı Oluştur"},components:{Layout:u["a"],PageHeader:s["a"]},data:function(){return{title:"Yeni Oluştur",items:[{text:"Havalimanı",href:"/"},{text:"Yeni Oluştur",active:!0}],form:{isTaxation:!0,typeOfTaxation:!1,localTaxRate:18},formsubmit:!1,isLoading:!1}},watch:{"form.isTaxation":function(e){this.form.isTaxation=e},"form.typeOfTaxation":function(e){this.form.typeOfTaxation=e},"form.localTaxRate":function(e){""==e&&(e="0")}},computed:{taxation:function(){return this.$store.state.taxation.taxation}},methods:Object(o["a"])({submitForm:function(){this.formsubmit=!0,this.$v.$touch(),this.$v.$invalid||this.updateTaxation({id:this.taxation._id,form:this.form})},setTaxation:function(){this.form.isTaxation=this.taxation.isTaxation,this.form.typeOfTaxation=this.taxation.typeOfTaxation,this.form.localTaxRate=this.taxation.localTaxRate}},l["l"]),validations:{form:{localTaxRate:{required:f["required"],maxLength:Object(f["maxLength"])(2)}}},mounted:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.fetchTaxation();case 2:e.setTaxation(),e.isLoading=!0;case 4:case"end":return t.stop()}}),t)})))()}},d=c,m=a("2877"),p=Object(m["a"])(d,r,n,!1,null,null,null);t["default"]=p.exports},b5ae:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"alpha",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(t,"alphaNum",{enumerable:!0,get:function(){return n.default}}),Object.defineProperty(t,"numeric",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(t,"between",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(t,"email",{enumerable:!0,get:function(){return u.default}}),Object.defineProperty(t,"ipAddress",{enumerable:!0,get:function(){return s.default}}),Object.defineProperty(t,"macAddress",{enumerable:!0,get:function(){return f.default}}),Object.defineProperty(t,"maxLength",{enumerable:!0,get:function(){return l.default}}),Object.defineProperty(t,"minLength",{enumerable:!0,get:function(){return c.default}}),Object.defineProperty(t,"required",{enumerable:!0,get:function(){return d.default}}),Object.defineProperty(t,"requiredIf",{enumerable:!0,get:function(){return m.default}}),Object.defineProperty(t,"requiredUnless",{enumerable:!0,get:function(){return p.default}}),Object.defineProperty(t,"sameAs",{enumerable:!0,get:function(){return v.default}}),Object.defineProperty(t,"url",{enumerable:!0,get:function(){return b.default}}),Object.defineProperty(t,"or",{enumerable:!0,get:function(){return y.default}}),Object.defineProperty(t,"and",{enumerable:!0,get:function(){return x.default}}),Object.defineProperty(t,"not",{enumerable:!0,get:function(){return h.default}}),Object.defineProperty(t,"minValue",{enumerable:!0,get:function(){return _.default}}),Object.defineProperty(t,"maxValue",{enumerable:!0,get:function(){return g.default}}),Object.defineProperty(t,"integer",{enumerable:!0,get:function(){return P.default}}),Object.defineProperty(t,"decimal",{enumerable:!0,get:function(){return O.default}}),t.helpers=void 0;var r=w(a("6235")),n=w(a("3a54")),i=w(a("45b8")),o=w(a("ec11")),u=w(a("5d75")),s=w(a("c99d")),f=w(a("91d3")),l=w(a("2a12")),c=w(a("5db3")),d=w(a("d4f4")),m=w(a("aa82")),p=w(a("e652")),v=w(a("b6cb")),b=w(a("772d")),y=w(a("d294")),x=w(a("3360")),h=w(a("6417")),_=w(a("eb66")),g=w(a("46bc")),P=w(a("1331")),O=w(a("c301")),T=j(a("78ef"));function j(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,a):{};r.get||r.set?Object.defineProperty(t,a,r):t[a]=e[a]}return t.default=e,t}function w(e){return e&&e.__esModule?e:{default:e}}t.helpers=T},b6cb:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"sameAs",eq:e},(function(t,a){return t===(0,r.ref)(e,this,a)}))};t.default=n},c301:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=(0,r.regex)("decimal",/^[-]?\d*(\.\d+)?$/);t.default=n},c99d:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=(0,r.withParams)({type:"ipAddress"},(function(e){if(!(0,r.req)(e))return!0;if("string"!==typeof e)return!1;var t=e.split(".");return 4===t.length&&t.every(i)}));t.default=n;var i=function(e){if(e.length>3||0===e.length)return!1;if("0"===e[0]&&"0"!==e)return!1;if(!e.match(/^\d+$/))return!1;var t=0|+e;return t>=0&&t<=255}},cb69:function(e,t,a){"use strict";(function(e){function a(e){return a="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.withParams=void 0;var r="undefined"!==typeof window?window:"undefined"!==typeof e?e:{},n=function(e,t){return"object"===a(e)&&void 0!==t?t:e((function(){}))},i=r.vuelidate?r.vuelidate.withParams:n;t.withParams=i}).call(this,a("c8ba"))},d294:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,r.withParams)({type:"or"},(function(){for(var e=this,a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];return t.length>0&&t.reduce((function(t,a){return t||a.apply(e,r)}),!1)}))};t.default=n},d4f4:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=(0,r.withParams)({type:"required"},(function(e){return"string"===typeof e?(0,r.req)(e.trim()):(0,r.req)(e)}));t.default=n},e652:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"requiredUnless",prop:e},(function(t,a){return!!(0,r.ref)(e,this,a)||(0,r.req)(t)}))};t.default=n},eb66:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e){return(0,r.withParams)({type:"minValue",min:e},(function(t){return!(0,r.req)(t)||(!/\s/.test(t)||t instanceof Date)&&+t>=+e}))};t.default=n},ec11:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a("78ef"),n=function(e,t){return(0,r.withParams)({type:"between",min:e,max:t},(function(a){return!(0,r.req)(a)||(!/\s/.test(a)||a instanceof Date)&&+e<=+a&&+t>=+a}))};t.default=n}}]);
//# sourceMappingURL=chunk-43b02e30.499f3162.js.map