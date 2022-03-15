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
  employeeMethod,
  vehicleMethod,
  rezervationMethod,
  uetdsMethod
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
      title: "Güncelle",
      items: [
        {
          text: "Rezervasyon",
          href: "/",
        },
        {
          text: "Güncelle",
          active: true,
        },
      ],
      gender:['E','K'],
      locationArray:[],
      employessArray:[],
      airportArray:[],
      terminals:['İç Hatlar','Dış Hatlar'],
      statusVariables:[{id:1,value:"Ödendi"},{id:0,value:"Ödenmedi"}],
      transferTypeArray:[{id:1,value:"Alından Transfer"},{id:2,value:'Yönlendirilen Transfer'}],
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
      isFormChange:false,
      isLoading:false,
      id:null,
      addPaxSubmit: false,
      formsubmit: false,
      customerReadOnly:true,
      companyOwner:true,
      newVehicleTypes:[],
      newAgencies:[],
      tempAgency:null,
      tempVehicle:null,
      tempPriceCurrencySelected:null,
      tempStatus:null,
      tempEmployess:[],
      tempUetdsPrice:null,
      tempDirectionPrice:null,
      tempVehicleType:null,
      tempTransferType:null,
      tempPickUpTime:'09:00',
      tempDropOffTime:'09:00',
      tempDropOffDateTime:null,
      tempPickUpDateTime:null,
      foundCustomerId:null,
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
      pdfURL:null,
      formVariables:{
        agency:null,
        vehicleType:null,
        uetdsPrice:null,
        directionPrice:null,
        flightNumber:null,
        transferDirection:0,
        startPoint:null,
        endPoint:null,
        terminal:null,
        pickUpDateTime:null,
        dropOffDateTime:null,
        transferType:0,
        status:null,
        isReturn:false,
        phoneNumber:null,
        babySeat: 0,
        childSeat: 0,
        wheelSeat: 0,
        smsNotification:false,
        uetdsNotification:false,
        priceCurrency:0,
        vehicle:null,
        customer: {
          id: null,
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
        tempPrice:null,
        price:{
          subtotal: 0, 
          tax: 0, 
          total: 0
        },
        note:null,
        uetdsStatus:false,
        uetdsRefNumber:null
      }
    };
    
  },
  watch:{
    tempVehicle(value){
      this.isFormChange=true
      if(value!=null){
        this.formVariables.vehicle=value._id
      }else{
        this.formVariables.vehicle=null
      }
    },
    tempPickUpTime(value){
      this.isFormChange=true
      const timePick = value.split(":");
      this.formVariables.pickUpDateTime.setHours(timePick[0],timePick[1],0)
    },
    tempDropOffTime(value){
      this.isFormChange=true
      const timeDrop = value.split(":");
      this.formVariables.dropOffDateTime.setHours(timeDrop[0],timeDrop[1],0);
    },
    tempPickUpDateTime(value){
      this.isFormChange=true
      this.formVariables.pickUpDateTime.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    },
    tempDropOffDateTime(value){
      this.isFormChange=true
      this.formVariables.dropOffDateTime.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    },
    'formVariables.transferDirection'(){
      this.isFormChange=true
      this.formVariables.startPoint=null
      this.formVariables.endPoint=null
    },
    'formVariables.startPoint'(){
      this.isFormChange=true;
    },
    'formVariables.endPoint'(){
      this.isFormChange=true;
    },
    'formVariables.isReturn'(value){
      this.formVariables.isReturn=value
      if (this.formVariables.tempPrice=='' || this.formVariables.tempPrice==null) {
        this.formVariables.price=Taxation.calPrice(0, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, value);
      } else {
       this.formVariables.price=Taxation.calPrice(this.formVariables.tempPrice, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, value);
      }
    },
    'formVariables.tempPrice'(value){
      if (value=='' || isNaN(value)) {
        this.formVariables.price=Taxation.calPrice(0, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, this.formVariables.isReturn);
        //console.log(`vergi calprice`,this.formVariables);
      } else {
        this.formVariables.price=Taxation.calPrice(value, this.taxation.isTaxation, this.taxation.typeOfTaxation, this.taxation.localTaxRate, this.formVariables.isReturn);
        //console.log(`vergi calprice`,this.formVariables);
      }
    },
    tempUetdsPrice(value){
      this.isFormChange=true
      if (value=='') {
        this.formVariables.uetdsPrice=null
      }else{
        this.formVariables.uetdsPrice=parseFloat(value)
      }
    },
    tempDirectionPrice(value){
      if (value=='') {
        this.formVariables.directionPrice=null
      }else{
        this.formVariables.directionPrice=parseFloat(value)
      }
    },
    'formVariables.uetdsNotification'(value){
      if (!value) {
        this.tempUetdsPrice=null
      }
    },
    'formVariables.flightNumber'(value){
      this.formVariables.flightNumber=value
    },
    tempVehicleType(value){
      if(value!=null){
        this.formVariables.vehicleType=value._id
      }else{
        this.formVariables.vehicleType=null
      }
    },
    tempPriceCurrencySelected(value){
      if(value!=null){
        this.formVariables.priceCurrency=value.id
      }else{
        this.formVariables.priceCurrency=null
      }
    },
    tempStatus(value){
      if(value!=null){
        this.formVariables.status=value.id
      }else{
        this.formVariables.status=null
      }
    },
    tempEmployess(){
      this.isFormChange=true
      let temp=[]
      this.tempEmployess.forEach(function(element) {
        temp.push(element._id)
      })
      
      this.formVariables.employees=temp
    },
    tempTransferType(value){
      if(value!=null){
        this.formVariables.transferType=value.id
      }
    },
    tempAgency(value){
      if(value!=null){
        this.formVariables.agency=value._id
        //console.log(this.formVariables.agency);
        if(value.companyOwner){
          this.companyOwner=true
          this.formVariables.transferType=0
          this.tempDirectionPrice=null
          this.formVariables.directionPrice=null
          this.tempTransferType=null
        }else{
          this.tempTransferType=this.transferTypeArray[0]
          this.companyOwner=false
        }
      }else{
        this.formVariables.agency=null
      }
    },
    uetdsNotification(value){
      if(value!=null){
        this.formVariables.transferType=value.id
      }
    }
  },
  computed: {
    vehicles(){
      return this.$store.state.vehicle.vehicles.data
    },
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
    },
    rezervation(){
      return this.$store.state.rezervation.rezervation
    },
    uetdsPrintOutPDF(){
      return this.$store.state.uetds.printOutPDF
    }
  },
  methods: {
    submitAddPaxForm() {
      this.isFormChange=true

      this.addPaxSubmit = true;
      this.$v.passangerList.$touch();
      //console.log("girdi");
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
        //console.log("kaydetti--");
        this.$v.passangerList.$reset();
      }
    },
    countriesObject (value) {
      return `${value.countryName} — [${value.code}]`
    },
    agencyObject ({ companyName }) {
      return `${companyName}`
    },
    setOwnerAgency(){
      this.agencies.forEach(element => {
          if(element.companyOwner){
            this.tempAgency=element
          }
      });
    },
    setCustomerNationality(){
      this.formVariables.customer.nationality=this.countries[6]
      this.passangerList.nationality=this.countries[6]
    },
    vehicleTypesObject (value) {
      return `${value.name} - ${value.pax}`
    },
    transferTypesObject (value) {
      return `${value.value}`
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
    vehiclesTypesObject ({brand,model,plate}) {
      return `${plate} - ${brand} ${model}`
    },
    setVehicleTypes(){
      this.newVehicleTypes=this.vehicleTypes;
    },
    priceCurrencyObject({text,symbol}){
      return `${text} ${symbol}`
    },
    statusVariablesObject({value}){
      return `${value}`
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
    setEmployess(){
      //0-Şoför 1-Şöför Yrd.2-Host 3-Hostes 4-Diğer 5-Rehber
      let tempSofor=[]
      let tempSoforYrd=[]
      let tempHost=[]
      let tempHostes=[]
      let tempDiger=[]
      let tempRehber=[]
      this.employees.data.forEach(element => {
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
    removePax(index){
      this.formVariables.pax.splice(index,  1);
    },
    scrollToTop() {
      window.scrollTo(0,0);
    },
    async uetdsChecked(){
      if(this.rezervation.uetdsStatus){
        return 'checked'
      }
      return 'checked'
    },
    timeAddZero(date) {
      let d=new Date(date);
      let h=null
      let m=null
    
      if(d.getHours()< 10){
        h="0" + d.getHours();
      }else{
        h=d.getHours();
      }

      if(d.getMinutes()< 10){
        m="0" + d.getMinutes();
      }else{
        m=d.getMinutes();
      }

      return h+':'+m
    },
    async submitForm() {
      
      this.formsubmit = true;
      this.$v.formVariables.$touch();
      if (!this.$v.formVariables.$invalid) {
      
        let rezervationForm={
          id:this.formVariables.id,
          agency:this.formVariables.agency,
          transferType:this.formVariables.transferType,
          vehicleType:this.formVariables.vehicleType,
          employee:this.formVariables.employees,
          customer:this.formVariables.customer.id,
          transferDirection:this.formVariables.transferDirection,
          startPoint:this.formVariables.startPoint,
          endPoint:this.formVariables.endPoint,
          flightNumber:this.formVariables.flightNumber,
          terminal:this.formVariables.terminal,
          isReturn:this.formVariables.isReturn,
          pickUpDateTime:this.formVariables.pickUpDateTime,
          dropOffDateTime:this.formVariables.dropOffDateTime,
          babySeat:this.formVariables.babySeat,
          childSeat:this.formVariables.childSeat,
          wheelSeat:this.formVariables.wheelSeat,
          pax:this.formVariables.pax,
          note:this.formVariables.note,
          vehicle:this.formVariables.vehicle,
          smsNotification:this.formVariables.smsNotification,
          price:this.formVariables.price.subtotal,
          uetdsPrice:this.formVariables.uetdsPrice,
          directionPrice:this.formVariables.directionPrice,
          priceCurrency:this.formVariables.priceCurrency,
          status:this.formVariables.status,
          uetdsStatus:this.rezervation.uetdsStatus,
          uetdsRefNumber:this.rezervation.uetdsRefNumber
        }

        await this.updateRezervation({id:rezervationForm.id,form:rezervationForm});
        

        if(this.isFormChange && this.rezervation.uetdsStatus){
          await this.cancelNotification(this.formVariables.id);
          await this.sendNotification(this.formVariables.id);
          this.isFormChange=false
          //console.log('U-ETDS Guncellemesi Yapıldı')
        }

        if(!this.rezervation.uetdsStatus && this.formVariables.uetdsNotification){
          await this.sendNotification(this.formVariables.id);
          this.isFormChange=false
          //console.log('bildirildi');
        }

        if(this.rezervation.uetdsStatus && !this.formVariables.uetdsNotification){
          await this.cancelNotification(this.formVariables.id);
          this.isFormChange=false
          //console.log('Bildirim İptal');
        }
        
        
        this.scrollToTop();
      }

      
    },
    updatePassengerList(){
      if(!this.customerReadOnly){
        this.formVariables.pax[0]={
          tcknOrPassport:this.formVariables.customer.tcknOrPassport,
          name:this.formVariables.customer.name,
          surname:this.formVariables.customer.surname,
          gender:this.formVariables.customer.gender,
          nationality:this.formVariables.customer.nationality,
        }
      }
    },
    setPriceCurrency(){
      this.tempPriceCurrencySelected=this.priceCurrency[0];
    },
    setCustomer(){
      this.formVariables.customer.id=this.rezervation.customer._id
      this.formVariables.phoneNumber=this.rezervation.customer.phone.formattedNumber
      this.formVariables.customer.tcknOrPassport=this.rezervation.customer.tcknOrPassport
      this.formVariables.customer.name=this.rezervation.customer.name
      this.formVariables.customer.surname=this.rezervation.customer.surname
      this.formVariables.customer.gender=this.rezervation.customer.gender
      this.formVariables.customer.nationality=this.rezervation.customer.nationality

      //DB gelen müşteriyi yolcu listesine ekledik
        if(this.oneTimeAddPassangertoList){
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
    },
    setLocalVariable(){
      this.formVariables.id=this.rezervation._id

      this.tempAgency=this.rezervation.agency
      this.tempVehicleType=this.rezervation.vehicleType

      this.formVariables.transferDirection=this.rezervation.transferDirection
      setTimeout(() => {
        this.formVariables.startPoint=this.rezervation.startPoint
        this.formVariables.endPoint=this.rezervation.endPoint
        this.tempPickUpDateTime=new Date(this.rezervation.pickUpDateTime);

        this.tempPickUpTime=this.timeAddZero(this.rezervation.pickUpDateTime)

        this.tempTransferType=this.transferTypeArray.find( ({ id }) => id == this.rezervation.transferType );
        this.tempEmployess=this.rezervation.employee
      }, 50);

      this.formVariables.flightNumber=this.rezervation.flightNumber
      this.formVariables.terminal=this.rezervation.terminal
      this.formVariables.babySeat=this.rezervation.babySeat
      this.formVariables.childSeat=this.rezervation.childSeat
      this.formVariables.wheelSeat=this.rezervation.wheelSeat

      this.formVariables.uetdsNotification=this.rezervation.uetdsStatus

      this.tempVehicle=this.rezervation.vehicle

      this.formVariables.note=this.rezervation.note

      this.formVariables.pax=JSON.parse(JSON.stringify(this.rezervation.pax))

      this.formVariables.tempPrice=this.rezervation.price
      this.tempPriceCurrencySelected=this.priceCurrency.find( ({ id }) => id == this.rezervation.priceCurrency );
      
      this.tempUetdsPrice=this.rezervation.uetdsPrice
      this.tempDirectionPrice=this.rezervation.directionPrice

      this.tempStatus=this.statusVariables.find( ({ id }) => id == this.rezervation.status );

      setTimeout(() => {this.isFormChange=false}, 60);
      
    },
    async printUetds(){
      await this.printOut(this.formVariables.id);
      this.pdfURL = 'data:application/octet-stream;base64,'+this.uetdsPrintOutPDF.pdf
      const downloadLink = document.createElement("a");
      downloadLink.href = this.pdfURL;
      downloadLink.download = this.rezervation.customer.name+' '+this.rezervation.customer.surname+'.PDF';
      downloadLink.click();
    },
    ...employeeMethod,
    ...agencyMethod,
    ...vehicleTypeMethod,
    ...pointMethod,
    ...airportMethod,
    ...taxationMethod,
    ...customerMethod,
    ...vehicleMethod,
    ...rezervationMethod,
    ...uetdsMethod
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
      agency:{ required },
      
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
      vehicleType:{ required},
      priceCurrency:{ required },
      status:{ required },
      transferType:{ required: requiredIf(function () {
          return !this.companyOwner
      })},
      employees:{ required: requiredIf(function (value) {
        return value.uetdsNotification
      })},
      vehicle:{ required: requiredIf(function (value) {
        return !value.uetdsNotification
      })},
      tempPrice:{ required, numeric, maxLength: maxLength(10) },
      uetdsPrice:{ required: requiredIf(function (value) {
        return value.uetdsNotification
      }),maxLength: maxLength(10),numeric},
      directionPrice:{ required: requiredIf(function () {
        return !this.companyOwner
      }),maxLength: maxLength(10),numeric},
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
    await this.fetchVehicles({page:1,limit:1000,search:""})
    await this.fetchCountries()
    await this.fetchRezervation(this.$route.params.id)
    this.setPriceCurrency();
    this.setOwnerAgency();
    this.setCustomerNationality();
    this.setVehicleTypes();
    this.setAgencies();
    this.setLocation();
    this.setAirport();
    this.setEmployess();
    this.setCustomer();
    this.setLocalVariable();
    var DateTimeDropOff=new Date()
    DateTimeDropOff.setHours(9,0,0)

    var  DateTimePickUp=new Date()
    DateTimePickUp.setHours(9,0,0)

    this.tempPickUpDateTime=DateTimePickUp
    this.tempDropOffDateTime=DateTimeDropOff
    
    this.formVariables.pickUpDateTime=DateTimePickUp
    this.formVariables.dropOffDateTime=DateTimeDropOff

    this.isLoading=true

    this.isFormChange=false
  },

}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
      <div class="row" v-if="!isLoading">
        <div class="card">
          <div class="card-body">
            <div class="text-center">
              <b-spinner v-if="!isLoading" type="grow" class="m-2" variant="primary" role="status"></b-spinner>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="isLoading">
        <div class="col-lg-12">
          <b-alert show dismissible variant="success" v-if="this.$store.state.rezervation.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.rezervation.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.rezervation.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.rezervation.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="success" v-if="this.$store.state.customer.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.customer.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.customer.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.customer.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="success" v-if="this.$store.state.uetds.notification.status==true">
          <i class="mdi mdi-check-all me-2"></i>{{this.$store.state.uetds.notification.message}}
        </b-alert>

        <b-alert show dismissible variant="danger" v-if="this.$store.state.uetds.notification.status==false">
          <i class="mdi mdi-close-circle-outline me-2"></i>{{this.$store.state.uetds.notification.message}}
        </b-alert>
          
        </div>

        <div class="col-lg-12">

          <div class="row">
            <div class="col-sm-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="avatar-xs me-3">
                      <span class="avatar-title rounded-circle bg-soft bg-primary text-primary font-size-18">
                        <i class="fas fa-car"></i>
                      </span>
                    </div>
                    <h5 class="font-size-14 mb-0">Sürücü Ödemesi</h5>
                  </div>
                  <div class="text-muted mt-4">
                    <div class="d-flex" v-if="rezervation.driverStatus">
                      <span class="badge badge-soft-success font-size-12"><i class="fas fa-check"></i></span>
                      <span class="ms-2 text-truncate">Ödendi</span>
                    </div>
                    <div class="d-flex" v-if="!rezervation.driverStatus">
                      <span class="badge badge-soft-danger font-size-12"><i class="fas fa-check"></i></span>
                      <span class="ms-2 text-truncate">Ödenmedi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="avatar-xs me-3">
                      <span class="avatar-title rounded-circle bg-soft bg-primary text-primary font-size-18">
                        <i class="fas fa-user-alt"></i>
                      </span>
                    </div>
                    <h5 class="font-size-14 mb-0">Müşteri Ödemesi</h5>
                  </div>
                  <div class="text-muted mt-4">
                    <div class="d-flex" v-if="rezervation.status">
                      <span class="badge badge-soft-success font-size-12"><i class="fas fa-check"></i></span>
                      <span class="ms-2 text-truncate">Ödendi</span>
                    </div>
                    <div class="d-flex" v-if="!rezervation.status">
                      <span class="badge badge-soft-danger font-size-12"><i class="fas fa-check"></i></span>
                      <span class="ms-2 text-truncate">Ödenmedi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-5 col-9">
                      <div class="d-flex align-items-center">
                      <div class="avatar-xs me-3">
                        <span class="avatar-title rounded-circle bg-soft bg-primary text-primary font-size-18">
                          <i class="fas fa-globe"></i>
                        </span>
                      </div>
                      <h5 class="font-size-15 mt-2">U-ETDS</h5>
                      </div>
                    </div>
                    <div class="col-md-7 col-3">
                      <ul class="list-inline user-chat-nav text-end mb-0">
                        <li class="list-inline-item">
                          <div class="avatar-xs me-3" type="button" v-on:click="printUetds" v-if="rezervation.uetdsStatus">
                            <span class="avatar-title rounded-circle bg-soft bg-light text-dark font-size-14">
                              <i class="fas fa-print" v-if="!this.$store.state.uetds.isBtnDisabled"></i>
                              <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.uetds.isBtnDisabled"></i>
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="text-muted mt-3">
                    <div class="d-flex" v-if="rezervation.uetdsStatus">
                      <span class="badge badge-soft-success font-size-12"><i class="fas fa-check"></i></span>
                      <span class="ms-2 text-truncate">Bildirildi</span>
                    </div>
                    <div class="d-flex" v-if="!rezervation.uetdsStatus">
                      <span class="badge badge-soft-danger font-size-12"><i class="fas fa-check"></i></span>
                      <span class="ms-2 text-truncate">Bildirilmedi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-2">Transfer Detayları</h4>
                  <div class="row">
                    <div class="col-sm-4 mt-2">
                      <label for="authorizedPhone">Agenta Seçimi</label>
                      <multiselect 
                          v-model="tempAgency" 
                          :options="this.newAgencies"
                          :searchable="true"
                          :custom-label="agencyObject"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen"
                          :class="{
                                'is-invalid':
                                  formsubmit && $v.formVariables.agency.$error,
                              }">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                        <div v-if="formsubmit && $v.formVariables.agency.$error" class="invalid-feedback">
                          <span v-if="!$v.formVariables.agency.required">Bu alan gereklidir.</span>
                        </div>
                    </div>
                    
                    <div class="col-sm-4 mt-2">
                      <label for="tempVehicleType">Araç Tipi</label>
                      <multiselect 
                            id="tempVehicleType"
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
                        <div v-if="formsubmit && $v.formVariables.vehicleType.$error" class="invalid-feedback">
                          <span v-if="!$v.formVariables.vehicleType.required">Bu alan gereklidir.</span>
                        </div>
                    </div>
                    
                    <div class="col-sm-4 mt-2">
                      <label for="tempTransferType">Transfer Tipi</label>
                      <multiselect 
                            id="tempTransferType"
                            v-model="tempTransferType" 
                            :options="this.transferTypeArray"
                            :custom-label="transferTypesObject"
                            :disabled="companyOwner"
                            :allow-empty="false"
                            :show-labels="false"
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

          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-2">Yeni Müşteri</h4>
              <div class="text-sm-end">
                <h5 v-if="customerReadOnly"><span class="badge bg-success ms-1 align-bottom">Mevcut</span></h5>
                <h5 v-if="!customerReadOnly"><span class="badge bg-warning ms-1 align-bottom">Eklenecek</span></h5>
              </div>
              <div class="row">
                <div class="col-sm-6 mt-2">
                    <label for="authorizedPhone">Müşteri Telefon No</label>
                    <VuePhoneNumberInput :disabled="customerReadOnly" position="top" size="sm" id="authorizedPhone" default-country-code="TR" v-model="formVariables.phoneNumber"
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
                      :readonly="customerReadOnly"
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
                      :readonly="customerReadOnly"
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
                      :readonly="customerReadOnly"
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
                      :disabled="customerReadOnly"
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
                        :disabled="customerReadOnly"
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
                    <date-picker :clearable="false" format="DD-MM-YYYY" placeholder="Alış tarihi" v-model="tempPickUpDateTime" :first-day-of-week="1" lang="tr"></date-picker>
                </div>
                <div class="col-sm-6 mt-2">
                  <label>Alış Saati</label>
                    <date-picker :clearable="false" sync="false" id="pickUpTime" v-model="tempPickUpTime" :time-picker-options="{start:'00:00',step:'00:15',end:'23:45'}" format="HH:mm" value-type="format" type="time" placeholder="ss:dd"></date-picker>
                </div>
              </div>
              
              <div class="row" v-if="formVariables.isReturn">
                <div class="col-sm-6 mt-2">
                  <label>Dönüş Tarihi</label>
                    <date-picker :clearable="false" format="DD-MM-YYYY" placeholder="Dönüş Tarihi" v-model="tempDropOffDateTime" :first-day-of-week="1" lang="tr">
                    </date-picker>
                </div>
                <div class="col-sm-6 mt-2">
                  <label>Dönüş Saati</label>
                    <date-picker :clearable="false" id="dropOffTime" v-model="tempDropOffTime" :time-picker-options="{start:'00:00',step:'00:15',end:'23:45'}" format="HH:mm" value-type="format" type="time" placeholder="ss:dd"></date-picker>
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

          <div class="row">
            <div class="col-sm-6">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title mb-4">Bilgilendirme</h4>
                    <div class="col-sm-6 mt-2">
                      <label class="form-check form-switch form-switch-md mb-3">
                        <input class="form-check-input" v-model="formVariables.smsNotification" type="checkbox" id="smsNotification"/>
                        <label class="form-check-label" for="smsNotification">SMS</label>
                      </label>
                   </div>
                </div>
              </div>
            </div>

            <div class="col-sm-6">
              <div class="card">
                  <div class="card-body">
                    <h4 class="card-title mb-4">Ulaştırma Bakanlığı</h4>
                    <div class="col-sm-6 mt-2">
                      <label class="form-check form-switch form-switch-md mb-3">
                        <input class="form-check-input" v-model="formVariables.uetdsNotification" type="checkbox" id="uetdsNotification" :checked="uetdsChecked"/>
                        <label class="form-check-label" for="uetdsNotification">U-ETDS</label>
                      </label>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <div class="card" v-if="formVariables.uetdsNotification || tempEmployess.length>0">
            <div class="card-body">
              <h4 class="card-title mb-3">U-ETDS Şoför ve Araç Plaka Seçimi</h4>
              <div class="row">
                <div class="col-sm-6 mt-2">
                      <label for="authorizedPhone">Şoför ve Diğer Personeller</label>
                      <multiselect 
                            id="vehicleTypes"
                            v-model="tempEmployess" 
                            :options="this.employessArray"
                            :custom-label="employessTypesObject"
                            :searchable="true"
                            :multiple="true"
                            track-by="_id"
                            open-direction="bottom"
                            group-values="employees"
                            group-label="type"
                            placeholder="Seçiniz"
                            selectLabel="Seçiniz"
                            deselectLabel="Seçimi Kaldır"
                            selectedLabel="Seçilen"
                            :class="{
                            'is-invalid':
                              formsubmit && $v.formVariables.employees.$error,
                            }"
                            >
                            <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                      </multiselect>
                      <div v-if="formsubmit && $v.formVariables.employees.$error" class="invalid-feedback">
                        <span v-if="!$v.formVariables.employees.required">Bu alan gereklidir.</span>
                      </div>
                </div>
                <div class="col-sm-6 mt-2">
                  <label for="authorizedPhone">Araç</label>
                  <multiselect 
                      id="vehicleTypes"
                      v-model="tempVehicle" 
                      :options="this.vehicles"
                      :custom-label="vehiclesTypesObject"
                      :searchable="true"
                      open-direction="bottom"
                      placeholder="Seçiniz"
                      selectLabel="Seçiniz"
                      deselectLabel="Seçimi Kaldır"
                      selectedLabel="Seçilen"
                      :class="{
                      'is-invalid':
                        formsubmit && $v.formVariables.vehicle.$error,
                      }"
                      >
                      <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                  </multiselect>
                  <div v-if="formsubmit && $v.formVariables.vehicle.$error" class="invalid-feedback">
                    <span v-if="!$v.formVariables.vehicle.required">Bu alan gereklidir.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-3">Fiyatlandırma</h4>
              <div class="row">
                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="transferPrice">Fiyat</label>
                    <input
                      v-model.trim="formVariables.tempPrice"
                      id="transferPrice"
                      name="transferPrice"
                      type="text"
                      class="form-control"
                      placeholder="00.00"
                      :class="{
                        'is-invalid': formsubmit && this.$v.formVariables.tempPrice.$error,
                      }"
                    />
                    <div v-if="formsubmit && $v.formVariables.tempPrice.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.tempPrice.required">Bu alan gereklidir.<br></span>
                      <span v-if="!$v.formVariables.tempPrice.numeric">Bu alana sadece sayı girilebilir.<br></span>
                      <span v-if="!$v.formVariables.tempPrice.maxLength">Bu alana maksimum 10 karakter girilebilir.</span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="uetdsPrice">UETDS Fiyatı</label>
                    <input
                      v-model="tempUetdsPrice"
                      id="uetdsPrice"
                      name="uetdsPrice"
                      type="text"
                      :disabled="!this.formVariables.uetdsNotification"
                      class="form-control"
                      placeholder="00.00"
                      :class="{
                          'is-invalid': formsubmit && $v.formVariables.uetdsPrice.$error,
                        }"
                      />
                    <div
                      v-if="formsubmit && $v.formVariables.uetdsPrice.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.uetdsPrice.required">Bu alan gereklidir.<br></span>
                      <span v-if="!$v.formVariables.uetdsPrice.numeric">Bu alana sadece sayı girilebilir.<br></span>
                      <span v-if="!$v.formVariables.uetdsPrice.maxLength">Bu alana maksimum 10 karakter girilebilir.<br></span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-2">
                  <div class="mb-3">
                    <label for="directionPrice">Yön Fiyatı</label>
                    <input
                      v-model="tempDirectionPrice"
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
                      <span v-if="!$v.formVariables.directionPrice.required">Bu alan gereklidir.<br></span>
                      <span v-if="!$v.formVariables.directionPrice.numeric">Bu alana sadece sayı girilebilir.<br></span>
                      <span v-if="!$v.formVariables.directionPrice.maxLength">Bu alana maksimum 50 karakter girilebilir.<br></span>
                    </div> 
                    
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="mb-3">
                    <label for="role">Para Birimi</label>
                    <multiselect 
                          v-model="tempPriceCurrencySelected" 
                          :options="this.priceCurrency"
                          :custom-label="priceCurrencyObject"
                          placeholder="Seçiniz"
                          selectLabel="Seçiniz"
                          deselectLabel="Seçimi Kaldır"
                          selectedLabel="Seçilen"
                          :class="{
                          'is-invalid':
                            formsubmit && $v.formVariables.priceCurrency.$error,
                          }">
                          <span slot="noResult">Oops! Öğe bulunamadı. Arama sorgusunu değiştirmeyi deneyin.</span>
                    </multiselect>
                    <div v-if="formsubmit && $v.formVariables.priceCurrency.$error" class="invalid-feedback">
                      <span v-if="!$v.formVariables.priceCurrency.required">Bu alan gereklidir.</span>
                    </div> 
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="mb-3">
                    <label for="role">Durum</label>
                    <multiselect 
                          v-model="tempStatus" 
                          :options="this.statusVariables"
                          :custom-label="statusVariablesObject"
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
                            <td class="text-sm-end">{{this.formVariables.directionPrice==null ? 0 : this.formVariables.directionPrice | priceFormat }} {{ this.tempPriceCurrencySelected!=null ? this.tempPriceCurrencySelected.symbol : ''}}</td>
                          </tr>
                          <tr>
                            <td>Ara Toplam : </td>
                            <td class="text-sm-end">{{this.formVariables.price.subtotal | priceFormat }} {{ this.tempPriceCurrencySelected!=null ? this.tempPriceCurrencySelected.symbol : ''}}</td>
                          </tr>
                          <tr>
                            <td>KDV({{this.taxation.localTaxRate}}%) :</td>
                            <td class="text-sm-end">{{this.formVariables.price.tax | priceFormat }} {{ this.tempPriceCurrencySelected!=null ? this.tempPriceCurrencySelected.symbol : ''}}</td>
                          </tr>
                          <tr>
                            <th>Toplam :</th>
                            <td class="text-sm-end">{{this.formVariables.price.total | priceFormat }} {{ this.tempPriceCurrencySelected!=null ? this.tempPriceCurrencySelected.symbol : ''}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="d-grid mt-4">
                      <div class="d-grid gap-2">
                        <button block type="submit" class="btn btn-success" v-on:click="submitForm" :disabled="this.$store.state.rezervation.isBtnDisabled || this.$store.state.uetds.isBtnDisabled">
                        <i class="bx bx-loader bx-spin font-size-16 align-middle me-2" v-if="this.$store.state.rezervation.isBtnDisabled || this.$store.state.uetds.isBtnDisabled"></i>
                          <span>Rezervasyon Güncelle</span>
                        </button>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
  </Layout>
</template>