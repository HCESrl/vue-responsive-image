<template>
  <picture>
    <source v-if="hasSmartphoneSrcset" :srcset="smartphoneSrcset" :sizes="smartphoneSizes" media="(max-width: 767px)">
    <source v-if="hasTabletSrcset" :srcset="tabletSrcset" :sizes="tabletSizes" media="(min-width: 768px) and (max-width: 1023px)">
    <img :src="defaultImage" :alt="alt" :class="[defaultClass, imageClass]" :srcset="srcset" :sizes="sizes">
  </picture>
</template>

<script>
export default {
  name: 'VueResponsiveImage',
  data: () => {
    return {
      'defaultClass': 'vue-responsive-image',
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
      // the default width of the image
      defaultWidth: 1600
    }
  },
  props: {
    // the base with which to generate image urls, with placeholders for width and height
    // %width% and %height%
    // example: http://via.placeholder.com/%width%x%height%
    imageUrl: {
      type: String,
      required: true
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
    // the maximum width to consider for the image, if it is not possibile to generate an image wider
    // than a specific width
    maxWidth: {
      type: Number,
      default: 1920
    }
  },
  computed: {
    test () {
      return 'test'
    },
    // the default image in the src attribute, for backwards compatibility
    defaultImage () {
      let finalWidth = this.getWidthAdaptedToWidthOnScreen(this.defaultWidth)
      return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth))
    },
    srcset () {
      return this.srcscetSizes.map(
        (width) => {
          let finalWidth = this.getWidthAdaptedToWidthOnScreen(width, this.widthOnScreen)
          return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
        }
      ).join(', ')
    },
    tabletSrcset () {
      return this.getSrcsetSizes('tablet').map(
        (width) => {
          let finalWidth = this.getWidthAdaptedToWidthOnScreen(width, this.widthOnScreenTablet)
          return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
        }
      ).join(', ')
    },
    smartphoneSrcset () {
      return this.getSrcsetSizes('smartphone').map(
        (width) => {
          let finalWidth = this.getWidthAdaptedToWidthOnScreen(width, this.widthOnScreenSmartphone)
          return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
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
  methods: {
    getSrcsetSizes (mode) {
      switch(mode) {
        case 'tablet': // portrait
          return this.baseSizes.tabletPortrait
          break;
        case 'smartphone':
          return this.baseSizes.smartphone
          break;
        case 'mobile':
          return [...new Set([...this.baseSizes.tabletPortrait, ...this.baseSizes.smartphone])]
          break;
        case 'all':
        default:
          return [...new Set([...this.baseSizes.desktop ,...this.baseSizes.tabletPortrait, ...this.baseSizes.smartphone])]
      }
    },
    getHeightFromWidth (width) {
      return Math.round(width / this.imageRatio)
    },
    getWidthAdaptedToWidthOnScreen (width, widthOnScreen = 100) {
      if(widthOnScreen === 100) return width
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