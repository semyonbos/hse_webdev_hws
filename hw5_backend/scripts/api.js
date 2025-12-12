/**
 * ApiService - сервис для работы с внешними API
 * Предоставляет методы для получения и отправки данных
 */
export class ApiService {
    constructor() {
        // Реальные API для свадебной тематики
        this.weatherApi = 'https://api.open-meteo.com/v1/forecast';
        this.weddingQuotesApi = 'https://api.quotable.io/random';
        this.submissionApi = 'https://jsonplaceholder.typicode.com/posts';
        this.countriesApi = 'https://restcountries.com/v3.1/all';
    }

    /**
     * getWeatherForecast - получает прогноз погоды для свадебной даты
     * @param {string} city - город
     * @param {string} date - дата свадьбы
     * @returns {Promise} - промис с данными о погоде
     */
    async getWeatherForecast(city, date) {
        try {
            if (!city || !date) {
                throw new Error('City and date are required');
            }

            // Преобразуем дату в timestamp
            const weddingDate = new Date(date);
            const today = new Date();
            const diffDays = Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24));
            
            // Получаем прогноз на ближайшие 16 дней (максимум для бесплатного API)
            const days = Math.min(16, diffDays);
            
            if (days < 0) {
                return { success: false, message: 'Wedding date is in the past' };
            }
            
            if (days > 16) {
                return { 
                    success: false, 
                    message: 'Weather forecast is only available for up to 16 days in advance'
                };
            }

            // Используем Open-Meteo API (бесплатный, не требует ключа)
            const response = await fetch(
                `${this.weatherApi}?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,windspeed_10m_max&forecast_days=${days}`
            );
            
            if (!response.ok) {
                throw new Error('Weather service unavailable');
            }
            
            const data = await response.json();
            
            // Форматируем данные для свадьбы
            const forecast = {
                success: true,
                city: city,
                date: date,
                daysUntilWedding: days,
                forecastData: data.daily
            };
            
            return forecast;
            
        } catch (error) {
            console.error('Weather API error:', error);
            return { 
                success: false, 
                message: 'Unable to get weather forecast',
                error: error.message 
            };
        }
    }

    /**
     * getWeddingQuote - получает случайную свадебную цитату
     * @returns {Promise} - промис с цитатой
     */
    async getWeddingQuote() {
        try {
            const response = await fetch(this.weddingQuotesApi + '?tags=love|marriage|wedding');
            
            if (!response.ok) {
                throw new Error('Quotes service unavailable');
            }
            
            const data = await response.json();
            
            return {
                success: true,
                quote: data.content,
                author: data.author
            };
            
        } catch (error) {
            console.error('Quotes API error:', error);
            // Возвращаем дефолтную цитату при ошибке
            return {
                success: false,
                quote: "A successful marriage requires falling in love many times, always with the same person.",
                author: "Mignon McLaughlin"
            };
        }
    }

    /**
     * getCountries - получает список стран для выбора места свадьбы
     * @returns {Promise} - промис со списком стран
     */
    async getCountries() {
        try {
            const response = await fetch(this.countriesApi);
            
            if (!response.ok) {
                throw new Error('Countries service unavailable');
            }
            
            const data = await response.json();
            
            // Форматируем список стран
            const countries = data
                .map(country => ({
                    name: country.name.common,
                    flag: country.flags?.svg || country.flags?.png,
                    region: country.region
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
            
            return {
                success: true,
                countries: countries
            };
            
        } catch (error) {
            console.error('Countries API error:', error);
            return {
                success: false,
                countries: []
            };
        }
    }

    /**
     * submitRegistration - отправляет данные регистрации на сервер
     * @param {Object} formData - данные формы
     * @returns {Promise} - промис с ответом сервера
     */
    async submitRegistration(formData) {
        try {
            // Преобразуем данные в формат для API
            const apiData = this.formatRegistrationData(formData);
            
            const response = await fetch(this.submissionApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit registration');
            }
            
            const data = await response.json();
            
            return {
                success: true,
                message: 'Registration submitted successfully!',
                serverResponse: data
            };
            
        } catch (error) {
            console.error('Submission API error:', error);
            return {
                success: false,
                message: 'Failed to submit registration to server',
                error: error.message
            };
        }
    }

    /**
     * formatRegistrationData - форматирует данные для отправки
     * @param {Object} formData - сырые данные формы
     * @returns {Object} - отформатированные данные
     */
    formatRegistrationData(formData) {
        // Объединяем данные со всех экранов
        const combinedData = {};
        Object.values(formData).forEach(screenData => {
            Object.assign(combinedData, screenData);
        });
        
        // Добавляем метаданные
        return {
            registration: combinedData,
            metadata: {
                submittedAt: new Date().toISOString(),
                source: 'WeddingRegistryPro',
                version: '1.0'
            }
        };
    }

    /**
     * getHolidayDates - получает даты праздников для планирования свадьбы
     * @param {number} year - год
     * @returns {Promise} - промис с датами праздников
     */
    async getHolidayDates(year = new Date().getFullYear()) {
        try {
            // Используем API для получения праздников (пример с публичным API)
            const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`);
            
            if (!response.ok) {
                throw new Error('Holidays service unavailable');
            }
            
            const data = await response.json();
            
            return {
                success: true,
                holidays: data
            };
            
        } catch (error) {
            console.error('Holidays API error:', error);
            return {
                success: false,
                holidays: []
            };
        }
    }
}