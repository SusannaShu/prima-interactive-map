# Prima-CB Interactive Map

An interactive map application for Prima-CB that displays locations and provides detailed information in popup windows when markers are clicked.

## Live Demo

A live demo of the interactive map is available at:  
[https://prima-interactive-map.netlify.app/](https://prima-interactive-map.netlify.app/)

[![Prima Interactive Map Preview](https://i.imgur.com/xZKnPFO.png)](https://prima-interactive-map.netlify.app/)

## Features

- Interactive map with custom markers
- Detailed popups with images and information
- Responsive design for all devices
- Location sharing with intelligent viewport adjustment
- Multilingual support (English/French)

## Technologies Used

- React
- Mapbox GL JS
- React-Map-GL

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/prima-interactive-map.git
   cd prima-interactive-map
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the `homepage` field in `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/prima-interactive-map"
   ```
   Replace `yourusername` with your actual GitHub username.

4. Start the development server:
   ```
   npm start
   ```

## Integration Plan for Prima-CB Website

To integrate this interactive map into the Prima-CB website with an admin backend for data management, follow these steps:

### 1. Backend API Development

1. Create RESTful API endpoints in your existing backend system:
   - `GET /api/locations` - Retrieve all locations
   - `GET /api/locations/:id` - Retrieve a specific location
   - `POST /api/locations` - Create a new location
   - `PUT /api/locations/:id` - Update a location
   - `DELETE /api/locations/:id` - Delete a location

2. Design the database schema based on the current location structure:
   ```
   Location {
     id: Integer (Primary Key)
     name: JSON Object {en: String, fr: String}
     description: JSON Object {en: String, fr: String}
     artist: String 
     year: String 
     dimensions: String 
     materials: JSON Object {en: String, fr: String} 
     longitude: Float
     latitude: Float
     image: String (URL)
     video: String (URL for second slide video) 
     artist_details: Object {
       photo: String (URL for artist photo) 
       school: String (artist's school or institution) 
       location: String (artist's base location) 
       website: String (URL to artist's website) 
     } 
   }
   ```

### 2. Admin Interface Development

1. Create admin forms for location management:
   - Location creation form with fields for all attributes
   - Location editing interface
   - Location list view with search and filtering
   - Image upload functionality that returns URLs for the image field

2. Implement validation to ensure required fields (id, name, description, coordinates) are present

### 3. Mapbox API Key

1. Create a Mapbox account at https://www.mapbox.com/ if Prima-CB doesn't already have one
2. Generate a new API access token in the Mapbox account dashboard
3. Set usage restrictions on the token (domain restrictions, rate limits) for security
4. Replace the current Mapbox token in the code:
   ```javascript
   // In src/components/Map.js, replace:
   const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VzYW5uYXNodSIsImEiOiJjbTZkajNkbWYwb3EyMmlxczdpeDljamxtIn0.0UgPtm1Ag2ai0QbmRszBBg';
   
   // With Prima-CB's token:
   const MAPBOX_TOKEN = 'YOUR_NEW_MAPBOX_TOKEN';
   
   // For better security, consider loading from environment variables:
   const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
   ```
5. If using environment variables, ensure they are properly set in the hosting environment

### 4. Frontend Map Integration

1. Modify the map component to fetch data from the API instead of the static file:
   ```javascript
   // Replace this in Map.js:
   import locations from '../data/locations';
   
   // With:
   const [locations, setLocations] = useState([]);
   
   useEffect(() => {
     fetch('https://your-domain.com/api/locations')
       .then(response => response.json())
       .then(data => setLocations(data))
       .catch(error => console.error('Error fetching locations:', error));
   }, []);
   ```

2. Add error handling and loading states to the map component:
   ```javascript
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   
   useEffect(() => {
     setLoading(true);
     fetch('https://your-domain.com/api/locations')
       .then(response => response.json())
       .then(data => {
         setLocations(data);
         setLoading(false);
       })
       .catch(error => {
         console.error('Error fetching locations:', error);
         setError(error);
         setLoading(false);
       });
   }, []);
   
   // Add conditional rendering in the return statement
   if (loading) return <div className="loading-spinner">Loading map data...</div>;
   if (error) return <div className="error-message">Error loading map: {error.message}</div>;
   ```

### 5. Component Embedding

1. Build the React application for production:
   ```
   npm run build
   ```

2. Embed the built application in the Prima-CB website using one of these methods:
   
   a. **IFrame Integration:**
   ```html
   <iframe 
     src="https://path-to-hosted-interactive-map" 
     title="Prima-CB Interactive Map" 
     width="100%" 
     height="600px" 
     frameborder="0"
   ></iframe>
   ```
   
   b. **Direct Script Integration:**
   Include the built JavaScript bundles directly in a dedicated page:
   ```html
   <div id="prima-map-root"></div>
   <script src="path-to-built-react-app/static/js/main.[hash].js"></script>
   ```
   
   c. **Module Federation (Advanced):**
   If both the main site and map are React-based, implement module federation for seamless integration.

### 6. Testing and Deployment

1. Test the API integration in a staging environment
2. Ensure that the admin interface properly updates the map data
3. Test the map component with real-time data updates
4. Deploy to production when all tests pass

## Original Project Notes

### Using the Location Sharing Feature

The application includes a location sharing feature that helps users see both their current location and sculpture locations on the map:

1. Click the "Share My Location" button in the top-right corner of the map.
2. Allow the browser to access your location when prompted.
3. The map will automatically adjust to show:
   - If a sculpture is already selected: Both your location and the selected sculpture in the same view
   - If no sculpture is selected: Your location and the nearest sculpture
   - If no sculptures are available: Just your location

### Current Data Structure

The current location data structure in `src/data/locations.js` should be maintained in the API responses:

```javascript
{
  id: 1,
  name: {
    en: "Location Name",
    fr: "Nom de l'emplacement"
  },
  description: {
    en: "Description text...",
    fr: "Texte de description..."
  },
  artist: "Artist Name", // For artwork locations
  year: "Year",
  dimensions: "Dimensions",
  materials: {
    en: "Materials used",
    fr: "Matériaux utilisés"
  },
  longitude: 0.0000, // Replace with actual coordinates
  latitude: 0.0000,  // Replace with actual coordinates
  image: "URL to image",
  video: "URL to video for second slide",
  artist_details: {
    photo: "URL to artist photo",
    school: "Artist's school or institution",
    location: "Artist's base location",
    website: "https://artist-website.com"
  }
}
```

## License

[Specify license or copyright information] 