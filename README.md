# Prima Interactive Map (Vue.js)

This is a Vue.js implementation of the Prima interactive map, designed to be integrated with the Prima website.

## Project Setup

```
cd vue-implementation
npm install
```

### Environment Variables

Create a `.env` file in the vue-implementation directory with:

```
VUE_APP_MAPBOX_TOKEN=your_mapbox_access_token
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

   ```
   npm run build
   ```

## Integration with Prima Website

### Method 1: Direct Integration

As a Vue component, this map can be directly integrated into the Prima website's Vue.js codebase:

1. Copy the `src/components/MapComponent.vue` file and the `src/data/locations.js` file into your project
2. Install the required dependencies (mapbox-gl, vue-mapbox)
3. Import and use the component in your Vue application

```js
import MapComponent from './path/to/MapComponent.vue';

export default {
  components: {
    MapComponent
  }
}
```

### Method 2: Build as Standalone

You can also build this project as a standalone application and embed it via iframe:

1. Run `npm run build`
2. Host the generated files in the `dist` directory on your server
3. Embed using an iframe in your website:

   ```html
   <iframe 
  src="https://your-hosting-url/prima-map/" 
     width="100%" 
  height="600" 
     frameborder="0"
   ></iframe>
   ```
   
## Features

- Interactive map showing locations in Prima Cabourg park
- Location details with image galleries and artist information
- Multilingual support (English/French)
- User location tracking and navigation
- Mobile responsive design

## Vue.js Resources for Beginners

If you're new to Vue.js, here are some helpful resources to get started:

- [Vue.js Official Documentation](https://vuejs.org/guide/introduction.html)
- [Vue CLI Documentation](https://cli.vuejs.org/)
- [Vue Mastery - Beginner Courses](https://www.vuemastery.com/courses/)
- [Vue School](https://vueschool.io/)

## Vue Project Structure

```
vue-implementation/
│
├── public/              # Static assets that will be copied directly to build
│
├── src/                 # Source files
│   ├── components/      # Vue components
│   │   ├── MapComponent.vue   # Main map component
│   │   └── Map.css            # Map styles
│   │
│   ├── data/            # Data files, including locations.js
│   ├── App.vue          # Root Vue component
│   └── main.js          # Vue application entry point
│
├── .env                 # Environment variables (you need to create this)
├── package.json         # Project dependencies and scripts
└── vue.config.js        # Vue configuration
```

## Customization

The map component uses Mapbox for rendering. You can customize the map style by changing the `mapStyle` property in `MapComponent.vue`. 