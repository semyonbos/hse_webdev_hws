import React from 'react';
import styles from './Author.module.css';

function Author() {
  return (
    <section className={styles.author}>
      <p className={styles.authorText}>Wedding Registry Service by Semyon Bosonogov, 2025</p>
      <p className={styles.authorText}>AI tools were used to assist in the development of this service</p>
    </section>
  );
}

export default Author;