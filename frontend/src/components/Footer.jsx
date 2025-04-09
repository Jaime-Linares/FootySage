import React, { useState } from 'react';
import Logo from './Logo';
import CustomModal from './CustomModal';
import githubLogo from '../assets/images/github.png';
import usLogo from '../assets/images/us.png';

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);

  const footerStyle = {
    backgroundColor: 'var(--color-green)',
    color: '#fff',
    fontFamily: 'var(--font-family-base)',
    fontSize: '14px',
    padding: '18px 0',
    width: '100%',
  };

  const contentWrapper = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
  };

  const leftStyle = {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const centerStyle = {
    fontSize: '16px',
    textAlign: 'center',
    flex: 1,
    minWidth: '200px',
  };

  const rightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'underline',
    cursor: 'pointer',
    margin: '0 5px',
  };

  const iconStyle = {
    backgroundColor: '#fff',
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    cursor: 'pointer',
  };

  return (
    <>
      <div style={footerStyle}>
        <div style={contentWrapper}>
          <div style={leftStyle}>
            <a href="https://statsbomb.com/es/" target="_blank" rel="noopener noreferrer">
                <Logo variant="statsbomb_red" width="200px" height = 'auto' />
            </a>
          </div>

          <div style={centerStyle}>
            © 2025 FootySage – Todos los derechos reservados <br />
            <span style={linkStyle} onClick={() => setShowTerms(true)}>
              Términos y condiciones de uso
            </span>
            <span style={{ margin: '0 5px' }}>·</span>
            <a href="mailto:info.footysage@gmail.com" style={linkStyle}>
              info.footysage@gmail.com
            </a>
          </div>

          <div style={rightStyle}>
            <a href="https://github.com/Jaime-Linares/FootySage" target="_blank" rel="noopener noreferrer">
                <img src={githubLogo} alt="GitHub" style={iconStyle} />
            </a>
            <a href="https://www.us.es/" target="_blank" rel="noopener noreferrer">
                <img src={usLogo} alt="Universidad de Sevilla" style={iconStyle} />
            </a>
          </div>
        </div>
      </div>

      <CustomModal isOpen={showTerms} onClose={() => setShowTerms(false)}>
        <h2 style={{ marginTop: 0 }}>Términos y condiciones</h2>
        <p>
          Aquí puedes colocar el contenido legal, condiciones del servicio, privacidad, etc.
        </p>
      </CustomModal>
    </>
  );
};


export default Footer;
