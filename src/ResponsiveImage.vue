<template>
  <picture>
    <source v-if="hasSmartphoneSrcset && !showError" :srcset="smartphoneSrcset" :sizes="smartphoneSizes" media="(max-width: 767px)">
    <source v-if="hasTabletSrcset && !showError" :srcset="tabletSrcset" :sizes="tabletSizes" media="(min-width: 768px) and (max-width: 1023px)">
    <img v-if="!showError" :src="defaultImage" :alt="alt" :class="[defaultClass, imageClass]" :srcset="srcset" :sizes="sizes" @error="onError">
    <img v-else :src="errorImage" :alt="alt" :class="[defaultClass, imageClass, errorClass]">
  </picture>
</template>

<script>
const responsiveImageSizes = require('responsive-image-sizes')

export default {
  name: 'VueResponsiveImage',
  props: {
    // the base with which to generate image urls, with placeholders for width and height
    // %width% and %height%
    // example: http://via.placeholder.com/%width%x%height%
    imageUrl: {
      type: String,
      required: true
    },
    showErrorImage: {
      type: Boolean,
      default: false
    },
    // the image to show in case of loading error, optional
    errorImageUrl: {
      type: String,
      required: false,
      default: ''
    },
    mode: {
      type: String,
      default: 'all',
      validator: function (value) {
        // The value must match one of these strings -  tablet means tablet portrait, tablet landscape uses desktop sizes
        return ['all', 'tablet', 'smartphone', 'mobile'].indexOf(value) !== -1
      }
    },
    // percentage of screen occupied by image, in numbers, defaults to 100
    widthOnScreen: {
      type: Number,
      default: 100
    },
    // percentage of screen occupied by image on tablet portrait, in numbers, if not set it uses witdhOnScreen
    widthOnScreenTablet: {
      type: Number,
      default: undefined
    },
    // percentage of screen occupied by image on smartphone, in numbers, if not set it uses witdhOnScreen
    widthOnScreenSmartphone: {
      type: Number,
      default: undefined
    },
    // ratio of height respective to width, defaults to 16/9
    imageRatio: {
      type: Number,
      default: 16 / 9
    },
    alt: {
      type: String,
      default: ''
    },
    imageClass: {
      type: String,
      default: ''
    },
    // the maximum width to consider for the image, if it is not possible to generate an image wider
    // than a specific width
    maxWidth: {
      type: Number,
      default: 1920
    }
  },
  data: () => {
    return {
      // if there's a loading error on the current image
      'hasError': false,
      'defaultErrorImage': "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' height='384' width='512' version='1.1' id='Layer_1' x='0px' y='0px' viewBox='0 0 512 384' xml:space='preserve'%3E%3Cmetadata id='metadata13'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cdefs id='defs14' /%3E%3Cstyle type='text/css' id='style2'%3E.st0%7Bfill:none;%7D%3C/style%3E%3Crect style='opacity:1;fill:%23ffffff;fill-opacity:1;stroke:none;stroke-width:1.72839284;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1' id='rect821' width='512' height='384' x='0' y='0' /%3E%3Cg id='g867' transform='matrix(3.2296952,0,0,3.08914,159.10914,99.3258)'%3E%3Cpath id='path2' d='M 58,37.104 V 4 C 58,3.447 57.552,3 57,3 H 1 C 0.448,3 0,3.447 0,4 v 44 c 0,0.553 0.448,1 1,1 h 34.003 c 1.963,4.693 6.6,8 11.997,8 7.168,0 13,-5.832 13,-13 0,-2.535 -0.74,-4.895 -2,-6.896 z M 34.359,47 H 2 V 5 h 54 v 29.622 c -0.17,-0.164 -0.354,-0.311 -0.532,-0.465 -0.088,-0.075 -0.171,-0.155 -0.261,-0.228 -0.235,-0.192 -0.48,-0.37 -0.728,-0.545 -0.092,-0.065 -0.181,-0.135 -0.275,-0.198 -0.245,-0.163 -0.498,-0.312 -0.754,-0.458 -0.109,-0.063 -0.214,-0.13 -0.325,-0.189 -0.077,-0.041 -0.154,-0.083 -0.232,-0.123 0.179,-0.385 0.112,-0.852 -0.218,-1.154 l -12,-11 C 40.479,20.083 40.223,19.985 39.955,20 39.69,20.012 39.44,20.129 39.261,20.325 L 29.467,31.052 24.724,26.309 C 24.35,25.936 23.752,25.918 23.356,26.265 L 6.339,41.249 C 5.924,41.614 5.884,42.246 6.249,42.661 6.447,42.886 6.723,43 7,43 7.234,43 7.47,42.918 7.66,42.751 L 23.973,28.389 34.275,38.69 c 0.203,0.203 0.47,0.295 0.736,0.287 C 34.361,40.523 34,42.22 34,44 c 0,0.493 0.033,0.977 0.087,1.456 0.009,0.075 0.024,0.149 0.034,0.224 0.056,0.428 0.131,0.849 0.227,1.262 0.005,0.019 0.006,0.039 0.011,0.058 z M 48.779,31.136 C 48.617,31.114 48.458,31.081 48.294,31.065 47.867,31.023 47.435,31 47,31 c -4.773,0 -8.942,2.593 -11.203,6.437 -0.036,-0.054 -0.06,-0.114 -0.107,-0.162 l -4.807,-4.807 9.181,-10.054 9.694,8.887 c -0.067,-0.015 -0.133,-0.032 -0.2,-0.045 -0.257,-0.052 -0.519,-0.084 -0.779,-0.12 z M 47,55 c -4.787,0 -8.859,-3.08 -10.367,-7.358 -0.094,-0.267 -0.176,-0.536 -0.249,-0.806 -0.015,-0.058 -0.03,-0.115 -0.045,-0.173 -0.06,-0.238 -0.112,-0.476 -0.156,-0.716 -0.024,-0.133 -0.042,-0.267 -0.061,-0.401 -0.026,-0.18 -0.054,-0.36 -0.071,-0.54 C 36.021,44.674 36,44.339 36,44 c 0,-6.065 4.935,-11 11,-11 0.426,0 0.848,0.031 1.265,0.079 0.127,0.015 0.25,0.039 0.375,0.057 0.291,0.044 0.579,0.096 0.863,0.162 0.141,0.033 0.281,0.07 0.421,0.108 0.268,0.074 0.531,0.159 0.792,0.253 0.134,0.048 0.269,0.094 0.4,0.147 0.295,0.119 0.583,0.255 0.866,0.399 0.083,0.042 0.17,0.077 0.252,0.121 0.342,0.185 0.671,0.393 0.992,0.614 0.131,0.09 0.255,0.19 0.382,0.286 0.199,0.15 0.395,0.305 0.584,0.469 0.127,0.11 0.251,0.224 0.373,0.339 0.193,0.184 0.379,0.377 0.559,0.575 0.094,0.103 0.191,0.202 0.281,0.309 0.261,0.311 0.51,0.634 0.739,0.976 C 57.315,39.643 58,41.743 58,44 58,50.065 53.065,55 47,55 Z' /%3E%3Cpath id='path6' d='m 16,25.138 c 3.071,0 5.569,-2.498 5.569,-5.568 C 21.569,16.498 19.071,14 16,14 c -3.071,0 -5.569,2.498 -5.569,5.569 0,3.071 2.498,5.569 5.569,5.569 z M 16,16 c 1.968,0 3.569,1.602 3.569,3.569 0,1.967 -1.601,3.569 -3.569,3.569 -1.968,0 -3.569,-1.601 -3.569,-3.568 C 12.431,17.603 14.032,16 16,16 Z' /%3E%3Ctext xml:space='preserve' style='font-style:normal;font-weight:normal;font-size:19.32133293px;line-height:125%25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:%23000000;fill-opacity:1;stroke:none;stroke-width:0.48303333px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1' x='45.547047' y='47.717636' id='text856' transform='scale(0.92912444,1.0762821)'%3E%3Ctspan id='tspan854' x='45.547047' y='47.717636' style='stroke-width:0.48303333px'%3E%3F%3C/tspan%3E%3C/text%3E%3C/g%3E%3C/svg%3E%0A",
      'defaultClass': 'vue-responsive-image',
      'errorClass': 'vue-responsive-image-error',
      // width placeholder
      'widthPlaceholder': '%width%',
      // height placeholder
      'heightPlaceholder': '%height%',
      // the base sizes on which to calculate final image width
      'baseSizes': {
        'desktop': [
          1920,
          1600,
          1440,
          1366,
          1024,
          768
        ],
        'tabletPortrait': [
          1600,
          1024,
          768
        ],
        'smartphone': [
          818,
          768,
          640
        ]
      },
      // the default width of the image, a reasonable size for old browsers, mostly desktop, who don't support srcset
      defaultWidth: 1600
    }
  },
  computed: {
    test () {
      return 'test'
    },
    showError () {
      return this.hasError && this.showErrorImage
    },
    // the default image in the src attribute, for backwards compatibility
    defaultImage () {
      let finalWidth = this.getWidthAdaptedToWidthOnScreen(this.defaultWidth, this.widthOnScreen)
      return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth))
    },
    errorImage () {
      if (this.errorImageUrl !== '') {
        return this.errorImageUrl
      }
      return this.defaultErrorImage
    },
    srcset () {
      // if no different widths are defined for tablet and desktop, produce images for all versions requested in mode parameter
      if (typeof this.widthOnScreenTablet === 'undefined' && typeof this.widthOnScreenSmartphone === 'undefined') {
        return this.getSrcsetSizes('all', this.widthOnScreen).map(
          (finalWidth) => {
            return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
          }
        ).join(', ')
      } else {
        // produce images only for desktop
        return this.getSrcsetSizes('desktop', this.widthOnScreen).map(
          (finalWidth) => {
            return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
          }
        ).join(', ')
      }
    },
    tabletSrcset () {
      return this.getSrcsetSizes('tablet', this.widthOnScreenTablet).map(
        (finalWidth) => {
          return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
        }
      ).join(', ')
    },
    smartphoneSrcset () {
      return this.getSrcsetSizes('smartphone', this.widthOnScreenSmartphone).map(
        (finalWidth) => {
          let result = this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
          return result
        }
      ).join(', ')
    },
    // only if there's a specific tablet width which is different from the desktop one
    hasTabletSrcset () {
      return typeof this.widthOnScreenTablet !== 'undefined' && this.widthOnScreenTablet !== this.widthOnScreen
    },
    // only if there's a specific smartphone width which is different from the desktop one
    hasSmartphoneSrcset () {
      return typeof this.widthOnScreenSmartphone !== 'undefined' && this.widthOnScreenSmartphone !== this.widthOnScreen
    },
    sizes () {
      return this.widthOnScreen + 'vw'
    },
    tabletSizes () {
      return this.widthOnScreenTablet + 'vw'
    },
    smartphoneSizes () {
      return this.widthOnScreenSmartphone + 'vw'
    },
    srcscetSizes () {
      // check mode
      return this.getSrcsetSizes(this.mode)
    }
  },
  watch: {
    imageUrl: {
      immediate: true,
      handler (value, oldValue) {
        this.hasError = false
        // console.log('image changed', value, oldValue)
      }
    }
  },
  methods: {
    onError (error) {
      this.hasError = true
      console.log('could not load image due to error ', error)
    },
    getSrcsetSizes (mode, widthOnPage) {
      let mappedMode = mode
      if (mode === 'tablet') {
        mappedMode = 'tabletPortrait'
      }
      let options = {
        deviceType: mappedMode,
        widthOnPage: widthOnPage
      }
      return responsiveImageSizes.getResponsiveSizes(options)
      /*
      switch (mode) {
        case 'tablet': // portrait
          return this.baseSizes.tabletPortrait
          break;
        case 'smartphone':
          return this.baseSizes.smartphone
          break;
        case 'mobile':
          return [...new Set([...this.baseSizes.tabletPortrait, ...this.baseSizes.smartphone])]
          break;
        case 'desktop':
          return this.baseSizes.desktop
          break;
        case 'all':
        default:
          return [...new Set([...this.baseSizes.desktop, ...this.baseSizes.tabletPortrait, ...this.baseSizes.smartphone])]
      }
      */
    },
    getHeightFromWidth (width) {
      return Math.round(width / this.imageRatio)
    },
    getWidthAdaptedToWidthOnScreen (width, widthOnScreen = 100) {
      if (widthOnScreen >= 100) return width
      return Math.round(width / 100 * widthOnScreen)
    },
    getImageUrlWithWidthAndHeight (width, height) {
      return this.imageUrl.replace(this.widthPlaceholder, width).replace(this.heightPlaceholder, height)
    }
  }
}
</script>

<style scoped>

</style>
