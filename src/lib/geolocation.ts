/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

/**
 * Check if location is within geofence radius
 */
export function isWithinRadius(
  userLat: number,
  userLon: number,
  schoolLat: number,
  schoolLon: number,
  radiusMeters: number
): boolean {
  const distance = calculateDistance(userLat, userLon, schoolLat, schoolLon);
  return distance <= radiusMeters;
}

/**
 * Default SMKN 8 Jakarta coordinates (example)
 * In production, this should be stored in database settings
 */
export const DEFAULT_SCHOOL_LOCATION = {
  latitude: -6.2297, // Example coordinates for Jakarta
  longitude: 106.8345,
  radius: 500, // 500 meters
};

/**
 * Get current location from browser
 */
export function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
