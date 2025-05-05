# Prima Interactive Map (Vue.js)

This is a Vue.js implementation of the Prima interactive map, designed to be integrated with the Prima website.

## Live Demo

View the live demo: [https://prima-interactive-map.netlify.app/](https://prima-interactive-map.netlify.app/)

## Project Setup

```
npm install
```

### Environment Variables

Create a `.env` file in the root directory with:

```
VUE_APP_MAPBOX_TOKEN=your_mapbox_access_token
VUE_APP_API_URL=your_api_url (optional, for backend integration)
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

This map can be integrated into an existing website (like Prima's) in a couple of ways:

### Method 1: iFrame Integration (Simplest)

1.  Deploy this Vue application to a host (like Netlify, Vercel, or your own server).
2.  Embed the map in your Prima site using an `<iframe>`:
    ```html
    <iframe 
      src="https://your-deployed-map-url.com" 
      width="100%" 
      height="600px" 
      style="border:none;"
      title="Prima Interactive Map"
    ></iframe>
    ```
    *Adjust `width`, `height`, and `src` accordingly.*

### Method 2: Component Integration (If Prima site uses Vue)

If Prima's main website already uses Vue.js, you can integrate the `BasicMap.vue` component directly:

1.  **Copy Files:**
    *   Copy `src/components/BasicMap.vue` into your Prima project's components directory.
    *   Copy the fonts from `src/assets/fonts/` or ensure equivalent fonts are loaded.
    *   Copy the marker icon (`public/marker-icon.svg`) to your public assets folder.
    *   Copy the location data `src/data/locations.js` or set up an API service (see below).

2.  **Install Dependencies:** Ensure your main project has `mapbox-gl` installed if it doesn't already.

3.  **Environment Variable:** Make sure the `VUE_APP_MAPBOX_TOKEN` is set in your main project's `.env` file.

4.  **Import and Use:**
    ```vue
    <template>
      <div>
        <!-- Other Prima site content -->
        <BasicMap 
          :language="currentLanguage" 
          @language-change="handleLanguageChange" 
        />
        <!-- Other Prima site content -->
      </div>
    </template>

    <script>
   import BasicMap from './path/to/BasicMap.vue';
   
   export default {
     components: {
       BasicMap
     },
     data() {
       return {
          // Assuming Prima site manages language state
          currentLanguage: 'en' 
        };
     },
     methods: {
        handleLanguageChange(newLang) {
          this.currentLanguage = newLang;
          // Potentially update language globally in Prima site
        }
      }
    };
    </script>
   ```

### Optional: Backend API Integration

Instead of using the static `src/data/locations.js`, you can fetch data from Prima's backend:

1.  **Backend Endpoints:** Ensure your backend provides an endpoint, e.g., `GET /api/map-locations`, that returns location data matching the schema defined below.

2.  **Modify `BasicMap.vue`:**
    *   Remove the static import: `// import locations from '../data/locations';`
    *   Add logic to fetch data in the `mounted` or `created` hook:
        ```javascript
        import axios from 'axios'; // Or your preferred HTTP client

        // ... inside export default {
     data() {
       return {
              // ... other data properties
              artLocations: [], // Initialize as empty
         loading: true,
              error: null,
              // ... hoverPopup, etc.
       };
     },
          mounted() {
            this.loadMapboxScript()
              .then(() => {
                // Mapbox script loaded, now fetch locations
                this.fetchLocations(); 
              })
              .catch(error => {
                this.error = `Error loading map library: ${error.message}`;
                this.loading = false;
              });
          },
          methods: {
            async fetchLocations() {
              this.loading = true;
              this.error = null;
              try {
                // Adjust URL as needed
                const response = await axios.get(process.env.VUE_APP_API_URL || '/api/map-locations'); 
                this.artLocations = response.data;
                this.initializeMap(); // Initialize map AFTER data is fetched
                // Note: Map initialization might need adjustments if called here
                // Ensure map instance exists before adding markers
                if (this.map) {
           this.addMarkers();
                } else {
                    // Handle case where map isn't ready yet (e.g., wait for 'load' event)
                    this.map.on('load', this.addMarkers);
                }
              } catch (err) {
                this.error = 'Failed to load location data.';
                console.error('Error fetching locations:', err);
              } finally {
         this.loading = false;
       }
            },
            // ... other methods like initializeMap, addMarkers, etc.
          }
        // ... rest of component
        ```
    *   Ensure `initializeMap` and `addMarkers` are called appropriately *after* the data has been successfully fetched.

## Data Schema

The map component expects location data (either from `locations.js` or an API) in the following format:

```javascript
[
{
    id: Number, // Unique identifier
  name: {
    en: String,
    fr: String
  },
  description: {
    en: String,
    fr: String
  },
  year: String,
  dimensions: String,
  materials: {
    en: String,
    fr: String
  },
  longitude: Number,
  latitude: Number,
    image: String, // URL to the main installation image
    artists: [ // Array of artist objects
      {
        name: String,
        photo: String, // URL to the artist's photo
    school: String,
        location: { // Artist's location (can be multilingual)
          en: String,
          fr: String
        },
        website: String // Artist's website or social media handle
      }
      // ... potentially more artists
    ]
  }
  // ... more location objects
]
```

## Deployment 

This project is configured for easy deployment on Netlify.

### Netlify Configuration

The `netlify.toml` file in the root directory configures the build process:

   ```toml
   [build]
  command = "npm run build" # Build command
  publish = "dist"          # Directory to publish
   
   [build.environment]
  NODE_VERSION = "16"       # Specify Node.js version
   
# Required for Single Page Applications (SPA) like Vue
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

Push your code to a Git repository (GitHub, GitLab, Bitbucket) and connect it to Netlify. Ensure you set the `VUE_APP_MAPBOX_TOKEN` environment variable in your Netlify site settings.

## Features

*   Interactive map displaying art installations using Mapbox GL JS.
*   Custom map markers.
*   Marker hover previews showing the installation image.
*   Clickable markers opening a detailed popup.
*   Multi-slide popup showing:
    *   Installation image and title.
    *   Installation details (year, materials, dimensions, description).
    *   Artist details (photo, name, school, location, website) - supports multiple artists per installation with one slide per artist.
*   Multilingual support (English/French) for text content, switchable via UI buttons.
*   "Share your location" button to show user's position on the map (currently uses emulated location for testing).
*   Highlights nearest installations when user location is shared.
*   Responsive design for desktop and mobile.

## Vue Project Structure

```
prima-interactive-map/
├── public/              # Static assets (index.html, favicon, marker-icon.svg)
│
├── src/
│   ├── assets/          # Processed assets (fonts)
│   │   └── BasicMap.vue   # <<<< The main map component >>>>
│   ├── data/            # Static data
│   │   └── locations.js # Default location data
│   ├── App.vue          # Root Vue component (loads BasicMap)
│   └── main.js          # Application entry point
│
├── .env                 # Local environment variables (requires VUE_APP_MAPBOX_TOKEN)
├── .env.example         # Example environment variables
├── netlify.toml         # Netlify deployment configuration
├── package.json         # Project dependencies and scripts
└── vue.config.js        # Vue CLI configuration
```

## Customization

The map style can be changed by modifying the `style` option in the `mapboxgl.Map` constructor within the `initializeMap` method in `src/components/BasicMap.vue`.

Mapbox offers various base styles, or you can create your own using Mapbox Studio.

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