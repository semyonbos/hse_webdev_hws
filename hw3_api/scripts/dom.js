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
     * @param {Object} navData - объект с данными (service, navigation)
     * @returns {HTMLElement} - готовый элемент <nav> с меню
     */
    static createNavigation(navData) {
        const nav = this.createElement('nav', 'navbar');
        const container = this.createElement('div', 'nav-container');

        // Создаём логотип
        const logo = this.createElement('a', 'nav-logo', 'WRP');
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
     * @param {Object} serviceData - данные о сервисе
     * @returns {HTMLElement} - секция с приветствием и описанием сервиса
     */
    static createHeroSection(serviceData) {
        const section = this.createElement('section', 'hero');
        section.id = 'home';

        const content = this.createElement('div', 'hero-content');

        // Создаём заголовок с названием сервиса
        const title = this.createElement('h1', 'hero-title', 
            serviceData.name.toUpperCase());

        const subtitle = this.createElement('p', 'hero-subtitle',
            serviceData.description);

        const tagline = this.createElement('p', 'hero-tagline',
            serviceData.tagline);

        const ctaButton = this.createElement('button', 'hero-cta', 'Start Registration');
        ctaButton.addEventListener('click', () => {
            document.querySelector('#screens').scrollIntoView({ behavior: 'smooth' });
        });

        content.append(title, subtitle, tagline, ctaButton);
        section.appendChild(content);
        return section;
    }

    /**
     * createFeaturesSection - создаёт секцию с преимуществами сервиса
     * @param {Object} featuresData - данные о преимуществах
     * @returns {HTMLElement} - секция с фичами
     */
    static createFeaturesSection(featuresData) {
        const section = this.createElement('section', 'features-section');
        section.id = 'features';

        const container = this.createElement('div', 'features-container');

        const title = this.createElement('h2', 'features-title', featuresData.title);
        const subtitle = this.createElement('p', 'features-subtitle', featuresData.subtitle);

        const grid = this.createElement('div', 'features-grid');

        featuresData.items.forEach(function(feature) {
            const featureCard = DOMBuilder.createElement('div', 'feature-card');
            
            const icon = DOMBuilder.createElement('div', 'feature-icon', feature.icon);
            const featureTitle = DOMBuilder.createElement('h3', 'feature-title', feature.title);
            const description = DOMBuilder.createElement('p', 'feature-description', feature.description);

            featureCard.append(icon, featureTitle, description);
            grid.appendChild(featureCard);
        });

        container.append(title, subtitle, grid);
        section.appendChild(container);
        return section;
    }

    /**
     * createServiceScreens - создаёт все экраны сервиса регистрации
     * @param {Array} screens - массив объектов экранов
     * @returns {HTMLElement} - контейнер со всеми экранами
     */
    static createServiceScreens(screens) {
        const container = this.createElement('section', 'service-screens');
        container.id = 'screens';

        screens.forEach(function(screen, index) {
            const screenElement = DOMBuilder.createElement('div', `service-screen screen-${screen.id}`);
            screenElement.id = screen.id;
            
            // Первый экран активен по умолчанию
            if (index === 0) {
                screenElement.classList.add('active');
            }

            const screenContent = DOMBuilder.createElement('div', 'screen-content');
            
            const title = DOMBuilder.createElement('h2', 'screen-title', screen.title);
            const description = DOMBuilder.createElement('p', 'screen-description', screen.description);

            const form = DOMBuilder.createForm(screen.fields, screen.id);

            const navigation = DOMBuilder.createElement('div', 'screen-navigation');
            
            if (index > 0) {
                const prevButton = DOMBuilder.createElement('button', 'nav-button prev-screen', 'Previous');
                navigation.appendChild(prevButton);
            }

            if (index < screens.length - 1) {
                const nextButton = DOMBuilder.createElement('button', 'nav-button next-screen', 'Next');
                navigation.appendChild(nextButton);
            } else {
                const submitButton = DOMBuilder.createElement('button', 'nav-button submit-button', 'Complete Registration');
                submitButton.type = 'submit';
                form.appendChild(submitButton);
            }

            screenContent.append(title, description, form, navigation);
            screenElement.appendChild(screenContent);
            container.appendChild(screenElement);
        });

        return container;
    }

    /**
     * createContactSection - создаёт секцию контактов
     * @param {Object} contactData - данные контактов
     * @returns {HTMLElement} - секция с контактной информацией
     */
    static createContactSection(contactData) {
        const section = this.createElement('section', 'contact-section');
        section.id = 'contact';

        const container = this.createElement('div', 'contact-container');

        const title = this.createElement('h2', 'contact-title', contactData.title);
        const subtitle = this.createElement('p', 'contact-subtitle', contactData.subtitle);

        const contactGrid = this.createElement('div', 'contact-grid');

        // Контактная информация
        const contactInfo = this.createElement('div', 'contact-info');
        
        const emailItem = this.createElement('div', 'contact-item');
        emailItem.innerHTML = `<strong>Email:</strong><br><a href="mailto:${contactData.email}">${contactData.email}</a>`;
        
        const phoneItem = this.createElement('div', 'contact-item');
        phoneItem.innerHTML = `<strong>Phone:</strong><br><a href="tel:${contactData.phone}">${contactData.phone}</a>`;
        
        const addressItem = this.createElement('div', 'contact-item');
        addressItem.innerHTML = `<strong>Address:</strong><br>${contactData.address.replace(/\n/g, '<br>')}`;
        
        const hoursItem = this.createElement('div', 'contact-item');
        hoursItem.innerHTML = `<strong>Business Hours:</strong><br>${contactData.hours.replace(/\n/g, '<br>')}`;

        contactInfo.append(emailItem, phoneItem, addressItem, hoursItem);

        // Социальные сети
        const socialInfo = this.createElement('div', 'social-info');
        const socialTitle = this.createElement('h3', 'social-title', 'Follow Us');
        const socialLinks = this.createElement('div', 'social-links');

        contactData.social.forEach(function(social) {
            const link = DOMBuilder.createElement('a', 'social-link', `${social.icon} ${social.name}`);
            link.href = social.link;
            link.target = '_blank';
            socialLinks.appendChild(link);
        });

        socialInfo.append(socialTitle, socialLinks);

        // Форма обратной связи
        const contactForm = this.createElement('form', 'contact-form');
        contactForm.innerHTML = `
            <h3>Send us a Message</h3>
            <div class="form-group">
                <input type="text" name="name" placeholder="Your Name" required class="form-input">
            </div>
            <div class="form-group">
                <input type="email" name="email" placeholder="Your Email" required class="form-input">
            </div>
            <div class="form-group">
                <textarea name="message" placeholder="Your Message" rows="5" required class="form-textarea"></textarea>
            </div>
            <button type="submit" class="contact-submit">Send Message</button>
        `;

        contactGrid.append(contactInfo, socialInfo, contactForm);
        container.append(title, subtitle, contactGrid);
        section.appendChild(container);

        // Добавляем обработчик формы
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });

        return section;
    }

    /**
     * createForm - создаёт форму для экрана
     * @param {Array} fields - массив полей формы
     * @param {string} screenId - ID экрана
     * @returns {HTMLElement} - готовая форма
     */
    static createForm(fields, screenId) {
        const form = this.createElement('form', 'registration-form');
        form.id = `${screenId}-form`;

        fields.forEach(function(field) {
            const fieldGroup = DOMBuilder.createElement('div', 'form-field-group');
            
            const label = DOMBuilder.createElement('label', 'form-label', field.label);
            if (field.required) {
                label.innerHTML += ' <span class="required">*</span>';
            }

            let input;
            
            switch(field.type) {
                case 'textarea':
                    input = DOMBuilder.createElement('textarea', 'form-input');
                    break;
                case 'select':
                    input = DOMBuilder.createElement('select', 'form-input');
                    field.options.forEach(option => {
                        const optionElement = DOMBuilder.createElement('option', '', option);
                        optionElement.value = option.toLowerCase();
                        input.appendChild(optionElement);
                    });
                    break;
                case 'checkbox':
                    input = DOMBuilder.createElement('input', 'form-checkbox');
                    input.type = 'checkbox';
                    if (field.checked) input.checked = true;
                    break;
                case 'review':
                    input = DOMBuilder.createElement('div', 'review-summary');
                    input.textContent = 'Your registration details will appear here...';
                    break;
                case 'location':
                    const locationGroup = DOMBuilder.createElement('div', 'location-group');
                    input = DOMBuilder.createElement('input', 'form-input');
                    input.type = field.type;
                    input.name = field.name;
                    input.required = field.required;

                    const geolocationButton = DOMBuilder.createElement('button', 'geolocation-btn', '📍 Auto-detect');
                    geolocationButton.type = 'button';
                    geolocationButton.title = 'Detect your current location';

                    locationGroup.append(input, geolocationButton);
                    fieldGroup.append(label, locationGroup);
                    break;
                default:
                    input = DOMBuilder.createElement('input', 'form-input');
                    input.type = field.type;
            }

            if (field.type !== 'location' && field.type !== 'checkbox' && field.type !== 'review') {
                input.name = field.name;
                input.required = field.required || false;
                fieldGroup.append(label, input);
            } else if (field.type === 'checkbox') {
                fieldGroup.classList.add('checkbox-group');
                fieldGroup.append(input, label);
            } else {
                fieldGroup.append(label, input);
            }

            form.appendChild(fieldGroup);
        });

        return form;
    }

    /**
     * createAuthorSection - создаёт секцию с информацией об авторе
     * @returns {HTMLElement} - секция с подписью автора
     */
    static createAuthorSection() {
        const section = this.createElement('section', 'author');
        const text1 = this.createElement('p', 'author__text', 'Wedding Registry Service by Semyon Bosonogov, 2025');
        const text2 = this.createElement('p', 'author__text', 'AI tools were used to assist in the development of this service');
        section.append(text1, text2);
        return section;
    }
}