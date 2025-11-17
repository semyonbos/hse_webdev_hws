// Обеспечивает плавную анимацию при переходе к секциям страницы

export class SmoothScroll {
    /**
     * constructor - инициализирует плавную прокрутку
     * Автоматически находит все якорные ссылки и добавляет обработчики
     */
    constructor() {
        this.init();
    }

    /**
     * init - устанавливает обработчики для всех якорных ссылок
     * Находит все ссылки вида <a href="#section-id">
     */
    init() {
        const self = this;

        // Находим все ссылки, начинающиеся с #
        document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                self.handleScroll(e, link);
            });
        });
    }

    /**
     * handleScroll - обрабатывает клик по якорной ссылке
     * @param {Event} e - объект события клика
     * @param {HTMLElement} link - элемент ссылки, по которой кликнули
     * 
     * Отменяет стандартное поведение и плавно прокручивает к нужной секции
     */
    handleScroll(e, link) {
        e.preventDefault();  // Отменяем стандартный резкий переход

        // Находим целевую секцию по ID из href
        const target = document.querySelector(link.getAttribute('href'));

        if (target) {
            // Плавно прокручиваем к секции (с отступом 80px для навбара)
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
}
