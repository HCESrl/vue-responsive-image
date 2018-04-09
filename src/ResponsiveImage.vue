<template>
  <picture>
    <img :src="defaultImage" :alt="alt" :class="[defaultClass, imageClass]" :srcset="srcset" :sizes="sizes">
  </picture>
</template>

<script>
  export default {
    name: 'vue-responsive-image',
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
      // percentage of screen occupied by image on tablet portrait, in numbers, defaults to 100
      widthOnScreenTablet: {
        type: Number
      },
      // percentage of screen occupied by image on smartphone, in numbers, defaults to 100
      widthOnScreenSmartphone: {
        type: Number
      },
      // ratio of height respective to width, defaults to 16/9
      imageRatio: {
        type: Number,
        default: 16/9
      },
      alt: {
        type: String
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
            let finalWidth = this.getWidthAdaptedToWidthOnScreen(width)
            return this.getImageUrlWithWidthAndHeight(finalWidth, this.getHeightFromWidth(finalWidth)) + ` ${finalWidth}w`
          }
        ).join(', ')
      },
      sizes () {
        return this.widthOnScreen + 'vw'
      },
      srcscetSizes () {
        // check mode
        switch(this.mode) {
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
      }
    },
    methods: {
      getHeightFromWidth (width) {
        return Math.round(width / this.imageRatio)
      },
      getWidthAdaptedToWidthOnScreen (width) {
        if(this.widthOnScreen === 100) return width
        return Math.round(width / 100 * this.widthOnScreen)
      },
      getImageUrlWithWidthAndHeight (width, height) {
        return this.imageUrl.replace(this.widthPlaceholder, width).replace(this.heightPlaceholder, height)
      }
    }
  }
</script>

<style scoped>

</style>