import Vue from 'vue'

Vue.filter('priceFormat', function (value) {
   return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
})

Vue.filter('date', function (value) {
   const myArray = value.split("T");
   const date = myArray[0];
   const time = myArray[1];
   const dateSplit = date.split("-");
   const timeSplit = time.split(":");

   return dateSplit[2]+'-'+dateSplit[1]+'-'+dateSplit[0]+' '+timeSplit[0]+':'+timeSplit[1]
})

Vue.filter('point', function (value) {
   if(value.airport !== undefined){
      return `${value.airport.name} — ${value.airport.cityName}`
   }else{
      if(value.hotel==undefined){
         return `${value.point} — ${value.city[0].name} / ${value.city[0].cityName}`
       }else{
         return `${value.hotel} — ${value.point} / ${value.city[0].name} / ${value.city[0].cityName}`
       }
   }
   
})

Vue.filter('priceCurrency', function (value) {
   if(value==0){
      return '₺'
   }
   if(value==1){
      return '€'
   }
   if(value==2){
      return '$'
   }
   if(value==3){
      return '£'
   }
})
