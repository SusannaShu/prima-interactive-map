<template>
  <div :class="['map-container', { 'has-popup': selectedLocation }]">
    <!-- Title and language selector -->
    <div class="map-header">
      <h1 class="map-title">PRIMA Interactive Map</h1>
      <div class="language-selector">
        <button 
          @click="$emit('language-change', 'fr')" 
          :class="['language-btn', { active: language === 'fr' }]"
        >Fr</button>
        <span class="language-separator">|</span>
        <button 
          @click="$emit('language-change', 'en')" 
          :class="['language-btn', { active: language === 'en' }]"
        >En</button>
      </div>
    </div>
    
    <!-- Map container -->
    <div ref="mapContainer" class="map"></div>
    
    <!-- Location request button -->
    <button 
      class="location-button"
      @click="handleLocationRequest"
      :disabled="loading"
    >
      <span v-if="!loading">{{ locationText[language].button }}</span>
      <span v-else>{{ locationText[language].loading }}</span>
    </button>
    
    <!-- Error message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- Custom popup -->
    <div v-if="selectedLocation" class="map-popup">
      <button class="close-button" @click="selectedLocation = null">×</button>
      
      <!-- Slide 1: Main image and title -->
      <div v-if="currentSlide === 0" class="popup-slide">
        <div class="popup-image-container">
          <img 
            :src="selectedLocation.image" 
            :alt="getText(selectedLocation.name)"
            class="popup-image"
          />
          <div class="popup-overlay">
            <h3>{{ getText(selectedLocation.name) }}</h3>
            <div v-if="selectedLocation.artist" class="artist">{{ selectedLocation.artist }}</div>
          </div>
        </div>
      </div>
      
      <!-- Slide 2: Details with artwork info -->
      <div v-if="currentSlide === 1" class="popup-slide details">
        <div class="slide-container">
          <div class="slide-content">
            <div class="year" :data-year="selectedLocation.year">{{ getText(selectedLocation.name) }}</div>
            <div class="specs">
              <div class="materials">{{ getText(selectedLocation.materials) }}</div>
              <div class="dimensions">{{ selectedLocation.dimensions }}</div>
            </div>
            <div class="description">{{ getText(selectedLocation.description) }}</div>
          </div>
        </div>
      </div>
      
      <!-- Slide 3: Artist info -->
      <div v-if="currentSlide === 2 && selectedLocation.artist_details" class="popup-slide artist-info">
        <div class="artist-container">
          <img 
            v-if="selectedLocation.artist_details.photo" 
            :src="selectedLocation.artist_details.photo" 
            :alt="selectedLocation.artist"
            class="artist-info-image"
          />
          <div class="artist-info-text">
            <div v-if="selectedLocation.artist_details.website" class="website">
              {{ selectedLocation.artist_details.website.replace(/^https?:\/\//, '') }}
            </div>
            <div class="name">{{ selectedLocation.artist }}</div>
            <div class="details">
              <div class="school">{{ selectedLocation.artist_details.school }}</div>
              <div class="location">{{ selectedLocation.artist_details.location }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation buttons -->
      <button class="popup-nav-button popup-nav-prev" @click="prevSlide">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" class="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button class="popup-nav-button popup-nav-next" @click="nextSlide">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" class="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      
      <!-- Slide indicators -->
      <div class="popup-dots">
        <button 
          v-for="n in (selectedLocation.artist_details ? 3 : 2)" 
          :key="n-1"
          :class="['popup-dot', { active: currentSlide === n-1 }]"
          @click="goToSlide(n-1)"
          :aria-label="`Slide ${n}`"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import locations from '../data/locations';

export default {
  name: 'BasicMap',
  props: {
    language: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      map: null,
      markers: [],
      loading: false,
      error: null,
      userLocation: null,
      selectedLocation: null,
      currentSlide: 0,
      locationText: {
        en: {
          button: 'Share your location',
          loading: 'Loading...'
        },
        fr: {
          button: 'Partagez votre position',
          loading: 'Chargement...'
        },
        es: {
          button: 'Compartir tu ubicación',
          loading: 'Cargando...'
        }
      },
      artLocations: locations // Use the imported locations data directly
    };
  },
  mounted() {
    // Load Mapbox GL JS dynamically
    this.loadMapboxScript()
      .then(() => {
        this.initializeMap()
        this.addMarkers() // Call addMarkers directly since we have the data
      })
      .catch(error => {
        this.error = `Error loading map: ${error.message}`
      })
  },
  methods: {
    async loadMapboxScript() {
      return new Promise((resolve, reject) => {
        if (window.mapboxgl) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)

        const link = document.createElement('link')
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      })
    },
    
    initializeMap() {
      if (!window.mapboxgl) {
        this.error = 'Mapbox GL JS not loaded'
        return
      }
      
      window.mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN
      
      this.map = new window.mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [1.7178452, 50.8372302],
        zoom: 15
      })
      
      this.map.on('load', () => {
        this.map.resize()
      })
    },
    
    addMarkers() {
      if (!this.map || !this.artLocations || this.artLocations.length === 0) return
      
      // Clear existing markers
      this.markers.forEach(marker => marker.remove())
      this.markers = []
      
      this.artLocations.forEach(location => {
        // Create custom marker element
        const markerEl = document.createElement('div')
        markerEl.className = 'custom-marker'
        
        // Add marker icon inside the marker element
        const markerIcon = document.createElement('img')
        markerIcon.src = '/marker-icon.svg' // Use the same marker icon as React
        markerIcon.alt = 'Location Marker'
        markerEl.appendChild(markerIcon)
        
        // Create marker instance
        const marker = new window.mapboxgl.Marker(markerEl)
          .setLngLat([location.longitude, location.latitude])
          .addTo(this.map)
        
        // Add click event to marker
        markerEl.addEventListener('click', () => {
          this.handleMarkerClick(location)
        })
        
        this.markers.push(marker)
      })
    },
    
    handleMarkerClick(location) {
      this.selectedLocation = location
      this.currentSlide = 0  // Reset to first slide
      
      // Fly to the location
      this.map.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 15,
        speed: 1.2
      })
    },
    
    handleLocationRequest() {
      if (!navigator.geolocation) {
        this.error = 'Geolocation is not supported by your browser'
        return
      }
      
      this.loading = true
      this.error = null
      
      navigator.geolocation.getCurrentPosition(
        position => {
          this.loading = false
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          
          // Define the center of the artwork installations area
          const artworkCenter = [1.7178452, 50.8372302]
          
          // Create a bounds object that includes both user location and artwork area
          const bounds = new window.mapboxgl.LngLatBounds()
          
          // Extend bounds to include user location
          bounds.extend([this.userLocation.longitude, this.userLocation.latitude])
          
          // Extend bounds to include artwork center
          bounds.extend(artworkCenter)
          
          // Fit map to show both points with padding
          this.map.fitBounds(bounds, {
            padding: 80, // Add padding around the bounds
            maxZoom: 15, // Limit maximum zoom level
            duration: 1000 // Animation duration in milliseconds
          })
          
          // Add user marker if it doesn't exist
          if (!this.userMarker) {
            const userMarkerEl = document.createElement('div')
            userMarkerEl.className = 'user-marker'
            
            this.userMarker = new window.mapboxgl.Marker(userMarkerEl)
              .setLngLat([this.userLocation.longitude, this.userLocation.latitude])
              .addTo(this.map)
          } else {
            // Update existing marker position
            this.userMarker.setLngLat([this.userLocation.longitude, this.userLocation.latitude])
          }
          
          // Calculate and display nearest locations
          this.findNearestLocations()
        },
        error => {
          this.loading = false
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.error = 'User denied the request for Geolocation.'
              break
            case error.POSITION_UNAVAILABLE:
              this.error = 'Location information is unavailable.'
              break
            case error.TIMEOUT:
              this.error = 'The request to get user location timed out.'
              break
            default:
              this.error = 'An unknown error occurred.'
              break
          }
        }
      )
    },
    
    findNearestLocations() {
      if (!this.userLocation || !this.artLocations) return
      
      // Calculate distance to each location
      const locationsWithDistance = this.artLocations.map(location => {
        const distance = this.calculateDistance(
          this.userLocation.latitude,
          this.userLocation.longitude,
          location.latitude,
          location.longitude
        )
        return { ...location, distance }
      })
      
      // Sort locations by distance
      locationsWithDistance.sort((a, b) => a.distance - b.distance)
      
      // Highlight nearest 3 locations
      this.markers.forEach((marker, index) => {
        const markerEl = marker.getElement()
        
        if (index < 3) {
          markerEl.classList.add('nearby-marker')
        } else {
          markerEl.classList.remove('nearby-marker')
        }
      })
    },
    
    calculateDistance(lat1, lon1, lat2, lon2) {
      // Haversine formula for calculating distance between two points
      const R = 6371 // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1)
      const dLon = this.deg2rad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // Distance in km
      return distance
    },
    
    deg2rad(deg) {
      return deg * (Math.PI / 180)
    },
    
    // Slideshow navigation methods
    nextSlide() {
      const maxSlides = this.selectedLocation.artist ? 3 : 2
      this.currentSlide = (this.currentSlide + 1) % maxSlides
    },
    
    prevSlide() {
      const maxSlides = this.selectedLocation.artist ? 3 : 2
      this.currentSlide = (this.currentSlide - 1 + maxSlides) % maxSlides
    },
    
    goToSlide(index) {
      this.currentSlide = index
    },
    
    // Helper method to get text in current language
    getText(textObj) {
      if (!textObj) return ''
      if (typeof textObj === 'string') return textObj
      return textObj[this.language] || textObj.en || ''
    },
    
    // Method to change language
    changeLanguage(lang) {
      if (lang === 'fr' || lang === 'en') {
        this.$emit('language-change', lang);
      }
    }
  }
};
</script>

