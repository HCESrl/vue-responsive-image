import ResponsiveImage from './ResponsiveImage.vue'

const VueResponsiveImage = {
  install (Vue, options) {
    console.log('installing', options)
    Vue.component(ResponsiveImage.name, ResponsiveImage)
  }
}
console.log(VueResponsiveImage)

export default VueResponsiveImage

// in-browser load
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueResponsiveImage)
}