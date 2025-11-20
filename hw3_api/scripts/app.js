// Точка входа: координирует все модули и инициализирует страницу

// ипортируем необходимые модули
import { serviceData } from './data.js';           // данные
import { DOMBuilder } from './dom.js';      // создание DOM элементов
import { MobileMenu } from './mobile_menu.js';      // мобильное меню
import { SmoothScroll } from './scroll.js'; // плавная прокрутка
import { RegistrationForm } from './registration.js'; // форма регистрации
import { GeolocationService } from './geolocation.js'; // геолокация
import { StorageService } from './storage.js';    // локальное хранилище

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
        new RegistrationForm(this.geolocation, this.storage);

        console.log('Interactive features initialized');
    }

    /**
     * setupNavigation - настраивает навигацию между экранами сервиса
     */
    setupNavigation() {
        const nextButtons = document.querySelectorAll('.next-screen');
        const prevButtons = document.querySelectorAll('.prev-screen');
        
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showScreen(this.currentScreen + 1);
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showScreen(this.currentScreen - 1);
            });
        });
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
        toast.textContent = message;
        
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
        }, 3000);
    }
}

/**
 * Точка запуска приложения
 * Ждём полной загрузки DOM, затем создаём приложение
 */
document.addEventListener('DOMContentLoaded', function() {
    new WeddingServiceApp();  // Создаём и запускаем приложение
});