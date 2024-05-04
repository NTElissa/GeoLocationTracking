import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import { getRoute, getDistance, getETA } from '../utils/mapUtils';

const libraries = ["places"];
// dotenv.config();
const startingPoint = { lat: -1.939826787816454, lng: 30.0445426438232 };
const stops = [
  { lat: -1.9355377074007851, lng: 30.060163829002217 },
  { lat: -1.9358808342336546, lng: 30.08024820994666 },
  { lat: -1.9489196023037583, lng: 30.092607828989397 },
  { lat: -1.9592132952818164, lng: 30.106684061788073 },
  { lat: -1.9487480402200394, lng: 30.126596781356923 },
];
const endingPoint = { lat: -1.9365670876910166, lng: 30.13020167024439 };

const Map = ({ currentLocation, onLocationChange, nextStop }) => {
  const [route, setRoute] = useState(null);
  const [eta, setEta] = useState('');
  const [markerClusterer, setMarkerClusterer] = useState(null);

  useEffect(() => {
    const fetchRouteAndETA = async () => {
      if (currensttLocation && nextStop && window.google) {
        try {
          const route = await getRoute(currentLocation, nextStop, stops);
          setRoute(route);
          const estimatedEta = getETA(route);
          setEta(estimatedEta);


        } catch (error) {
          console.error('Error fetching route and distance:', error);
        }
      }
    };

    fetchRouteAndETA();
  }, [currentLocation, nextStop]);

  useEffect(() => {
    if (window.google) {
      const clusterer = new MarkerClusterer({ map: google.map, markers: [] });
      setMarkerClusterer(clusterer);
    }
  }, []);

  useEffect(() => {
    if (markerClusterer) {
      const markers = stops.map(
          (stop, index) =>
              new google.maps.Marker({
                position: stop,
                label: `Stop ${String.fromCharCode(65 + index)}`,
              })
      );
      markerClusterer.addMarkers(markers);
    }
  }, [markerClusterer]);

  const handleDragEnd = (event) => {
    const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    onLocationChange(newLocation);
  };

  // Calculate the center based on the stops
  const centerLat = stops.reduce((sum, stop) => sum + stop.lat, 0) / stops.length;
  const centerLng = stops.reduce((sum, stop) => sum + stop.lng, 0) / stops.length;
  const center = { lat: centerLat, lng: centerLng };

  return (
      <LoadScript
          googleMapsApiKey={import.meta.env.VITE_MAP_KEY}
          loadingElement={<div>Loading...</div>}
          libraries={libraries}
      >
        <GoogleMap
            zoom={16} // Increased zoom level
            center={center} // Use the calculated center
            mapContainerStyle={{ height: '500px', width: '100%' }}
        >
          {/* Render starting point marker */}
          <Marker position={startingPoint} label="Starting Point" />

          {/* Render ending point marker */}
          <Marker position={endingPoint} label="Ending Point" />

          {/* Render route polyline */}
          {route && (
              <Polyline
                  path={route.overview_path.map((coord) => ({
                    lat: coord.lat,
                    lng: coord.lng,
                  }))}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    icons: [
                      {
                        icon: 'hello',
                        offset: '0',
                        repeat: '20px',
                      },
                    ],
                  }}
              />
          )}

          {/* Render current location marker */}
          <Marker
              position={currentLocation}
              draggable={true}
              onDragEnd={handleDragEnd}
          />

          {/* Render next stop marker */}
          {nextStop && (
              <Marker
                  position={nextStop}
                  label={{ text: `ETA: ${eta}`, color: 'white' }}
              />
          )}

          {/* Render final destination marker when there are no more stops */}
          {!nextStop && (
              <Marker position={endingPoint} label="Final Destination" />
          )}
        </GoogleMap>
      </LoadScript>
  );
};

export default Map;
