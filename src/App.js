import React, { useState } from 'react';
import MapComponent from './components/Map';
import './App.css';

function App() {
  const [language, setLanguage] = useState('en'); // Default language is English

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    // Here you would implement actual language switching functionality
  };

  return (
    <div className="app">
      <header className="app-header">
      {/* <img src="/logo.png" alt="prima cb logo" style={{ height: '40px', marginRight: '10px' }} /> */}
        <h1>PRIMA Interactive Map</h1>
        <div className="language-selector">
          <button 
            className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
            onClick={() => toggleLanguage('fr')}
          >
            Fr
          </button>
          <span className="lang-separator">|</span>
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => toggleLanguage('en')}
          >
            En
          </button>
        </div>
      </header>
      
      <main>
        <MapComponent />
      </main>
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Prima-CB. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App; 