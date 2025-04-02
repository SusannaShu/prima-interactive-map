# Prima-CB Interactive Map

An interactive map application for Prima-CB's global locations, built with React and Mapbox GL.

## Features

- Interactive map showing Prima-CB's global locations
- Clickable markers that reveal detailed information about each location
- Responsive design for desktop and mobile devices
- Smooth animations and intuitive user interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone this repository
```
git clone <repository-url>
cd prima-cb-interactive-map
```

2. Install dependencies
```
npm install
```

3. Set up environment variables for Mapbox 
   - The Mapbox token is already included in the source code
   - For production, it's recommended to move this to an environment variable

## Running the Application

Start the development server:
```
npm start
```

The application will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Building for Production

Create a production build:
```
npm run build
```

This will create optimized files in the `build` folder that you can deploy to a web server.

## Customizing Locations

To customize the map locations:

1. Edit the `src/data/locations.js` file
2. Replace the sample location data with actual Prima-CB locations
3. Add your own images to the `public/images` directory for each location

## Technologies Used

- React
- Mapbox GL JS
- React-Map-GL

## License

This project is licensed under the MIT License. 