<style>
/* Font definitions */
@font-face {
  font-family: 'JigsawStencil';
  src: url('../assets/fonts/header.otf') format('opentype');
  font-weight: bold;
  font-style: normal;
}

.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

/* Location button */
.location-button {
  position: absolute;
  top: 70px; /* Adjusted to position below header */
  right: 10px;
  z-index: 1;
  background-color: #ffffff;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  outline: none !important; /* Force remove outline */
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
  -webkit-appearance: none; /* Remove default styling */
  user-select: none; /* Prevent text selection */
  -webkit-user-select: none; /* For Safari */
}

.map-container.has-popup .location-button {
  display: none;
}

.location-button:hover {
  background-color: #f0f0f0;
}

.location-button:focus, 
.location-button:active {
  background-color: #e0e0e0;
  outline: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.location-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Error message */
.error-message {
  position: absolute;
  top: 110px; /* Positioned below the location button */
  right: 10px;
  z-index: 1;
  background-color: #ff5252;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  max-width: 250px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Custom popup */
.map-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vh;
  height: 70vh;
  max-width: 90%;
  max-height: 90vh;
  aspect-ratio: 1/1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  overflow: visible; /* Changed from hidden to visible to allow nav buttons to show */
  z-index: 1;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -45%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
}

/* Close button */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  color: #333;
  font-size: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Popup slides */
.popup-slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.popup-slide {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.3s ease;
  overflow: hidden;
}

/* Image container - make it match popup height */
.popup-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.popup-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Overlay for title and artist */
.popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 30px;
  color: white;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Move text to top */
  background: linear-gradient(rgba(0,0,0,0.7), transparent, transparent); /* Top shadow only */
}

