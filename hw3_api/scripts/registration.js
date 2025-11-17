// Класс для обработки формы регистрации

export class RegistrationForm {
    /**
     * constructor - инициализирует обработку формы
     */
    constructor() {
        this.formData = {};
        this.init();
    }

    /**
     * init - устанавливает обработчики для формы
     */
    init() {
        this.setupFormHandlers();
        this.setupRealTimeValidation();
    }

    /**
     * setupFormHandlers - настраивает обработчики для форм
     */
    setupFormHandlers() {
        const forms = document.querySelectorAll('.registration-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });

            // Сохраняем данные при изменении полей
            form.addEventListener('input', (e) => {
                this.saveFormData(form);
            });
        });
    }

    /**
     * setupRealTimeValidation - настраивает валидацию в реальном времени
     */
    setupRealTimeValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('form-input')) {
                this.validateField(e.target);
            }
        });
    }

    /**
     * validateField - валидирует отдельное поле
     * @param {HTMLElement} field - поле для валидации
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-field-group');
        
        // Удаляем предыдущие сообщения об ошибках
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        field.classList.remove('error');

        if (field.required && !value) {
            this.showError(field, 'This field is required');
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }

        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        return true;
    }

    /**
     * showError - показывает сообщение об ошибке
     * @param {HTMLElement} field - поле с ошибкой
     * @param {string} message - сообщение об ошибке
     */
    showError(field, message) {
        const fieldGroup = field.closest('.form-field-group');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        fieldGroup.appendChild(errorElement);
        field.classList.add('error');
    }

    /**
     * saveFormData - сохраняет данные формы
     * @param {HTMLElement} form - форма для сохранения
     */
    saveFormData(form) {
        const formData = new FormData(form);
        const screenId = form.id.replace('-form', '');
        
        this.formData[screenId] = {};
        formData.forEach((value, key) => {
            this.formData[screenId][key] = value;
        });

        // Обновляем summary на последнем экране
        this.updateReviewSummary();
        
        // Сохраняем в localStorage
        localStorage.setItem('weddingRegistrationData', JSON.stringify(this.formData));
    }

    /**
     * updateReviewSummary - обновляет сводку на экране review
     */
    updateReviewSummary() {
        const reviewElement = document.querySelector('.review-summary');
        if (reviewElement) {
            let summaryHTML = '<div class="summary-content">';
            
            Object.keys(this.formData).forEach(screenId => {
                const screenData = this.formData[screenId];
                Object.keys(screenData).forEach(field => {
                    if (screenData[field]) {
                        summaryHTML += `<p><strong>${this.formatFieldName(field)}:</strong> ${screenData[field]}</p>`;
                    }
                });
            });

            summaryHTML += '</div>';
            reviewElement.innerHTML = summaryHTML;
        }
    }

    /**
     * formatFieldName - форматирует имя поля для отображения
     * @param {string} fieldName - исходное имя поля
     * @returns {string} - отформатированное имя
     */
    formatFieldName(fieldName) {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    /**
     * handleFormSubmit - обрабатывает отправку формы
     * @param {HTMLElement} form - отправляемая форма
     */
    handleFormSubmit(form) {
        // Проверяем все обязательные поля
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.saveFormData(form);
            this.showSuccessMessage();
        }
    }

    /**
     * showSuccessMessage - показывает сообщение об успешной регистрации
     */
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>🎉 Registration Complete!</h3>
            <p>Thank you for registering with Wedding Registry Pro. We've sent a confirmation email with next steps.</p>
            <button class="success-button" onclick="location.reload()">Start New Registration</button>
        `;
        
        document.querySelector('.service-screens').appendChild(successMessage);
        
        // Прокручиваем к сообщению об успехе
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
}