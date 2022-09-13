import ResponsiveImage from './plugin.js'
import { createApp } from 'vue/dist/vue.esm-bundler'

const app = createApp({
  data() {
    return {
      'title':'Vue responsive image plugin'
    }
  }
})

app.use(ResponsiveImage)
app.mount('#app')