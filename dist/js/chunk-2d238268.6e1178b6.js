(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d238268"],{fdc7:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Layout",[a("PageHeader",{attrs:{title:e.title,items:e.items}}),a("div",{staticClass:"row"},[a("div",{staticClass:"col-12"},[a("div",{staticClass:"card"},[a("div",{staticClass:"card-body"},[a("h4",{staticClass:"card-title"},[e._v("Acentalar")]),a("div",{staticClass:"row mt-4"},[a("div",{staticClass:"col-sm-12 col-md-6"},[a("div",{staticClass:"dataTables_length",attrs:{id:"tickets-table_length"}},[a("label",{staticClass:"d-inline-flex align-items-center"},[a("b-form-select",{staticClass:"form-select form-select-sm",attrs:{size:"sm",options:e.pageOptions},model:{value:e.perPage,callback:function(t){e.perPage=t},expression:"perPage"}}),e._v(" Göster")],1)])]),a("div",{staticClass:"col-sm-12 col-md-6"},[a("div",{staticClass:"dataTables_filter text-md-end",attrs:{id:"tickets-table_filter"}},[a("label",{staticClass:"d-inline-flex align-items-center"},[e._v(" Arama: "),a("b-form-input",{staticClass:"form-control form-control-sm ms-2",attrs:{type:"search",placeholder:"Arama..."},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}})],1)])])]),a("div",{staticClass:"table-responsive mb-0"},[a("b-table",{staticClass:"datatables",attrs:{items:e.agencies,fields:e.fields,responsive:"sm","per-page":e.perPage,"current-page":1,filter:e.filter,busy:!this.$store.state.agency.isLoad},scopedSlots:e._u([{key:"cell(authorizedPhone)",fn:function(t){return[e._v(" "+e._s(t.value.formattedNumber)+" ")]}},{key:"cell(actions)",fn:function(e){return[a("b-button-group",[a("router-link",{attrs:{to:{name:"agenciesupdate",params:{id:e.item._id}}}},[a("b-button",{attrs:{size:"sm",variant:"outline-secondary"}},[a("i",{staticClass:"mdi mdi-account-edit d-block font-size-16"})])],1),a("b-button",{attrs:{size:"sm",variant:"outline-secondary"}},[a("i",{staticClass:"mdi mdi-account-details d-block font-size-16"})])],1)]}},{key:"table-busy",fn:function(){return[a("div",{staticClass:"text-center text-primary my-2"},[a("b-spinner",{staticClass:"align-middle"}),a("strong",[e._v("Yükleniyor...")])],1)]},proxy:!0}])})],1),a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("div",{staticClass:"dataTables_paginate paging_simple_numbers float-end"},[a("ul",{staticClass:"pagination pagination-rounded mb-0"},[a("b-pagination",{attrs:{"total-rows":this.$store.state.agency.agencies.totalDocs,"per-page":e.perPage},model:{value:e.currentPage,callback:function(t){e.currentPage=t},expression:"currentPage"}})],1)])])])])])])])],1)},i=[],l=a("5530"),r=(a("4de4"),a("444f")),n=a("2579"),c=a("4d77"),o={page:{title:"Acenta Listesi"},components:{Layout:r["a"],PageHeader:n["a"]},data:function(){return{title:"Acenta Listesi",items:[{text:"Acentalar",href:"/"},{text:"Liste",active:!0}],currentPage:1,perPage:10,pageOptions:[10,25,50,100],filter:null,fields:[{key:"companyName",label:"Acenta Ünvanı",sortable:!0},{key:"taxAdministration",label:"Vergi Dairesi",sortable:!0},{key:"taxNumber",label:"Vergi Kimlik No",sortable:!0},{key:"authorizedName",label:"Yetkili Ad",sortable:!0},{key:"authorizedSurname",label:"Yetkili Soyad",sortable:!0},{key:"authorizedPhone",label:"Yetkili Telefon",sortable:!0},{key:"authorizedEmail",label:"Email",sortable:!0},{key:"actions",label:"Durum"}]}},watch:{currentPage:function(e){null!=this.filter?this.fetchAgencies({page:e,limit:this.perPage,search:this.filter}):this.fetchAgencies({page:e,limit:this.perPage,search:""})},perPage:function(e){this.fetchAgencies({page:this.currentPage,limit:e,search:""})},filter:function(e){this.fetchAgencies({page:"",limit:this.perPage,search:e}),this.currentPage=1}},computed:{rows:function(){return this.$store.state.agency.isLoad?this.$store.state.agency.agencies.totalPages:1},agencies:function(){return this.$store.state.agency.agencies.data}},mounted:function(){this.fetchAgencies({page:this.currentPage,limit:this.perPage,search:""})},methods:Object(l["a"])({},c["a"])},d=o,u=a("2877"),m=Object(u["a"])(d,s,i,!1,null,null,null);t["default"]=m.exports}}]);
//# sourceMappingURL=chunk-2d238268.6e1178b6.js.map