# Prima-CB Interactive Map

An interactive map application for Prima-CB that displays locations and provides detailed information in popup windows when markers are clicked.

## Features

- Interactive map with custom markers
- Detailed popups with images and information
- Responsive design for all devices
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