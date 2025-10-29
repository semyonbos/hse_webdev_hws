// Все методы статические - вызываются через имя класса, без создания экземпляра

export class DOMBuilder {
    /**
     * createElement - базовый метод для создания DOM элемента
     * @param {string} tag - название HTML тега ('div', 'nav', 'p', и т.д.)
     * @param {string} className - CSS класс для элемента (необязательно)
     * @param {string} content - текстовое содержимое элемента (необязательно)
     * @returns {HTMLElement} - созданный DOM элемент
     */
    static createElement(tag, className, content) {
        if (className === undefined) className = '';
        if (content === undefined) content = '';

        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }

    /**
     * createNavigation - создаёт навигационное меню
     * @param {Object} navData - объект с данными (couple, navigation)
     * @returns {HTMLElement} - готовый элемент <nav> с меню
     * 
     * Создаёт:
     * - Логотип с инициалами
     * - Список ссылок навигации (динамически из массива)
     * - Кнопку мобильного меню (3 полоски)
     */
    static createNavigation(navData) {
        const nav = this.createElement('nav', 'navbar');
        const container = this.createElement('div', 'nav-container');

        // Создаём логотип
        const logo = this.createElement('a', 'nav-logo', navData.couple.initials);
        logo.href = '#home';

        // Создаём меню динамически из массива navigation
        const menu = this.createElement('ul', 'nav-menu');
        navData.navigation.forEach(function(item) {
            const li = document.createElement('li');
            const link = DOMBuilder.createElement('a', 'nav-link', item.label);
            link.href = item.href;
            li.appendChild(link);
            menu.appendChild(li);
        });

        // Создаём кнопку мобильного меню (гамбургер)
        const toggle = this.createElement('div', 'mobile-menu-toggle');
        for (let i = 0; i < 3; i++) {
            toggle.appendChild(document.createElement('span'));
        }

        // Собираем всё вместе
        container.append(logo, menu, toggle);
        nav.appendChild(container);
        return nav;
    }

    /**
     * createHeroSection - создаёт главную секцию (hero)
     * @param {Object} eventData - данные о мероприятии (date, venue, location)
     * @param {Object} coupleData - данные о паре (bride, groom)
     * @returns {HTMLElement} - секция с приветствием и деталями события
     */
    static createHeroSection(eventData, coupleData) {
        const section = this.createElement('section', 'hero');
        section.id = 'home';

        const content = this.createElement('div', 'hero-content');

        // Создаём заголовок с именами
        const title = this.createElement('h1', 'hero-title', 
            `${coupleData.bride.toUpperCase()} & ${coupleData.groom.toUpperCase()}`);

        const subtitle = this.createElement('p', 'hero-subtitle',
            'With love and gratitude, we invite you to share in the joy of our wedding day.');

        // Создаём блок с деталями события
        const details = this.createElement('div', 'hero-details');
        const dateP = this.createElement('p', '', eventData.date);
        const venueP = this.createElement('p', '', eventData.venue);
        const locationP = this.createElement('p', '', eventData.location);
        details.append(dateP, venueP, locationP);

        content.append(title, subtitle, details);
        section.appendChild(content);
        return section;
    }

    /**
     * createContentGrid - создаёт сетку с карточками контента
     * @param {Array} sections - массив объектов секций
     * @returns {HTMLElement} - секция с сеткой карточек
     * 
     * Для каждой секции создаёт карточку с:
     * - ID для навигации
     * - Заголовком
     * - Описанием
     */
    static createContentGrid(sections) {
        const grid = this.createElement('section', 'content-grid');

        sections.forEach(function(section) {
            const card = DOMBuilder.createElement('div', `content-card card-${section.id}`);
            card.id = section.id;

            const cardContent = DOMBuilder.createElement('div', 'card-content');
            const title = DOMBuilder.createElement('h2', 'card-title', section.title);
            const description = DOMBuilder.createElement('p', 'card-description', section.description);

            cardContent.append(title, description);
            card.appendChild(cardContent);
            grid.appendChild(card);
        });

        return grid;
    }

    /**
     * createRegistrySection - создаёт секцию реестра подарков
     * @param {Object} registryData - данные реестра (title, description, buttonText, link)
     * @returns {HTMLElement} - секция с информацией о реестре
     */
    static createRegistrySection(registryData) {
        const section = this.createElement('section', 'registry-section');
        const content = this.createElement('div', 'registry-content');

        const title = this.createElement('h2', 'registry-title', registryData.title);
        const text = this.createElement('p', 'registry-text', registryData.description);

        const button = this.createElement('a', 'registry-button', registryData.buttonText);
        button.href = registryData.link;
        button.target = '_blank';

        content.append(title, text, button);
        section.appendChild(content);
        return section;
    }

    /**
     * createAuthorSection - создаёт секцию с информацией об авторе
     * @returns {HTMLElement} - секция с подписью автора
     */
    static createAuthorSection() {
        const section = this.createElement('section', 'author');
        const text1 = this.createElement('p', 'author__text', 'Versted by Semyon Bosonogov, 2025;');
        const text2 = this.createElement('p', 'author__text', 'AI tools were used to assist in the development of this page');
        section.append(text1, text2);
        return section;
    }
}