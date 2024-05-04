export const getRoute = async (start, end, waypoints) => {
  if (!window.google) {
    throw new Error("Google Maps API has not loaded yet");
  }
  const directionsService = new google.maps.DirectionsService();
  const request = {
    origin: start,
    destination: end,
    waypoints: waypoints.map((stop) => ({ location: stop })),
    travelMode: 'DRIVING',
  };
  const response = await directionsService.route(request);
  return response.routes[0];
};

export const getDistance = (origin, destination) => {
  if (!window.google) {
    throw new Error("Google Maps API has not loaded yet");
  }
  const service = new google.maps.DistanceMatrixService();
  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK') {
            const { distance, duration } = response.rows[0].elements[0];
            resolve({ distance, duration });
          } else {
            reject(new Error(`DirectionsService failed with status: ${status}`));
          }
        }
    );
  });
};

export const getETA = (route) => {
  if (!window.google) {
    throw new Error("Google Maps API has not loaded yet");
  }

  const leg = route.legs[0];
  const { text: duration } = leg.duration;
  const { text: distance } = leg.distance;

  return `${duration} (${distance})`;
};

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


