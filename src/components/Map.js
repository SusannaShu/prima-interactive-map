import React, { useState, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import locations from '../data/locations';

// Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VzYW5uYXNodSIsImEiOiJjbTZkajNkbWYwb3EyMmlxczdpeDljamxtIn0.0UgPtm1Ag2ai0QbmRszBBg';

const MapComponent = () => {
  // State for viewport
  const [viewState, setViewState] = useState({
    longitude: 1.7191, // Centered on Prima-CB region
    latitude: 50.8297,
    zoom: 12
  });

  // State for selected popup
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Reference to the map component
  const mapRef = useRef(null);

  // Handle marker click
  const handleMarkerClick = (e, location) => {
    e.originalEvent.stopPropagation();
    
    // Calculate an upward offset to show the popup more centered in the viewport
    const verticalOffset = 0.002; // Adjust this value to move the center point up
    
    const newViewport = {
      longitude: location.longitude,
      latitude: location.latitude - verticalOffset, // Offset upward to better center the popup
      zoom: Math.max(viewState.zoom, 13), // Ensure minimum zoom level
      transitionDuration: 500 // Smooth transition in milliseconds
    };
    
    setViewState(newViewport);
    setSelectedLocation(location);
  };

  const renderPopupContent = (location) => {
    if (location.artist) { // This is an artwork
      return (
        <div className="popup-content">
          <h3>{location.name}</h3>
          {location.image && (
            <div className="popup-image-container">
              <img 
                src={location.image} 
                alt={location.name} 
                className="popup-image"
              />
            </div>
          )}
          <p className="popup-description">{location.description}</p>
          {location.details && (
            <p className="popup-description">{location.details}</p>
          )}
          <div className="artwork-details">
            <dl>
              <dt>Artist</dt>
              <dd>{location.artist}</dd>
              <dt>Year</dt>
              <dd>{location.year}</dd>
              <dt>Collection</dt>
              <dd>{location.collection}</dd>
            </dl>
            <dl>
              <dt>Materials</dt>
              <dd>{location.materials}</dd>
              <dt>Dimensions</dt>
              <dd>{location.dimensions}</dd>
            </dl>
          </div>
        </div>
      );
    }
    
    // Regular location popup
    return (
      <div className="popup-content">
        <h3>{location.name}</h3>
        {location.image && (
          <div className="popup-image-container">
            <img 
              src={location.image} 
              alt={location.name} 
              className="popup-image"
            />
          </div>
        )}
        <p className="popup-description">{location.description}</p>
      </div>
    );
  };

  return (
    <div className="map-container">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {locations.map(location => (
          <Marker 
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            onClick={e => handleMarkerClick(e, location)}
          >
            <div className="marker">
              <img src="/marker-icon.svg" alt="Location Marker" />
            </div>
          </Marker>
        ))}

        {selectedLocation && (
          <Popup
            longitude={selectedLocation.longitude}
            latitude={selectedLocation.latitude - 0.002} // Small offset to better position the popup
            anchor="center" 
            onClose={() => setSelectedLocation(null)}
            closeOnClick={false}
            offset={[0, -15]} // Offset upward to center more in the viewport
            className="artwork-popup"
            maxWidth="none"
          >
            {renderPopupContent(selectedLocation)}
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent; 