<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import 'vue2-datepicker/locale/tr';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'

import {
  rezervationMethod,
  vehicleMethod,
  employeeMethod
} from "@/state/helpers";
/**
 * Advanced table component
 */
export default {
  page: {
    title: "Rezervasyon Listesi"
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
    DatePicker
  },
  data() {
    return {
      startDate:null,
      endDate:null,
      title: "Rezervasyon Listesi",
      items: [
        {
          text: "Rezervasyon",
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
          key: "pickUpDateTime",
          label: 'Tarih',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "flightNumber",
          label: 'Uçuş No',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "startPoint",
          label: 'Nereden',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "endPoint",
          label: 'Nereye',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "vehicleType",
          label: 'Araç Tipi',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "vehicle",
          label: 'Araç',
          sortable: true
        },
        {
          key: "employess",
          label: 'Personel',
          sortable: true
        },
        {
          key: "price",
          label: 'Fiyat',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "customer",
          label: 'Adı Soyadı',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "gender",
          label: 'Cinsiyet',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "phoneNumber",
          label: 'Telefon',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: "note",
          label: 'Açıklama',
          sortable: true,
          tdClass: 'align-middle',
        },
        
        { 
          key: 'actions', 
          label: 'Durum',
          tdClass: 'align-middle'
        }
      ],
      newVehicles:[],
      newEmployees:[],
      employessArray:[],
      transferDirection:[{id:3,value:"Tümü"},{id:0,value:"Havalimanından Noktaya"},{id:1,value:'Noktadan Havalimanına'},{id:2,value:'Noktadan Noktaya'}],
      selectedTransferDirection:null
    };
  },
  watch:{
    currentPage(value){
      if(this.filter!=null){
        this.fetchRezervations({page:value,limit:this.perPage,search:this.filter})
      }else{
        this.fetchRezervations({page:value,limit:this.perPage,search:""})
      }
      
    },
    perPage(value){
      this.fetchRezervations({page:this.currentPage,limit:value,search:""})
    },
    filter(value){
      this.fetchRezervations({page:"",limit:this.perPage,search:value})
      this.currentPage=1
    }
  },
  computed: {
    rows() {
      if(this.$store.state.rezervation.isLoad){
        return this.$store.state.rezervation.rezervations.totalPages
      }
      return 1
    },
    rezervations(){
      return this.$store.state.rezervation.rezervations.data
    },
    vehicles(){
      return this.$store.state.vehicle.vehicles.data
    },
    employees(){
      return this.$store.state.employee.employees.data
    }
  },
  methods: {
    ...rezervationMethod,
    ...vehicleMethod,
    ...employeeMethod,
    transferDirectionObject(value) {
      return `${value.value}`
    },
    vehiclesObject ({plate , brand , model}) {
      return `${plate}-${brand} ${model}`
    },
    employessTypesObject ({name,surname}) {
      return `${name} ${surname}`
    },
    async updateVehicleRow(row,vehicle){
      let payload={
        id:row.item._id,
        form:{
          vehicle:vehicle._id
        },
        vehicle:vehicle,
        index:row.index
      }
      await this.updateVehicleOfRezervation(payload);
    },
    async removeVehicleRow(row,vehicle){
      let payload={
        id:row.item._id,
        form:{
          vehicle:vehicle._id
        },
        vehicle:null,
        index:row.index
      }
      await this.updateVehicleOfRezervation(payload);
    },
    async setEmployeeRow(row,employee){
      let payload={
        id:row.item._id,
        employee:employee,
        index:row.index
      }
      await this.setEmployeeOfRezervation(payload);
    },
    async removeEmployeeRow(row,employee){
      let payload={
        id:row.item._id,
        employee:employee,
        index:row.index
      }
      await this.removeEmployeeOfRezervation(payload);
    },
    setVehicle(){
     this.newVehicles=this.vehicles
    },
    setEmployee(){
      //0-Şoför 1-Şöför Yrd.2-Host 3-Hostes 4-Diğer 5-Rehber
      //console.log('this.employees',this.employees);
      let tempSofor=[]
      let tempSoforYrd=[]
      let tempHost=[]
      let tempHostes=[]
      let tempDiger=[]
      let tempRehber=[]
      this.employees.forEach(element => {
        if(element.type==0){
          tempSofor.push({name:element.name,surname:element.surname,_id:element._id})
        }
        if(element.type==1){
          tempSoforYrd.push({name:element.name,surname:element.surname,_id:element._id})
        }
        if(element.type==2){
          tempHost.push({name:element.name,surname:element.surname,_id:element._id})
        } 
        if(element.type==3){
          tempHostes.push({name:element.name,surname:element.surname,_id:element._id})
        }
        if(element.type==4){
          tempDiger.push({name:element.name,surname:element.surname,_id:element._id})
        }
        if(element.type==5){
          tempRehber.push({name:element.name,surname:element.surname,_id:element._id})
        }
      });

      if(tempSofor.length>0){
          this.employessArray.push({type:"Şoför",employees:tempSofor})
        }

      if(tempSoforYrd.length>0){
          this.employessArray.push({type:"Şöför Yrd",employees:tempSoforYrd})
        }

        if(tempHost.length>0){
          this.employessArray.push({type:"Host",employees:tempHost})
        }

        if(tempHostes.length>0){
          this.employessArray.push({type:"Hostes",employees:tempHostes})
        }

        if(tempDiger.length>0){
          this.employessArray.push({type:"Diğer",employees:tempDiger})
        }

        if(tempRehber.length>0){
           this.employessArray.push({type:"Rehber",employees:tempRehber})
        }
    },
    limitText (count) {
      return `+ ${count}`
    },
    async searchButton(){
      console.log(this.selectedTransferDirection);
      if(this.selectedTransferDirection.id==3){
        await this.fetchRezervationsSearch({startDate:this.startDate,endDate:this.endDate})
      }else{
        await this.fetchRezervationsSearch({startDate:this.startDate,endDate:this.endDate,direction:this.selectedTransferDirection.id})
      }
    },
    async todayButton(){
      var today = new Date();
      await this.fetchRezervationsSearch({startDate:today,endDate:today})
    },
    async tomorrowButton(){
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await this.fetchRezervationsSearch({startDate:tomorrow,endDate:tomorrow})
    },
    async allButton(){
      await this.fetchRezervations({page:this.currentPage,limit:this.perPage,search:""})
    },
    getVariant (status) {
      switch (status) {
        case 1:
          return 'danger'
        case 2:
          return 'warning'
        default:
          return null
      }
    },
    printPDF(){
      console.log('girdi')

      let temp=[]
       
      console.log(this.rezervations);

      this.rezervations.forEach((element) => {
            let vehicle=null
            let employess=''
            let startPoint=this.$options.filters.point(element.startPoint)
            let endPoint=this.$options.filters.point(element.endPoint)

            if(vehicle!=null){
              vehicle=element.vehicle.plate+' '+element.vehicle.brand+' '+element.vehicle.model
            }else{
              vehicle=null
            }

            if(element.employee.length>0){
              console.log('---',element.employee);
              
              element.employee.forEach((element_in) => {
                employess += element_in.name+' '+element_in.surname+' '

              })
              
            } else {
              employess=null
            }

            console.log(element);
            let table=[
              element.pickUpDateTime,
              element.flightNumber,
              startPoint,
              endPoint,
              element.vehicleType.name,
              vehicle,
              employess,
              element.price.total,
              element.customer.name+' '+element.customer.surname,
              element.customer.phone.formattedNumber,
              element.note
            ]
            temp.push(table)
        }
      );
      console.log('temp',temp);
      const doc = new jsPDF({
        orientation: "landscape",
        format: 'a4',
      });

      
      doc.text("Hello world!", 10, 10);
      doc.autoTable({
        head: [['Tarih', 'Uçuş Numarası', 'Nereden','Nereye','Araç Tipi','Araç','Personel','Fiyat','Adı Soyadı','Telefon','Açıklama']],
        body: temp,
        theme: 'grid',
      })
      doc.setFont('Lato-Regular', 'normal');
      doc.save('table.pdf')
    }
  },
  async mounted() {
    await this.fetchRezervations({page:this.currentPage,limit:this.perPage,search:""})
    await this.fetchVehicles({page:1,limit:1000,search:""})
    await this.fetchEmployees({page:1,limit:1000,search:""})
    this.setVehicle();
    this.setEmployee();
    this.selectedTransferDirection=this.transferDirection[0]
    var sDate=new Date();
    var eDate = new Date();
    eDate.setDate(eDate.getDate() + 7);

    this.startDate=sDate
    this.endDate=eDate

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
            <h4 class="card-title">Tüm Rezervasyonlarınızı Listeleyein veya Filtreleyin</h4>
            <span>Tüm rezervasyonları tarih aralığı ve transfer yönüne göre listeleyebilirsiniz. Beyaz renkli sıra; Havalimanından Çıkış, Kırmızı renkli sıra; Havalimanına Dönüş, Sarı renkli sıra; Noktadan Noktaya transferleri belirtmektedir.</span>
            <div class="row">

                <div class="col-md-12 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="form-group mt-3 mb-0">
                        <label>Başlangıç Tarihi :</label>
                        <date-picker :clearable="false" format="DD-MM-YYYY" placeholder="Başlangıç Tarihi" v-model="startDate" :first-day-of-week="1" lang="tr"/>
                    </div>
                </div>

                <div class="col-md-12 col-lg-2 col-xl-2 col-xxl-2">
                    <div class="form-group mt-3 mb-0">
                        <label>Bitiş Tarihi :</label>
                        <date-picker :clearable="false" format="DD-MM-YYYY" placeholder="Bitiş Tarihi" v-model="endDate" :first-day-of-week="1" lang="tr"/>
                    </div>
                </div>

                <div class="col-md-9 col-lg-2 col-xl-2 col-xxl-3">
                    <div class="form-group mt-3 mb-0">
                        <label>Transfer Yönü :</label>
                        <multiselect 
                          v-model="selectedTransferDirection"
                          :options="this.transferDirection"
                          :custom-label="transferDirectionObject"
                          :searchable="true"
                          id="customerGender"
                          placeholder="Seçiniz"
                          :allow-empty="false"
                          selectLabel=""
                          deselectLabel=""
                          selectedLabel="">
                        </multiselect>
                    </div>
                </div>

                <div class="col-md-3 col-lg-2 col-xl-2 col-xxl-1 align-self-end">
                    <div class="mt-3 d-grid">
                        <button type="button" v-on:click="searchButton" class="btn btn-warning w-md">
                            Ara
                        </button>
                    </div>
                </div>

                <div class="col-md-3 col-lg-4 col-xl-4 col-xxl-1 align-self-end">
                    <div class="mt-3 d-grid">
                        <button type="button" v-on:click="todayButton" class="btn btn-success w-md">
                            Bugün
                        </button>
                    </div>
                </div>

                <div class="col-md-3 col-lg-4 col-xl-4 col-xxl-1 align-self-end">
                    <div class="mt-3 d-grid">
                        <button type="button" v-on:click="tomorrowButton" class="btn btn-success w-md">
                            Yarın
                        </button>
                    </div>
                </div>

                <div class="col-md-3 col-lg-4 col-xl-4 col-xxl-1 align-self-end">
                    <div class="mt-3 d-grid">
                        <button type="button" v-on:click="allButton" class="btn btn-success w-md">
                            Tümü
                        </button>
                    </div>
                </div>
               
                <div class="col-md-3 col-lg-4 col-xl-4 col-xxl-1 align-self-end">
                    <div class="mt-3 d-grid">
                        <button type="button" v-on:click="printPDF" class="btn btn-light w-md">
                           <i class="fa fa-print"></i> Yazdır
                        </button>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    <b-form-select class="form-select form-select-sm ml-2" v-model="perPage" size="sm" :options="pageOptions">
                    </b-form-select> &nbsp;
                    Göster
                  </label>
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
            <div class="table-responsive table-nowrap mb-0 ">
              <b-table
                :items="rezervations"
                :fields="fields"
                :per-page="perPage"
                :current-page="1"
                :filter="filter"
                :busy="!this.$store.state.rezervation.isLoad"
                hover
              >
                <template #cell(pickUpDateTime)="row">
                  <span v-show="false">{{ row.item._rowVariant=getVariant(row.item.transferDirection) }}</span>
                  {{ row.value | date }}
                </template>
                <template #cell(flightNumber)="row">
                  {{ row.item.flightNumber }}
                </template>
                <template #cell(startPoint)="row">
                  {{ row.value | point }}
                </template>
                <template #cell(endPoint)="row">
                  {{ row.value | point }}
                </template>
                <template #cell(vehicle)="row">
                  <b-row style="width: 250px;margin-right: 10px;">
                    <multiselect
                      v-bind:value="row.item.vehicle"
                      v-on:select="updateVehicleRow(row,$event)" 
                      v-on:remove="removeVehicleRow(row,$event)"
                      placeholder="Seçiniz"
                      selectLabel=""
                      deselectLabel=""
                      selectedLabel=""
                      open-direction="below"
                      :options="newVehicles" 
                      :custom-label="vehiclesObject"
                      :searchable="false">
                    </multiselect>
                  </b-row>
                </template>
                <template #cell(employess)="row">
                  <b-row style="width: 250px;margin-right: 10px;">
                    <multiselect 
                        :limit="1"
                        :limit-text="limitText"
                        v-bind:value="row.item.employee"
                        v-on:select="setEmployeeRow(row,$event)" 
                        :options="employessArray"
                        :custom-label="employessTypesObject"
                        :searchable="true"
                        :multiple="true"
                        v-on:remove="removeEmployeeRow(row,$event)"
                        track-by="_id"
                        open-direction="bottom"
                        group-values="employees"
                        group-label="type"
                        placeholder="Seçiniz"
                        selectLabel=""
                        deselectLabel=""
                        selectedLabel="">
                    </multiselect>
                  </b-row>
                </template>
                <template #cell(vehicleType)="row">
                  {{ row.value.name }}
                </template>
                <template #cell(price)="row">
                {{ row.item.price.total | priceFormat }} {{ row.item.priceCurrency | priceCurrency }}
                </template>
                <template #cell(customer)="row">
                  {{ row.value.name+' '+row.value.surname }}
                </template>
                <template #cell(gender)="row">
                  {{ row.item.customer.gender }}
                </template>
                <template #cell(phoneNumber)="row">
                  {{ row.item.customer.phone.formattedNumber }}
                </template>
                <template #cell(note)="row">
                  {{ row.item.note }}
                </template>
                <template #cell(actions)="row">
                  <b-button-group>
                    <router-link :to="{ name: 'rezervationsupdate', params: { id: row.item._id }}"><b-button size="sm" variant="outline-secondary"><i class="mdi mdi-account-edit d-block font-size-16"></i></b-button></router-link>
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
                      :total-rows="this.$store.state.rezervation.rezervations.totalDocs"
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
