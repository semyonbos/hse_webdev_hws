/**
 * StorageService - сервис для работы с локальным хранилищем
 * Предоставляет методы для сохранения, загрузки и управления данными
 */
export class StorageService {
    constructor() {
        this.isSupported = this.checkStorageSupport();
        this.storageKeyPrefix = 'weddingRegistry_';
    }

    /**
     * checkStorageSupport - проверяет поддержку Local Storage
     * @returns {boolean} - true если поддерживается
     */
    checkStorageSupport() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('Local Storage is not supported:', e);
            return false;
        }
    }

    /**
     * saveData - сохраняет данные в Local Storage
     * @param {string} key - ключ для сохранения
     * @param {any} data - данные для сохранения
     * @returns {boolean} - успех операции
     */
    saveData(key, data) {
        if (!this.isSupported) {
            console.warn('Local Storage not supported, data not saved');
            return false;
        }

        try {
            const storageKey = this.storageKeyPrefix + key;
            const dataToStore = {
                data: data,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(storageKey, JSON.stringify(dataToStore));
            return true;
        } catch (error) {
            console.error('Error saving to Local Storage:', error);
            this.handleStorageError(error);
            return false;
        }
    }

    /**
     * getData - загружает данные из Local Storage
     * @param {string} key - ключ данных
     * @returns {any} - загруженные данные или null
     */
    getData(key) {
        if (!this.isSupported) {
            return null;
        }

        try {
            const storageKey = this.storageKeyPrefix + key;
            const stored = localStorage.getItem(storageKey);
            
            if (!stored) {
                return null;
            }

            const parsed = JSON.parse(stored);
            
            // Проверяем актуальность данных (старше 7 дней)
            if (this.isDataExpired(parsed.timestamp, 7)) {
                this.clearData(key);
                return null;
            }

            return parsed.data;
        } catch (error) {
            console.error('Error reading from Local Storage:', error);
            return null;
        }
    }

    /**
     * clearData - удаляет данные из Local Storage
     * @param {string} key - ключ данных для удаления
     * @returns {boolean} - успех операции
     */
    clearData(key) {
        if (!this.isSupported) {
            return false;
        }

        try {
            const storageKey = this.storageKeyPrefix + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing data from Local Storage:', error);
            return false;
        }
    }

    /**
     * clearAllAppData - удаляет все данные приложения
     * @returns {boolean} - успех операции
     */
    clearAllAppData() {
        if (!this.isSupported) {
            return false;
        }

        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.storageKeyPrefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing all app data:', error);
            return false;
        }
    }

    /**
     * isDataExpired - проверяет истек ли срок данных
     * @param {string} timestamp - метка времени
     * @param {number} days - количество дней для истечения
     * @returns {boolean} - true если данные истекли
     */
    isDataExpired(timestamp, days = 7) {
        const storedDate = new Date(timestamp);
        const expirationDate = new Date(storedDate.getTime() + (days * 24 * 60 * 60 * 1000));
        return new Date() > expirationDate;
    }

    /**
     * getStorageInfo - возвращает информацию о хранилище
     * @returns {Object} - информация о хранилище
     */
    getStorageInfo() {
        if (!this.isSupported) {
            return { supported: false };
        }

        try {
            let appDataSize = 0;
            let appDataCount = 0;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.storageKeyPrefix)) {
                    appDataCount++;
                    appDataSize += localStorage.getItem(key).length;
                }
            }

            return {
                supported: true,
                appDataCount,
                appDataSize: this.formatBytes(appDataSize),
                totalUsed: this.formatBytes(JSON.stringify(localStorage).length)
            };
        } catch (error) {
            return { supported: false, error: error.message };
        }
    }

    /**
     * formatBytes - форматирует байты в читаемый вид
     * @param {number} bytes - количество байт
     * @param {number} decimals - количество знаков после запятой
     * @returns {string} - отформатированная строка
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * handleStorageError - обрабатывает ошибки хранилища
     * @param {Error} error - объект ошибки
     */
    handleStorageError(error) {
        // Очищаем хранилище при ошибке переполнения
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            console.warn('Storage quota exceeded, clearing old data...');
            this.clearAllAppData();
        }
    }
}