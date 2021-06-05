<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import {
  agencyMethod
} from "@/state/helpers";
/**
 * Advanced table component
 */
export default {
  page: {
    title: "Acenta Listesi"
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Acenta Listesi",
      items: [
        {
          text: "Acentalar",
          href: "/",
        },
        {
          text: "Liste",
          active: true,
        },
      ],
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      fields: [
        {
          key: "companyName",
          label: 'Acenta Ünvanı',
          sortable: true
        },
        {
          key: "taxAdministration",
          label: 'Vergi Dairesi',
          sortable: true
        },
        {
          key: "taxNumber",
          label: 'Vergi Kimlik No',
          sortable: true
        },
        {
          key: "authorizedName",
          label: 'Yetkili Ad',
          sortable: true
        },
        {
          key: "authorizedSurname",
          label: 'Yetkili Soyad',
          sortable: true
        },
        {
          key: "authorizedPhone",
          label: 'Yetkili Telefon',
          sortable: true
        },
        {
          key: "authorizedEmail",
          label: 'Email',
          sortable: true
        },
        { key: 'actions', label: 'Durum' }
      ],

    };
  },
  watch:{
    currentPage(value){
      if(this.filter!=null){
        this.fetchAgencies({page:value,limit:this.perPage,search:this.filter})
      }else{
        this.fetchAgencies({page:value,limit:this.perPage,search:""})
      }
      
    },
    perPage(value){
      this.fetchAgencies({page:this.currentPage,limit:value,search:""})
    },
    filter(value){
      this.fetchAgencies({page:"",limit:this.perPage,search:value})
      this.currentPage=1
    }
  },
  computed: {
    rows() {
      if(this.$store.state.agency.isLoad){
        return this.$store.state.agency.agencies.totalPages
      }
      return 1
    },
    agencies(){
      return this.$store.state.agency.agencies.data
    }
  },
  mounted() {
    this.fetchAgencies({page:this.currentPage,limit:this.perPage,search:""})
  },
  methods: {
    ...agencyMethod
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Acentalar</h4>
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    <b-form-select
                      class="form-select form-select-sm"
                      v-model="perPage"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select> &nbsp;Göster</label>
                </div>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-end">
                  <label class="d-inline-flex align-items-center">
                    Arama:
                    <b-form-input v-model="filter" type="search" placeholder="Arama..." class="form-control form-control-sm ms-2"></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                class="datatables"
                :items="agencies"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="1"
                :filter="filter"
                :busy="!this.$store.state.agency.isLoad"
              >
              <template #cell(authorizedPhone)="row">
                {{ row.value.formattedNumber }}
              </template>
              <template #cell(actions)="row">
                <b-button-group>
                  <router-link :to="{ name: 'agenciesupdate', params: { id: row.item._id }}"><b-button size="sm" variant="outline-secondary"><i class="mdi mdi-account-edit d-block font-size-16"></i></b-button></router-link>
                  <b-button size="sm" variant="outline-secondary"><i class="mdi mdi-account-details d-block font-size-16"></i></b-button>
                </b-button-group>
              </template>
              <template #table-busy>
                <div class="text-center text-primary my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Yükleniyor...</strong>
                </div>
              </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div class="dataTables_paginate paging_simple_numbers float-end">
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="this.$store.state.agency.agencies.totalDocs"
                      :per-page="perPage"
                    ></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
