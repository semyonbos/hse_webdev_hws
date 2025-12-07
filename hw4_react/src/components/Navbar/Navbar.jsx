import React, { useState } from 'react';
import { serviceData } from '../../services/data';
import styles from './Navbar.module.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <a href="#home" className={styles.navLogo}>WRP</a>
        
        <ul className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
          {serviceData.navigation.map((item) => (
            <li key={item.label}>
              <a 
                href={item.href} 
                className={styles.navLink}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div 
          className={`${styles.mobileMenuToggle} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;