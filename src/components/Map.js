import React, { useState, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import locations from '../data/locations';

// Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VzYW5uYXNodSIsImEiOiJjbTZkajNkbWYwb3EyMmlxczdpeDljamxtIn0.0UgPtm1Ag2ai0QbmRszBBg';

// Location Request Component
const LocationRequest = ({ onLocationUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationRequest = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          onLocationUpdate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setLoading(false);
          setError('Unable to retrieve your location');
          console.error(err);
        }
      );
    } else {
      setLoading(false);
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="location-request">
      <button 
        onClick={handleLocationRequest} 
        disabled={loading}
        className="location-btn"
      >
        {loading ? 'Getting location...' : 'Share My Location'}
      </button>
      {error && <p className="location-error">{error}</p>}
    </div>
  );
};

const MapComponent = () => {
  // State for viewport
  const [viewState, setViewState] = useState({
    longitude: 1.7191, // Centered on Prima-CB region
    latitude: 50.8297,
    zoom: 12
  });

  // State for selected popup
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // State for user location
  const [userLocation, setUserLocation] = useState(null);
  
  // Reference to the map component
  const mapRef = useRef(null);

  // Handle marker click
  const handleMarkerClick = (e, location) => {
    e.originalEvent.stopPropagation();
    
    // Set viewport to center on marker location
    const newViewport = {
      longitude: location.longitude,
      latitude: location.latitude,
      zoom: Math.max(viewState.zoom, 13), // Ensure minimum zoom level
      transitionDuration: 500 // Smooth transition in milliseconds
    };
    
    setViewState(newViewport);
    setSelectedLocation(location);
  };

  // Handle user location update
  const handleLocationUpdate = (location) => {
    setUserLocation(location);
    
    // Optionally update viewport to show user location
    setViewState({
      longitude: location.longitude,
      latitude: location.latitude,
      zoom: 12,
      transitionDuration: 1000
    });
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
              {/* <dt>Collection</dt>
              <dd>{location.collection}</dd> */}
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
      <LocationRequest onLocationUpdate={handleLocationUpdate} />
      
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

        {/* Display user location marker if available */}
        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor="center"
          >
            <div className="user-marker">
              <div className="user-marker-dot"></div>
              <div className="user-marker-pulse"></div>
            </div>
          </Marker>
        )}

        {selectedLocation && (
          <Popup
            longitude={selectedLocation.longitude}
            latitude={selectedLocation.latitude}
            anchor="center" 
            onClose={() => setSelectedLocation(null)}
            closeOnClick={false}
            offset={[0, 0]} // Remove offset for more precise positioning
            className="artwork-popup"
            maxWidth="none"
            closeButton={true}
            dynamicPosition={false}
          >
            {renderPopupContent(selectedLocation)}
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent; 