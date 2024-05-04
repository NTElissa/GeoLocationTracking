import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import { getRoute, getETA } from '../utils/mapUtils';

const libraries = ["places"];
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
        if (!window.google) {
            console.error("Google Maps API is not loaded yet");
            return; // Exit if Google Maps API is not available
        }

        const fetchRouteAndETA = async () => {
            if (currentLocation && nextStop) {
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
        if (window.google && !markerClusterer) {
            const clusterer = new MarkerClusterer({ map: google.map, markers: [] });
            setMarkerClusterer(clusterer);
        }
    }, [google.map, markerClusterer]);

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

    if (!window.google) {
        return <div>Loading Google Maps...</div>; // Fallback while Google Maps is loading
    }

    return (
        <LoadScript
            googleMapsApiKey="YOUR_API_KEY"
            libraries={libraries}
        >
            <GoogleMap
                zoom={13}
                center={{ lat: -1.945, lng: 30.065 }}
                mapContainerStyle={{ height: '500px', width: '100%' }}
            >
                >
                <Marker position={startingPoint} label="Starting Point" />
                <Marker position={endingPoint} label="Ending Point" />
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
                        }}
                    />
                )}
                <Marker
                    position={currentLocation}
                    draggable={true}
                    // onDragEnd={handleDragEnd}
                />
                {nextStop && (
                    <Marker
                        position={nextStop}
                        label={{ text: `ETA: ${eta}`, color: 'white' }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
