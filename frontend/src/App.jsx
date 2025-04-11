import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Check from './views/Check/Check';
import LandingPage from './views/LandingPage/LandingPage';
import Home from './views/Home/Home';
import Navbar from './components/Navbar';
import Login from './views/User/Login/Login';
import Register from './views/User/Register/Register';
import SendMailRecoverPassword from './views/User/RecoverPassword/SendMailRecoverPassword';


const App = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar isLoggedIn={false} username="jaime196" />
        <div style={{ flex: 1, paddingTop: '60px' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/check" element={<Check />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover_password" element={<SendMailRecoverPassword />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};


export default App;
