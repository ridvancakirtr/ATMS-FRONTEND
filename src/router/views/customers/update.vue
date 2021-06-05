<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import {
  required,
  maxLength,
  minLength,
  email
} from "vuelidate/lib/validators";

import {
  customerMethod
} from "@/state/helpers";

/**
 * Customer-create component
 */
export default {
  page: {
    title: "Müşteri Güncelle",
  },
  components: { Layout, PageHeader,Multiselect, VuePhoneNumberInput },
  data() {
    return {
      title: "Güncelle",
      items: [
        {
          text: "Müşteriler",
          href: "/",
        },
        {
          text: "Güncelle",
          active: true,
        },
      ],
      form: {
        tcknOrPassport: "",
        name: "",
        surname: "",
        email: "",
        phone: {
          countryCode: "",
          nationalNumber: "",
          countryCallingCode: "",
          formattedNumber: "",
          phoneNumber:""
        },
        gender: "",
        nationality:{
          code: null,
          countryName: null
        },
      },
      formsubmit: false,
      gender:['E','K'],
      phoneNumber: null,
      results: null,
      isLoading:false
    };
  },
  watch:{ 
    phoneNumber(){
      this.form.phone.countryCode=this.customer.phone.countryCode
      this.form.phone.nationalNumber=this.customer.phone.nationalNumber
      this.form.phone.countryCallingCode=this.customer.phone.countryCallingCode
      this.form.phone.formattedNumber=this.customer.phone.formattedNumber
      this.form.phone.phoneNumber=this.customer.phone.phoneNumber
    },
    results(value){
      this.form.phone.countryCode=value.countryCode
      this.form.phone.nationalNumber=value.nationalNumber
      this.form.phone.countryCallingCode=value.countryCallingCode
      this.form.phone.formattedNumber=value.formattedNumber
      this.form.phone.phoneNumber=value.phoneNumber
    }
  },
  computed: {
    countries(){
      return this.$store.state.customer.countries
    },
    customer(){
      return this.$store.state.customer.customer
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.updateCustomer({id:this.$route.params.id,form:this.form});
      }

    },
    countriesObject ({ countryName, code }) {
      return `${countryName} — [${code}]`
    },
    setCustomer(){
      this.form.tcknOrPassport=this.customer.tcknOrPassport
      this.form.name=this.customer.name
      this.form.surname=this.customer.surname
      //this.form.phone=this.customer.phone
      this.form.email=this.customer.email
      this.form.gender=this.customer.gender
      this.form.nationality=this.customer.nationality
      
      this.phoneNumber=this.customer.phone.nationalNumber
    },
    ...customerMethod
  },
  validations: {
    form: {
      tcknOrPassport: { required,minLength: minLength(7), maxLength: maxLength(11) },
      name: { required, maxLength: maxLength(50) },
      surname: { required, maxLength: maxLength(50) },
      email: { required, email, maxLength: maxLength(50) },
      gender: { required },
      nationality: { required },
    },
    phoneNumber: { required }
  },
  async mounted() {
    await this.fetchCountries()
    await this.fetchCustomer(this.$route.params.id)
    this.setCustomer()
    this.isLoading=true
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.customer.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.customer.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.customer.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.customer.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
             <div class="text-center">
                <b-spinner v-if="!isLoading"
                  type="grow"
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            
            <h4 class="card-title mb-4" v-if="isLoading">Müşteri Güncelle</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla müşteri güncelleyebilirsiniz.</p>
            <form action="#" @submit.prevent="submitForm" v-if="isLoading">
              <div class="row">
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label for="tcknOrPassport">TC veya Pasaport Numarası</label>
                    <input
                      v-model="form.tcknOrPassport"
                      id="tcknOrPassport"
                      name="tcknOrPassport"
                      type="number"
                      class="form-control"
                      placeholder="Lütfen TC veya Pasaport numarasını giriniz..."
                      :class="{
                        'is-invalid': formsubmit && $v.form.tcknOrPassport.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.tcknOrPassport.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.tcknOrPassport.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.tcknOrPassport.maxLength"
                        >Bu alana maksimum 11 karakter girilebilir.</span
                      >
                      <span v-if="!$v.form.tcknOrPassport.minLength"
                        >Bu alana minimum 7 karakter giriniz.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                     <label for="name">Adı</label>
                    <input
                    v-model="form.name"
                    id="name"
                    name="name"
                    type="text"
                    class="form-control"
                    placeholder="Lütfen müşteri adını giriniz..."
                    :class="{
                      'is-invalid': formsubmit && $v.form.name.$error,
                    }"
                  />
                  <div
                    v-if="formsubmit && $v.form.name.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.name.required"
                      >Bu alan gereklidir.</span
                    >
                    <span v-if="!$v.form.name.maxLength"
                      >Bu alana maksimum 50 karakter girilebilir.</span
                    >
                  </div>
                  </div>
                  <div class="mb-3">
                    <label for="surname">Soyadı</label>
                    <input
                      v-model="form.surname"
                      id="surname"
                      name="surname"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen müşteri soyadını giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.form.surname.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.surname.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.surname.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.surname.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                      <label class="control-label">Uyruk</label>
                      <multiselect 
                        v-model="form.nationality" 
                        :options="this.countries"
                        :searchable="true"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{
                        'is-invalid': formsubmit && $v.form.nationality.$error,
                        }"
                        :custom-label="countriesObject">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                      <div v-if="formsubmit && $v.form.nationality.$error" class="invalid-feedback">
                        <span v-if="!$v.form.nationality.required">Bu alan gereklidir.</span>
                      </div>
                  </div>
                </div>
                <div class="col-sm-6">
                    <div class="mb-3">
                      <label for="email">Email</label>
                      <input
                    v-model="form.email"
                    id="email"
                    name="email"
                    type="email"
                    class="form-control"
                    placeholder="ornek@mail.com"
                    :class="{
                      'is-invalid': formsubmit && $v.form.email.$error,
                    }"
                  />
                  <div
                    v-if="formsubmit && $v.form.email.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.email.required"
                      >Bu alan gereklidir.</span
                    >
                    <span v-if="!$v.form.email.email && $v.form.email.required"
                      >Bu alana geçerli email adresi giriniz.</span
                    >
                    <span
                      v-if="
                        !$v.form.email.maxlength &&
                        $v.form.email.required &&
                        $v.form.email.email
                      "
                      >Bu alana maksimum 50 karakter girilebilir.</span
                    >
                  </div>
                    </div>
                    <div class="mb-3">
                      <label for="phone">Telefon</label>
                      <VuePhoneNumberInput default-country-code="TR" v-model="phoneNumber" @update="results = $event"
                      :translations="{
                        countrySelectorLabel: 'Ülke Kodu',
                        countrySelectorError: 'Ülke Kodu Seçiniz',
                        phoneNumberLabel: 'Telefon Numarası',
                        example: 'Örnek :'
                      }"
                      :class="{'is-invalid': formsubmit && $v.phoneNumber.$error}"/>
                      <div v-if="formsubmit && $v.phoneNumber.$error" class="invalid-feedback" >
                        <span v-if="!$v.phoneNumber.required">Bu alan gereklidir.</span>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="control-label">Cinsiyet</label>
                      <multiselect
                        v-model="form.gender"
                        :options="gender"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{'is-invalid': formsubmit && $v.form.gender.$error}"
                      >
                      </multiselect>
                      <div
                      v-if="formsubmit && $v.form.gender.$error" class="invalid-feedback">
                      <span v-if="!$v.form.gender.required">Bu alan gereklidir.</span>
                      </div>
                    </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.customer.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.customer.isBtnDisabled"></i>
                    Müşteri Güncelle
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>