import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import NavItem from './NavItem';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

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
    gap: isLoggedIn ? '70px' : '130px',
    marginRight: isLoggedIn ? '40px' : '60px',
  };

  return (
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
              <NavItem to="#" onClick={(e) => { e.preventDefault(); logout(); }}>Cerrar sesión</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/check">Próximos partidos</NavItem>
              <NavItem to="/login">Inicia sesión</NavItem>
              <NavItem to="/register">Regístrate</NavItem>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default Navbar;
