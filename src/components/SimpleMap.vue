<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import locations from '../data/locations';

export default {
  name: 'SimpleMap',
  props: {
    language: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      map: null,
      locations: locations,
      markers: []
    };
  },
  watch: {
    // Watch language prop changes
    language: {
      handler(newLang) {
        this.updatePopups(newLang);
      }
    }
  },
  mounted() {
    // Initialize map when component is mounted
    this.initMap();
  },
  methods: {
    initMap() {
      try {
        // Set access token
        mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;
        
        // Initialize map
        this.map = new mapboxgl.Map({
          container: 'map', // Use ID instead of ref
          style: 'mapbox://styles/mapbox/light-v10',
          center: [1.7178452, 50.8372302],
          zoom: 14
        });
        
        // Add markers when map is loaded
        this.map.on('load', () => {
          this.addMarkers();
          // Emit event when map is loaded
          this.$emit('reload');
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    },
    
    addMarkers() {
      try {
        // Clear existing markers
        this.markers.forEach(m => {
          if (m.marker) {
            m.marker.remove();
          }
        });
        this.markers = [];
        
        // Add markers for each location
        this.locations.forEach(location => {
          // Create marker element
          const el = document.createElement('div');
          el.className = 'marker';
          
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3>${this.getLocalizedText(location.name, this.language)}</h3>
              <p>${this.getLocalizedText(location.description, this.language)}</p>
            `);
          
          // Add marker to map
          const marker = new mapboxgl.Marker(el)
            .setLngLat([location.longitude, location.latitude])
            .setPopup(popup)
            .addTo(this.map);
            
          // Store marker and popup
          this.markers.push({
            id: location.id,
            marker: marker,
            popup: popup
          });
        });
      } catch (error) {
        console.error('Error adding markers:', error);
      }
    },
    
    updatePopups(lang) {
      this.markers.forEach(m => {
        const location = this.locations.find(loc => loc.id === m.id);
        if (location && m.popup) {
          m.popup.setHTML(`
            <h3>${this.getLocalizedText(location.name, lang)}</h3>
            <p>${this.getLocalizedText(location.description, lang)}</p>
          `);
        }
      });
    },
    
    getLocalizedText(field, lang) {
      if (field && typeof field === 'object' && field[lang]) {
        return field[lang];
      }
      return field;
    }
  }
};
</script>

<style>
.map-container {
  width: 100%;
  height: 100vh;
}

#map {
  width: 100%;
  height: 100%;
}

.marker {
  background-color: #4285F4;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
}

.mapboxgl-popup-content {
  padding: 15px;
  border-radius: 5px;
}

.mapboxgl-popup-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
}

.mapboxgl-popup-content p {
  margin: 0;
  font-size: 14px;
}
</style>
