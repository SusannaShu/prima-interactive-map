import React, { useState, useRef, useContext } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import locations from '../data/locations';

// Mapbox access token
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VzYW5uYXNodSIsImEiOiJjbTZkajNkbWYwb3EyMmlxczdpeDljamxtIn0.0UgPtm1Ag2ai0QbmRszBBg';

// Create a language context to be used in the app
export const LanguageContext = React.createContext('en');

// Location Request Component
const LocationRequest = ({ onLocationUpdate }) => {
  const language = useContext(LanguageContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locationText = {
    en: {
      button: 'Share My Location',
      loading: 'Getting location...',
      error: 'Unable to retrieve your location',
      unsupported: 'Geolocation is not supported by your browser'
    },
    fr: {
      button: 'Partager Ma Position',
      loading: 'Localisation en cours...',
      error: 'Impossible de récupérer votre position',
      unsupported: 'La géolocalisation n\'est pas prise en charge par votre navigateur'
    }
  };

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
          setError(locationText[language].error);
          console.error(err);
        }
      );
    } else {
      setLoading(false);
      setError(locationText[language].unsupported);
    }
  };

  return (
    <div className="location-request">
      <button 
        onClick={handleLocationRequest} 
        disabled={loading}
        className="location-btn"
      >
        {loading ? locationText[language].loading : locationText[language].button}
      </button>
      {error && <p className="location-error">{error}</p>}
    </div>
  );
};

