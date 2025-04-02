# Prima-CB Interactive Map

An interactive map application for Prima-CB that displays locations and provides detailed information in popup windows when markers are clicked.

## Features

- Interactive map with custom markers
- Detailed popups with images and information
- Responsive design for all devices
- Location sharing with intelligent viewport adjustment
- GitHub Pages deployment support

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

## Deploying to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. Make sure your changes are committed to your GitHub repository.

2. Run the deployment script:
   ```
   npm run deploy
   ```

3. Your site will be available at the URL specified in the `homepage` field of your `package.json`.

### First-time Deployment Notes

If this is your first deployment:

1. After running `npm run deploy`, the `gh-pages` branch will be created in your repository.
2. Go to your GitHub repository settings → Pages.
3. Make sure the source is set to the `gh-pages` branch.
4. Your site should be published at `https://yourusername.github.io/prima-interactive-map/`.

## Using the Location Sharing Feature

The application includes a location sharing feature that helps users see both their current location and sculpture locations on the map:

1. Click the "Share My Location" button in the top-right corner of the map.
2. Allow the browser to access your location when prompted.
3. The map will automatically adjust to show:
   - If a sculpture is already selected: Both your location and the selected sculpture in the same view
   - If no sculpture is selected: Your location and the nearest sculpture
   - If no sculptures are available: Just your location

This feature helps visitors easily navigate to sculptures by showing the spatial relationship between their current position and artwork locations.

## Customizing Location Data

Location data is stored in `src/data/locations.js`. Add or modify locations by editing this file:

```javascript
{
  id: 1,
  name: "Location Name",
  description: "Description text...",
  artist: "Artist Name", // For artwork locations
  year: "Year",
  collection: "Collection Name",
  dimensions: "Dimensions",
  materials: "Materials used",
  longitude: 0.0000, // Replace with actual coordinates
  latitude: 0.0000,  // Replace with actual coordinates
  image: "URL to image"
}
```

## License

[Specify license or copyright information] 