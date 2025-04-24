# Prima Interactive Map (Vue.js)

This is a Vue.js implementation of the Prima interactive map, designed to be integrated with the Prima website.

## Project Setup

```
npm install
```

### Environment Variables

Create a `.env` file in the root directory with:

```
VUE_APP_MAPBOX_TOKEN=your_mapbox_access_token
VUE_APP_API_URL=your_api_url (for backend integration)
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

### Method 1: Component Integration with Existing Vue Site

To integrate this map component into Prima's existing Vue.js application:

1. Copy the required files into your project:
   - `src/components/BasicMap.vue` 
   - `src/assets/fonts/` directory (or ensure the fonts are available)
   
2. Create an API service to connect to your backend:
   ```js
   // src/services/mapService.js
   import axios from 'axios';
   
   const API_URL = process.env.VUE_APP_API_URL;
   
   export default {
     getLocations() {
       return axios.get(`${API_URL}/map-locations`);
     },
     // Add other API methods as needed
   };
   ```

3. Import and use the component in your Vue application:
   ```js
   import BasicMap from './path/to/BasicMap.vue';
   
   export default {
     components: {
       BasicMap
     },
     data() {
       return {
         language: 'en'
       }
     },
     methods: {
       setLanguage(lang) {
         this.language = lang;
       }
     }
   }
   ```

4. Use the component in your template:
   ```html
   <BasicMap 
     :language="language" 
     @language-change="setLanguage" 
   />
   ```

### Method 2: Backend API Integration

To connect the map with Prima's admin backend instead of using static data:

1. Create the following API endpoints in your backend:
   - `GET /api/map-locations` - Retrieve all locations
   - `GET /api/map-locations/:id` - Retrieve a specific location
   - `POST /api/map-locations` - Create a new location
   - `PUT /api/map-locations/:id` - Update a location
   - `DELETE /api/map-locations/:id` - Delete a location
   - `POST /api/upload` - Upload media files (images/videos)

2. Modify the `BasicMap.vue` component to fetch data from your API:
   ```js
   // In the script section of BasicMap.vue
   import mapService from '@/services/mapService';
   
   // Replace the static import
   // import locations from '../data/locations';
   
   export default {
     data() {
       return {
         // ...existing data properties
         locations: [],
         loading: true,
         error: null
       };
     },
     
     async created() {
       try {
         const response = await mapService.getLocations();
         this.locations = response.data;
         this.loading = false;
         
         // Initialize map after locations are loaded
         this.loadMapboxScript().then(() => {
           this.initializeMap();
           this.addMarkers();
         });
       } catch (error) {
         this.error = 'Failed to load map data';
         this.loading = false;
         console.error('Error loading locations:', error);
       }
     }
     
     // ...rest of component
   };
   ```

### Method 3: Admin Panel Integration

For a complete admin panel to manage locations:

1. Create admin components for managing locations:
   - `LocationsList.vue` - List and manage all locations
   - `LocationEditor.vue` - Add/edit location details
   - `MapPicker.vue` - Visual location picker using Mapbox

2. Ensure your backend provides proper API endpoints (as listed above)

3. Sample code for a location editor form:
   ```html
   <template>
     <div class="location-editor">
       <h2>{{ isEditing ? 'Edit' : 'Add' }} Location</h2>
       
       <form @submit.prevent="saveLocation">
         <!-- Basic fields -->
         <div class="form-group">
           <label>Name (English)</label>
           <input v-model="location.name.en" required />
         </div>
         
         <div class="form-group">
           <label>Name (French)</label>
           <input v-model="location.name.fr" required />
         </div>
         
         <!-- Other fields for artist, year, dimensions, materials, etc. -->
         
         <!-- Coordinates -->
         <div class="form-group">
           <label>Coordinates</label>
           <div class="coordinates-inputs">
             <input v-model.number="location.longitude" placeholder="Longitude" required />
             <input v-model.number="location.latitude" placeholder="Latitude" required />
           </div>
         </div>
         
         <!-- File uploads -->
         <div class="form-group">
           <label>Image</label>
           <input type="file" @change="handleImageUpload" />
         </div>
         
         <button type="submit">Save</button>
       </form>
     </div>
   </template>
   ```

## Data Schema

Your backend should implement this data structure for locations:

```javascript
{
  id: Number,
  name: {
    en: String,
    fr: String
  },
  description: {
    en: String,
    fr: String
  },
  artist: String,
  year: String,
  dimensions: String,
  materials: {
    en: String,
    fr: String
  },
  longitude: Number,
  latitude: Number,
  image: String, // URL to image
  video: String, // URL to video (optional)
  artist_details: {
    photo: String, // URL to artist photo
    school: String,
    location: String,
    website: String
  }
}
```

## Deployment 

### Netlify Deployment

1. Add a `netlify.toml` file to your project:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "16"
   
   # For SPA routing
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Add a `_redirects` file in the public directory:
   ```
   /* /index.html 200
   ```

## Features

- Interactive map showing locations in Prima park
- Location details with image galleries and artist information
- Multilingual support (English/French)
- User location tracking and navigation
- Mobile responsive design
- Backend API integration for dynamic content management

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