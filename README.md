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
VUE_APP_CONTENTFUL_SPACE_ID=your_contentful_space_id
VUE_APP_CONTENTFUL_ACCESS_TOKEN=your_contentful_delivery_api_token
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

## Data Management with Contentful

The map is designed to fetch its location data from Contentful, a headless Content Management System (CMS). This allows for easy updates to art installations and artist information by non-technical users through a web interface.

1.  **Contentful Setup:**
    *   A Contentful space is set up with two main Content Types: `Art Installation` and `Artist`.
    *   Refer to the [Contentful Update Guide](./docs/updating-contentful-guide.md) for details on how to manage content.
2.  **Vue Integration:**
    *   The `contentful` SDK is used to fetch data.
    *   API keys (`VUE_APP_CONTENTFUL_SPACE_ID`, `VUE_APP_CONTENTFUL_ACCESS_TOKEN`) are stored in `.env`.
    *   `src/services/contentfulService.js` initializes the Contentful client.
    *   `src/components/BasicMap.vue` fetches and transforms data in its `mounted` hook and `fetchLocations`/`transformContentfulData` methods.
    *   The static `src/data/locations.js` is no longer the primary data source but can be used as a fallback or for initial development if Contentful is not yet configured.

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
    *   Copy `src/services/contentfulService.js`.
    *   Copy the fonts from `src/assets/fonts/` or ensure equivalent fonts are loaded.
    *   Copy the marker icon (`public/marker-icon.svg`) to your public assets folder.

2.  **Install Dependencies:** Ensure your main project has `mapbox-gl` and `contentful` installed.

3.  **Environment Variable:** Make sure the `VUE_APP_MAPBOX_TOKEN`, `VUE_APP_CONTENTFUL_SPACE_ID`, and `VUE_APP_CONTENTFUL_ACCESS_TOKEN` are set in your main project's `.env` file.

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

## Data Schema

The map component expects location data from Contentful, which is then transformed into the following format (this structure is also a good reference if using a different backend or the static `src/data/locations.js` file as a fallback):

```javascript
[
  {
    id: String, // Contentful Entry ID
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
    image: String, // URL to the main installation image from Contentful
    artists: [ // Array of artist objects from Contentful
      {
        name: String,
        photo: String, // URL to the artist's photo from Contentful
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

Push your code to a Git repository (GitHub, GitLab, Bitbucket) and connect it to Netlify. Ensure you set the `VUE_APP_MAPBOX_TOKEN`, `VUE_APP_CONTENTFUL_SPACE_ID`, and `VUE_APP_CONTENTFUL_ACCESS_TOKEN` environment variables in your Netlify site settings.

## Features

*   Interactive map displaying art installations using Mapbox GL JS, with data managed in Contentful.
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

## Project Structure

```
prima-interactive-map/
├── public/              # Static assets (index.html, favicon, marker-icon.svg)
│
├── src/
│   ├── assets/          # Processed assets (fonts)
│   ├── components/      # Vue components
│   │   └── BasicMap.vue   # <<<< The main map component >>>>
│   ├── data/            # Static data
│   │   └── locations.js # Fallback/example location data
│   ├── services/        # API service clients
│   │   └── contentfulService.js # Contentful client setup
│   ├── App.vue          # Root Vue component (loads BasicMap)
│   └── main.js          # Application entry point
│
├── .env                 # Local environment variables (Mapbox & Contentful tokens)
├── .env.example         # Example environment variables
├── docs/                # Documentation and guides
│   └── updating-contentful-guide.md # Guide for updating content via Contentful
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
