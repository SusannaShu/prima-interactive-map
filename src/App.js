import React from 'react';
import MapComponent from './components/Map';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Prima-CB Interactive Locations</h1>
        <p>Explore our global presence through the interactive map below</p>
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