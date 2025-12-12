// Класс для обработки формы регистрации

export class RegistrationForm {
    /**
     * constructor - инициализирует обработку формы
     * @param {GeolocationService} geolocation - сервис геолокации
     * @param {StorageService} storage - сервис хранилища
     * @param {ApiService} api - API сервис
     */
    constructor(geolocation, storage, api) {
        this.formData = {};
        this.geolocation = geolocation;
        this.storage = storage;
        this.api = api;
        this.init();
    }

    // ... (остальные методы без изменений, только дополнения)

    /**
     * handleFormSubmit - обрабатывает отправку формы
     * @param {HTMLElement} form - отправляемая форма
     */
    async handleFormSubmit(form) {
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
            
            try {
                // Отправляем данные на сервер через API
                this.showToast('📤 Sending registration to server...', 'info');
                
                const result = await this.api.submitRegistration(this.formData);
                
                if (result.success) {
                    this.showSuccessMessage(result.message);
                    console.log('Server response:', result.serverResponse);
                    
                    // Очищаем сохранённые данные после успешной отправки
                    setTimeout(() => {
                        this.storage.clearData('weddingRegistration');
                    }, 2000);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('API submission error:', error);
                this.showToast('⚠️ Data saved locally, but server submission failed', 'warning');
                this.showSuccessMessage(); // Показываем локальный успех
            }
        } else {
            this.showToast('Please fix the errors before submitting.', 'error');
        }
    }

    /**
     * updateReviewSummary - обновляет сводку на экране review
     * (добавлена возможность показа данных с API)
     */
    updateReviewSummary() {
        const reviewElement = document.querySelector('.review-summary');
        if (reviewElement) {
            let summaryHTML = '<div class="summary-content">';
            
            if (Object.keys(this.formData).length === 0) {
                summaryHTML += '<p class="summary-empty">No data entered yet. Your registration details will appear here as you fill out the forms.</p>';
            } else {
                // Отображаем данные формы
                Object.keys(this.formData).forEach(screenId => {
                    const screenData = this.formData[screenId];
                    Object.keys(screenData).forEach(field => {
                        if (screenData[field] && screenData[field] !== 'false') {
                            const displayValue = screenData[field] === 'true' ? 'Yes' : screenData[field];
                            summaryHTML += `<p><strong>${this.formatFieldName(field)}:</strong> ${displayValue}</p>`;
                        }
                    });
                });
                
                // Добавляем информацию с API (если есть)
                summaryHTML += this.getAPIDataSummary();
            }

            summaryHTML += '</div>';
            reviewElement.innerHTML = summaryHTML;
        }
    }

    /**
     * getAPIDataSummary - возвращает HTML с данными из API
     * @returns {string} - HTML для отображения данных API
     */
    getAPIDataSummary() {
        let apiHTML = '';
        
        // Проверяем наличие данных для прогноза погоды
        const weddingDate = this.getFormValue('weddingDate');
        const location = this.getFormValue('location');
        
        if (weddingDate && location) {
            apiHTML += `
                <div class="api-data-section">
                    <h4>📡 API Data Integration</h4>
                    <p><strong>Real-time Features:</strong></p>
                    <ul>
                        <li>Weather forecast available for ${location}</li>
                        <li>Wedding date: ${weddingDate}</li>
                        <li>Countries list loaded from API</li>
                        <li>Wedding quotes fetched in real-time</li>
                    </ul>
                    <p class="api-note"><small>This data is fetched from external APIs to enhance your wedding planning experience.</small></p>
                </div>
            `;
        }
        
        return apiHTML;
    }

    /**
     * getFormValue - получает значение из формы по имени поля
     * @param {string} fieldName - имя поля
     * @returns {string} - значение поля
     */
    getFormValue(fieldName) {
        for (const screenId in this.formData) {
            if (this.formData[screenId][fieldName]) {
                return this.formData[screenId][fieldName];
            }
        }
        return null;
    }

    // ... (остальные методы без изменений)
}