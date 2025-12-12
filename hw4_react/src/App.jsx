import React, { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import ServiceScreens from './components/ServiceScreens/ServiceScreens';
import Contact from './components/Contact/Contact';
import Author from './components/Author/Author';

function App() {
  useEffect(() => {
    // smooth scroll для якорных ссылок
    const handleAnchorClick = (e) => {
      const target = e.target;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href').substring(1);
        const element = document.getElementById(id);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <ServiceScreens />
      <Contact />
      <Author />
    </>
  );
}

export default App;