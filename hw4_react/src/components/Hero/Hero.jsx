import React from 'react';
import { serviceData } from '../../services/data';
import styles from './Hero.module.css';

function Hero() {
  const scrollToRegistration = () => {
    document.querySelector('#screens').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{serviceData.service.name.toUpperCase()}</h1>
        <p className={styles.heroSubtitle}>{serviceData.service.description}</p>
        <p className={styles.heroTagline}>{serviceData.service.tagline}</p>
        <button className={styles.heroCta} onClick={scrollToRegistration}>
          Start Registration
        </button>
      </div>
    </section>
  );
}

export default Hero;