const MapComponent = () => {
  // Get current language from context
  const language = useContext(LanguageContext);
  
  // State for viewport
  const [viewState, setViewState] = useState({
    
    longitude: 1.7178452, 
    latitude: 50.8372302, 
    zoom: 15 // Increased zoom level for better pin visibility
  });

  // State for selected popup
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // State for user location
  const [userLocation, setUserLocation] = useState(null);
  
  // Reference to the map component
  const mapRef = useRef(null);

  // State for current slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper function to get text based on language
  const getText = (field) => {
    if (field && typeof field === 'object' && field[language]) {
      return field[language];
    }
    return field; // Return as is if not a language object
  };

  // Handle marker click
  const handleMarkerClick = (e, location) => {
    e.originalEvent.stopPropagation();
    
    // Reset current slide to 0 when opening a new popup
    setCurrentSlide(0);
    
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
    
    // If a sculpture is selected, fit both points in the viewport
    if (selectedLocation) {
      // Calculate bounds to fit both the user and selected sculpture
      const bounds = getBoundingBox([
        [location.longitude, location.latitude],
        [selectedLocation.longitude, selectedLocation.latitude]
      ]);
      
      // Use mapRef to fit bounds
      if (mapRef.current) {
        // Add padding to the bounds for better visibility
        const padding = { top: 50, bottom: 50, left: 50, right: 50 };
        
        // Adjust the viewport to fit both points
        mapRef.current.fitBounds(
          [
            [bounds.minLng, bounds.minLat], // Southwest corner
            [bounds.maxLng, bounds.maxLat]  // Northeast corner
          ],
          { padding, duration: 1000 }
        );
      }
    } else {
      // Find the nearest sculpture to show on the map
      let nearestLocationId = null;
      let shortestDistance = Infinity;
      
      // Calculate distances to all locations
      locations.forEach(loc => {
        const distance = calculateDistance(
          location.latitude, location.longitude,
          loc.latitude, loc.longitude
        );
        
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestLocationId = loc.id;
        }
      });
      
      // If we found a nearby sculpture, show both
      if (nearestLocationId) {
        const nearestLocation = locations.find(loc => loc.id === nearestLocationId);
        
        // Calculate bounds to fit both points
        const bounds = getBoundingBox([
          [location.longitude, location.latitude],
          [nearestLocation.longitude, nearestLocation.latitude]
        ]);
        
        // Use mapRef to fit bounds
        if (mapRef.current) {
          const padding = { top: 50, bottom: 50, left: 50, right: 50 };
          
          mapRef.current.fitBounds(
            [
              [bounds.minLng, bounds.minLat],
              [bounds.maxLng, bounds.maxLat]
            ],
            { padding, duration: 1000 }
          );
        }
      } else {
        // Just center on user location if no sculptures
        setViewState({
          longitude: location.longitude,
          latitude: location.latitude,
          zoom: 12,
          transitionDuration: 1000
        });
      }
    }
  };

  // Helper function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  // Helper function to convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Helper function to calculate bounding box for two points
  const getBoundingBox = (points) => {
    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;
    
    points.forEach(point => {
      const [lng, lat] = point;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });
    
    // Add a small buffer (about 10% of the range)
    const latBuffer = (maxLat - minLat) * 0.1;
    const lngBuffer = (maxLng - minLng) * 0.1;
    
    return {
      minLat: minLat - latBuffer,
      maxLat: maxLat + latBuffer,
      minLng: minLng - lngBuffer,
      maxLng: maxLng + lngBuffer
    };
  };

  const renderPopupContent = (location) => {
    const labels = {
      en: {
        artist: 'Artist',
        year: 'Year',
        collection: 'Collection',
        materials: 'Materials',
        dimensions: 'Dimensions',
        prev: 'Previous',
        next: 'Next'
      },
      fr: {
        artist: 'Artiste',
        year: 'Année',
        collection: 'Collection',
        materials: 'Matériaux',
        dimensions: 'Dimensions',
        prev: 'Précédent',
        next: 'Suivant'
      }
    };

    const handlePrevious = (e) => {
      e.stopPropagation();
      setCurrentSlide(current => (current > 0 ? current - 1 : 2));
    };

    const handleNext = (e) => {
      e.stopPropagation();
      setCurrentSlide(current => (current < 2 ? current + 1 : 0));
    };

    const handleDotClick = (index) => {
      setCurrentSlide(index);
    };
    
    if (location.artist) { // This is an artwork
      const slides = [
        // Slide 1: Image with name/artist overlay
        {
          image: location.image,
          content: (
            <div className="popup-overlay">
              <h3>{getText(location.name)}</h3>
              <div className="artist">{location.artist}</div>
            </div>
          )
        },
        // Slide 2: Video background with text overlay
        {
          className: 'details',
          noImage: true,
          content: (
            <div className="slide-container">
              <video 
                className="slide-video"
                src="https://res.cloudinary.com/sheyou/video/upload/v1744197348/Whats_App_Video_2025_04_09_at_13_15_07_589bdc4dc1.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="slide-content">
                <div className="year">{location.year}</div>
                <div className="specs">{getText(location.materials)}<br/>{location.dimensions}</div>
                <div className="description">{getText(location.description)}</div>
              </div>
            </div>
          )
        },
        // Slide 3: Artist info on white background
        {
          className: 'artist-info',
          noImage: true,
          content: (
            <div className="artist-container">
              <img 
                src="https://res.cloudinary.com/sheyou/image/upload/v1744134549/Screen_Shot_2025_04_08_at_6_13_48_PM_fa97918287.png"
                alt="Artist"
                className="artist-info-image"
              />
              <div className="artist-info-text">
                <div className="name">TIM FORMGREN</div>
                <div className="details">
                  AA School of Architecture<br />
                  London, UK
                </div>
              </div>
            </div>
          )
        }
      ];

      return (
        <div className="popup-content">
          <div className="popup-image-container">
            <div className="popup-slides">
              {slides.map((slide, index) => (
                <div 
                  key={index} 
                  className={`popup-slide ${slide.className || ''} ${index === currentSlide ? 'active' : ''}`}
                >
                  {!slide.noImage && (
                    <img 
                      src={slide.image} 
                      alt={getText(location.name)} 
                      className="popup-image"
                    />
                  )}
                  {slide.content}
                </div>
              ))}
            </div>
            <button className="popup-nav-button popup-nav-prev" onClick={handlePrevious} aria-label={labels[language].prev}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button className="popup-nav-button popup-nav-next" onClick={handleNext} aria-label={labels[language].next}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            <div className="popup-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`popup-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Regular location popup
    return (
      <div className="popup-content">
        <div className="popup-image-container">
        {location.image && (
            <img 
              src={location.image} 
              alt={getText(location.name)} 
              className="popup-image"
            />
          )}
          <div className="popup-overlay">
            <h3>{getText(location.name)}</h3>
          </div>
        </div>
        <p className="popup-description">{getText(location.description)}</p>
      </div>
    );
  };

  return (
    <div className={`map-container ${selectedLocation ? 'has-popup' : ''}`}>
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