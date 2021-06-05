<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import {
  required,
  maxLength
} from "vuelidate/lib/validators";

import {
  vehicleTypeMethod
} from "@/state/helpers";

/**
 * vehicletype-create component
 */
export default {
  page: {
    title: "Yeni Araç Tipi Oluştur",
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Yeni Oluştur",
      items: [
        {
          text: "Araç Tipi",
          href: "/",
        },
        {
          text: "Yeni Oluştur",
          active: true,
        },
      ],
      form: {
        name: null,
        pax:null,
        queue:null
      },
      formsubmit: false,
      isLoading:false
    };
  },
  watch:{ 
    resetForm(value){
      if(value){
        this.form.name=null;
        this.form.pax=null;
        this.form.queue=null;
      }
    }
  },
  computed: {
    vehicletype(){
      return this.$store.state.vehicletype.vehicleType
    }
  },
  methods: {
    submitForm() {
      this.formsubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.updateVehicleType({id:this.$route.params.id,form:this.form});
      }
    },
    setVehicle(){
      this.form.name=this.vehicletype.name
      this.form.pax=this.vehicletype.pax
      this.form.queue=this.vehicletype.queue
    },
    ...vehicleTypeMethod
  },
  validations: {
    form: {
      name: { required, maxLength: maxLength(50) },
      pax: { required, maxLength: maxLength(2) },
      queue: { required, maxLength: maxLength(2) }
    }
  },
  async mounted() {
    await this.fetchVehicleType(this.$route.params.id)
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
        <b-alert show dismissible variant="success" v-if="this.$store.state.vehicletype.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.vehicletype.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.vehicletype.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.vehicletype.notification.message}}
        </b-alert>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4" v-if="isLoading">Yeni Araç Tipi Oluştur</h4>
            <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla araç tipi oluşturabilirsiniz.</p>
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
                    <label for="name">Araç Tipi</label>
                    <input
                      v-model="form.name"
                      id="name"
                      name="name"
                      type="text"
                      class="form-control"
                      placeholder="Wolksvagen Crafter (7+1)"
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
                    <label for="pax">Araç Kapasitesi</label>
                    <input
                      v-model="form.pax"
                      id="pax"
                      name="pax"
                      type="number"
                      class="form-control"
                      placeholder="Örn : 7"
                      :class="{
                        'is-invalid': formsubmit && $v.form.pax.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.form.pax.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.pax.required"
                        >Bu alan gereklidir.</span
                      >
                      <span v-if="!$v.form.pax.maxLength"
                        >Bu alana maksimum 2 karakter girilebilir.</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="mb-3">
                    <label for="queue">Sıra</label>
                    <input
                  v-model="form.queue"
                  id="queue"
                  name="queue"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  :class="{
                    'is-invalid': formsubmit && $v.form.queue.$error,
                  }"
                />
                <div v-if="formsubmit && $v.form.queue.$error" class="invalid-feedback">
                  <span v-if="!$v.form.queue.required">Bu alan gereklidir.</span>
                  <span v-if="!$v.form.queue.maxLength">Bu alana maksimum 2 karakter girilebilir.</span>
                </div>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button type="submit" class="btn btn-success" :disabled="this.$store.state.vehicletype.isBtnDisabled">
                  <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.vehicletype.isBtnDisabled"></i>
                  Araç Tipi Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>