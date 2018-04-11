import Vue from 'vue'
import ResponsiveImage from './plugin.js'

Vue.use(ResponsiveImage)

var vm = new Vue({
  el: '#app',
  data: {
    'title':'Vue responsive image plugin'
  }
})
