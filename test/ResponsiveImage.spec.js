import { mount } from '@vue/test-utils'
import ResponsiveImage from '../src/ResponsiveImage.vue'

const imageUrlRegex = /^http:\/\/via\.placeholder\.com\/[0-9]+x[0-9]+$/
const srcsetRegex = /^(http:\/\/via\.placeholder\.com\/[0-9]+x[0-9]+ [0-9]+w(, )?)+$/

describe('ResponsiveImage.vue', () => {
  it('check that there is an image and a source tag at least', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50,
        widthOnScreenTablet: 75,
        widthOnScreenSmartphone: 100
      }
    })
    expect(wrapper.contains('img')).toBe(true)
    expect(wrapper.contains('source')).toBe(true)
  })
  it('check that there is no source tag if there\'s only the desktop width set', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50
      }
    })
    expect(wrapper.contains('source')).toBe(false)
  })
  it('check that there is one source tag if there\'s only the tablet width set', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50,
        widthOnScreenTablet: 75
      }
    })
    expect(wrapper.findAll('source')).toHaveLength(1)
  })
  it('check that there is one source tag if there\'s only the smartphone width set', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50,
        widthOnScreenSmartphone: 100
      }
    })
    expect(wrapper.findAll('source')).toHaveLength(1)
  })
  it('check that img tag has  a proper sizes attribute set', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50,
        widthOnScreenTablet: 75,
        widthOnScreenSmartphone: 100
      }
    })
    expect(wrapper.find('img').attributes().sizes).toMatch(/^[0-9]+vw$/)
  })
  it('check that source tags have a proper sizes attribute set', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50,
        widthOnScreenTablet: 75,
        widthOnScreenSmartphone: 100
      }
    })
    expect(wrapper.findAll('source').at(0).attributes().sizes).toMatch(/^[0-9]+vw$/)
    expect(wrapper.findAll('source').at(1).attributes().sizes).toMatch(/^[0-9]+vw$/)
  })
  it('check that img tag has a proper src attribute set', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50,
        widthOnScreenTablet: 75,
        widthOnScreenSmartphone: 100
      }
    })
    expect(wrapper.find('img').attributes().src).toMatch(imageUrlRegex)
  })
  it('check that img tag has a proper srcset attribute set', () => {
    const wrapper = mount(ResponsiveImage, {
      propsData: {
        imageUrl: 'http://via.placeholder.com/%width%x%height%',
        widthOnScreen: 50,
        widthOnScreenTablet: 75,
        widthOnScreenSmartphone: 100
      }
    })
    expect(wrapper.find('img').attributes().srcset).toMatch(srcsetRegex)
  })
})