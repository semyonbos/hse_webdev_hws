// JS basic update final: скрипт для отзывчивой смены дизайна и мобильного меню
// Mobile menu
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Toggle menu
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Предотвращаем всплытие
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Simple parallax
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${window.pageYOffset * -0.5}px)`;
    }
});