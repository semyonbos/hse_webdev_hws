// Точка входа: координирует все модули и инициализирует страницу

// Импортируем необходимые модули
import { serviceData } from './data.js';           // данные
import { DOMBuilder } from './dom.js';            // создание DOM элементов
import { MobileMenu } from './mobile_menu.js';    // мобильное меню
import { SmoothScroll } from './scroll.js';       // плавная прокрутка
import { RegistrationForm } from './registration.js'; // форма регистрации
import { GeolocationService } from './geolocation.js'; // геолокация
import { StorageService } from './storage.js';    // локальное хранилище
import { ApiService } from './api.js';           // API сервис

/**
 * WeddingServiceApp - главный класс приложения сервиса регистрации
 * Управляет всей логикой: создаёт страницу и инициализирует функции
 */
class WeddingServiceApp {
    /**
     * constructor - создаёт экземпляр приложения
     * Сохраняет данные и запускает инициализацию
     */
    constructor() {
        this.data = serviceData;  // Сохраняем данные для использования
        this.currentScreen = 0;   // Текущий экран
        this.geolocation = new GeolocationService(); // Сервис геолокации
        this.storage = new StorageService();         // Сервис хранилища
        this.api = new ApiService();                // API сервис
        this.init();              // Запускаем инициализацию
    }

    /**
     * init - главная функция инициализации
     * Вызывает построение страницы и подключение интерактивности
     */
    init() {
        this.buildPage();           // Создаём DOM структуру страницы
        this.initializeFeatures();  // Добавляем интерактивные функции
        this.setupNavigation();     // Настраиваем навигацию между экранами
        this.checkSavedData();      // Проверяем сохранённые данные
        this.loadAPIData();         // Загружаем данные с API
    }

    /**
     * buildPage - создаёт и добавляет все секции страницы в DOM
     */
    buildPage() {
        const body = document.body;

        // Очищаем body (удаляем старое содержимое)
        body.innerHTML = '';

        // Создаём все секции страницы из данных
        const nav = DOMBuilder.createNavigation(this.data);
        const hero = DOMBuilder.createHeroSection(this.data.service);
        const features = DOMBuilder.createFeaturesSection(this.data.features);
        const screens = DOMBuilder.createServiceScreens(this.data.screens);
        const contact = DOMBuilder.createContactSection(this.data.contact);
        const author = DOMBuilder.createAuthorSection();

        // Добавляем все секции в body
        body.append(nav, hero, features, screens, contact, author);

        console.log('Service pages built dynamically from data');
    }

    /**
     * initializeFeatures - инициализирует интерактивные функции
     */
    initializeFeatures() {
        // Инициализируем мобильное меню
        new MobileMenu('.mobile-menu-toggle', '.nav-menu');

        // Инициализируем плавную прокрутку
        new SmoothScroll();

        // Инициализируем форму регистрации с зависимостями
        new RegistrationForm(this.geolocation, this.storage, this.api);

        console.log('Interactive features initialized');
    }

    /**
     * loadAPIData - загружает данные с внешних API
     */
    async loadAPIData() {
        // Загружаем свадебную цитату для отображения
        await this.displayWeddingQuote();
        
        // Загружаем список стран для выбора места свадьбы
        await this.loadCountriesList();
    }

