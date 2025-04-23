# Prima Interactive Map - Backend Integration Guide

## Overview

This guide outlines how to integrate the Prima Interactive Map component with your existing backend instead of using the static `locations.js` file. This integration allows for dynamic content management through your CMS or admin interface.

## Backend Requirements

### API Endpoints

Create the following REST API endpoints to manage location data:

1. `GET /api/map-locations` - Retrieve all locations
2. `GET /api/map-locations/:id` - Retrieve a specific location by ID
3. `POST /api/map-locations` - Create a new location
4. `PUT /api/map-locations/:id` - Update an existing location
5. `DELETE /api/map-locations/:id` - Delete a location
6. `POST /api/upload` - Upload media files (images/videos)

### Data Schema

Your backend should support the following data structure for each location:

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

### Media Upload Handling

For file uploads, implement a secure upload handler that:

1. Validates file types (jpg, png, mp4, etc.)
2. Sets appropriate file size limits
3. Generates unique filenames
4. Returns URLs for the uploaded files
5. Optionally generates thumbnails for images

## Frontend Integration

### API Service

Create a service file to handle API requests:

```javascript
// src/services/mapService.js
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export default {
  getLocations() {
    return axios.get(`${API_URL}/map-locations`);
  },
  
  getLocation(id) {
    return axios.get(`${API_URL}/map-locations/${id}`);
  },
  
  createLocation(location) {
    return axios.post(`${API_URL}/map-locations`, location);
  },
  
  updateLocation(id, location) {
    return axios.put(`${API_URL}/map-locations/${id}`, location);
  },
  
  deleteLocation(id) {
    return axios.delete(`${API_URL}/map-locations/${id}`);
  },
  
  uploadFile(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // image, video, artist_photo
    
    return axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
```

### Modify BasicMap Component

Update the `BasicMap.vue` component to fetch data from the API instead of importing from `locations.js`:

```javascript
// In the script section of BasicMap.vue
import mapService from '@/services/mapService';

export default {
  // ...existing component code
  
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
  
  // ...rest of your component
};
```

## Admin Interface Integration

### Location Editor Form

Create an admin form component for adding/editing locations:

```vue
<template>
  <div class="location-editor">
    <h2>{{ isEditing ? 'Edit' : 'Add' }} Location</h2>
    
    <form @submit.prevent="saveLocation">
      <!-- Basic Information -->
      <div class="form-group">
        <label>Name (English)</label>
        <input v-model="location.name.en" required />
      </div>
      
      <div class="form-group">
        <label>Name (French)</label>
        <input v-model="location.name.fr" required />
      </div>
      
      <!-- Add fields for all other properties -->
      
      <!-- Coordinates -->
      <div class="form-group">
        <label>Coordinates</label>
        <div class="coordinates-inputs">
          <input v-model.number="location.longitude" placeholder="Longitude" required />
          <input v-model.number="location.latitude" placeholder="Latitude" required />
        </div>
        <button type="button" @click="showMapPicker">Select on Map</button>
      </div>
      
      <!-- Image Upload -->
      <div class="form-group">
        <label>Artwork Image</label>
        <input type="file" @change="handleImageUpload" accept="image/*" />
        <img v-if="location.image" :src="location.image" class="preview" />
      </div>
      
      <!-- Video Upload -->
      <div class="form-group">
        <label>Video (Optional)</label>
        <input type="file" @change="handleVideoUpload" accept="video/*" />
        <video v-if="location.video" :src="location.video" controls class="preview"></video>
      </div>
      
      <!-- Artist Photo Upload -->
      <div class="form-group">
        <label>Artist Photo</label>
        <input type="file" @change="handleArtistPhotoUpload" accept="image/*" />
        <img v-if="location.artist_details.photo" :src="location.artist_details.photo" class="preview" />
      </div>
      
      <button type="submit">Save Location</button>
      <button type="button" @click="cancel">Cancel</button>
    </form>
  </div>
</template>

<script>
import mapService from '@/services/mapService';

export default {
  props: {
    initialLocation: Object,
    isEditing: Boolean
  },
  
  data() {
    return {
      location: this.initialLocation || {
        name: { en: '', fr: '' },
        description: { en: '', fr: '' },
        artist: '',
        year: '',
        dimensions: '',
        materials: { en: '', fr: '' },
        longitude: null,
        latitude: null,
        image: '',
        video: '',
        artist_details: {
          photo: '',
          school: '',
          location: '',
          website: ''
        }
      }
    };
  },
  
  methods: {
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const response = await mapService.uploadFile(file, 'image');
        this.location.image = response.data.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
      }
    },
    
    async handleVideoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const response = await mapService.uploadFile(file, 'video');
        this.location.video = response.data.url;
      } catch (error) {
        console.error('Error uploading video:', error);
        alert('Failed to upload video');
      }
    },
    
    async handleArtistPhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        const response = await mapService.uploadFile(file, 'artist_photo');
        this.location.artist_details.photo = response.data.url;
      } catch (error) {
        console.error('Error uploading artist photo:', error);
        alert('Failed to upload artist photo');
      }
    },
    
    showMapPicker() {
      // Implement a map picker modal to select coordinates
      // This could use Mapbox GL JS to let admin click on the map to set coordinates
    },
    
    async saveLocation() {
      try {
        if (this.isEditing) {
          await mapService.updateLocation(this.location.id, this.location);
        } else {
          await mapService.createLocation(this.location);
        }
        this.$emit('saved');
      } catch (error) {
        console.error('Error saving location:', error);
        alert('Failed to save location');
      }
    },
    
    cancel() {
      this.$emit('cancelled');
    }
  }
};
</script>
```

