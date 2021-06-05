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
  userMethod
} from "@/state/helpers";

/**
 * user-create component
 */
export default {
  page: {
    title: "Kullanıcı Güncelle",
  },
  components: { Layout, PageHeader,Multiselect,VuePhoneNumberInput },
  data() {
    return {
      title: "Güncelle",
      items: [
        {
          text: "Kullanıcı",
          href: "/",
        },
        {
          text: "Güncelle",
          active: true,
        },
      ],
      form: {
        name: null,
        surname: null,
        email: null,
        phone: {
          countryCode: "",
          nationalNumber: "",
          countryCallingCode: "",
          formattedNumber: "",
          phoneNumber:""
        },
        role:null,
        gender:null
      },
      role:[{id:0,value:'Yönetici'},{id:1,value:'Operatör'}],
      roleValue:null,
      gender:['E','K'],
      isLoading:false,
      formsubmit: false,
      phoneNumber: null,
      results: null,
    };
  },
  watch:{ 
    roleValue(object){
      this.form.role=object.id
    },
    phoneNumber(){
      this.form.phone.countryCode=this.user.phone.countryCode
      this.form.phone.nationalNumber=this.user.phone.nationalNumber
      this.form.phone.countryCallingCode=this.user.phone.countryCallingCode
      this.form.phone.formattedNumber=this.user.phone.formattedNumber
      this.form.phone.phoneNumber=this.user.phone.phoneNumber
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
    resetForm(){
      return this.$store.state.user.notification.status
    },
    user(){
      return this.$store.state.user.user
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.updateUser({id:this.$route.params.id,form:this.form});
      }
    },
    setUser(){
      this.form.name=this.user.name
      this.form.surname=this.user.surname
      this.form.email=this.user.email
      this.form.role=this.user.role
      this.roleValue=this.role[this.user.role]
      this.form.gender=this.user.gender
      
      this.phoneNumber=this.user.phone.nationalNumber
    },
    roleObject ({ value }) {
      return value
    },
    ...userMethod
  },
  validations: {
    form: {
      name: { required, maxLength: maxLength(50) },
      surname: { required, maxLength: maxLength(50) },
      phone: { required, maxLength: maxLength(20) },
      email: { required, email,minlength:minLength(6),maxLength: maxLength(50) },
      gender: { required },
      role: { required },
    },
    phoneNumber: { required, maxLength: maxLength(50) }
  },
  async mounted() {
    await this.fetchUser(this.$route.params.id)
    this.setUser()
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.user.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.user.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.user.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.user.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Kullanıcı Güncelle</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla kullanıcı oluşturabilirsiniz.</p>
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
                    <label for="name">Ad</label>
                    <input
                      v-model="form.name"
                      id="name"
                      name="name"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen kullanıcı adını giriniz..."
                      :class="{
                        'is-invalid': formsubmit && $v.form.name.$error,
                      }"
                    />
                    <div v-if="formsubmit && $v.form.name.$error" class="invalid-feedback">
                      <span v-if="!$v.form.name.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.form.name.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="surname">Soyad</label>
                    <input
                      v-model="form.surname"
                      id="surname"
                      name="surname"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen kullanıcı adını giriniz..."
                      :class="{
                        'is-invalid': formsubmit && $v.form.surname.$error,
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
                    <label for="role">Rol</label>
                    <multiselect 
                        v-model="roleValue" 
                        :options="this.role"
                        :searchable="true"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{
                        'is-invalid': formsubmit && $v.form.role.$error,
                        }"
                        :custom-label="roleObject">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div
                      v-if="formsubmit && $v.form.role.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.role.required"
                        >Bu alan gereklidir.</span
                      >
                    </div>
                  </div>   
                </div>
                <div class="col-sm-6">
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
                    <label for="email">Email</label>
                    <input
                      v-model="form.email"
                      id="email"
                      name="email"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen kullanıcı adını giriniz..."
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
                      <span v-if="!$v.form.email.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="gender">Cinsiyet</label>
                    <multiselect 
                        v-model="form.gender" 
                        :options="this.gender"
                        :searchable="true"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{
                        'is-invalid': formsubmit && $v.form.gender.$error,
                        }">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                          <div
                          v-if="formsubmit && $v.form.gender.$error"
                          class="invalid-feedback"
                        >
                          <span v-if="!$v.form.gender.required"
                            >Bu alan gereklidir.</span
                          >
                        </div>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.user.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.user.isBtnDisabled"></i>
                    Kullanıcı Güncelle
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