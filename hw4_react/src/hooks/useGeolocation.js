import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const isSupported = 'geolocation' in navigator;

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!isSupported) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }, [isSupported]);

  const getCityFromCoordinates = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || 'Unknown location';
    } catch (error) {
      console.warn('Geocoding service error:', error);
      throw new Error('Unable to determine city from coordinates');
    }
  }, []);

  const getCurrentCity = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const city = await getCityFromCoordinates(
        position.latitude, 
        position.longitude
      );
      setLocation(city);
      return city;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentPosition, getCityFromCoordinates]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      if (navigator.permissions?.query) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'granted') {
          return 'granted';
        } else if (result.state === 'prompt') {
          try {
            await getCurrentPosition();
            return 'granted';
          } catch {
            return 'denied';
          }
        } else {
          return 'denied';
        }
      } else {
        try {
          await getCurrentPosition();
          return 'granted';
        } catch {
          return 'denied';
        }
      }
    } catch {
      return 'denied';
    }
  }, [isSupported, getCurrentPosition]);

  const getErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location services in your browser settings.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.';
      case error.TIMEOUT:
        return 'The request to get your location timed out.';
      default:
        return error.message || 'An unknown error occurred while getting your location.';
    }
  };

  return {
    isSupported,
    isLoading,
    error,
    location,
    getCurrentCity,
    requestPermission,
    getErrorMessage
  };
}