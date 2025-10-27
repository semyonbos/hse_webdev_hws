// scroll to section script
export class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const self = this;

        document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                self.handleScroll(e, link);
            });
        });
    }

    handleScroll(e, link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
} 