### Location Management List

Create a component to list, edit, and delete locations:

```vue
<template>
  <div class="locations-manager">
    <h1>Manage Map Locations</h1>
    
    <button @click="showAddForm">Add New Location</button>
    
    <div v-if="loading">Loading locations...</div>
    <div v-else-if="error">{{ error }}</div>
    
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Artist</th>
          <th>Year</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="location in locations" :key="location.id">
          <td>{{ location.id }}</td>
          <td>{{ location.name.en }}</td>
          <td>{{ location.artist }}</td>
          <td>{{ location.year }}</td>
          <td>
            <button @click="editLocation(location)">Edit</button>
            <button @click="confirmDelete(location)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Add/Edit Form Modal -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <location-editor
          :initial-location="currentLocation"
          :is-editing="!!currentLocation.id"
          @saved="handleSaved"
          @cancelled="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import mapService from '@/services/mapService';
import LocationEditor from './LocationEditor.vue';

export default {
  components: {
    LocationEditor
  },
  
  data() {
    return {
      locations: [],
      loading: true,
      error: null,
      showForm: false,
      currentLocation: {}
    };
  },
  
  async created() {
    await this.loadLocations();
  },
  
  methods: {
    async loadLocations() {
      try {
        this.loading = true;
        const response = await mapService.getLocations();
        this.locations = response.data;
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to load locations';
        this.loading = false;
        console.error('Error loading locations:', error);
      }
    },
    
    showAddForm() {
      this.currentLocation = {};
      this.showForm = true;
    },
    
    editLocation(location) {
      this.currentLocation = { ...location };
      this.showForm = true;
    },
    
    async confirmDelete(location) {
      if (confirm(`Are you sure you want to delete "${location.name.en}"?`)) {
        try {
          await mapService.deleteLocation(location.id);
          await this.loadLocations();
        } catch (error) {
          console.error('Error deleting location:', error);
          alert('Failed to delete location');
        }
      }
    },
    
    async handleSaved() {
      this.closeForm();
      await this.loadLocations();
    },
    
    closeForm() {
      this.showForm = false;
      this.currentLocation = {};
    }
  }
};
</script>
```

## Environment Configuration

Update your `.env` files to include the API URL:

```
# .env.development
VUE_APP_API_URL=http://localhost:3000/api
VUE_APP_MAPBOX_TOKEN=your_mapbox_token

# .env.production
VUE_APP_API_URL=https://your-production-api.com/api
VUE_APP_MAPBOX_TOKEN=your_mapbox_token
```

## Security Considerations

1. Implement authentication and authorization for the admin interfaces and API endpoints
2. Validate all incoming data on the server
3. Use HTTPS for all API communications
4. Set CORS policies to restrict access to your API
5. Implement rate limiting to prevent abuse
6. Sanitize uploaded files to prevent security vulnerabilities

## Migration from Static Data

To migrate from the static `locations.js` file to the dynamic backend:

1. Create a migration script that reads from `locations.js` and calls your API to create each location
2. Download and upload all referenced images and videos to your backend storage
3. Run the migration script once to populate your database
4. After verification, remove the `locations.js` file from your codebase

## Conclusion

This integration allows the Prima Interactive Map to be fully managed through your backend, enabling content editors to add, edit, and delete locations without developer intervention. The dynamic approach also makes it easier to scale with more locations and media assets in the future. 