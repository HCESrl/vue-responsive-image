/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

import Vue from 'vue'
import ResponsiveImage from './plugin.js'

Vue.use(ResponsiveImage)

var vm = new Vue({
  el: '#app',
  data: {
    'test':'This is a test'
  }
})
