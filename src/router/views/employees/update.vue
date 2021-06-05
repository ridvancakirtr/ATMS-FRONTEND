<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import DatePicker from "vue2-datepicker";
import 'vue2-datepicker/locale/tr';

import {
  required,
  maxLength,
  minLength,
  email
} from "vuelidate/lib/validators";

import {
  employeeMethod,
  formatShortDate
} from "@/state/helpers";

/**
 * employee-create component
 */
export default {
  page: {
    title: "Yeni Personel Oluştur",
  },
  components: { Layout, PageHeader,Multiselect, VuePhoneNumberInput,DatePicker },
  data() {
    return {
      title: "Yeni Oluştur",
      items: [
        {
          text: "Personel",
          href: "/",
        },
        {
          text: "Yeni Oluştur",
          active: true,
        },
      ],
      form: {
        tcknOrPassport: null,
        name: null,
        surname: null,
        email: null,
        phone: {
          countryCode: null,
          nationalNumber: null,
          countryCallingCode: null,
          formattedNumber: null,
          phoneNumber:null
        },
        type:null,
        gender: null,
        nationality:{
          code: null,
          countryName: null
        },
        dateOfBirth:null,
        lisanceNumber:null,
        address:null
      },
      formsubmit: false,
      gender:['E','K'],
      typeCode:[
        {
          "value":"0",
          "name":"Şoför"
        },
        {
          "value":"1",
          "name":"Şoför Yardımcısı"
        },
        {
          "value":"2",
          "name":"Host"
        },
        {
          "value":"3",
          "name":"Hostes"
        },
        {
          "value":"4",
          "name":"Diğer"
        },
        {
          "value":"5",
          "name":"Rehber"
        }
      ],
      typeObject:null,
      phoneNumber: null,
      results: null,
      isLoading:false
    };
  },
  watch:{ 
    phoneNumber(){
      this.form.phone.countryCode=this.employee.phone.countryCode
      this.form.phone.nationalNumber=this.employee.phone.nationalNumber
      this.form.phone.countryCallingCode=this.employee.phone.countryCallingCode
      this.form.phone.formattedNumber=this.employee.phone.formattedNumber
      this.form.phone.phoneNumber=this.employee.phone.phoneNumber
    },
    results(value){
      this.form.phone.countryCode=value.countryCode
      this.form.phone.nationalNumber=value.nationalNumber
      this.form.phone.countryCallingCode=value.countryCallingCode
      this.form.phone.formattedNumber=value.formattedNumber
      this.form.phone.phoneNumber=value.phoneNumber
    },
    
    typeObject(object){
      this.form.type=object.value
    }
  },
  computed: {
    countries(){
      return this.$store.state.employee.countries
    },
    employee(){
      return this.$store.state.employee.employee
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.updateEmployee({id:this.$route.params.id,form:this.form});
      }

    },
    countriesObject ({ countryName, code }) {
      return `${countryName} — [${code}]`
    },
    typesObject ({ name }) {
      return name
    },
    setEmployee(){
      this.form.tcknOrPassport=this.employee.tcknOrPassport;
      
      this.form.name=this.employee.name;
      this.form.surname=this.employee.surname;
      this.form.email=this.employee.email;

      this.typeObject=this.typeCode[this.employee.type]

      this.form.lisanceNumber=this.employee.lisanceNumber;
      this.form.lisanceType=this.employee.lisanceType;
      this.form.address=this.employee.address;
      this.form.gender= this.employee.gender;
      this.form.nationality= this.employee.nationality;
      this.form.dateOfBirth= formatShortDate(this.employee.dateOfBirth)

      this.phoneNumber  =this.employee.phone.nationalNumber
    },
    ...employeeMethod
  },
  validations: {
    form: {
      tcknOrPassport: { required,minLength: minLength(7), maxLength: maxLength(11) },
      name: { required, maxLength: maxLength(50) },
      surname: { required, maxLength: maxLength(50) },
      email: { required, email, maxLength: maxLength(50) },
      gender: { required },
      nationality: { required },
      type: { required },
      dateOfBirth: { required },
      address:{maxLength: maxLength(255)},
      lisanceNumber:{maxLength: maxLength(5)},
      lisanceType:{maxLength: maxLength(5)}
    },
    phoneNumber: { required }
  },
  async mounted() {
    await this.fetchCountries()
    await this.fetchEmployee(this.$route.params.id)
    this.setEmployee()
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.employee.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.employee.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.employee.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.employee.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Yeni Personel Oluştur</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla personel oluşturabilirsiniz.</p>
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
                    placeholder="Lütfen Personel adını giriniz..."
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
                      placeholder="Lütfen Personel soyadını giriniz..."
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
                  <div class="mb-3">
                    <label>Doğum Tarihi</label>
                    <br />
                    <date-picker value-type="date" format="DD-MM-YYYY" placeholder="Doğum tarihini" v-model="form.dateOfBirth" :first-day-of-week="1" lang="tr"
                      :class="{'is-invalid': formsubmit && $v.form.dateOfBirth.$error}">
                    </date-picker>
                    <div v-if="formsubmit && $v.form.dateOfBirth.$error" class="invalid-feedback">
                        <span v-if="!$v.form.dateOfBirth.required">Bu alan gereklidir.</span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="lisanceNumber">Ehliyet Lisans No</label>
                    <input
                      v-model="form.lisanceNumber"
                      id="lisanceNumber"
                      name="lisanceNumber"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen ehliyet lisans numarasını giriniz..."
                      :class="{
                          'is-invalid': formsubmit && $v.form.lisanceNumber.$error,
                        }"
                    />
                    <div v-if="formsubmit && $v.form.lisanceNumber.$error" class="invalid-feedback">
                        <span v-if="!$v.form.lisanceNumber.maxLength">Bu alana maksimum 5 karakter girilebilir.</span>
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
                    <VuePhoneNumberInput size="sm" default-country-code="TR" v-model="phoneNumber" @update="results = $event"
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
                  <div class="mb-3">
                    <label class="control-label">Tür</label>
                    <multiselect
                      v-model="typeObject"
                      :options="this.typeCode"
                      placeholder="Seçiniz"
                      selectLabel="Seçiniz"
                      deselectLabel="Seçimi Kaldır"
                      selectedLabel="Seçilen"
                      :custom-label="typesObject"
                      :class="{'is-invalid': formsubmit && $v.form.type.$error}"
                    >
                    </multiselect>
                    <div
                    v-if="formsubmit && $v.form.type.$error" class="invalid-feedback">
                    <span v-if="!$v.form.type.required">Bu alan gereklidir.</span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="lisanceType">Ehliyet Türü</label>
                    <input
                      v-model="form.lisanceType"
                      id="lisanceType"
                      name="lisanceType"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen ehliyet türünü giriniz..."
                      :class="{
                        'is-invalid': formsubmit && $v.form.lisanceType.$error,
                      }"
                    />
                    <div v-if="formsubmit && $v.form.lisanceType.$error" class="invalid-feedback">
                        <span v-if="!$v.form.lisanceType.maxLength">Bu alana maksimum 5 karakter girilebilir.</span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="address">Adres</label>
                    <textarea
                        v-model="form.address"
                        id="address"
                        class="form-control"
                        rows="3"
                        placeholder="Lütfen adres giriniz..."
                        :class="{
                          'is-invalid': formsubmit && $v.form.address.$error,
                        }"
                      ></textarea>
                      <div v-if="formsubmit && $v.form.address.$error" class="invalid-feedback">
                        <span v-if="!$v.form.address.maxLength">Bu alana maksimum 255 karakter girilebilir...</span>
                      </div>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.employee.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.employee.isBtnDisabled"></i>
                    Personel Güncelle
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>