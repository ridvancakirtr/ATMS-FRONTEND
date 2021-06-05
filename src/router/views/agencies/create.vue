<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import {
  required,
  maxLength,
  email,
  numeric
} from "vuelidate/lib/validators";

import {
  agencyMethod
} from "@/state/helpers";

/**
 * Customer-create component
 */
export default {
  page: {
    title: "Yeni Acenta Oluştur",
  },
  components: { Layout, PageHeader,VuePhoneNumberInput },
  data() {
    return {
      title: "Yeni Oluştur",
      items: [
        {
          text: "Acenta",
          href: "/",
        },
        {
          text: "Yeni Oluştur",
          active: true,
        },
      ],
      form: {
        companyName: null,
        taxAdministration: null,
        taxNumber: null,
        address: null,
        authorizedName: null,
        authorizedSurname: null,
        authorizedPhone: {
          countryCode: null,
          nationalNumber: null,
          countryCallingCode: null,
          formattedNumber: null,
          phoneNumber:null
        },
        authorizedEmail: null,
      },
      results: null,
      phoneNumber:"",
      isLoading:false,
      formsubmit: false
    };
  },
  watch:{ 
    resetForm(value){
      if(value){
        this.form.companyName= null,
        this.form.taxAdministration= null,
        this.form.taxNumber= null,
        this.form.address= null,
        this.form.authorizedName= null,
        this.form.authorizedSurname= null,
        this.form.authorizedPhone= {
          countryCode: null,
          nationalNumber: null,
          countryCallingCode: null,
          formattedNumber: null,
          phoneNumber:null
        },
        this.form.authorizedEmail= null,
        this.phoneNumber=null
        this.$v.$reset();
      }
    },
    results(a){
      console.log(a);
      this.form.authorizedPhone.countryCode=a.countryCode
      this.form.authorizedPhone.nationalNumber=a.nationalNumber
      this.form.authorizedPhone.countryCallingCode=a.countryCallingCode
      this.form.authorizedPhone.formattedNumber=a.formattedNumber
      this.form.authorizedPhone.phoneNumber=a.phoneNumber
    },
  },
  computed: {
    resetForm(){
      return this.$store.state.agency.notification.status
    },
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      console.log("this.form->",this.form);
      console.log("this.$v->",this.$v);
      this.$v.$touch();
      if (!this.$v.$invalid) {
          console.log("girdi");
          this.createAgency(this.form);
      }

    },
    ...agencyMethod
  },
  validations: {
    form: {
      companyName: { required, maxLength: maxLength(50) },
      taxAdministration: { required, maxLength: maxLength(50) },
      taxNumber: { required,numeric, maxLength: maxLength(50) },
      address: { required, maxLength: maxLength(255) },
      authorizedName: { required, maxLength: maxLength(50) },
      authorizedSurname: { required, maxLength: maxLength(50) },
      authorizedEmail: { required,email, maxLength: maxLength(50) },
    },
    phoneNumber: { required, maxLength: maxLength(50) }
  },
  async mounted() {
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.agency.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.agency.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.agency.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.agency.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Yeni Acenta Oluştur</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla acenta oluşturabilirsiniz.</p>
            <div class="text-center">
                <b-spinner v-if="!isLoading"
                  type="grow"
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            <form action="#" @submit.prevent="submitForm" v-if="isLoading">
              <div class="row">
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label for="companyName">Acenta Ünvanı</label>
                    <input
                      v-model="form.companyName"
                      id="companyName"
                      name="companyName"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen acenta ünvanını giriniz..."
                      :class="{
                        'is-invalid': formsubmit && $v.form.companyName.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.companyName.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.companyName.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.companyName.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                     <label for="taxAdministration">Vergi Dairesi</label>
                    <input
                    v-model="form.taxAdministration"
                    id="taxAdministration"
                    name="taxAdministration"
                    type="text"
                    class="form-control"
                    placeholder="Lütfen vergi dairesini giriniz..."
                    :class="{
                      'is-invalid': formsubmit && $v.form.taxAdministration.$error,
                    }"
                  />
                  <div
                    v-if="formsubmit && $v.form.taxAdministration.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.taxAdministration.required"
                      >Bu alan gereklidir.</span
                    >
                    <span v-if="!$v.form.taxAdministration.maxLength"
                      >Bu alana maksimum 50 karakter girilebilir.</span
                    >
                  </div>
                  </div>
                  <div class="mb-3">
                    <label for="taxNumber">Vergi Kimlik No</label>
                    <input
                      v-model="form.taxNumber"
                      id="taxNumber"
                      name="taxNumber"
                      type="number"
                      class="form-control"
                      placeholder="Lütfen vergi numarasını giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.form.taxNumber.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.taxNumber.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.taxNumber.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.taxNumber.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                      <span v-if="!$v.form.taxNumber.numeric"
                        >Bu alana sadece sayı girilebilir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="authorizedEmail">Email</label>
                    <input
                      v-model="form.authorizedEmail"
                      id="authorizedEmail"
                      name="authorizedEmail"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen email numarasını giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.form.authorizedEmail.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.authorizedEmail.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.authorizedEmail.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.authorizedEmail.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                      <span v-if="!$v.form.authorizedEmail.email"
                        >Bu alana geçerli bir email adresi giriniz.</span
                      >
                    </div>
                  </div>                    
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                     <label for="authorizedName">Yetkili Ad</label>
                    <input
                    v-model="form.authorizedName"
                    id="authorizedName"
                    name="authorizedName"
                    type="text"
                    class="form-control"
                    placeholder="Lütfen yetkili adını giriniz..."
                    :class="{
                      'is-invalid': formsubmit && $v.form.authorizedName.$error,
                    }"
                  />
                  <div
                    v-if="formsubmit && $v.form.authorizedName.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.authorizedName.required"
                      >Bu alan gereklidir.</span
                    >
                    <span v-if="!$v.form.authorizedName.maxLength"
                      >Bu alana maksimum 50 karakter girilebilir.</span
                    >
                  </div>
                  </div>
                  <div class="mb-3">
                     <label for="authorizedSurname">Yetkili Soyad</label>
                    <input
                    v-model="form.authorizedSurname"
                    id="authorizedSurname"
                    name="authorizedSurname"
                    type="text"
                    class="form-control"
                    placeholder="Lütfen yetkili soyadını giriniz..."
                    :class="{
                      'is-invalid': formsubmit && $v.form.authorizedSurname.$error,
                    }"
                  />
                  <div
                    v-if="formsubmit && $v.form.authorizedSurname.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.authorizedSurname.required"
                      >Bu alan gereklidir.</span
                    >
                    <span v-if="!$v.form.authorizedSurname.maxLength"
                      >Bu alana maksimum 50 karakter girilebilir.</span
                    >
                  </div>
                  </div>
                  <div class="mb-3">
                      <label for="authorizedPhone">Yetkili Telefon</label>
                      <VuePhoneNumberInput id="authorizedPhone" default-country-code="TR" v-model="phoneNumber" @update="results = $event"
                      :translations="{
                        countrySelectorLabel: 'Ülke Kodu',
                        countrySelectorError: 'Ülke Kodu Seçiniz',
                        phoneNumberLabel: 'Telefon Numarası',
                        example: 'Örnek :'
                      }"
                      :class="{'is-invalid': formsubmit && $v.phoneNumber.$error}"/>
                      <div v-if="formsubmit && $v.phoneNumber.$error" class="invalid-feedback" >
                        <span v-if="!$v.phoneNumber.required">Bu alan gereklidir.</span>
                        <span v-if="!$v.phoneNumber.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        
                      </div>
                  </div>
                  <div class="mb-3">
                    <label for="address">Adres</label>
                    <textarea
                      v-model="form.address"
                      rows="3"
                      id="address"
                      name="address"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen adres giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.form.address.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.address.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.address.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.address.maxLength"
                        >Bu alana maksimum 255 karakter girilebilir.</span
                      >
                    </div>
                  </div>                 
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.agency.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.agency.isBtnDisabled"></i>
                    Acenta Oluştur
                  </button>
                  <button type="reset" class="btn btn-secondary ms-1">
                    Temizle
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>