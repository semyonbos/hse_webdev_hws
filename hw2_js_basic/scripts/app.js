// main app script
import { weddingData } from './data.js';
import { DOMBuilder } from './dom.js';
import { MobileMenu } from './mobile_menu.js';
import { SmoothScroll } from './scroll.js';

// for local server
// - npx http-server -c-1 -o --cors

// app initialization
class WeddingApp {
    constructor() {
        this.data = weddingData;
        this.init();
    }

    init() {
        // build the page dynamically from data
        this.buildPage();
        // initialize interactive features
        this.initializeFeatures();
    }

    buildPage() {
        const body = document.body;

        // clearing existing content
        body.innerHTML = '';

        // create and append sections dynamically
        const nav = DOMBuilder.createNavigation(this.data);
        const hero = DOMBuilder.createHeroSection(this.data.event, this.data.couple);
        const contentGrid = DOMBuilder.createContentGrid(this.data.sections);
        const registry = DOMBuilder.createRegistrySection(this.data.registry);
        const author = DOMBuilder.createAuthorSection();

        body.append(nav, hero, contentGrid, registry, author);

        console.log('Page built dynamically from data');
    }

    initializeFeatures() {
        // mobile menu
        new MobileMenu('.mobile-menu-toggle', '.nav-menu');

        // smooth scroll
        new SmoothScroll();

        console.log('Interactive features initialized');
    }
}

// initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new WeddingApp();
});