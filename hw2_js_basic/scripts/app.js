// Точка входа: координирует все модули и инициализирует страницу

// Импортируем необходимые модули
import { weddingData } from './modules/data.js';           // Данные
import { DOMBuilder } from './modules/domBuilder.js';      // Создание DOM элементов
import { MobileMenu } from './modules/mobileMenu.js';      // Мобильное меню
import { SmoothScroll } from './modules/smoothScroll.js'; // Плавная прокрутка

/**
 * WeddingApp - главный класс приложения
 * Управляет всей логикой: создаёт страницу и инициализирует функции
 */
class WeddingApp {
    /**
     * constructor - создаёт экземпляр приложения
     * Сохраняет данные и запускает инициализацию
     */
    constructor() {
        this.data = weddingData;  // Сохраняем данные для использования
        this.init();              // Запускаем инициализацию
    }

    /**
     * init - главная функция инициализации
     * Вызывает построение страницы и подключение интерактивности
     */
    init() {
        this.buildPage();           // Создаём DOM структуру страницы
        this.initializeFeatures();  // Добавляем интерактивные функции
    }

    /**
     * buildPage - создаёт и добавляет все секции страницы в DOM
     * Использует DOMBuilder для динамического создания элементов из данных
     * 
     * Создаёт:
     * - Навигацию
     * - Hero секцию
     * - Сетку карточек
     * - Секцию реестра
     * - Секцию автора
     */
    buildPage() {
        const body = document.body;

        // Очищаем body (удаляем старое содержимое)
        body.innerHTML = '';

        // Создаём все секции страницы из данных
        const nav = DOMBuilder.createNavigation(this.data);
        const hero = DOMBuilder.createHeroSection(this.data.event, this.data.couple);
        const contentGrid = DOMBuilder.createContentGrid(this.data.sections);
        const registry = DOMBuilder.createRegistrySection(this.data.registry);
        const author = DOMBuilder.createAuthorSection();

        // Добавляем все секции в body
        body.append(nav, hero, contentGrid, registry, author);

        console.log('✅ Page built dynamically from data');
    }

    /**
     * initializeFeatures - инициализирует интерактивные функции
     * Создаёт экземпляры классов для:
     * - Мобильного меню
     * - Плавной прокрутки
     * - Параллакс эффекта
     */
    initializeFeatures() {
        // Инициализируем мобильное меню
        new MobileMenu('.mobile-menu-toggle', '.nav-menu');

        // Инициализируем плавную прокрутку
        new SmoothScroll();

        console.log('✅ Interactive features initialized');
    }
}

/**
 * Точка запуска приложения
 * Ждём полной загрузки DOM, затем создаём приложение
 */
document.addEventListener('DOMContentLoaded', function() {
    new WeddingApp();  // Создаём и запускаем приложение
});
