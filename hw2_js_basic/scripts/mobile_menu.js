// mobile menu script
export class MobileMenu {
    constructor(toggleSelector, menuSelector) {
        this.toggle = document.querySelector(toggleSelector);
        this.menu = document.querySelector(menuSelector);
        this.links = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        const self = this;

        this.toggle.addEventListener('click', function() {
            self.toggleMenu();
        });

        this.links.forEach(function(link) {
            link.addEventListener('click', function() {
                self.closeMenu();
            });
        });

        document.addEventListener('click', function(e) {
            self.handleOutsideClick(e);
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
    }

    handleOutsideClick(e) {
        if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
            this.closeMenu();
        }
    }
}
