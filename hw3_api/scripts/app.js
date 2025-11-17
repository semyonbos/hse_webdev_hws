// Точка входа: координирует все модули и инициализирует страницу

// Импортируем необходимые модули
import { serviceData } from './data.js';           // Данные
import { DOMBuilder } from './dom.js';      // Создание DOM элементов
import { MobileMenu } from './mobile_menu.js';      // Мобильное меню
import { SmoothScroll } from './scroll.js'; // Плавная прокрутка
import { RegistrationForm } from './registration.js'; // Форма регистрации

// Точка входа: координирует все модули и инициализирует страницу

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

        console.log('✅ Service pages built dynamically from data');
    }

    /**
     * initializeFeatures - инициализирует интерактивные функции
     */
    initializeFeatures() {
        // Инициализируем мобильное меню
        new MobileMenu('.mobile-menu-toggle', '.nav-menu');

        // Инициализируем плавную прокрутку
        new SmoothScroll();

        // Инициализируем форму регистрации
        new RegistrationForm();

        console.log('✅ Interactive features initialized');
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
}

/**
 * Точка запуска приложения
 * Ждём полной загрузки DOM, затем создаём приложение
 */
document.addEventListener('DOMContentLoaded', function() {
    new WeddingServiceApp();  // Создаём и запускаем приложение
});