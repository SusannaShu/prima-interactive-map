# Interactive Map Implementation for Prima-CB

## Overview
This document outlines the plan to create an interactive map for the Prima-CB website using React and Mapbox GL JS. The map will display markers at specific locations, which when clicked will display popup windows with relevant content.

## Technology Stack
- **React**: Frontend library for building the user interface
- **Mapbox GL JS**: For rendering the interactive map
- **React-Map-GL**: React wrapper for Mapbox GL JS

## Implementation Steps

### 1. Project Setup
- Create a React application
- Install necessary dependencies:
  ```
  npm install react-map-gl mapbox-gl
  ```

### 2. Map Component Structure
- Create a main `Map` component
- Store the Mapbox access token in environment variables
- Define map styling and initial viewport settings

### 3. Define Locations
- Create a data structure for locations with:
  - Coordinates (longitude, latitude)
  - Name/Title
  - Description/Content for popups
  - Any additional metadata (images, links, etc.)

### 4. Marker and Popup Implementation
- Render markers at each location
- Implement click handlers to show/hide popups
- Style popups with consistent design matching Prima-CB's branding

### 5. Responsive Design
- Ensure the map is responsive across different screen sizes
- Implement mobile-friendly interactions

## Example Location Data Structure

```javascript
const locations = [
  {
    id: 1,
    name: "Prima-CB Headquarters",
    description: "Our main office location with expert staff available for consultation.",
    longitude: 0.000, // Replace with actual coordinates
    latitude: 0.000,  // Replace with actual coordinates
    image: "headquarters.jpg"
  },
  // Additional locations...
];
```

## Next Steps
1. Set up React project structure
2. Create basic map component
3. Implement markers and popups
4. Finalize styling and user interaction
5. Test across devices and browsers

## Mapbox Access Token

This token should be stored in an environment variable for security in the actual implementation. 