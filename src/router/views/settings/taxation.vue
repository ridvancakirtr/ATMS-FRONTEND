<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import {
  required,
  maxLength
} from "vuelidate/lib/validators";

import {
  taxationMethod
} from "@/state/helpers";
/**
 * taxation-create component
 */
export default {
  page: {
    title: "Yeni Havalimanı Oluştur",
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Yeni Oluştur",
      items: [
        {
          text: "Havalimanı",
          href: "/",
        },
        {
          text: "Yeni Oluştur",
          active: true,
        },
      ],
      form: {
        isTaxation:true,
        typeOfTaxation:false,
        localTaxRate:18
      },
      formsubmit: false,
      isLoading:false,
    };
  },
  watch:{ 
    'form.isTaxation'(value){
        this.form.isTaxation=value
    },
    'form.typeOfTaxation'(value){
        this.form.typeOfTaxation=value
    },
    'form.localTaxRate'(value){
        if(value==''){
          value='0';
        }
    }
  },
  computed: {
    taxation(){
      return this.$store.state.taxation.taxation
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.updateTaxation({id:this.taxation._id ,form :this.form});
      }
    },
    setTaxation(){
      this.form.isTaxation=this.taxation.isTaxation
      this.form.typeOfTaxation=this.taxation.typeOfTaxation
      this.form.localTaxRate=this.taxation.localTaxRate
    },
    ...taxationMethod
  },
  validations: {
    form: {
      localTaxRate: { required, maxLength: maxLength(2) }
    }
  },
  async mounted() {
    await this.fetchTaxation();
    this.setTaxation();
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.taxation.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.taxation.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.taxation.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.taxation.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Vergilendirme</h4>
            <p class="card-title-desc" v-if="isLoading">Tahsil edeceğiniz tüm ödemeler için vergilendirme uygulayabilirsiniz. Vergi hesaplama türünü isteğe bağlı olarak fiyatın içinde ve dışında olacak şekilde tanımlayabilirsiniz. </p>
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
                    <label class="mb-1 mt-3 fw-medium">Vergilendirme</label>
                  <div class="mb-3">
                    <div class="form-check form-switch mb-3">
                        <input v-model="form.isTaxation" class="form-check-input" type="checkbox" id="taxation" checked />
                        <label class="form-check-label" for="taxation">
                            Tüm finansal işlemler için vergilendirmeyi aktif et.
                        </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="mb-1 mt-3 fw-medium">Vergilendirme Türü</label>
                <div class="col-sm-6">
                    <div class="form-check form-check-left mb-3">
                        <input class="form-check-input" :value="false" v-model="form.typeOfTaxation" type="radio" id="taxExcluded" name="taxgroup" :checked="this.form.typeOfTaxation" />
                        <label class="form-check-label" for="taxExcluded">Vergi Hariç</label>
                        <p class="text-muted font-10">KDV, tanımladığınız fiyatın dışında olacak şekilde hesaplanır. Tüm fiyatlar kdv hariç olarak görünür.</p>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-check form-check-left mb-3">
                        <input class="form-check-input" :value="true" v-model="form.typeOfTaxation" type="radio" id="taxIncluded" name="taxgroup" :checked="this.form.typeOfTaxation"/>
                        <label class="form-check-label" for="taxIncluded">Vergi Dahil</label>
                        <p class="text-muted font-10">KDV, tanımladığınız fiyatın içerisinde olacak şekilde hesaplanır. Tüm fiyatlar kdv dahil olarak görünür.</p>
                    </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                        <label for="localTaxRate">Yerel Vergi Oranı (%)</label>
                        <input
                        v-model="form.localTaxRate"
                        id="localTaxRate"
                        name="hotel"
                        type="number"
                        class="form-control"
                        placeholder="Lütfen vergi oranı giriniz..."
                        :class="{
                        'is-invalid': formsubmit && $v.form.localTaxRate.$error,
                          }"
                        />
                        <div v-if="formsubmit && $v.form.localTaxRate.$error" class="invalid-feedback">
                        <span v-if="!$v.form.localTaxRate.required">Bu alan gereklidir.</span>
                        <span v-if="!$v.form.localTaxRate.maxLength">Bu alana maksimum 2 karakter girilebilir.</span>
                    </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.taxation.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.taxation.isBtnDisabled"></i>
                    Ayarları Kaydet
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>