.popup-overlay h3 {
  margin: 0;
  font-family: 'JigsawStencil', sans-serif;
  font-size: 50.667px; /* 38pt converted to px */
  font-weight: bold;
  letter-spacing: 1px;
  line-height: 0.9;
  text-align: left;
}

.popup-overlay .artist {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 26.667px; /* 20pt converted to px */
  font-weight: normal;
  line-height: 1;
  opacity: 0.9;
  text-align: left;
  margin: 0;
}

/* Details slide styling */
.slide-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-content {
  height: 100%;
  padding: 30px;
  overflow-y: auto;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align content to bottom */
  box-sizing: border-box;
}

/* Details slide content - updated to match design exactly */
.year {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 33.333px; /* 25pt converted to px */
  font-weight: 700; /* Make it bolder */
  line-height: 1;
  margin: 0;
  text-align: left;
  text-transform: uppercase;
}

.year::before {
  content: attr(data-year);
  display: block;
  font-size: 16px; /* 12pt converted to px */
  margin-bottom: 1px;
  font-weight: normal;
}

.specs {
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  margin-bottom: 0;
}

.specs .materials {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 18.667px; /* 14pt converted to px */
  font-weight: normal;
  line-height: 1.1;
  color: #333;
  margin-bottom: 1px;
  text-align: left;
}

