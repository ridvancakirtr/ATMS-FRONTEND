<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import {
  required
} from "vuelidate/lib/validators";

import {
  airportMethod
} from "@/state/helpers";

/**
 * airport-create component
 */
export default {
  page: {
    title: "Yeni Havalimanı Güncelle",
  },
  components: { Layout, PageHeader,Multiselect },
  data() {
    return {
      title: "Yeni Güncelle",
      items: [
        {
          text: "Havalimanı",
          href: "/",
        },
        {
          text: "Yeni Güncelle",
          active: true,
        },
      ],
      form: {
        airport: null
      },
      airportValue:null,
      formsubmit: false,
      isLoading:false
    };
  },
  watch:{ 
    airportValue(value){
      if(value!=null){
        this.form.airport=value._id
      }
    }
  },
  computed: {
    resetForm(){
      return this.$store.state.airport.notification.status
    },
    airports(){
      return this.$store.state.airport.uetdsAirports
    },
    airport(){
      return this.$store.state.airport.airport
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.updateAirport({id:this.$route.params.id,form:this.form});
      }
    },
    airportObject ({ name,cityName }) {
      return `${name} — [${cityName}]`
    },
    setAirport(){
      this.form.airport=this.airport.airport._id;
      this.airportValue=this.airport.airport;
    },
    ...airportMethod
  },
  validations: {
    airportValue: { required }
  },
  async mounted() {
    await this.fetchUetdsAirports();
    await this.fetchAirport(this.$route.params.id)
    this.setAirport()
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.airport.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.airport.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.airport.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.airport.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Yeni Havalimanı Güncelle</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla Havalimanı oluşturabilirsiniz.</p>
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
                    <label for="role">Havalimanı</label>
                    <multiselect 
                        v-model="airportValue" 
                        :options="this.airports"
                        :searchable="true"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{
                        'is-invalid': formsubmit && $v.airportValue.$error,
                        }"
                        :custom-label="airportObject">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div
                      v-if="formsubmit && $v.airportValue.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.airportValue.required"
                        >Bu alan gereklidir.</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.airport.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.airport.isBtnDisabled"></i>
                    Havalimanı Güncelle
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>