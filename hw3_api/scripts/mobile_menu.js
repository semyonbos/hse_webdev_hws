// Класс для обработки открытия/закрытия навигационного меню на мобильных устройствах

export class MobileMenu {
    /**
     * constructor - инициализирует мобильное меню
     * @param {string} toggleSelector - CSS селектор кнопки меню (например, '.mobile-menu-toggle')
     * @param {string} menuSelector - CSS селектор самого меню (например, '.nav-menu')
     * 
     * Находит элементы в DOM и вызывает init() для настройки обработчиков
     */
    constructor(toggleSelector, menuSelector) {
        this.toggle = document.querySelector(toggleSelector);  // Кнопка гамбургер
        this.menu = document.querySelector(menuSelector);      // Само меню
        this.links = document.querySelectorAll('.nav-link');   // Все ссылки в меню
        this.init();
    }

    /**
     * init - устанавливает все обработчики событий
     * Вызывается автоматически при создании экземпляра класса
     * 
     * Добавляет обработчики для:
     * - Клика по кнопке меню
     * - Клика по ссылкам в меню
     * - Клика вне меню
     */
    init() {
        const self = this;  // Сохраняем контекст для использования в function

        // Обработчик клика по кнопке меню
        this.toggle.addEventListener('click', function() {
            self.toggleMenu();
        });

        // Обработчики для каждой ссылки в меню
        this.links.forEach(function(link) {
            link.addEventListener('click', function() {
                self.closeMenu();
            });
        });

        // Обработчик клика вне меню (закрывает меню)
        document.addEventListener('click', function(e) {
            self.handleOutsideClick(e);
        });
    }

    /**
     * toggleMenu - переключает состояние меню (открыто/закрыто)
     * Добавляет или убирает класс 'active' у меню и кнопки
     */
    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }

    /**
     * closeMenu - закрывает меню
     * Убирает класс 'active' у меню и кнопки
     */
    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
    }

    /**
     * handleOutsideClick - обрабатывает клик вне меню
     * @param {Event} e - объект события клика
     * 
     * Если клик произошёл не по меню и не по кнопке, закрывает меню
     */
    handleOutsideClick(e) {
        if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
            this.closeMenu();
        }
    }
}