    /**
     * displayWeddingQuote - загружает и отображает свадебную цитату
     */
    async displayWeddingQuote() {
        try {
            const quoteData = await this.api.getWeddingQuote();
            
            if (quoteData.success) {
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    const quoteElement = document.createElement('div');
                    quoteElement.className = 'hero-quote';
                    quoteElement.innerHTML = `
                        <blockquote class="quote-text">"${quoteData.quote}"</blockquote>
                        <cite class="quote-author">— ${quoteData.author}</cite>
                    `;
                    heroContent.appendChild(quoteElement);
                    
                    // Показываем уведомление
                    this.showToast('💖 Wedding quote loaded', 'info');
                }
            }
        } catch (error) {
            console.error('Failed to load wedding quote:', error);
        }
    }

    /**
     * loadCountriesList - загружает список стран для поля location
     */
    async loadCountriesList() {
        try {
            const countriesData = await this.api.getCountries();
            
            if (countriesData.success && countriesData.countries.length > 0) {
                // Находим поле location и заменяем его на select
                const locationInputs = document.querySelectorAll('input[name="location"]');
                
                locationInputs.forEach(input => {
                    const fieldGroup = input.closest('.form-field-group');
                    if (fieldGroup) {
                        // Создаём select элемент
                        const select = document.createElement('select');
                        select.className = 'form-input';
                        select.name = 'location';
                        select.id = 'location-select';
                        select.required = true;
                        
                        // Добавляем пустую опцию
                        const defaultOption = document.createElement('option');
                        defaultOption.value = '';
                        defaultOption.textContent = 'Select your country';
                        select.appendChild(defaultOption);
                        
                        // Добавляем страны
                        countriesData.countries.slice(0, 50).forEach(country => {
                            const option = document.createElement('option');
                            option.value = `${country.name}`;
                            option.textContent = `${country.name}`;
                            option.dataset.region = country.region;
                            select.appendChild(option);
                        });
                        
                        // Заменяем input на select
                        const locationGroup = fieldGroup.querySelector('.location-group');
                        if (locationGroup) {
                            const currentInput = locationGroup.querySelector('input[name="location"]');
                            if (currentInput) {
                                currentInput.remove();
                                locationGroup.insertBefore(select, locationGroup.querySelector('.geolocation-btn'));
                            }
                        }
                    }
                });
                
                console.log('Countries list loaded:', countriesData.countries.length, 'countries');
            }
        } catch (error) {
            console.error('Failed to load countries list:', error);
        }
    }

    /**
     * setupNavigation - настраивает навигацию между экранами сервиса
     */
    setupNavigation() {
        const nextButtons = document.querySelectorAll('.next-screen');
        const prevButtons = document.querySelectorAll('.prev-screen');
        
        // Добавляем прогноз погоды при переходе на экран деталей свадьбы
        nextButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                // Prevent default in case button acts as a submit
                e.preventDefault();
                console.log('Next button clicked. Current index:', this.currentScreen);
                const currentScreen = document.querySelector('.service-screen.active');
                if (currentScreen && currentScreen.id === 'couple-info') {
                    await this.checkWeatherForecast();
                }
                this.showScreen(this.currentScreen + 1);
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Prev button clicked. Current index:', this.currentScreen);
                this.showScreen(this.currentScreen - 1);
            });
        });
    }

    /**
     * checkWeatherForecast - проверяет прогноз погоды для даты свадьбы
     */
    async checkWeatherForecast() {
        const weddingDateInput = document.querySelector('input[name="weddingDate"]');
        const locationInput = document.querySelector('#location-select') || 
                              document.querySelector('input[name="location"]');
        
        if (weddingDateInput && weddingDateInput.value && locationInput && locationInput.value) {
            try {
                this.showToast('🌤️ Checking weather forecast...', 'info');
                
                const weatherData = await this.api.getWeatherForecast(
                    locationInput.value, 
                    weddingDateInput.value
                );
                
                if (weatherData.success) {
                    this.showToast(
                        `Weather forecast available for ${locationInput.value}`, 
                        'success'
                    );
                    
                    // Сохраняем прогноз для отображения на экране review
                    this.weatherForecast = weatherData;
                } else {
                    this.showToast(weatherData.message, 'warning');
                }
            } catch (error) {
                console.error('Weather forecast error:', error);
            }
        }
    }

    /**
     * checkSavedData - проверяет наличие сохранённых данных
     * Показывает уведомление, если есть незавершённая регистрация
     */
    checkSavedData() {
        const savedData = this.storage.getData('weddingRegistration');
        if (savedData && Object.keys(savedData).length > 0) {
            this.showRestoreNotification();
        }
    }

    /**
     * showRestoreNotification - показывает уведомление о восстановлении данных
     */
    showRestoreNotification() {
        const notification = document.createElement('div');
        notification.className = 'restore-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p>📋 We found your saved registration data. Would you like to restore it?</p>
                <div class="notification-buttons">
                    <button class="btn-restore">Restore Data</button>
                    <button class="btn-dismiss">Start Fresh</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Обработчики кнопок
        notification.querySelector('.btn-restore').addEventListener('click', () => {
            this.restoreSavedData();
            notification.remove();
        });

        notification.querySelector('.btn-dismiss').addEventListener('click', () => {
            this.storage.clearData('weddingRegistration');
            notification.remove();
        });

        // Автоматически скрыть через 10 секунд
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * restoreSavedData - восстанавливает сохранённые данные в формы
     */
    restoreSavedData() {
        const savedData = this.storage.getData('weddingRegistration');
        if (savedData) {
            // Триггерим событие для восстановления данных
            document.dispatchEvent(new CustomEvent('restoreSavedData', {
                detail: { savedData }
            }));
            
            // Показываем подтверждение
            this.showToast('Registration data restored successfully!', 'success');
        }
    }

    /**
     * showScreen - переключает видимость экранов
     * @param {number} screenIndex - индекс экрана для показа
     */
    showScreen(screenIndex) {
        const screens = document.querySelectorAll('.service-screen');
        const totalScreens = screens.length;

        if (screenIndex >= 0 && screenIndex < totalScreens) {
            screens.forEach((screen, index) => {
                screen.classList.toggle('active', index === screenIndex);
            });
            this.currentScreen = screenIndex;
        }
    }

    /**
     * showToast - показывает всплывающее уведомление
     * @param {string} message - текст сообщения
     * @param {string} type - тип сообщения (success, error, warning)
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Анимация появления
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    /**
     * getToastIcon - возвращает иконку для тоста
     * @param {string} type - тип сообщения
     * @returns {string} - HTML иконки
     */
    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

/**
 * Точка запуска приложения
 * Ждём полной загрузки DOM, затем создаём приложение
 */
document.addEventListener('DOMContentLoaded', function() {
    new WeddingServiceApp();  // Создаём и запускаем приложение
});