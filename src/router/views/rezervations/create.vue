<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import DatePicker from "vue2-datepicker";
import 'vue2-datepicker/locale/tr';
import NumberInputSpinner from "vue-number-input-spinner";
import * as Taxation from '../../../helpers/taxation';
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
  airportMethod,
  taxationMethod,
  employeeMethod
} from "@/state/helpers";

/**
 * Customer-create component
 */
export default {
  page: {
    title: "Yeni Rezervasyon Oluştur",
  },
  components: { Layout, PageHeader,Multiselect,VuePhoneNumberInput,DatePicker,NumberInputSpinner},
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
      gender:['E','K'],
      locationArray:[],
      employessArray:[],
      airportArray:[],
      terminals:['İç Hatlar','Dış Hatlar'],
      statusVariables:['Ödendi','Ödenmedi'],
      transferType:[{id:0,value:"Alından Transfer"},{id:1,value:'Yönlendirilen Transfer'}],
      priceCurrency:[
        {
          id:0,
          text:'TÜRK LİRASI',
          symbol:'₺',
        },
        {
          id:1,
          text:'EURO',
          symbol:'€',
        },
        {
          id:2,
          text:'DOLAR',
          symbol:'$',
        },
        {
          id:3,
          text:'POUND',
          symbol:'£',
        }
      ],
      isLoading:false,
      addPaxSubmit: false,
      formsubmit: false,
      results:null,
      customerIsAvalible:false,
      companyOwner:true,
      newVehicleTypes:[],
      newAgencies:[],
      tempEmployess:[],
      tempVehicleType:null,
      foundCustomerId:null,
      oneTimeAddPassangertoList:true,
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

      priceCurrencySelected:{
          id:0,
          text:'TÜRK LİRASI',
          symbol:'₺',
      },
      formVariables:{
        agency:null,
        vehicleType:null,
        uetdsPrice:null,
        rezervationPrice:null,
        directionPrice:0,
        flightNumber:null,
        transferDirection:0,
        startPoint:null,
        endPoint:null,
        terminal:null,
        pickUpDate:null,
        pickUpTime:null,
        dropOffTime:null,
        dropOffDate:null,
        transferType:0,
        status:null,
        isReturn:false,
        phoneNumber:null,
        babySeat: 0,
        childSeat: 0,
        wheelSeat: 0,
        smsNotification:false,
        uetdsNotification:false,
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
        employees:[],
        pax:[],
        price:{
          subtotal: 0, 
          tax: 0, 
          total: 0
        },
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
        note:null,
      }
    };
    
  },
  watch:{
    'formVariables.pickUpTime'(value){
      this.updateStartDateTime({type:"time",value})
    },
    'formVariables.pickUpDate'(value){
      this.updateStartDateTime({type:"date",value})
    },
    'formVariables.dropOffTime'(value){
      this.updateReturnDateTime({type:"time",value})
    },
    'formVariables.dropOffDate'(value){
      this.updateReturnDateTime({type:"date",value})
    },
    'formVariables.transferDirection'(){
      this.formVariables.startPoint=null
      this.formVariables.endPoint=null
    },
    'formVariables.isReturn'(value){
      this.formVariables.isReturn=value
      if (this.rezervationPrice=='' || this.rezervationPrice==null) {
        this.formVariables.price=Taxation.calPrice(0, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, value);
      } else {
       this.formVariables.price=Taxation.calPrice(this.rezervationPrice, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, value);
      }
    },
    'formVariables.rezervationPrice'(value){
      if (value=='') {
        this.formVariables.price=Taxation.calPrice(0, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, this.formVariables.isReturn);
        console.log(`vergi calprice`,this.formVariables);
      } else {
        this.formVariables.price=Taxation.calPrice(value, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, this.formVariables.isReturn);
        console.log(`vergi calprice`,this.formVariables);
      }
    },
    'formVariables.uetdsPrice'(value){
      if (value=='') {
        this.formVariables.uetds.price=0
      } else {
        this.formVariables.uetds.price=value
      }
    },
    'formVariables.priceCurrencySelected'(value){
      console.log(value);
      this.formVariables.priceCurrency=value.id
    },
    'formVariables.directionPrice'(value){
      if (value=='') {
        this.formVariables.directionPrice=0
      } else {
        this.formVariables.directionPrice=value
      }
    },
    'formVariables.flightNumber'(value){
      this.formVariables.flightNumber=value
    },
    'tempVehicleType'(value){
      this.formVariables.vehicleType=value.name + ' - ' + value.pax +' Kişi'
    },
    tempEmployess(){
      let temp=[]
      this.tempEmployess.forEach(function(element) {
        temp.push(element.id)
      })
      this.formVariables.employees=temp
    },
    async results(a){
      console.log(a)
      this.formVariables.customer.phone.countryCode=a.countryCode
      this.formVariables.customer.phone.nationalNumber=a.nationalNumber
      this.formVariables.customer.phone.countryCallingCode=a.countryCallingCode
      this.formVariables.customer.phone.formattedNumber=a.formattedNumber
      this.formVariables.customer.phone.phoneNumber=a.phoneNumber

      await this.fetchCustomers({page:"",limit:10,search:a.formattedNumber})
      
      if(this.$store.state.customer.customers.data[0]!=undefined){
        console.log('bulundu')
        this.customerIsAvalible=true

        this.formVariables.customer.tcknOrPassport=null
        this.formVariables.customer.name=null
        this.formVariables.customer.surname=null
        this.formVariables.customer.gender=null
        this.formVariables.customer.nationality=null
        this.foundCustomerId=null

        //DB gelen müşteri bilgilerini customer objesine atıyoruz
        this.formVariables.customer.tcknOrPassport=this.$store.state.customer.customers.data[0].tcknOrPassport
        this.formVariables.customer.name=this.$store.state.customer.customers.data[0].name
        this.formVariables.customer.surname=this.$store.state.customer.customers.data[0].surname
        this.formVariables.customer.gender=this.$store.state.customer.customers.data[0].gender
        this.formVariables.customer.nationality=this.$store.state.customer.customers.data[0].nationality
        this.foundCustomerId=this.$store.state.customer.customers.data[0]._id

        //DB gelen müşteriyi yolcu listesine ekledik
        if(this.oneTimeAddPassangertoList){
          this.formVariables.pax=[]
          this.formVariables.pax.push({
              tcknOrPassport:this.formVariables.customer.tcknOrPassport,
              name:this.formVariables.customer.name,
              surname:this.formVariables.customer.surname,
              gender:this.formVariables.customer.gender,
              nationality:this.formVariables.customer.nationality,
            }
          )
          this.oneTimeAddPassangertoList=false
        }

      }else{
        console.log('bulundumadi')
        this.foundCustomerId=null
        this.formVariables.customer.tcknOrPassport=null
        this.formVariables.customer.name=null
        this.formVariables.customer.surname=null
        this.formVariables.customer.gender=null
        this.formVariables.customer.nationality=null

        this.formVariables.pax=[]
        this.oneTimeAddPassangertoList=true

        this.customerIsAvalible=false

        this.setCustomerNationality();
      }
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
    customer(){
      return this.$store.state.customer.customer
    },
    vehicleTypes(){
      return this.$store.state.vehicletype.vehicleTypes.data
    },
    points(){
      return this.$store.state.point.points.data
    },
    airports(){
      return this.$store.state.airport.airports.data
    },
    taxation(){
      return this.$store.state.taxation.taxation
    },
    employees(){
      return this.$store.state.employee.employees
    }
  },
  methods: {
    updateStartDateTime({type,value}){
      if(type=="time"){
        this.formVariables.pickUpTime.setHours(value.split(":")[0]);
        this.formVariables.pickUpTime.setMinutes(value.split(":")[1]);
      }

      if(type=="date"){
        this.formVariables.pickUpDate.setDate(value.getDate());
        this.formVariables.pickUpDate.setMonth(value.getMonth());
        this.formVariables.pickUpDate.setFullYear(value.getFullYear());
      }
    },
    updateReturnDateTime({type,value}){
      if(type=="time"){
        this.formVariables.dropOffTime.setHours(value.split(":")[0]);
        this.formVariables.dropOffTime.setMinutes(value.split(":")[1]);
      }

      if(type=="date"){
        this.formVariables.dropOffDate.setDate(value.getDate());
        this.formVariables.dropOffDate.setMonth(value.getMonth());
        this.formVariables.dropOffDate.setFullYear(value.getFullYear());
      }
    },
    submitAddPaxForm() {
      this.addPaxSubmit = true;
      this.$v.passangerList.$touch();
      console.log("girdi");
      if (!this.$v.passangerList.$invalid) {
          this.formVariables.pax.push(
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
        console.log("kaydetti--");
        this.$v.passangerList.$reset();
      }else{
        console.log("hata");
        console.log(this.$v.passangerList);
      }
    },
    countriesObject (value) {
      return `${value.countryName} — [${value.code}]`
    },
    resetCustomerForm(){
      this.formVariables.customer.tcknOrPassport=null;
      this.formVariables.customer.name=null;
      this.formVariables.customer.surname=null;
      this.formVariables.customer.email=null;
      
      this.formVariables.customer.phone.countryCode=null;
      this.formVariables.customer.phone.nationalNumber=null;
      this.formVariables.customer.phone.countryCallingCode=null;
      this.formVariables.customer.phone.formattedNumber=null;
      this.formVariables.customer.phone.phoneNumber=null;

      this.formVariables.customer.gender= null;
      this.formVariables.customer.nationality= null;
    },
    agencyObject ({ companyName }) {
      return `${companyName}`
    },
    setOwnerAgency(){
      this.agencies.forEach(element => {
          if(element.companyOwner){
            this.formVariables.agency=element
          }
      });
    },
    selectedAgency(value){
      this.formVariables.agency=value._id
      if(value.companyOwner){
        this.companyOwner=true
      }else{
        this.companyOwner=false
      }
    },
    selectedTransferType(value){
      this.formVariables.transferType=value._id
    },
    setTransferType(){
      this.formVariables.transferType=this.transferType[0]
    },
    setCustomerNationality(){
      this.formVariables.customer.nationality=this.countries[6]
      this.passangerList.nationality=this.countries[6]
    },
    vehicleTypesObject (value) {
      console.log(value)
      return `${value.name} - ${value.pax}`
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
    employessTypesObject ({name,surname}) {
      return `${name} ${surname}`
    },
    transferTypeObject({ value }){
      return value
    },
    setVehicleTypes(){
      this.newVehicleTypes=this.vehicleTypes;
    },
    selectedPriceCurrency(value){
      this.formVariables.priceCurrency=value.id
    },
    priceCurrencyObject({text,symbol}){
      return `${text} ${symbol}`
    },
    setAgencies(){
      this.newAgencies=this.agencies;
    },
    setLocation(){
      let tempOtel=[]
      let tempKonum=[]
      this.points.forEach(element => {
        console.log('element',element)
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
    setEmployess(){
      //0-Şoför 1-Şöför Yrd.2-Host 3-Hostes 4-Diğer 5-Rehber
      let tempSofor=[]
      let tempSoforYrd=[]
      let tempHost=[]
      let tempHostes=[]
      let tempDiger=[]
      let tempRehber=[]
      this.employees.data.forEach(element => {
        console.log(element)
        if(element.type==0){
          tempSofor.push({name:element.name,surname:element.surname,id:element._id})
        }
        if(element.type==1){
          tempSoforYrd.push({name:element.name,surname:element.surname,id:element._id})
        }
        if(element.type==2){
          tempHost.push({name:element.name,surname:element.surname,id:element._id})
        } 
        if(element.type==3){
          tempHostes.push({name:element.name,surname:element.surname,id:element._id})
        }
        if(element.type==4){
          tempDiger.push({name:element.name,surname:element.surname,id:element._id})
        }
        if(element.type==5){
          tempRehber.push({name:element.name,surname:element.surname,id:element._id})
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
    removePax(index){
      this.formVariables.pax.splice(index,  1);
    },
    async submitForm() {
  
      let rezervationForm={
        agency:this.formVariables.agency._id,
        transferType:this.formVariables.transferType.id,
        vehicleType:this.formVariables.vehicleType,
        employees:this.formVariables.employees,
        customer:null
      }

      if(!this.customerIsAvalible){
        await this.createCustomer(this.formVariables.customer);
        rezervationForm.customer=this.customer._id;
      }else{
        rezervationForm.customer=this.foundCustomerId;
      }

      console.log(rezervationForm)
      
    },
    updatePassengerList(){
      if(!this.customerIsAvalible){
        this.formVariables.pax[0]={
          tcknOrPassport:this.formVariables.customer.tcknOrPassport,
          name:this.formVariables.customer.name,
          surname:this.formVariables.customer.surname,
          gender:this.formVariables.customer.gender,
          nationality:this.formVariables.customer.nationality,
        }
      }
    },
    ...employeeMethod,
    ...agencyMethod,
    ...vehicleTypeMethod,
    ...pointMethod,
    ...airportMethod,
    ...taxationMethod,
    ...customerMethod
  },
  validations: {
    passangerList: {
      tcknOrPassport: { required,minLength: minLength(7), maxLength: maxLength(11),numeric },
      name: { required, maxLength: maxLength(50) },
      surname: { required, maxLength: maxLength(50) },
      gender: { required },
      nationality: { required }
    },
    formVariables:{
      customer: {
        tcknOrPassport: { required,minLength: minLength(7), maxLength: maxLength(11) },
        name: { required, maxLength: maxLength(50) },
        surname: { required, maxLength: maxLength(50) },
        gender: { required },
        nationality: { required }
      },
      startPoint:{ required },
      endPoint:{ required },
      phoneNumber: { required, maxLength: maxLength(50) },
      terminal:{ required },
      tempVehicleType:{ required, maxLength: maxLength(50) },
      priceCurrency:{ required },
      status:{ required },
      directionPrice:{ required: requiredIf(function () {
          return !this.companyOwner
      }), maxLength: maxLength(50) },
      pickUpTime:{ required },
      pickUpDate:{ required },
      dropOffTime:{ required: requiredIf(function (value) {
        console.log(`..........`,value);
        return value.isReturn
      })},
      dropOffDate:{ required: requiredIf(function (value) {
        console.log(`..........`,value);
        return value.isReturn
      })},
      rezervationPrice:{ required, maxLength: maxLength(50) },
      uetdsPrice:{ required, maxLength: maxLength(50) },
      flightNumber:{ required, maxLength: maxLength(50) },
      note:{ maxLength: maxLength(255) },
    }
  },
  async mounted() {
    await this.fetchTaxation()
    await this.fetchEmployees({page:1,limit:1000,search:""})
    await this.fetchAgencies({page:1,limit:1000,search:""})
    await this.fetchVehicleTypes({page:1,limit:1000,search:""})
    await this.fetchPoints({page:1,limit:1000,search:""})
    await this.fetchAirports({page:1,limit:1000,search:""})
    await this.fetchCountries()
    this.setOwnerAgency();
    this.setCustomerNationality();
    this.setVehicleTypes();
    this.setAgencies();
    this.setTransferType();
    this.setLocation();
    this.setAirport();
    this.setEmployess();
    this.isLoading=true
    //this.formVariables.vehicleType=this.vehicleTypes[0];
    this.formVariables.pickUpDate=new Date();
    this.formVariables.dropOffDate=new Date();
  },

}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-2">Transfer Detayları</h4>
                  <div class="row">
                    <div class="col-sm-6 mt-2">
                      <label for="authorizedPhone">Agenta Seçimi</label>
                      <multiselect 
                          v-model="formVariables.agency" 
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
                    <div class="col-sm-6 mt-2">
                      <label for="authorizedPhone">Transfer Tipi</label>
                      <multiselect 
                          id="transferType"
                          v-model="formVariables.transferType" 
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
                    <div class="col-sm-6 mt-2">
                      <label for="authorizedPhone">Araç Tipi</label>
                      <multiselect 
                            id="vehicleTypes"
                            v-model="tempVehicleType" 
                            :options="this.newVehicleTypes"
                            :custom-label="vehicleTypesObject"
                            :searchable="true"
                            placeholder="Seçiniz"
                            selectLabel="Seçiniz"
                            deselectLabel="Seçimi Kaldır"
                            selectedLabel="Seçilen"
                            :class="{
                            'is-invalid':
                              formsubmit && $v.formVariables.vehicleType.$error,
                            }"
                            >
                            <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                        </multiselect>
                    </div>
                    <div class="col-sm-6 mt-2">
                      <label for="authorizedPhone">Şoför ve Diğer Personeller</label>
                      <multiselect 
                            id="vehicleTypes"
                            v-model="tempEmployess" 
                            :options="this.employessArray"
                            :custom-label="employessTypesObject"
                            :searchable="true"
                            :multiple="true"
                            track-by="id"
                            open-direction="bottom"
                            group-values="employees"
                            group-label="type"
                            placeholder="Seçiniz"
                            selectLabel="Seçiniz"
                            deselectLabel="Seçimi Kaldır"
                            selectedLabel="Seçilen"
                            :class="{
                            'is-invalid':
                              formsubmit && $v.formVariables.vehicleType.$error,
                            }"
                            >
                            <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                        </multiselect>
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
              <h4 class="card-title mb-2">Yeni Müşteri</h4>
              <div class="text-sm-end">
                <h5 v-if="customerIsAvalible"><span class="badge bg-success ms-1 align-bottom">Mevcut</span></h5>
                <h5 v-if="!customerIsAvalible"><span class="badge bg-warning ms-1 align-bottom">Eklenecek</span></h5>
              </div>
              <div class="row">
                <div class="col-sm-6 mt-2">
                    <label for="authorizedPhone">Müşteri Telefon No</label>
                    <VuePhoneNumberInput position="top" size="sm" id="authorizedPhone" default-country-code="TR" v-model="formVariables.phoneNumber" @update="results = $event"
                    :translations="{
                      countrySelectorLabel: 'Ülke Kodu',
                      countrySelectorError: 'Ülke Kodu Seçiniz',
                      phoneNumberLabel: 'Telefon Numarası',
                      example: 'Örnek :'
                    }"
                    :class="{
                      'is-invalid':
                        formsubmit && $v.formVariables.phoneNumber.$error,
                    }"
                    />
                    <div v-if="formsubmit && $v.formVariables.phoneNumber.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.phoneNumber.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.formVariables.phoneNumber.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>          
                </div>

                <div class="col-sm-6 mt-2">
                    <label for="tcknOrPassport">TC veya Pasaport</label>
                    <input
                      v-model="formVariables.customer.tcknOrPassport"
                      id="tcknOrPassport"
                      name="tcknOrPassport"
                      type="text"
                      class="form-control"
                      placeholder="TC veya Pasaport numarası giriniz..."
                      :class="{
                        'is-invalid':
                          formsubmit && $v.formVariables.customer.tcknOrPassport.$error,
                      }"
                      @input="updatePassengerList"
                      :disabled="customerIsAvalible"
                    />
                    <div v-if="formsubmit && $v.formVariables.customer.tcknOrPassport.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.customer.tcknOrPassport.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.formVariables.customer.tcknOrPassport.maxLength">Bu alana maksimum 11 karakter girilebilir.</span>
                    </div> 
                </div>

                <div class="col-sm-6 mt-2">
                    <label for="name">Müşteri Adı</label>
                    <input
                      v-model="formVariables.customer.name"
                      id="name"
                      name="name"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen müşteri adını giriniz..."
                      @input="updatePassengerList"
                      :class="{
                        'is-invalid':
                          formsubmit && $v.formVariables.customer.name.$error,
                      }"
                      :disabled="customerIsAvalible"
                    />
                    <div v-if="formsubmit && $v.formVariables.customer.name.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.customer.name.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.formVariables.customer.name.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>   
                </div>

                <div class="col-sm-6 mt-2">
                    <label for="surname">Müşteri Soyadı</label>
                    <input
                      v-model="formVariables.customer.surname"
                      id="surname"
                      name="surname"
                      type="text"
                      class="form-control"
                      placeholder="Lütfen müşteri soyadını giriniz..."
                      @input="updatePassengerList"
                      :class="{
                        'is-invalid':
                          formsubmit && $v.formVariables.customer.surname.$error,
                      }"
                      :disabled="customerIsAvalible"
                    />
                    <div v-if="formsubmit && $v.formVariables.customer.surname.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.customer.surname.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.formVariables.customer.surname.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>
                </div>

                <div class="col-sm-6 mt-2">
                    <label for="gender" class="control-label">Cinsiyet</label>
                    <multiselect 
                      v-model="formVariables.customer.gender" 
                      id="gender"
                      :options="this.gender"
                      :disabled="customerIsAvalible"
                      :searchable="true"
                      placeholder="Seçiniz"
                      selectLabel="Seçiniz"
                      deselectLabel="Seçimi Kaldır"
                      selectedLabel="Seçilen"
                      @close="updatePassengerList"
                      :class="{
                      'is-invalid': formsubmit && $v.formVariables.customer.gender.$error,
                      }">
                      <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div v-if="formsubmit && $v.formVariables.customer.gender.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.customer.gender.required">Bu alan gereklidir.</span>
                    </div>
                </div>

                <div class="col-sm-6 mt-2">
                      <label class="control-label">Uyruk</label>
                      <multiselect 
                        v-model="formVariables.customer.nationality" 
                        :options="this.countries"
                        :searchable="true"
                        placeholder="Seçiniz"
                        selectLabel="Seçiniz"
                        deselectLabel="Seçimi Kaldır"
                        selectedLabel="Seçilen"
                        :class="{
                        'is-invalid': formsubmit && $v.formVariables.customer.nationality.$error,
                        }"
                        :custom-label="countriesObject">
                        <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                      <div v-if="formsubmit && $v.formVariables.customer.nationality.$error" class="invalid-feedback">
                        <span v-if="!$v.formVariables.customer.nationality.required">Bu alan gereklidir.</span>
                      </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Karşılama Detayları</h4>
              <label class="mt-2">Lokasyon Tipi</label>
              <div class="row">
                <div class="col-sm-4">
                  <label class="card-radio-label mt-2">
                    <input type="radio" id="airportToLocation" value="0" v-model="formVariables.transferDirection" class="card-radio-input" checked/>
                    <div class="card-radio">
                      <i class="mdi mdi-airplane-landing font-size-24 text-primary align-middle me-2"></i>
                      <span>Havalimanı Lokasyon</span>
                    </div>
                  </label>
                </div>

                <div class="col-sm-4">
                  <label class="card-radio-label mt-2">
                    <input type="radio" id="locationToAirport" value="1" v-model="formVariables.transferDirection" class="card-radio-input"/>
                    <div class="card-radio">
                      <i class="mdi mdi-airplane-takeoff font-size-24 text-primary align-middle me-2"></i>
                      <span>Lokasyon Havalimanı</span>
                    </div>
                  </label>
                </div>

                <div class="col-sm-4">
                  <label class="card-radio-label mt-2">
                    <input type="radio" id="locationToLocation" value="2" v-model="formVariables.transferDirection" class="card-radio-input"/>
                    <div class="card-radio">
                      <i class="mdi mdi-map-marker-outline font-size-24 text-primary align-middle me-2"></i>
                      <span>Lokasyon Lokasyon</span>
                    </div>
                  </label>
                </div>
                
              </div>

              <div class="row" v-if="formVariables.transferDirection==0">
                <div class="col-sm-6 mt-2">
                  <label for="airportArray_0" class="control-label">Başlangıç Noktası</label>
                  <multiselect 
                    v-model="formVariables.startPoint" 
                    :options="this.airportArray"
                    :searchable="true"
                    id="airportArray_0"
                    :custom-label="airportObject"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.formVariables.startPoint.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.startPoint.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.startPoint.required">Bu alan gereklidir.</span>
                  </div>
                </div>
                <div class="col-sm-6 mt-2">
                  <label for="locationArray_0" class="control-label">Bitiş Noktası</label>
                  <multiselect 
                    v-model="formVariables.endPoint" 
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
                    'is-invalid': formsubmit && $v.formVariables.endPoint.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.endPoint.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.endPoint.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>

              <div class="row" v-if="formVariables.transferDirection==1">
                <div class="col-sm-6 mt-2">
                  <label for="locationArray_1" class="control-label">Başlangıç Noktası</label>
                  <multiselect 
                    v-model="formVariables.startPoint" 
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
                    'is-invalid': formsubmit && $v.formVariables.startPoint.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.startPoint.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.startPoint.required">Bu alan gereklidir.</span>
                  </div>
                </div>
                <div class="col-sm-6 mt-2">
                  <label for="airportArray_1" class="control-label">Bitiş Noktası</label>
                  <multiselect 
                    v-model="formVariables.endPoint" 
                    :options="this.airportArray"
                    :searchable="true"
                    id="airportArray_1"
                    :custom-label="airportObject"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"

                    :class="{
                    'is-invalid': formsubmit && $v.formVariables.endPoint.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.endPoint.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.endPoint.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>
              
              <div class="row" v-if="formVariables.transferDirection==2">
                <div class="col-sm-6 mt-2">
                  <label for="locationArray_2" class="control-label">Başlangıç Noktası</label>
                  <multiselect 
                    v-model="formVariables.startPoint" 
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
                    'is-invalid': formsubmit && $v.formVariables.startPoint.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.startPoint.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.startPoint.required">Bu alan gereklidir.</span>
                  </div>
                </div>
                <div class="col-sm-6 mt-2">
                  <label for="locationArray_22" class="control-label">Bitiş Noktası</label>
                  <multiselect 
                    v-model="formVariables.endPoint" 
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
                    'is-invalid': formsubmit && $v.formVariables.endPoint.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.endPoint.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.endPoint.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-6 mt-2">
                  <label for="flightNumber" class="control-label">Uçuş Numarası</label>
                  <input
                    v-model="formVariables.flightNumber"
                    id="flightNumber"
                    name="flightNumber"
                    type="text"
                    class="form-control"
                    placeholder="Lütfen müşteri adını giriniz..."
                    :class="{
                      'is-invalid':
                        formsubmit && $v.formVariables.flightNumber.$error,
                    }"
                  />
                  <div v-if="formsubmit && $v.formVariables.flightNumber.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.flightNumber.required">Bu alan gereklidir.</span>
                    <span v-if="!$v.formVariables.flightNumber.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                  </div>
                </div>
                <div class="col-sm-6 mt-2">
                  <label for="terminal" class="control-label">Terminal Seçimi</label>
                  <multiselect 
                    v-model="formVariables.terminal" 
                    :options="this.terminals"
                    :searchable="true"
                    id="terminal"
                    placeholder="Seçiniz"
                    selectLabel="Seçiniz"
                    deselectLabel="Seçimi Kaldır"
                    selectedLabel="Seçilen"
                    :class="{
                    'is-invalid': formsubmit && $v.formVariables.terminal.$error,
                    }">
                    <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.terminal.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.terminal.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-6 mt-2">
                  <label class="card-radio-label mb-2">
                    <input type="radio" id="oneDirection" :value="false" v-model="formVariables.isReturn" class="card-radio-input" checked/>
                    <div class="card-radio">
                      <i class="mdi mdi-arrow-right font-size-24 text-primary align-middle me-2"></i>
                      <span>Tek Yön</span>
                    </div>
                  </label>
                </div>
                <div class="col-sm-6 mt-2">
                  <label class="card-radio-label mb-2">
                    <input type="radio" id="doubleDirection" :value="true" v-model="formVariables.isReturn" class="card-radio-input"/>
                    <div class="card-radio">
                      <i class="mdi mdi-arrow-left-right font-size-24 text-primary align-middle me-2"></i>
                      <span>Gidiş Dönüş</span>
                    </div>
                  </label>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-6 mt-2">
                  <label>Alış Tarihi</label>
                    <date-picker format="DD-MM-YYYY" placeholder="Alış tarihi" v-model="formVariables.pickUpDate" :first-day-of-week="1" lang="tr"
                      :class="{'is-invalid': formsubmit && $v.formVariables.pickUpDate.$error}">
                    </date-picker>
                    <div v-if="formsubmit && $v.formVariables.pickUpDate.$error" class="invalid-feedback">
                        <span v-if="!$v.formVariables.pickUpDate.required">Bu alan gereklidir.</span>
                    </div>
                </div>
                <div class="col-sm-6 mt-2">
                  <label>Alış Saati</label>
                    <date-picker v-model="formVariables.pickUpTime" format="hh:mm" value-type="format" type="time" placeholder="ss:dd"
                    :class="{'is-invalid': formsubmit && $v.formVariables.pickUpTime.$error}"
                    ></date-picker>
                    <div v-if="formsubmit && $v.formVariables.pickUpTime.$error" class="invalid-feedback">
                        <span v-if="!$v.formVariables.pickUpTime.required">Bu alan gereklidir.</span>
                    </div>
                </div>
              </div>
              
              <div class="row" v-if="formVariables.isReturn">
                <div class="col-sm-6 mt-2">
                  <label>Dönüş Tarihi</label>
                    <date-picker format="DD-MM-YYYY" placeholder="Dönüş Tarihi" v-model="formVariables.dropOffDate" :first-day-of-week="1" lang="tr"
                      :class="{'is-invalid': formsubmit && $v.formVariables.dropOffDate.$error}">
                    </date-picker>
                    <div v-if="formsubmit && $v.formVariables.dropOffDate.$error" class="invalid-feedback">
                        <span v-if="!$v.formVariables.dropOffDate.required">Bu alan gereklidir.</span>
                    </div>
                </div>
                <div class="col-sm-6 mt-2">
                  <label>Dönüş Saati</label>
                    <date-picker v-model="formVariables.dropOffTime" format="hh:mm" value-type="format" type="time" placeholder="ss:dd"
                    :class="{'is-invalid': formsubmit && $v.formVariables.dropOffTime.$error}"
                    ></date-picker>
                    <div v-if="formsubmit && $v.formVariables.dropOffTime.$error" class="invalid-feedback">
                        <span v-if="!$v.formVariables.dropOffTime.required">Bu alan gereklidir.</span>
                    </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-4 mt-2">
                  <div class="form-group">
                    <label>Bebek Koltuğu</label>
                    <NumberInputSpinner :min="0" :max="10" :integerOnly="true" v-model="formVariables.babySeat" />
                  </div>
                </div>
                <div class="col-sm-4 mt-2">
                  <div class="form-group">
                    <label>Çocuk Koltuğu</label>
                    <NumberInputSpinner :min="0" :max="10" :integerOnly="true" v-model="formVariables.childSeat" />
                  </div>
                </div>
                <div class="col-sm-4 mt-2">
                    <div class="form-group">
                    <label>Engelsiz Koltuğu</label>
                    <NumberInputSpinner :min="0" :max="10" :integerOnly="true" v-model="formVariables.wheelSeat" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-4">Yolcu Listesi</h4>
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
                          placeholder="Adı"
                          :class="{
                            'is-invalid': addPaxSubmit && $v.passangerList.name.$error,
                          }"
                        />
                        <div v-if="addPaxSubmit && $v.passangerList.name.$error" class="invalid-feedback">
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
                          placeholder="Soyadı"
                          :class="{
                            'is-invalid':
                              addPaxSubmit && $v.passangerList.surname.$error,
                          }"
                        />
                        <div v-if="addPaxSubmit && $v.passangerList.surname.$error" class="invalid-feedback">
                          <span v-if="!$v.passangerList.surname.required">Bu alan gereklidir.</span>
                          <span v-if="!$v.passangerList.surname.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                       <div class="mb-3">
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
                    </div>
                    <div class="col-sm-1">
                      <div class="mb-3">
                        <label for="customerGender" class="control-label">Cinsiyet</label>
                        <multiselect 
                          v-model="passangerList.gender" 
                          :options="this.gender"
                          :searchable="true"
                          id="customerGender"
                          placeholder="S"
                          selectLabel=""
                          deselectLabel=""
                          :class="{
                          'is-invalid': addPaxSubmit && $v.passangerList.gender.$error,
                          }"
                          selectedLabel="">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                        </multiselect>
                        <div v-if="addPaxSubmit && $v.passangerList.gender.$error" class="invalid-feedback">
                          <span v-if="!$v.passangerList.gender.required">Bu alan gereklidir.</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="mb-3">
                        <label for="customerTcknOrPassport">TC veya Pasaport</label>
                        <input
                          v-model="passangerList.tcknOrPassport"
                          id="customerTcknOrPassport"
                          name="customerTcknOrPassport"
                          type="text"
                          class="form-control"
                          placeholder="TC veya Pasaport numarası"
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
                    <div class="col-sm-1">
                      <div class="mt-2 mb-2">
                        <label for="add">&nbsp;</label>
                        <div class="d-grid" id="add">
                          <button block class="btn btn-success" v-on:click="submitAddPaxForm">+</button>
                        </div>
                      </div>
                    </div>
                </div>
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
                <tbody v-if="this.formVariables.pax.length!=0">
                  <tr v-for="(item,index) in this.formVariables.pax" :key="index">
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
                    <b-form-textarea
                      v-model="formVariables.note"
                      rows="2" placeholder="Transfer açıklaması..."
                      :class="{
                        'is-invalid': formsubmit && $v.formVariables.note.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.formVariables.note.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.note.maxLength">Bu alana maksimum 255 karakter girilebilir.</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
                <h4 class="card-title mb-4">Bildirimler</h4>
                <div class="row">
                  <div class="col-sm-6">
                    <div class="col-sm-6">
                      <div class="form-check form-switch form-switch-md mb-3">
                        <input class="form-check-input" v-model="formVariables.smsNotification" type="checkbox" id="sms"/>
                        <label class="form-check-label" for="sms">SMS</label>
                      </div>
                  </div>
                  </div>
                   <div class="col-sm-6">
                      <div class="form-check form-switch form-switch-md mb-3">
                        <input class="form-check-input" v-model="formVariables.uetdsNotification" type="checkbox" id="uetds"/>
                        <label class="form-check-label" for="uetds">U-ETDS</label>
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
              <h4 class="card-title mb-3">Fiyatlandırma</h4>
              <div class="row">
                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="transferPrice">Fiyat</label>
                    <input
                      v-model="formVariables.rezervationPrice"
                      id="transferPrice"
                      name="transferPrice"
                      type="text"
                      class="form-control"
                      placeholder="00.00"
                      :class="{
                        'is-invalid': formsubmit && $v.formVariables.rezervationPrice.$error,
                      }"
                    />
                    <div
                      v-if="formsubmit && $v.formVariables.rezervationPrice.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.rezervationPrice.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.formVariables.rezervationPrice.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="uetdsPrice">UETDS Fiyatı</label>
                    <input
                      v-model="formVariables.uetdsPrice"
                      id="uetdsPrice"
                      name="uetdsPrice"
                      type="text"
                      class="form-control"
                      placeholder="00.00"
                      :class="{
                          'is-invalid': formsubmit && $v.formVariables.uetdsPrice.$error,
                        }"
                      />
                    <div
                      v-if="formsubmit && $v.formVariables.uetdsPrice.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.uetdsPrice.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.formVariables.uetdsPrice.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="directionPrice">Yön Fiyatı</label>
                    <input
                      v-model="formVariables.directionPrice"
                      :disabled="companyOwner"
                      id="directionPrice"
                      name="directionPrice"
                      type="text"
                      class="form-control"
                      placeholder="00.00"
                      :class="{
                        'is-invalid':
                          formsubmit && $v.formVariables.directionPrice.$error,
                      }"
                    />
                    <div v-if="formsubmit && $v.formVariables.directionPrice.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.directionPrice.required">Bu alan gereklidir.</span>
                      <span v-if="!$v.formVariables.directionPrice.maxLength">Bu alana maksimum 50 karakter girilebilir.</span>
                    </div> 
                    
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="mb-3">
                    <label for="role">Para Birimi</label>
                    <multiselect 
                          v-model="priceCurrencySelected" 
                          :options="this.priceCurrency"
                          :searchable="true"
                          :custom-label="priceCurrencyObject"
                          @select="selectedPriceCurrency"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="mb-3">
                    <label for="role">Durum</label>
                    <multiselect 
                          v-model="formVariables.status" 
                          :options="this.statusVariables"
                          placeholder="Seçiniz"
                          selectLabel=""
                          deselectLabel=""
                          selectedLabel=""
                          :class="{
                          'is-invalid':
                            formsubmit && $v.formVariables.status.$error,
                          }">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div v-if="formsubmit && $v.formVariables.status.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.status.required">Bu alan gereklidir.</span>
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
                    <tr v-if="!companyOwner">
                      <td>Yön Fiyatı :</td>
                      <td class="text-sm-end">{{this.formVariables.directionPrice | priceFormat }} {{this.priceCurrencySelected.symbol}}</td>
                    </tr>
                    <tr>
                      <td>Ara Toplam : </td>
                      <td class="text-sm-end">{{this.formVariables.price.subtotal | priceFormat }} {{this.priceCurrencySelected.symbol}}</td>
                    </tr>
                    <tr>
                      <td>KDV({{this.taxation.localTaxRate}}%) :</td>
                      <td class="text-sm-end">{{this.formVariables.price.tax | priceFormat }} {{this.priceCurrencySelected.symbol}}</td>
                    </tr>
                    <tr>
                      <th>Toplam :</th>
                      <td class="text-sm-end">{{this.formVariables.price.total | priceFormat }} {{this.priceCurrencySelected.symbol}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-grid mt-4">
                <div class="d-grid gap-2">
                  <button block class="btn btn-secondary ms-1" v-on:click="submitForm">Rezervasyon Oluştur</button>
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>
   
  </Layout>
</template>