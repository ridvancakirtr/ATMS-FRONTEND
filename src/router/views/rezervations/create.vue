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
  numeric,
  requiredIf
} from "vuelidate/lib/validators";

import {
  customerMethod,
  agencyMethod,
  vehicleTypeMethod,
  pointMethod,
  airportMethod

} from "@/state/helpers";

/**
 * Customer-create component
 */
export default {
  page: {
    title: "Yeni Rezervasyon Oluştur",
  },
  components: { Layout, PageHeader,Multiselect,VuePhoneNumberInput,DatePicker},
  data() {
    return {
      title: "Yeni Oluştur",
      items: [
        {
          text: "Rezervasyon",
          href: "/",
        },
        {
          text: "Yeni Oluştur",
          active: true,
        },
      ],
      rezervation:{
        customer:null,
        startPoint:null,
        endPoint:null,
        flightNumber:null,
        terminal:null,
        startDate:null,
        endDate:null,
        agency:null,
        vehicleType:null,
        directionPrice:null,
        priceCurrency:null,
        note:null,
        transferDirection:0,
        transferType:0,
        price:null,
        uetds:{
          status: false,
          price:null,
          refNumber: null,
          baslangicUlke: null,
          baslangicIl: null,
          baslangicIlce: null,
          bitisUlke: null,
          bitisIl: null,
          bitisIlce: null
        },
        pax:[]
      },
      customer: {
        tcknOrPassport: null,
        name: null,
        surname: null,
        gender: null,
        phone: {
          countryCode: null,
          nationalNumber: null,
          countryCallingCode: null,
          formattedNumber: null,
          phoneNumber: null
        },
        nationality:{
          code: null,
          countryName: null
        },
      },

      passangerList:{
        tcknOrPassport: null,
        name: null,
        surname: null,
        gender: null,
        nationality:{
          code: null,
          countryName: null
        },
      },
      
      gender:['E','K'],
      locationArray:[],
      airportArray:[],
      terminal:['İç Hatlar','Dış Hatlar'],
      status:['Ödendi','Ödenmedi'],
      transferType:[{id:0,value:"Alından Transfer"},{id:1,value:'Yönlendirilen Transfer'}],
      priceCurrency:[
        {
          id:0,
          value:'₺ TÜRK LİRASI'
        },
        {
          id:1,
          value:'€ EURO'
        },
        {
          id:2,
          value:'$ DOLAR'
        },
        {
          id:3,
          value:'£ POUND'
        }
      ],
      pickUpTime:null,
      pickUpDate:null,
      dropOffTime:null,
      dropOffDate:null,
      phoneNumber:null,
      isReturn:false,
      isLoading:false,
      addPaxSubmit: false,
      formsubmit: false,
      results:null,
      customerInputIsActive:false,
      clickCustomerSearchisActive:false,
      companyOwner:true,
      newVehicleTypes:[],
      newAgencies:[],
      oneTimeAddPassangertoList:true,
      welcomeDetails:{
        location2:null,
        location:null,
        airport:null
      }
      
    };
  },
  watch:{ 
    async results(a){
      
      this.customer.phone.countryCode=a.countryCode
      this.customer.phone.nationalNumber=a.nationalNumber
      this.customer.phone.countryCallingCode=a.countryCallingCode
      this.customer.phone.formattedNumber=a.formattedNumber
      this.customer.phone.phoneNumber=a.phoneNumber

      await this.fetchCustomers({page:"",limit:10,search:a.formattedNumber})
      

      if(this.$store.state.customer.customers.data[0]!=undefined){
        this.clickCustomerSearchisActive=true

        this.customer.tcknOrPassport=null
        this.customer.name=null
        this.customer.surname=null
        this.customer.gender=null
        this.customer.nationality=null


        //DB gelen müşteri bilgilerini customer objesine atıyoruz
        this.customer.tcknOrPassport=this.$store.state.customer.customers.data[0].tcknOrPassport
        this.customer.name=this.$store.state.customer.customers.data[0].name
        this.customer.surname=this.$store.state.customer.customers.data[0].surname
        this.customer.gender=this.$store.state.customer.customers.data[0].gender
        this.customer.nationality=this.$store.state.customer.customers.data[0].nationality
        
        this.rezervation.customer=this.$store.state.customer.customers.data[0]._id

        this.customerInputIsActive=true

        //DB gelen müşteriyi yolcu listesine ekledik
        if(this.oneTimeAddPassangertoList){
          this.rezervation.pax=[]
          this.rezervation.pax.push({
              tcknOrPassport:this.customer.tcknOrPassport,
              name:this.customer.name,
              surname:this.customer.surname,
              gender:this.customer.gender,
              nationality:this.customer.nationality,
            }
          )
          this.oneTimeAddPassangertoList=false
        }
        
      }else{
          this.customer.tcknOrPassport=null
          this.customer.name=null
          this.customer.surname=null
          this.customer.gender=null
          this.customer.nationality=null

          this.rezervation.pax=[]
          this.oneTimeAddPassangertoList=true
          this.clickCustomerSearchisActive=false
          this.customerInputIsActive=false
      }
    },
    location(value){
      if(this.rezervation.transferDirection==0){
        console.log(value);
        if(value!=null){
          this.rezervation.startPoint= value.hotel!=null ? value.hotel +"/" + value.point +"/" +value.city[0].name+"/"+value.city[0].cityName : value.point +"/" +value.city[0].name+"/"+value.city[0].cityName
          //console.log("airport-to-location 0 | BİTİŞ - >",this.rezervation.startPoint);
        }
      }

      if(this.rezervation.transferDirection==1){
        if(value!=null){
          this.rezervation.endPoint=value.hotel!=null ? value.hotel +"/" + value.point +"/" +value.city[0].name+"/"+value.city[0].cityName : value.point +"/" +value.city[0].name+"/"+value.city[0].cityName
          //console.log("location-to-airport 1 - | BAŞLANGIÇ - >",this.rezervation.endPoint);
        }
      }

      if(this.rezervation.transferDirection==2){
        if(value!=null){
          this.rezervation.startPoint=value.hotel!=null ? value.hotel +"/" + value.point +"/" +value.city[0].name+"/"+value.city[0].cityName : value.point +"/" +value.city[0].name+"/"+value.city[0].cityName
          //console.log("location-to-location 2 - | BAŞLANGIÇ - >",this.rezervation.startPoint);
        }
      }
    },
    airport(value){
      console.log(value)
      if(this.rezervation.transferDirection==0){
        if(value!=null){
          this.rezervation.startPoint=value.airport.name +"/" +value.airport.cityName;
          //console.log("airport-to-location 0 | BAŞLANGIÇ - >",this.rezervation.startPoint);
        }
        
      }

      if(this.rezervation.transferDirection==1){
        if(value!=null){
          this.rezervation.endPoint=value.airport.name +"/" +value.airport.cityName;
          //console.log("location-to-airport 1 | BİTİŞ - >",this.rezervation.endPoint);
        }
      }
    },
    location2(value){
      if(this.rezervation.transferDirection==2){
        if(value!=null){
          this.rezervation.endPoint=value.hotel!=null ? value.hotel +"/" + value.point +"/" +value.city[0].name+"/"+value.city[0].cityName : value.point +"/" +value.city[0].name+"/"+value.city[0].cityName
          //console.log("location-to-location 2 | BİTİŞ - >",this.rezervation.endPoint);
        }
      }
    },
    isReturn(value){
      this.rezervation.isReturn=value
    },
    "rezervation.transferDirection"(){
      this.welcomeDetails.location2=null,
      this.welcomeDetails.location=null,
      this.welcomeDetails.airport=null
    }
  },
  computed: {
    countries(){
      return this.$store.state.customer.countries
    },
    agencies(){
      return this.$store.state.agency.agencies.data
    },
    customers(){
      return this.$store.state.customer.customers.data
    },
    vehicleTypes(){
      return this.$store.state.vehicletype.vehicleTypes.data
    },
    points(){
      return this.$store.state.point.points.data
    },
    airports(){
      return this.$store.state.airport.airports.data
    }
  },
  methods: {
    submitAddPaxForm() {
      this.addPaxSubmit = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
          this.rezervation.pax.push(
          {
            tcknOrPassport:this.passangerList.tcknOrPassport,
            name:this.passangerList.name,
            surname:this.passangerList.surname,
            gender:this.passangerList.gender,
            nationality:this.passangerList.nationality,
          }
        );
        
        
        this.passangerList={
        tcknOrPassport: null,
        name: null,
        surname: null,
        gender: null,
        nationality:this.countries[7]
      }
        
        this.$v.$reset();
      }
    },
    countriesObject (value) {
      return `${value.countryName} — [${value.code}]`
    },
    resetCustomerForm(){
      this.customer.tcknOrPassport=null;
      this.customer.name=null;
      this.customer.surname=null;
      this.customer.email=null;
      
      this.customer.phone.countryCode=null;
      this.customer.phone.nationalNumber=null;
      this.customer.phone.countryCallingCode=null;
      this.customer.phone.formattedNumber=null;
      this.customer.phone.phoneNumber=null;

      this.customer.gender= null;
      this.customer.nationality= null;
    },
    agencyObject ({ companyName,authorizedName,authorizedSurname }) {
      return `${companyName} — [${authorizedName} ${authorizedSurname}]`
    },
    setOwnerAgency(){
      this.agencies.forEach(element => {
          if(element.companyOwner){
            this.rezervation.agency=element
          }
      });
    },
    selectedAgency(value){
      this.rezervation.agency=value._id
      if(value.companyOwner){
        this.companyOwner=true
      }else{
        this.companyOwner=false
      }
    },
    selectedTransferType(value){
      this.rezervation.transferType=value._id
    },
    setTransferType(){
      this.rezervation.transferType=this.transferType[0]
    },
    setCustomerNationality(){
      this.customer.nationality=this.countries[7]
      this.passangerList.nationality=this.countries[7]
    },
    vehicleTypesObject ({ name,pax}) {
      return `${name} — ${pax} Kişi (Sürücü Hariç)`
    },
    locationObject({point,hotel,city}){
      if(hotel==undefined){
        return `${point} — ${city[0].name} / ${city[0].cityName}`
      }else{
        return `${hotel} — ${point} / ${city[0].name} / ${city[0].cityName}`
      }
    },
    airportObject({airport}){
      return `${airport.name} — ${airport.cityName}`
    },
    transferTypeObject({ value }){
      return value
    },
    selectedVehicleTypes(value){
      this.rezervation.vehicleType=value.name
    },
    setVehicleTypes(){
      this.newVehicleTypes=this.vehicleTypes;
    },
    selectedPriceCurrency(value){
      this.rezervation.priceCurrency=value.id
    },
    priceCurrencyObject({value}){
      return value
    },
    setAgencies(){
      this.newAgencies=this.agencies;
    },
    setLocation(){
      let tempOtel=[]
      let tempKonum=[]
      this.points.forEach(element => {
        if(element.type=="Otel"){
            tempOtel.push({point:element.point,hotel: element.hotel, city:[element.city]});
        }

        if(element.type=="Konum"){
            tempKonum.push({point:element.point, city:[element.city]});
        }

      });
      this.locationArray.push({type:"Konum",location:tempKonum})
      this.locationArray.push({type:"Otel",location:tempOtel})
    },
    setAirport(){
      this.airportArray=this.airports;
    },
    removePax(index){
      this.rezervation.pax.splice(index,  1);
    },
    submitForm() {
      this.formsubmit = true;
      console.log("rezervasyon oluştur",this);
      this.$v.$touch();
      if (!this.$v.$invalid) {
          console.log("Dalaman");
      }
    },
    ...customerMethod,
    ...agencyMethod,
    ...vehicleTypeMethod,
    ...pointMethod,
    ...airportMethod
  },
  validations: {
    passangerList: {
      tcknOrPassport: { required,minLength: minLength(7), maxLength: maxLength(11),numeric },
      name: { required, maxLength: maxLength(50) },
      surname: { required, maxLength: maxLength(50) },
      gender: { required },
      nationality: { required }
    },
    customer: {
      tcknOrPassport: { required,minLength: minLength(7), maxLength: maxLength(11) },
      name: { required, maxLength: maxLength(50) },
      surname: { required, maxLength: maxLength(50) },
      gender: { required },
      nationality: { required }
    },
    welcomeDetails:{
      airport: { required },
      location: { required }
    },
    phoneNumber: { required, maxLength: maxLength(50) },
    rezervation:{
      flightNumber:{ required, maxLength: maxLength(50) },
      terminal:{ required, maxLength: maxLength(50) },
      pickUpTime:{ required },
      pickUpDate:{ required },
      dropOffTime:{ required: requiredIf(function (value) {
        return value.isReturn
      })},
      dropOffDate:{ required: requiredIf(function (value) {
        return value.isReturn
      })},
      vehicleType:{ required, maxLength: maxLength(50) },
      price:{ required, maxLength: maxLength(50) },
      uetds:{
        price:{ required, maxLength: maxLength(50) }
      },
      directionPrice:{ required: requiredIf(function () {
        return !this.companyOwner
      }), maxLength: maxLength(50) },
      priceCurrency:{ required },
      status:{ required }
    }

  },
  async mounted() {
    await this.fetchCountries()
    await this.fetchAgencies({page:1,limit:1000,search:""})
    await this.fetchVehicleTypes({page:1,limit:1000,search:""})
    await this.fetchPoints({page:1,limit:1000,search:""})
    await this.fetchAirports({page:1,limit:1000,search:""})
    this.setOwnerAgency();
    this.setCustomerNationality();
    this.setVehicleTypes();
    this.setAgencies();
    this.setTransferType();
    this.setLocation();
    this.setAirport();
    this.isLoading=true
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <form action="#" @submit.prevent="submitForm">
      <div class="row">

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4" v-if="isLoading">Acenta Seçimi</h4>
              <p class="card-title-desc" v-if="isLoading">Bu alandan kolaylıkla acenta seçerek rezervasyon oluşturabilirsiniz.</p>
              <div class="text-center">
                  <b-spinner v-if="!isLoading"
                    type="grow"
                    class="m-2"
                    variant="primary"
                    role="status"
                  ></b-spinner>
                </div>
                <div class="row">
                  <div class="col-sm-12">
                    <div class="mb-3">
                      <label for="role">Acenta Seçiniz</label>
                      <multiselect 
                          v-model="rezervation.agency" 
                          :options="this.newAgencies"
                          :searchable="true"
                          :custom-label="agencyObject"
                          @select="selectedAgency"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Transfer Tipi</h4>
              <p class="card-title-desc" >Bu alandan kolaylıkla transfer tipi seçerek rezervasyon oluşturabilirsiniz.</p>
              <div class="row">
                <div class="col-sm-12">
                  <div class="mb-3">
                    <label for="transferType">Transfer Durumu Seçiniz</label>
                      <multiselect 
                          id="transferType"
                          v-model="rezervation.transferType" 
                          :options="this.transferType"
                          :custom-label="transferTypeObject"
                          :searchable="true"
                          @select="selectedTransferType"
                          :disabled="companyOwner"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Araç Tipi</h4>
              <p class="card-title-desc" >Bu alandan kolaylıkla acenta seçerek rezervasyon oluşturabilirsiniz.</p>
                <div class="row">
                  <div class="col-sm-12">
                    <div class="mb-3">
                      <label for="vehicleTypes">Araç Tipi Seçiniz</label>
                        <multiselect 
                            id="vehicleTypes"
                            v-model="rezervation.vehicleType" 
                            :options="this.newVehicleTypes"
                            :custom-label="vehicleTypesObject"
                            :searchable="true"
                            placeholder="Seçiniz"
                            selectLabel="Seçiniz"
                            deselectLabel="Seçimi Kaldır"
                            selectedLabel="Seçilen"
                            :class="{
                            'is-invalid':
                              formsubmit && $v.rezervation.vehicleType.$error,
                            }"
                            >
                            <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                        </multiselect>
                        <div v-if="formsubmit && $v.rezervation.vehicleType.$error" class="invalid-feedback">
                          <span v-if="!$v.rezervation.vehicleType.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.rezervation.vehicleType.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        </div> 
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        </div>

      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Yeni Müşteri</h4>
                  <div class="row">
                    <div class="col-sm-6">
                        <label for="authorizedPhone">Müşteri Telefon No</label>
                        <VuePhoneNumberInput position="top" size="sm" id="authorizedPhone" default-country-code="TR" v-model="phoneNumber" @update="results = $event"
                        :translations="{
                          countrySelectorLabel: 'Ülke Kodu',
                          countrySelectorError: 'Ülke Kodu Seçiniz',
                          phoneNumberLabel: 'Telefon Numarası',
                          example: 'Örnek :'
                        }"
                        :class="{
                          'is-invalid':
                            formsubmit && $v.phoneNumber.$error,
                        }"
                        />
                        <div v-if="formsubmit && $v.phoneNumber.$error" class="invalid-feedback">
                          <span v-if="!$v.phoneNumber.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.phoneNumber.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        </div>          
                    </div>
                    <div class="col-sm-6">
                        <label for="nationality" class="control-label">Uyruk</label>
                        <multiselect 
                          v-model="customer.nationality" 
                          id="nationality"
                          :options="this.countries"
                          :disabled="customerInputIsActive"
                          :searchable="true"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen"
                          :class="{
                          'is-invalid': formsubmit && $v.customer.nationality.$error,
                          }"
                          :custom-label="countriesObject">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                        </multiselect>
                        <div v-if="formsubmit && $v.customer.nationality.$error" class="invalid-feedback">
                          <span v-if="!$v.customer.nationality.required">Bu alan gereklidir.</span>
                        </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="mb-3 mt-2">
                        <label for="name">Müşteri Adı</label>
                        <input
                          v-model="customer.name"
                          id="name"
                          name="name"
                          type="text"
                          class="form-control"
                          placeholder="Lütfen müşteri adını giriniz..."
                          :class="{
                            'is-invalid':
                              formsubmit && $v.customer.name.$error,
                          }"
                          :disabled="customerInputIsActive"
                        />
                        <div v-if="formsubmit && $v.customer.name.$error" class="invalid-feedback">
                          <span v-if="!$v.customer.name.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.customer.name.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        </div>   
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="mb-3 mt-2">
                        <label for="surname">Müşteri Soyadı</label>
                        <input
                          v-model="customer.surname"
                          id="surname"
                          name="surname"
                          type="text"
                          class="form-control"
                          placeholder="Lütfen müşteri soyadını giriniz..."
                          :class="{
                            'is-invalid':
                              formsubmit && $v.customer.surname.$error,
                          }"
                          :disabled="customerInputIsActive"
                        />
                        <div v-if="formsubmit && $v.customer.surname.$error" class="invalid-feedback">
                          <span v-if="!$v.customer.surname.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.customer.surname.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        </div>  
                      </div>
                    </div>
                    <div class="col-sm-6">
                        <label for="gender" class="control-label">Cinsiyet</label>
                        <multiselect 
                          v-model="customer.gender" 
                          id="gender"
                          :options="this.gender"
                          :disabled="customerInputIsActive"
                          :searchable="true"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen"
                          :class="{
                          'is-invalid': formsubmit && $v.customer.gender.$error,
                          }">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                        </multiselect>
                        <div v-if="formsubmit && $v.customer.gender.$error" class="invalid-feedback">
                          <span v-if="!$v.customer.gender.required">Bu alan gereklidir.</span>
                        </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="mb-3">
                        <label for="tcknOrPassport">TC veya Pasaport Numarası</label>
                        <input
                          v-model="customer.tcknOrPassport"
                          id="tcknOrPassport"
                          name="tcknOrPassport"
                          type="text"
                          class="form-control"
                          placeholder="TC veya Pasaport numarası giriniz..."
                          :class="{
                            'is-invalid':
                              formsubmit && $v.customer.tcknOrPassport.$error,
                          }"
                          :disabled="customerInputIsActive"
                        />
                        <div v-if="formsubmit && $v.customer.tcknOrPassport.$error" class="invalid-feedback">
                          <span v-if="!$v.customer.tcknOrPassport.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.customer.tcknOrPassport.maxLength">Bu alana maksimum 11 karakter girilebilir.</span>
                        </div> 
                      </div>
                    </div>
                    <p v-if="customerInputIsActive && clickCustomerSearchisActive"><i class="mdi mdi-account-check me-1"></i> Müşteri Kayıtlı</p>
                    <p v-if="!customerInputIsActive && clickCustomerSearchisActive"><i class="mdi mdi-account-cancel me-1"></i> Müşteri Kayıtlı Değil</p>
                  </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Karşılama Detayları</h4>
              <div class="row">
                <label>Transfer Tipi</label>

                <div class="col-sm-4">
                  <label class="card-radio-label mb-2">
                    <input type="radio" id="airportToLocation" value="0" v-model="rezervation.transferDirection" class="card-radio-input" checked/>
                    <div class="card-radio">
                      <i class="mdi mdi-airplane-landing font-size-24 text-primary align-middle me-2"></i>
                      <span>Havalimanı Lokasyon</span>
                    </div>
                  </label>
                </div>

                <div class="col-sm-4">
                  <label class="card-radio-label mb-2">
                    <input type="radio" id="locationToAirport" value="1" v-model="rezervation.transferDirection" class="card-radio-input"/>
                    <div class="card-radio">
                      <i class="mdi mdi-airplane-takeoff font-size-24 text-primary align-middle me-2"></i>
                      <span>Lokasyon Havalimanı</span>
                    </div>
                  </label>
                </div>

                <div class="col-sm-4">
                  <label class="card-radio-label mb-2">
                    <input type="radio" id="locationToLocation" value="2" v-model="rezervation.transferDirection" class="card-radio-input"/>
                    <div class="card-radio">
                      <i class="mdi mdi-map-marker-outline font-size-24 text-primary align-middle me-2"></i>
                      <span>Lokasyon Lokasyon</span>
                    </div>
                  </label>
                </div>
                
              </div>

              <div class="row mt-3" v-show="rezervation.transferDirection==0">
                <div class="col-sm-6">
                  <label for="airportArray_0" class="control-label">Başlangıç Noktası</label>
                  <multiselect 
                    v-model="welcomeDetails.airport" 
                    :options="this.airportArray"
                    :searchable="true"
                    id="airportArray_0"
                    :custom-label="airportObject"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.welcomeDetails.airport.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.welcomeDetails.airport.$error" class="invalid-feedback">
                    <span v-if="!$v.welcomeDetails.airport.required">Bu alan gereklidir.</span>
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="locationArray_0" class="control-label">Bitiş Noktası</label>
                  <multiselect 
                    v-model="welcomeDetails.location" 
                    :options="this.locationArray"
                    :searchable="true"
                    group-values="location"
                    group-label="type"
                    :custom-label="locationObject"
                    id="locationArray_0"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.welcomeDetails.location.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.welcomeDetails.location.$error" class="invalid-feedback">
                    <span v-if="!$v.welcomeDetails.location.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>

              <div class="row mt-3" v-show="rezervation.transferDirection==1">
                <div class="col-sm-6">
                  <label for="locationArray_1" class="control-label">Bitiş Noktası</label>
                  <multiselect 
                    v-model="welcomeDetails.location" 
                    :options="this.locationArray"
                    :searchable="true"
                    group-values="location"
                    group-label="type"
                    :custom-label="locationObject"
                    id="locationArray_1"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.welcomeDetails.location.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.welcomeDetails.location.$error" class="invalid-feedback">
                    <span v-if="!$v.welcomeDetails.location.required">Bu alan gereklidir.</span>
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="airportArray_1" class="control-label">Başlangıç Noktası</label>
                  <multiselect 
                    v-model="welcomeDetails.airport" 
                    :options="this.airportArray"
                    :searchable="true"
                    id="airportArray_1"
                    :custom-label="airportObject"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"

                    :class="{
                    'is-invalid': formsubmit && $v.welcomeDetails.airport.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.welcomeDetails.airport.$error" class="invalid-feedback">
                    <span v-if="!$v.welcomeDetails.airport.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>
              
              <div class="row mt-3" v-show="rezervation.transferDirection==2">
                <div class="col-sm-6">
                  <label for="locationArray_2" class="control-label">Başlangıç Noktası</label>
                  <multiselect 
                    v-model="welcomeDetails.location" 
                    :options="this.locationArray"
                    :searchable="true"
                    group-values="location"
                    group-label="type"
                    :custom-label="locationObject"
                    id="locationArray_2"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.welcomeDetails.location.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.welcomeDetails.location.$error" class="invalid-feedback">
                    <span v-if="!$v.welcomeDetails.location.required">Bu alan gereklidir.</span>
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="locationArray_22" class="control-label">Bitiş Noktası</label>
                  <multiselect 
                    v-model="welcomeDetails.location2" 
                    :options="this.locationArray"
                    :searchable="true"
                    group-values="location"
                    group-label="type"
                    :custom-label="locationObject"
                    id="locationArray_22"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.welcomeDetails.location.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.welcomeDetails.location.$error" class="invalid-feedback">
                    <span v-if="!$v.welcomeDetails.location.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>

              <div class="row mt-4">
                <div class="col-sm-6">
                  <label for="flightNumber" class="control-label">Uçuş Numarası</label>
                  <input
                    v-model="rezervation.flightNumber"
                    id="flightNumber"
                    name="flightNumber"
                    type="text"
                    class="form-control"
                    placeholder="Lütfen müşteri adını giriniz..."
                    :class="{
                      'is-invalid':
                        formsubmit && $v.rezervation.flightNumber.$error,
                    }"
                  />
                  <div v-if="formsubmit && $v.rezervation.flightNumber.$error" class="invalid-feedback">
                    <span v-if="!$v.rezervation.flightNumber.required">Bu alan gereklidir.</span>
                    <span v-if="!$v.rezervation.flightNumber.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="terminal" class="control-label">Terminal Seçimi</label>
                  <multiselect 
                    v-model="rezervation.terminal" 
                    :options="this.terminal"
                    :searchable="true"
                    id="terminal"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.rezervation.terminal.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.rezervation.terminal.$error" class="invalid-feedback">
                    <span v-if="!$v.rezervation.terminal.required">Bu alan gereklidir.</span>
                    <span v-if="!$v.rezervation.terminal.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                  </div>
                </div>
              </div>
              <div class="row mt-4">
                <label>Transfer Yönü</label>
                <div class="col-sm-6">
                  <label class="card-radio-label mb-2">
                    <input type="radio" id="oneDirection" :value="false" v-model="isReturn" class="card-radio-input" checked/>
                    <div class="card-radio">
                      <i class="mdi mdi-arrow-right font-size-24 text-primary align-middle me-2"></i>
                      <span>Tek Yön</span>
                    </div>
                  </label>
                </div>
                <div class="col-sm-6">
                  <label class="card-radio-label mb-2">
                    <input type="radio" id="doubleDirection" :value="true" v-model="isReturn" class="card-radio-input"/>
                    <div class="card-radio">
                      <i class="mdi mdi-arrow-left-right font-size-24 text-primary align-middle me-2"></i>
                      <span>Gidiş Dönüş</span>
                    </div>
                  </label>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-sm-6">
                  <label>Alış Tarihi</label>
                    <date-picker format="DD-MM-YYYY" placeholder="Alış tarihi" v-model="pickUpDate" :first-day-of-week="1" lang="tr"
                      :class="{'is-invalid': formsubmit && $v.rezervation.pickUpDate.$error}">
                    </date-picker>
                    <div v-if="formsubmit && $v.rezervation.pickUpDate.$error" class="invalid-feedback">
                        <span v-if="!$v.rezervation.pickUpDate.required">Bu alan gereklidir.</span>
                    </div>
                </div>
                <div class="col-sm-6">
                  <label>Alış Saati</label>
                    <date-picker v-model="pickUpTime" format="hh:mm" value-type="format" type="time" placeholder="ss:dd"
                    :class="{'is-invalid': formsubmit && $v.rezervation.pickUpTime.$error}"
                    ></date-picker>
                    <div v-if="formsubmit && $v.rezervation.pickUpTime.$error" class="invalid-feedback">
                        <span v-if="!$v.rezervation.pickUpTime.required">Bu alan gereklidir.</span>
                    </div>
                </div>
              </div>
              <div class="row mt-3" v-if="isReturn">
                <div class="col-sm-6">
                  <label>Dönüş Tarihi</label>
                    <date-picker format="DD-MM-YYYY" placeholder="Dönüş Tarihi" v-model="dropOffDate" :first-day-of-week="1" lang="tr"
                      :class="{'is-invalid': formsubmit && $v.rezervation.dropOffDate.$error}">
                    </date-picker>
                    <div v-if="formsubmit && $v.rezervation.dropOffDate.$error" class="invalid-feedback">
                        <span v-if="!$v.rezervation.dropOffDate.required">Bu alan gereklidir.</span>
                    </div>
                </div>
                <div class="col-sm-6">
                  <label>Dönüş Saati</label>
                    <date-picker v-model="dropOffTime" format="hh:mm" value-type="format" type="time" placeholder="ss:dd"
                    :class="{'is-invalid': formsubmit && $v.rezervation.dropOffTime.$error}"
                    ></date-picker>
                    <div v-if="formsubmit && $v.rezervation.dropOffTime.$error" class="invalid-feedback">
                        <span v-if="!$v.rezervation.dropOffTime.required">Bu alan gereklidir.</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Yolcu Listesi</h4>
              <form action="#" @submit.prevent="submitAddPaxForm">
                <div class="row">
                    <div class="col-sm-2">
                      <div class="mb-3">
                        <label for="customerName">Müşteri Adı</label>
                        <input
                          v-model="passangerList.name"
                          id="customerName"
                          name="customerName"
                          type="text"
                          class="form-control"
                          placeholder="Lütfen müşteri adını giriniz..."
                          :class="{
                            'is-invalid': addPaxSubmit && $v.passangerList.name.$error,
                          }"
                        />
                        <div v-if="addPaxSubmit && !$v.passangerList.nationality.$error" class="invalid-feedback">
                          <span v-if="!$v.passangerList.name.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.passangerList.name.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        </div>
                      </div>
                    
                    </div>
                    <div class="col-sm-2">
                      <div class="mb-3">
                        <label for="customerSurname">Müşteri Soyadı</label>
                        <input
                          v-model="passangerList.surname"
                          id="customerSurname"
                          name="customerSurname"
                          type="text"
                          class="form-control"
                          placeholder="Lütfen müşteri soyadını giriniz..."
                          :class="{
                            'is-invalid':
                              addPaxSubmit && $v.passangerList.surname.$error,
                          }"
                        />
                        <div v-if="addPaxSubmit && !$v.passangerList.nationality.$error" class="invalid-feedback">
                          <span v-if="!$v.passangerList.name.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.passangerList.name.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                        <label for="customerNationality" class="control-label">Uyruk</label>
                        <multiselect 
                          v-model="passangerList.nationality" 
                          :options="this.countries"
                          :searchable="true"
                          id="customerNationality"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen"
                          :class="{
                            'is-invalid': addPaxSubmit && $v.passangerList.nationality.$error,
                          }"
                          :custom-label="countriesObject">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                        </multiselect>
                        <div v-if="addPaxSubmit && $v.passangerList.nationality.$error" class="invalid-feedback">
                          <span v-if="!$v.passangerList.nationality.required">Bu alan gereklidir.</span>
                        </div>
                    </div>
                    <div class="col-sm-1">
                      <label for="customerGender" class="control-label">Cinsiyet</label>
                      <multiselect 
                        v-model="passangerList.gender" 
                        :options="this.gender"
                        :searchable="true"
                        id="customerGender"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        :class="{
                        'is-invalid': addPaxSubmit && $v.passangerList.gender.$error,
                        }"
                        selectedLabel="Seçilen">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                      <div v-if="addPaxSubmit && $v.passangerList.gender.$error" class="invalid-feedback">
                        <span v-if="!$v.passangerList.gender.required">Bu alan gereklidir.</span>
                      </div>
                    </div>
                    <div class="col-sm-2">
                      <div class="mb-3">
                        <label for="customerTcknOrPassport">TC veya Pasaport Numarası</label>
                        <input
                          v-model="passangerList.tcknOrPassport"
                          id="customerTcknOrPassport"
                          name="customerTcknOrPassport"
                          type="text"
                          class="form-control"
                          placeholder="TC veya Pasaport numarası..."
                          :class="{
                            'is-invalid':
                              addPaxSubmit && $v.passangerList.tcknOrPassport.$error,
                          }"
                        />
                        <div v-if="addPaxSubmit && $v.passangerList.tcknOrPassport.$error" class="invalid-feedback">
                          <span v-if="!$v.passangerList.tcknOrPassport.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.passangerList.tcknOrPassport.maxLength">Bu alana maksimum 11 karakter girilebilir.</span>
                          <span v-if="!$v.passangerList.tcknOrPassport.minLength">Bu alana minimum 7 karakter giriniz.</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-2">
                        <div class="mt-4 ">
                            <div class="d-grid gap-2">
                              <button block class="btn btn-secondary ms-1">Yolcu Ekle</button>
                            </div>
                        </div>
                    </div>
                </div>
              </form>
              <div class="table-responsive">
              <table class="table table-nowrap table-centered mb-0 align-middle">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Ad</th>
                    <th scope="col">Soyad</th>
                    <th scope="col">Uyruk</th>
                    <th scope="col">Cinsiyet</th>
                    <th scope="col" colspan="2">TC veya Pasaport Numarası</th>
                  </tr>
                </thead>
                <tbody v-if="this.rezervation.pax.length!=0">
                  <tr v-for="(item,index) in this.rezervation.pax" :key="index">
                    <th scope="row" style="width:1%">
                      <div class="text-muted">{{index+1}}</div>
                    </th>
                    <td style="width:20%">
                      <div class="text-muted">{{item.name}}</div>
                    </td>
                    <td style="width:20%">
                      <div class="text-muted">{{item.surname}}</div>
                    </td>
                    <td style="width:20%">
                    <div class="text-muted">{{item.nationality.countryName}}</div>
                    </td>
                    <td style="width:20%">
                      <div class="text-muted">{{item.gender}}</div>
                    </td>
                    <td style="width:20%">
                      <div class="text-muted">{{item.tcknOrPassport}}</div>
                    </td>
                    <td style="width:20%">
                      <a class="btn btn-danger btn-sm w-xs" @click="removePax(index)">Sil</a>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
                <h4 class="card-title mb-4">Transfer Açıklaması</h4>
                <div class="row">
                  <div class="col-sm-12">
                    <b-form-textarea id="rezervationNote" v-model="rezervation.note" rows="2" placeholder="Transfer açıklaması..."></b-form-textarea>
                  </div>
                </div>
            </div>
          </div>

        </div>
      </div>


      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-3">Fiyatlandırma</h4>
              <div class="row">
                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="transferPrice">Transfer Fiyatı</label>
                    <input
                      v-model="rezervation.price"
                      id="transferPrice"
                      name="transferPrice"
                      type="text"
                      class="form-control"
                      placeholder="00.00"
                      :class="{
                        'is-invalid': formsubmit && $v.rezervation.price.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.rezervation.price.$error" class="invalid-feedback">
                      <span v-if="!$v.rezervation.price.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.rezervation.price.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>
                  </div>
                </div>

                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="uetdsPrice">UETDS Fiyatı</label>
                    <input
                      v-model="rezervation.uetds.price"
                      id="uetdsPrice"
                      name="uetdsPrice"
                      type="text"
                      class="form-control"
                      placeholder="00.00"
                    :class="{
                        'is-invalid': formsubmit && $v.rezervation.uetds.price.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.rezervation.uetds.price.$error" class="invalid-feedback">
                      <span v-if="!$v.rezervation.uetds.price.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.rezervation.uetds.price.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>
                  </div>
                </div>

                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="directionPrice">Yön Fiyatı</label>
                    <input
                      v-model="rezervation.directionPrice"
                      :disabled="companyOwner"
                      id="directionPrice"
                      name="directionPrice"
                      type="text"
                      class="form-control"
                      placeholder="00.00"
                      :class="{
                        'is-invalid':
                          formsubmit && $v.rezervation.directionPrice.$error,
                      }"
                    />
                    <div v-if="formsubmit && $v.rezervation.directionPrice.$error" class="invalid-feedback">
                      <span v-if="!$v.rezervation.directionPrice.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.rezervation.directionPrice.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div> 
                    
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="mb-3">
                    <label for="role">Para Birimi</label>
                    <multiselect 
                          v-model="rezervation.priceCurrency" 
                          :options="this.priceCurrency"
                          :searchable="true"
                          :custom-label="priceCurrencyObject"
                          @select="selectedPriceCurrency"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          :class="{
                          'is-invalid':
                            formsubmit && $v.rezervation.priceCurrency.$error,
                          }"
                          selectedLabel="Seçilen">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div v-if="formsubmit && $v.rezervation.priceCurrency.$error" class="invalid-feedback">
                      <span v-if="!$v.rezervation.priceCurrency.required">Bu alan gereklidir.</span>
                    </div> 
                  </div>
                </div>

                <div class="col-sm-3">
                  <div class="mb-3">
                    <label for="role">Durum</label>
                    <multiselect 
                          v-model="rezervation.status" 
                          :options="this.status"
                          :searchable="true"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          :class="{
                          'is-invalid':
                            formsubmit && $v.rezervation.status.$error,
                          }"
                          selectedLabel="Seçilen">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div v-if="formsubmit && $v.rezervation.status.$error" class="invalid-feedback">
                      <span v-if="!$v.rezervation.status.required">Bu alan gereklidir.</span>
                    </div> 
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">BİLGİLENDİRME</h4>
              <p class="card-title-desc">
                  Rezervasyon oluşturulukdan sonra, rezervasyon listesinden tarih aralığı belirleyerek arama işlemi yapabilirsiniz. Yönlendirilen rezevasyonlar için acenta listesinden, yönlendirdiğiniz acentayI seçerek yönlendirilen ve alınan tüm transferleri kolayca listeleyebilirsiniz
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
        <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table mb-0">
                  <tbody>
                    <tr>
                      <td>Yön Fiyatı :</td>
                      <td>$ 1,857</td>
                    </tr>
                    <tr>
                      <td>Ara Toplam :</td>
                      <td>- $ 157</td>
                    </tr>
                    <tr>
                      <td>KDV(18%) :</td>
                      <td>$ 25</td>
                    </tr>
                    <tr>
                      <th>Toplam :</th>
                      <th>$ 1744.22</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-grid mt-4">
                <div class="d-grid gap-2">
                  <button block class="btn btn-secondary ms-1">Rezervasyon Oluştur</button>
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>
    </form>
  </Layout>
</template>