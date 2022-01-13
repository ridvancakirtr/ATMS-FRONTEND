import Vue from 'vue'

Vue.filter('priceFormat', function (value) {
   return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
})