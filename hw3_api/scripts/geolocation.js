/**
 * GeolocationService - открытый сервис для работы с геолокацией
 * Предоставляет методы для определения местоположения пользователя
 */
export class GeolocationService {
    constructor() {
        this.isSupported = 'geolocation' in navigator;
        this.currentLocation = null;
    }

    /**
     * getCurrentPosition - получает текущее местоположение пользователя
     * @returns {Promise} - промис с координатами или ошибкой
     */
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
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
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    resolve(this.currentLocation);
                },
                (error) => {
                    const errorMessage = this.getErrorMessage(error);
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    }

    /**
     * getCityFromCoordinates - определяет город по координатам
     * @param {number} latitude - широта
     * @param {number} longitude - долгота
     * @returns {Promise} - промис с названием города
     */
    async getCityFromCoordinates(latitude, longitude) {
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
    }

    /**
     * getCurrentCity - получает текущий город пользователя
     * @returns {Promise} - промис с названием города
     */
    async getCurrentCity() {
        try {
            const position = await this.getCurrentPosition();
            const city = await this.getCityFromCoordinates(
                position.latitude, 
                position.longitude
            );
            return city;
        } catch (error) {
            throw error;
        }
    }

    /**
     * getErrorMessage - преобразует код ошибки геолокации в читаемое сообщение
     * @param {Object} error - объект ошибки геолокации
     * @returns {string} - читаемое сообщение об ошибке
     */
    getErrorMessage(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Location access denied. Please enable location services in your browser settings.';
            case error.POSITION_UNAVAILABLE:
                return 'Location information is unavailable.';
            case error.TIMEOUT:
                return 'The request to get your location timed out.';
            default:
                return 'An unknown error occurred while getting your location.';
        }
    }

    /**
     * requestPermission - запрашивает разрешение на геолокацию
     * @returns {Promise} - промис с результатом запроса разрешения
     */
    async requestPermission() {
        if (!this.isSupported) {
            return 'denied';
        }

        return new Promise((resolve) => {
            // Проверяем текущее разрешение
            navigator.permissions?.query({ name: 'geolocation' })
                .then((result) => {
                    if (result.state === 'granted') {
                        resolve('granted');
                    } else if (result.state === 'prompt') {
                        // Запрашиваем разрешение через получение позиции
                        this.getCurrentPosition()
                            .then(() => resolve('granted'))
                            .catch(() => resolve('denied'));
                    } else {
                        resolve('denied');
                    }
                })
                .catch(() => {
                    // Fallback для браузеров без permissions API
                    this.getCurrentPosition()
                        .then(() => resolve('granted'))
                        .catch(() => resolve('denied'));
                });
        });
    }
}