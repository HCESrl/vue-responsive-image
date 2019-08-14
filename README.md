# Vue Responsive Image

Vue Responsive Image is a Vue component that allows you to quickly 
insert responsive image tags in your Vue project, provided you have some automated 
system that produces the various sizes of images required. The component calculates 
all source sizes and, depending on the parameters passed, generates the appropriate
`<img>` tag and its `srcset` attribute and, if needed, separate `<source>` tags
 for tablet portrait and smartphone views.
 
## Requirements
You need to have some system that automatically generates the images for you
when an URL with the appropriate format is called, for example:
http://via.placeholder.com/1920x1080
 
## Standard Installation

### npm

``` npm install --save-dev vue-responsive-image ``` 

### Vue

Import the component in the `*.vue` template that uses it

``` import VueResponsiveImage from 'vue-responsive-image' ```

## Fast installation

Just copy the `ResponsiveImage.vue` component somewhere in your project and import it in the templates that need it. 
Remember that this way your component won't be automatically upgraded with 
bugfixes and improvements, though! 

## Using a .js file

You can also include the script you find in the `dist/` folder called `vue-responsive-image-web.min.js`. This
way you can use it directly in simple Vue-based pages. To find out how to include it, check the HTML file in `web-test/web-test.html`.
Keep in mind that in this case your component won't be automatically upgraded unless you manually update the script.

## Usage
   
VueResponsiveImage must be used as a component in your template.

Minimal usage:

```
<vue-responsive-image
    :image-url="'http://via.placeholder.com/%width%x%height%'"
    :image-ratio="16/9"
  ></vue-responsive-image>
```

Complete set of options:

```
<vue-responsive-image
    :image-url="'http://via.placeholder.com/%width%x%height%'"
    :error-image-url="'https://via.placeholder.com/160x90.png/09f/fff?text=Not+Found'"
    :show-error-image="true"
    :width-on-screen="50"
    :width-on-screen-tablet="75"
    :width-on-screen-smartphone="100"
    :image-ratio="16/9"
    :alt="'test1'"
    :image-class="'vw50'"
    :mode="'all'"
  ></vue-responsive-image>
```

### Parameters

It currently supports the following parameters:

<table>
  <tr><td><b>Parameter</b></td><td><b>Default value</b></td><td></td></tr>
  <tr><td>image-url</td><td>N/a</td><td>The base url to create images, with a width and height placeholder which will be replaced by the component. Example:http://via.placeholder.com/%width%x%height%. %width% and %height% will be replaced with the calculated width and height for each image.</td></tr>
  <tr><td>show-error-image</td><td>false</td><td>Whether to show the error image instead of the broken image if the current image fails to load</td></tr>
  <tr><td>error-image-url</td><td>N/a</td><td>The URL for an image to show in case of failure to load the image. It can be an inline SVG. The component now detects image load failures and instead of showing broken images shows an error image. The default is a grey-background svg</td></tr>
  <tr><td>width-on-screen</td><td>100</td><td>The percentage of the screen the image will occupy in the layout. Used to determine the various s0izes for the srcset of the image</td></tr>
  <tr><td>width-on-screen-tablet</td><td>-</td><td>The percentage of the screen the image will occupy in the layout on tablet-portrait mode, only if different from default</td></tr>
  <tr><td>width-on-screen-smartphone</td><td>-</td><td>The percentage of the screen the image will occupy in the layout on smartphone mode, only if different from default</td></tr>
  <tr><td>image-ratio</td><td>16/9</td><td>The width to height ratio of the image, used to determine the height of the final images</td></tr>
  <tr><td>alt</td><td>''</td><td>The alt attribute for the image</td></tr>
  <tr><td>class</td><td>''</td><td>The extra class(es) to be added to the image. The class "vue-reponsive-image" is added by default</td></tr>
  <tr><td>mode</td><td>'all'</td><td>Possible values: 'all', 'tablet', 'smartphone', 'mobile'. The desidered mode of operation for the main image, if only "mobile" is passed, then desktop sizes will not be generated, etc.</td></tr>
</table>


## Demo
You can find a simple demo here: https://codepen.io/paolomioni/pen/PeNoQg


## Principles
This plugin is based on the analyses I made for my clients, and explained in an article I wrote which you can find here:

[Applying `srcset`: choosing the right sizes for responsive images at different breakpoints](https://medium.com/hceverything/applying-srcset-choosing-the-right-sizes-for-responsive-images-at-different-breakpoints-a0433450a4a3)


### Assumptions
This plugin assumes that you are using the same image, with the same proportions (the same width and height ratio), for all breakpoints. It might support different ratio images in the future.

It also assumes that you will use the same image width for desktop and tablet landscape, but that you might need a different overall image width for tablet portrait and smartphone. 

For example, your image might occupy 33% of the screen on desktop, 50% on tablet portrait, and 100% on smartphones. This requires completely different
sizes for the final images in the HTML, and the plugin calculates those for you.
This is by far the most common use case according to my experience.

## Testing
There is a unit test suite made with mocha-webpack. Just clone the project, install with npm, and run `npm run test`.

## Roadmap

- More sophisticated options for different breakpoints and different ratios
- Automatic lazy loading using the Intersection Observer API
- Integration with some routine to produce the images with server-side tools 
according to the plugin's logic
- A more thorough unit test suite
- Switch to a single `config` parameter? Not sure if it's needed

Feel free to contact me with proposal, requests, and pull requests.
Bugs and issues should be submitted on the GitHub page of the project. 

## License
MIT
