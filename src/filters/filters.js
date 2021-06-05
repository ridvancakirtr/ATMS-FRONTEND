import Vue from 'vue'

Vue.filter('formatShortDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY')
  }
})
