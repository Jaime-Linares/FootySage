import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import PrivateRoute from './components/PrivateRoute';
import GuestRoute from './components/GuestRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './views/LandingPage/LandingPage';
import Home from './views/Home/Home';
import Check from './views/Check/Check';
import Login from './views/User/Login/Login';
import Register from './views/User/Register/Register';
import UpcomingMatches from './views/Matches/UpcomingMatches/UpcomingMatches';
import SendMailRecoverPassword from './views/User/RecoverPassword/SendMailRecoverPassword';
import Profile from './views/User/Profile/Profile';
import ChangePassword from './views/User/Profile/ChangePassword';
import MatchSelector from './views/Matches/MatchSelector/MatchSelector';
import MatchSimulation from './views/Matches/SimulateMatch/MatchSimulation';
import CompetitionsAnalysis from './views/CompetitionsAnalysis/CompetitionsAnalysis';
import MatchAnalysis from './views/Matches/MatchAnalysis/MatchAnalysis';


const App = () => {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div style={{ flex: 1, paddingTop: '60px' }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/upcoming_matches" element={<UpcomingMatches />} />
                {/* LOGUEADO */}
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/change_password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
                <Route path="/match_selector" element={<PrivateRoute><MatchSelector /></PrivateRoute>} />
                <Route path="/match_simulation/:league/:match_id" element={<PrivateRoute><MatchSimulation /></PrivateRoute>} />
                <Route path="/competitions_analysis" element={<PrivateRoute><CompetitionsAnalysis /></PrivateRoute>} />
                <Route path="/match_analysis/:league/:match_id" element={<PrivateRoute><MatchAnalysis /></PrivateRoute>} />
                <Route path="/check" element={<PrivateRoute><Check /></PrivateRoute>} />
                {/* NO LOGUEADO */}
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/recover_password" element={<GuestRoute><SendMailRecoverPassword /></GuestRoute>} />
              </Routes>
            </div>

            <Footer />
          </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
};


export default App;
