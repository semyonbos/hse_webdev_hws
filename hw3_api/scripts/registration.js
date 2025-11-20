// Класс для обработки формы регистрации

export class RegistrationForm {
    /**
     * constructor - инициализирует обработку формы
     * @param {GeolocationService} geolocation - сервис геолокации
     * @param {StorageService} storage - сервис хранилища
     */
    constructor(geolocation, storage) {
        this.formData = {};
        this.geolocation = geolocation;
        this.storage = storage;
        this.init();
    }

    /**
     * init - устанавливает обработчики для формы
     */
    init() {
        this.setupFormHandlers();
        this.setupRealTimeValidation();
        this.setupGeolocationHandler();
        this.setupAutoSave();
        this.setupRestoreListener();
        
        // Восстанавливаем сохранённые данные
        this.restoreSavedData();
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
     * setupGeolocationHandler - настраивает обработчик геолокации
     */
    setupGeolocationHandler() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('geolocation-btn')) {
                this.handleGeolocationClick(e.target);
            }
        });
    }

    /**
     * setupAutoSave - настраивает автоматическое сохранение
     */
    setupAutoSave() {
        // Сохраняем при изменении полей
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('form-input') || 
                e.target.classList.contains('form-textarea') ||
                e.target.classList.contains('form-checkbox')) {
                this.saveFormData();
            }
        });

        // Сохраняем при изменении селектов
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('form-input') && e.target.tagName === 'SELECT') {
                this.saveFormData();
            }
        });
    }

    /**
     * setupRestoreListener - настраивает слушатель для восстановления данных
     */
    setupRestoreListener() {
        document.addEventListener('restoreSavedData', (e) => {
            this.restoreSavedData(e.detail.savedData);
        });
    }

    /**
     * handleGeolocationClick - обрабатывает клик по кнопке геолокации
     * @param {HTMLElement} button - нажатая кнопка
     */
    async handleGeolocationClick(button) {
        const originalText = button.textContent;
        
        try {
            button.textContent = '🌍 Detecting...';
            button.disabled = true;

            // Запрашиваем разрешение
            const permission = await this.geolocation.requestPermission();
            
            if (permission === 'denied') {
                throw new Error('Location permission denied');
            }

            // Получаем город
            const city = await this.geolocation.getCurrentCity();
            
            // Заполняем поле location
            const locationInput = document.querySelector('input[name="location"]');
            if (locationInput) {
                locationInput.value = city;
                this.saveFormData();
                this.showToast(`Location detected: ${city}`, 'success');
            }

        } catch (error) {
            console.warn('Geolocation error:', error);
            this.showToast(error.message, 'error');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
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
     */
    saveFormData() {
        const forms = document.querySelectorAll('.registration-form');
        
        forms.forEach(form => {
            const formData = new FormData(form);
            const screenId = form.id.replace('-form', '');
            
            this.formData[screenId] = {};
            formData.forEach((value, key) => {
                this.formData[screenId][key] = value;
            });

            // Сохраняем чекбоксы
            const checkboxes = form.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                this.formData[screenId][checkbox.name] = checkbox.checked;
            });
        });

        // Сохраняем в Local Storage
        this.storage.saveData('weddingRegistration', this.formData);
        
        // Обновляем summary на последнем экране
        this.updateReviewSummary();
    }

    /**
     * restoreSavedData - восстанавливает сохранённые данные
     * @param {Object} savedData - данные для восстановления
     */
    restoreSavedData(savedData = null) {
        const dataToRestore = savedData || this.storage.getData('weddingRegistration');
        
        if (!dataToRestore) {
            return;
        }

        this.formData = dataToRestore;

        Object.keys(this.formData).forEach(screenId => {
            const form = document.getElementById(`${screenId}-form`);
            if (form) {
                const screenData = this.formData[screenId];
                Object.keys(screenData).forEach(fieldName => {
                    const input = form.querySelector(`[name="${fieldName}"]`);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = screenData[fieldName];
                        } else {
                            input.value = screenData[fieldName];
                        }
                    }
                });
            }
        });

        this.updateReviewSummary();
    }

    /**
     * updateReviewSummary - обновляет сводку на экране review
     */
    updateReviewSummary() {
        const reviewElement = document.querySelector('.review-summary');
        if (reviewElement) {
            let summaryHTML = '<div class="summary-content">';
            
            if (Object.keys(this.formData).length === 0) {
                summaryHTML += '<p class="summary-empty">No data entered yet. Your registration details will appear here as you fill out the forms.</p>';
            } else {
                Object.keys(this.formData).forEach(screenId => {
                    const screenData = this.formData[screenId];
                    Object.keys(screenData).forEach(field => {
                        if (screenData[field] && screenData[field] !== 'false') {
                            const displayValue = screenData[field] === 'true' ? 'Yes' : screenData[field];
                            summaryHTML += `<p><strong>${this.formatFieldName(field)}:</strong> ${displayValue}</p>`;
                        }
                    });
                });
            }

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
            this.saveFormData();
            this.showSuccessMessage();
            
            // Очищаем сохранённые данные после успешной отправки
            setTimeout(() => {
                this.storage.clearData('weddingRegistration');
            }, 2000);
        } else {
            this.showToast('Please fix the errors before submitting.', 'error');
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
            <p><small>Your data has been saved locally for 7 days.</small></p>
            <button class="success-button" onclick="location.reload()">Start New Registration</button>
        `;
        
        document.querySelector('.service-screens').appendChild(successMessage);
        
        // Прокручиваем к сообщению об успехе
        successMessage.scrollIntoView({ behavior: 'smooth' });

        // Показываем тост
        this.showToast('Registration submitted successfully!', 'success');
    }

    /**
     * showToast - показывает всплывающее уведомление
     * @param {string} message - текст сообщения
     * @param {string} type - тип сообщения (success, error, warning)
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this.getToastIcon(type)}</span>
            <span class="toast-message">${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Анимация появления
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }

    /**
     * getToastIcon - возвращает иконку для тоста
     * @param {string} type - тип сообщения
     * @returns {string} - HTML иконки
     */
    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}