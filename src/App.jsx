import React, { useState, useEffect } from 'react';
import Map from './components/Map';

const startingPoint = { lat: -1.939826787816454, lng: 30.0445426438232 };
const stops = [
    { lat: -1.9355377074007851, lng: 30.060163829002217 },
    { lat: -1.9358808342336546, lng: 30.08024820994666 },
    { lat: -1.9489196023037583, lng: 30.092607828989397 },
    { lat: -1.9592132952818164, lng: 30.106684061788073 },
    { lat: -1.9487480402200394, lng: 30.126596781356923 },
];

const MAX_DISTANCE_TO_STOP = 0.01; // Distance in degrees (adjust as needed)

function App() {
    const [currentLocation, setCurrentLocation] = useState(startingPoint);
    const [currentStopIndex, setCurrentStopIndex] = useState(0);

    const handleLocationChange = (location) => {
        setCurrentLocation(location);
    };

    useEffect(() => {
        const checkStopReached = () => {
            if (currentStopIndex < stops.length) {
                const nextStop = stops[currentStopIndex];
                const distance = getDistanceBetweenCoordinates(
                    currentLocation.lat,
                    currentLocation.lng,
                    nextStop.lat,
                    nextStop.lng
                );

                if (distance <= MAX_DISTANCE_TO_STOP) {
                    setCurrentStopIndex(currentStopIndex + 1);
                }
            }
        };

        checkStopReached();
    }, [currentLocation, currentStopIndex]);

    const nextStop = currentStopIndex < stops.length ? stops[currentStopIndex] : null;

    return (
        <div>
            <Map
                currentLocation={currentLocation}
                onLocationChange={handleLocationChange}
                nextStop={nextStop}
            />
        </div>
    );
}

// Helper function to calculate distance between two coordinates
function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance * 111.32; // Convert to degrees
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

export default App;

