import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import NavItem from './NavItem';
import CustomModal from './CustomModal';
import CustomButton from './CustomButton';
import MessageBanner from './MessageBanner';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setLogoutMessage('Sesión cerrada correctamente');
    logout();
    setTimeout(() => {
      setLogoutMessage('');
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'var(--color-green)',
    color: '#fff',
    fontFamily: 'var(--font-family-base)',
    fontSize: '15px',
    padding: '10px 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxHeight: '45px',
  };

  const leftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    textDecoration: 'none',
    color: 'inherit',
    marginLeft: '40px',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
  };

  const rightWrapperStyle = {
    width: '75%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const rightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isLoggedIn ? '60px' : '130px',
    marginRight: isLoggedIn ? '30px' : '60px',
  };

  return (
    <>
      <div style={navStyle}>
        <Link
          to="/"
          style={leftStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Logo variant="footysage_white" width="60px" height="60px" />
          <span style={{ fontWeight: 'bold', fontSize: '23px' }}>FootySage</span>
        </Link>

        <div style={rightWrapperStyle}>
          <div style={rightStyle}>
            {isLoggedIn ? (
              <>
                <NavItem to="/home" active>Inicio</NavItem>
                <NavItem to="/check">Análisis competiciones</NavItem>
                <NavItem to="/check">Análisis partidos en tiempo real</NavItem>
                <NavItem to="/check">Próximos partidos</NavItem>
                <NavItem to="/check">{user?.username}</NavItem>
                <NavItem to="#" onClick={handleLogoutClick}>Cerrar sesión</NavItem>
              </>
            ) : (
              <>
                <NavItem to="/check">Próximos partidos</NavItem>
                <NavItem to="/login">Iniciar sesión</NavItem>
                <NavItem to="/register">Registrarse</NavItem>
              </>
            )}
          </div>
        </div>
      </div>
      
      {logoutMessage && (
        <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'center' }}>
          <MessageBanner message={logoutMessage} type="success" />
        </div>
      )}

      <CustomModal isOpen={showLogoutModal} onClose={cancelLogout}>
        <h3 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px', textAlign: 'center' }}>
          ¿Estás seguro de que quieres cerrar sesión?
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <CustomButton
            title="Cancelar"
            onPress={cancelLogout}
            color='#bbb'
            textStyle={{ color: '#333' }}
            buttonStyle={{ borderRadius: '8px' }}
          />
          <CustomButton
            title="Sí, cerrar sesión"
            onPress={confirmLogout}
            color='var(--color-green)'
            buttonStyle={{ borderRadius: '8px' }}
          />
        </div>
      </CustomModal>
    </>
  );
};


export default Navbar;
