<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import {
  required,
  maxLength
} from "vuelidate/lib/validators";

import {
  vehicleMethod
} from "@/state/helpers";

/**
 * Customer-create component
 */
export default {
  page: {
    title: "Araç Güncelle",
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Araç Güncelle",
      items: [
        {
          text: "Araç",
          href: "/",
        },
        {
          text: "Güncelle",
          active: true,
        },
      ],
      form: {
        brand: null,
        model: null,
        year: null,
        km: null,
        plate:null,
        note:null,
        isRental:false
      },
      isLoading:false,
      formsubmit: false
    };
  },
  computed: {
    vehicle(){
      return this.$store.state.vehicle.vehicle
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.updateVehicle({id:this.$route.params.id,form:this.form});
      }

    },
    setVehicle(){
      this.form.brand=this.vehicle.brand
      this.form.model=this.vehicle.brand
      this.form.year=this.vehicle.year
      this.form.km=this.vehicle.km
      this.form.plate=this.vehicle.plate
      this.form.note=this.vehicle.note
      this.form.isRental=this.vehicle.isRental
    },
    ...vehicleMethod
  },
  validations: {
    form: {
      brand: { required, maxLength: maxLength(50) },
      model: { required, maxLength: maxLength(50) },
      year: { required, maxLength: maxLength(4) },
      km: { required, maxLength: maxLength(50) },
      plate: { required,maxLength: maxLength(50) },
      note: { maxLength: maxLength(255) },

    },
  },
  async mounted() {
    await this.fetchVehicle(this.$route.params.id)
    this.setVehicle()
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <b-alert show dismissible variant="success" v-if="this.$store.state.vehicle.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.vehicle.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.vehicle.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.vehicle.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Yeni Araç Güncelle</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla araç oluşturabilirsiniz.</p>
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
                    <label for="brand">Marka</label>
                    <input
                      v-model="form.brand"
                      id="brand"
                      name="brand"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen araç markasını giriniz..."
                      :class="{
                        'is-invalid': formsubmit && $v.form.brand.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.brand.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.brand.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.brand.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                     <label for="name">Model</label>
                    <input
                    v-model="form.model"
                    id="model"
                    name="model"
                    type="text"
                    class="form-control"
                    placeholder="Lütfen araç modelini giriniz..."
                    :class="{
                      'is-invalid': formsubmit && $v.form.model.$error,
                    }"
                  />
                  <div
                    v-if="formsubmit && $v.form.model.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.model.required"
                      >Bu alan gereklidir.</span
                    >
                    <span v-if="!$v.form.model.maxLength"
                      >Bu alana maksimum 50 karakter girilebilir.</span
                    >
                  </div>
                  </div>
                  <div class="mb-3">
                    <label for="year">Model Yılı</label>
                    <input
                      v-model="form.year"
                      id="year"
                      name="year"
                      type="number"
                      class="form-control"
                      placeholder="Lütfen model yılını giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.form.year.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.year.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.year.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.year.maxLength"
                        >Bu alana maksimum 4 karakter girilebilir.</span
                      >
                    </div>
                  </div>                 
                </div>
                <div class="col-sm-6">
                    <div class="mb-3">
                    <label for="km">Kilometre</label>
                    <input
                      v-model="form.km"
                      id="km"
                      name="km"
                      type="number"
                      class="form-control"
                      placeholder="Lütfen kilometre giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.form.km.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.km.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.km.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.year.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="plate">Plaka</label>
                    <input
                      v-model="form.plate"
                      id="plate"
                      name="plate"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen araç plakasını giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.form.plate.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.plate.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.plate.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.plate.maxLength"
                        >Bu alana maksimum 50 karakter girilebilir.</span
                      >
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="note">Araç Notu</label>
                    <textarea
                        v-model="form.note"
                        id="note"
                        class="form-control"
                        rows="3"
                        placeholder="Lütfen araç notu giriniz..."
                        :class="{
                          'is-invalid': formsubmit && $v.form.note.$error,
                        }"
                      ></textarea>
                      <div v-if="formsubmit && $v.form.note.$error" class="invalid-feedback">
                        <span v-if="!$v.form.note.maxLength">Bu alana maksimum 255 karakter girilebilir...</span>
                      </div>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.vehicle.isBtnDisabled">
                    <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.vehicle.isBtnDisabled"></i>
                    Araç Güncelle
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>