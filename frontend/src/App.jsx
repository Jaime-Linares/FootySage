import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Check from './views/Check/Check';
import LandingPage from './views/LandingPage/LandingPage';
import Home from './views/Home/Home';


const App = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/check" element={<Check />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};


export default App;
