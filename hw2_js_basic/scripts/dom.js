// dom script
export class DOMBuilder {
    static createElement(tag, className = '', content = '') { // class createElement
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;

        return element;
    }

    static createNavigation(navData) {
        const nav = this.createElement('nav', 'navbar');
        const container = this.createElement('div', 'nav-container');
        
        // logo
        const logo = this.createElement('a', 'nav-logo', navData.couple.initials);
        logo.href = '#home';
        
        // menu
        const menu = this.createElement('ul', 'nav-menu');
        navData.navigation.forEach(item => {
            const li = document.createElement('li');
            const link = this.createElement('a', 'nav-link', item.label);
            link.href = item.href;
            li.appendChild(link);
            menu.appendChild(li);
        });
        
        // mobile menu
        const toggle = this.createElement('div', 'mobile-menu-toggle');
        for (let i = 0; i < 3; i++) {
            toggle.appendChild(document.createElement('span'));
        }
        
        container.append(logo, menu, toggle);
        nav.appendChild(container);

        return nav;
    }

    static createHeroSection(eventData, coupleData) {
        const section = this.createElement('section', 'hero');
        section.id = 'home';
        
        const content = this.createElement('div', 'hero-content');
        
        const title = this.createElement('h1', 'hero-title', 
            `${coupleData.bride.toUpperCase()} & ${coupleData.groom.toUpperCase()}`);
        
        const subtitle = this.createElement('p', 'hero-subtitle',
            'With love and gratitude, we invite you to share in the joy of our wedding day.');
        
        const details = this.createElement('div', 'hero-details');
        details.innerHTML = `
            <p>${eventData.date}</p>
            <p>${eventData.venue}</p>
            <p>${eventData.location}</p>
        `;
        
        content.append(title, subtitle, details);
        section.appendChild(content);

        return section;
    }

    static createContentGrid(sections) {
        const grid = this.createElement('section', 'content-grid');
        
        sections.forEach(section => {
            const card = this.createElement('div', `content-card card-${section.id}`);
            card.id = section.id;
            
            const cardContent = this.createElement('div', 'card-content');
            const title = this.createElement('h2', 'card-title', section.title);
            const description = this.createElement('p', 'card-description', section.description);
            
            cardContent.append(title, description);
            card.appendChild(cardContent);
            grid.appendChild(card);
        });
        
        return grid;
    }

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

    static createAuthorSection() {
        const section = this.createElement('section', 'author');
        section.innerHTML = `
            <p class="author__text">Versted by Semyon Bosonogov, 2025;</p>
            <p class="author__text">AI tools were used to assist in the development of this page</p>
        `;
        
        return section;
    }
}