import React, { useState, useEffect } from 'react';
import { serviceData } from '../../services/data';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ServiceScreen from './ServiceScreen';
import styles from './ServiceScreens.module.css';

function ServiceScreens() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [formData, setFormData] = useLocalStorage('weddingRegistration', {});
  const [showRestoreNotification, setShowRestoreNotification] = useState(false);
  const [toast, setToast] = useState(null);
  const geolocation = useGeolocation();

  useEffect(() => {
    const savedData = Object.keys(formData).length > 0;
    if (savedData && !sessionStorage.getItem('notificationShown')) {
      setShowRestoreNotification(true);
      sessionStorage.setItem('notificationShown', 'true');
    }
  }, [formData]);

  const handleNext = () => {
    if (currentScreen < serviceData.screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleFormChange = (screenId, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [screenId]: {
        ...prev[screenId],
        [fieldName]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    const currentScreenData = serviceData.screens[currentScreen];
    const requiredFields = currentScreenData.fields.filter(field => field.required);
    
    let isValid = true;
    requiredFields.forEach(field => {
      if (!formData[currentScreenData.id]?.[field.name]) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToastMessage('Please fill all required fields', 'error');
      return;
    }

    if (currentScreen === serviceData.screens.length - 1) {
      showToastMessage('Registration complete!', 'success');
      setTimeout(() => {
        setFormData({});
        setCurrentScreen(0);
        sessionStorage.removeItem('notificationShown');
      }, 2000);
    } else {
      handleNext();
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const restoreData = () => {
    setShowRestoreNotification(false);
    showToastMessage('Data restored successfully!', 'success');
  };

  const dismissNotification = () => {
    setShowRestoreNotification(false);
    setFormData({});
  };

  const handleGeolocation = async () => {
    try {
      const city = await geolocation.getCurrentCity();
      handleFormChange('wedding-details', 'location', city);
      showToastMessage(`Location detected: ${city}`, 'success');
    } catch (error) {
      showToastMessage(error.message, 'error');
    }
  };

  return (
    <section id="screens" className={styles.serviceScreens}>
      {showRestoreNotification && (
        <div className={styles.restoreNotification}>
          <div className={styles.notificationContent}>
            <p>📋 We found your saved registration data. Would you like to restore it?</p>
            <div className={styles.notificationButtons}>
              <button className={styles.btnRestore} onClick={restoreData}>
                Restore Data
              </button>
              <button className={styles.btnDismiss} onClick={dismissNotification}>
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {serviceData.screens.map((screen, index) => (
          <ServiceScreen
            key={screen.id}
            screen={screen}
            isActive={currentScreen === index}
            formData={formData[screen.id] || {}}
            onChange={handleFormChange}
            onGeolocation={handleGeolocation}
            geolocation={geolocation}
          />
        ))}

        <div className={styles.screenNavigation}>
          {currentScreen > 0 && (
            <button type="button" className={styles.prevButton} onClick={handlePrev}>
              Previous
            </button>
          )}
          
          {currentScreen < serviceData.screens.length - 1 ? (
            <button type="button" className={styles.nextButton} onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="submit" className={styles.submitButton}>
              Complete Registration
            </button>
          )}
        </div>
      </form>

      {toast && (
        <div className={`${styles.toast} ${styles[`toast${toast.type}`]}`}>
          <span className={styles.toastIcon}>
            {toast.type === 'success' ? 'yes' : 'no'}
          </span>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      )}
    </section>
  );
}

export default ServiceScreens;