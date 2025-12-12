import React, { useState } from 'react';
import { serviceData } from '../../services/data';
import styles from './Contact.module.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <h2 className={styles.contactTitle}>{serviceData.contact.title}</h2>
        <p className={styles.contactSubtitle}>{serviceData.contact.subtitle}</p>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <strong>Email:</strong><br />
              <a href={`mailto:${serviceData.contact.email}`}>
                {serviceData.contact.email}
              </a>
            </div>
            
            <div className={styles.contactItem}>
              <strong>Phone:</strong><br />
              <a href={`tel:${serviceData.contact.phone}`}>
                {serviceData.contact.phone}
              </a>
            </div>
            
            <div className={styles.contactItem}>
              <strong>Address:</strong><br />
              {serviceData.contact.address.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}<br />
                </React.Fragment>
              ))}
            </div>
            
            <div className={styles.contactItem}>
              <strong>Business Hours:</strong><br />
              {serviceData.contact.hours.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}<br />
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className={styles.socialInfo}>
            <h3 className={styles.socialTitle}>Follow Us</h3>
            <div className={styles.socialLinks}>
              {serviceData.contact.social.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon} {social.name}
                </a>
              ))}
            </div>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <h3>Send us a Message</h3>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={styles.formTextarea}
                required
              />
            </div>
            <button type="submit" className={styles.contactSubmit}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;