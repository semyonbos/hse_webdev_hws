import React from 'react';
import { serviceData } from '../../services/data';
import styles from './Features.module.css';

function Features() {
  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        <h2 className={styles.featuresTitle}>{serviceData.features.title}</h2>
        <p className={styles.featuresSubtitle}>{serviceData.features.subtitle}</p>
        
        <div className={styles.featuresGrid}>
          {serviceData.features.items.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;