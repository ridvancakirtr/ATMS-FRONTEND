<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import {
  required,
  maxLength
} from "vuelidate/lib/validators";

import {
  pointMethod
} from "@/state/helpers";

/**
 * point-create component
 */
export default {
  page: {
    title: "Lokasyon Güncelle",
  },
  components: { Layout, PageHeader,Multiselect },
  data() {
    return {
      title: "Güncelle",
      items: [
        {
          text: "Lokasyon",
          href: "/",
        },
        {
          text: "Güncelle",
          active: true,
        },
      ],
      form:{
        type:null,
        city:null,
        point:null,
        hotel:null
      },
      isLoading:false,
      formsubmit: false,
      locationType:['Konum','Otel'],
      cityValue:null
    };
  },
  watch:{ 
    cityValue(value){
      this.form.city=value._id
    },

    "form.type"(value){
      if(value=='Konum'){
        this.form.hotel=null
      }
    }
  },
  computed: {
    cities(){
      return this.$store.state.point.cities
    },
    point(){
      return this.$store.state.point.point
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.updatePoint({id:this.$route.params.id,form:this.form});
      }
    },
    cityObject ({ name,cityName }) {
      return `${name} — [${cityName}]`
    },
    setPoint(){
      this.form.type=this.point.type
      this.form.city=this.point.city._id
      this.cityValue=this.point.city
      this.form.point=this.point.point
      this.form.hotel=this.point.hotel
      console.log(this.point);
    },
    ...pointMethod
  },
  validations: {
    form: {
      type: { required },
      city: { required },
      point: { required, maxLength: maxLength(20) }
    }
  },
  async mounted() {
    await this.fetchCities();
    await this.fetchPoint(this.$route.params.id)
    this.setPoint()
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.point.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.point.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.point.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.point.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Lokasyon Güncelle</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla Lokasyon oluşturabilirsiniz.</p>
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
                    <label for="type">Lokasyon Türü</label>
                    <multiselect 
                        v-model="form.type" 
                        :options="this.locationType"
                        :searchable="true"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{
                        'is-invalid': formsubmit && $v.form.type.$error,
                        }">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div
                      v-if="formsubmit && $v.form.type.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.type.required"
                        >Bu alan gereklidir.</span
                        
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="point">Konum Adı</label>
                    <input
                      v-model="form.point"
                      id="point"
                      name="point"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen konum adını giriniz..."
                      :class="{
                        'is-invalid': formsubmit && $v.form.point.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.point.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.point.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.point.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                    </div>
                  </div>    
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label for="role">İlçe/İl</label>
                    <multiselect 
                        v-model="cityValue" 
                        :options="this.cities"
                        :searchable="true"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{
                        'is-invalid': formsubmit && $v.form.city.$error,
                        }"
                        :custom-label="cityObject">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div
                      v-if="formsubmit && $v.form.city.$error"
                      class="invalid-feedback"
                    >city
                      <span v-if="!$v.form.city.required"
                        >Bu alan gereklidir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3" v-if="this.form.type=='Otel'">
                    <label for="hotel">Otel Adı</label>
                    <input
                      v-model="form.hotel"
                      id="hotel"
                      name="hotel"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen otel adını giriniz..."
                    />
                  </div>  
                </div>
                
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.point.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.point.isBtnDisabled"></i>
                    Lokasyon Güncelle
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>