.specs .dimensions {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 16px; /* 12pt converted to px */
  font-weight: normal;
  line-height: 1.1;
  color: #333;
  text-align: left;
  margin-bottom: 0;
}

.description {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 16px; /* 12pt converted to px */
  font-weight: normal;
  line-height: 1.2;
  margin: 10px 0 0 0;
  text-align: left;
  color: #333;
  max-width: 100%;
}

/* Artist slide styling */
.popup-slide.artist-info {
  background: white;
}

.artist-container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Left align content */
  text-align: left;
  height: 100%;
  overflow-y: auto;
  justify-content: flex-end; /* Bottom align content */
  box-sizing: border-box;
}

.artist-info-image {
  width: 265px;
  height: 370px; /* Rectangular shape as per design */
  object-fit: cover;
  margin: 0 0 10px 0; /* Reduced margin */
  margin-bottom: 20px;
  border-radius: 0; /* Remove border radius */
}

.artist-info-text {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Artist info slide styling - updated to match design exactly */
.artist-info-text .website {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 16px; /* 12pt converted to px */
  font-weight: 500; /* Medium weight */
  line-height: 1.1;
  color: #333;
  margin-bottom: 1px;
  text-align: left;
}

.artist-info-text .name {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 33.333px; /* 25pt converted to px */
  font-weight: 700; /* Bold */
  line-height: 1;
  margin-bottom: 5px;
  text-align: left;
  text-transform: uppercase;
}

.artist-info-text .details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.artist-info-text .school {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 18.667px; /* 14pt converted to px */
  font-weight: normal;
  line-height: 1.1;
  color: #333;
  margin-bottom: 1px;
  text-align: left;
}

.artist-info-text .location {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 16px; /* 12pt converted to px */
  font-weight: normal;
  line-height: 1.1;
  color: #333;
  text-align: left;
  margin-bottom: 0;
}

/* Navigation buttons */
.popup-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease;
}

.popup-nav-button:hover {
  background-color: white;
}

.popup-nav-button svg {
  width: 20px;
  height: 20px;
}

.popup-nav-prev {
  left: -15px; /* Move further outside the popup */
  
}

.popup-nav-next {
  right: -15px; /* Move further outside the popup */
}

/* Popup dots - make them more visible */
.popup-dots {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 5;
}

.popup-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popup-dot.active {
  background-color: white;
  transform: scale(1.2);
}

/* Marker styling */
.mapboxgl-marker {
  cursor: pointer;
}

.custom-marker {
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 25px;
  height: 41px;
  position: relative;
}

.custom-marker:hover {
  transform: scale(1.1);
}

.custom-marker img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.user-marker {
  width: 16px;
  height: 16px;
  background-color: #333333;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 rgba(51, 51, 51, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(51, 51, 51, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(51, 51, 51, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(51, 51, 51, 0);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .map-popup {
    width: 90vw;
    height: 75vh; /* Make height larger than width for mobile */
    aspect-ratio: auto; /* Override square aspect ratio */
  }
  
  .slide-content {
    padding: 20px;
  }
  
  .artist-container {
    padding: 20px;
  }
  
  
  /* Mobile font size adjustments */

}

/* Map header styling */
.map-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.map-title {
  font-family: 'JigsawStencil', sans-serif;
  font-size: 24px;
  margin: 0;
  font-weight: bold;
  color: #000;
}

.language-selector {
  display: flex;
  align-items: center;
}

.language-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  color: #666;
  text-decoration: none;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.language-btn.active {
  color: #000;
  font-weight: 500;
}

.language-separator {
  margin: 0 8px;
  color: #666;
}

/* Responsive adjustments for header */
@media (max-width: 600px) {
  .map-title {
    font-size: 20px;
  }
  
  .language-btn {
    font-size: 14px;
  }
  
  .map-header {
    padding: 10px 15px;
  }

}
</style> 