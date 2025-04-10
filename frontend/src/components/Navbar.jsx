import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from './Logo';


const Navbar = ({ isLoggedIn = false, username = '' }) => {
  const navStyle = {
    backgroundColor: 'var(--color-green)',
    color: '#fff',
    fontFamily: 'var(--font-family-base)',
    fontSize: '15px',
    padding: '10px 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const leftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: 'inherit',
    marginLeft: '30px',
  };

  const rightStyle = {
    display: 'flex',
    gap: '60px',
    alignItems: 'center',
    marginRight: '30px',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '18px',
  };

  const activeLinkStyle = {
    ...linkStyle,
    textDecoration: 'underline',
    fontWeight: 'bold',
  };

  return (
    <div style={navStyle}>
      <Link to="/" style={leftStyle}>
        <Logo variant="footysage_white" width="60px" height="60px" />
        <span style={{ fontWeight: 'bold', fontSize: '23px' }}>FootySage</span>
      </Link>

      <div style={rightStyle}>
        {isLoggedIn ? (
          <>
            <Link to="/home" style={activeLinkStyle}>Inicio</Link>
            <Link to="/check" style={linkStyle}>Análisis competiciones</Link>
            <Link to="/check" style={linkStyle}>Análisis partidos en tiempo real</Link>
            <Link to="/check" style={linkStyle}>Próximos partidos</Link>
            <Link to="/check" style={linkStyle}>{username}</Link>
          </>
        ) : (
          <>
            <Link to="/check" style={linkStyle}>Próximos partidos</Link>
            <Link to="/check" style={linkStyle}>Inicia sesión</Link>
            <Link to="/check" style={linkStyle}>Regístrate</Link>
          </>
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
};

export default Navbar;
