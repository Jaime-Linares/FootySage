import React, { useState } from 'react';
import PropTypes from 'prop-types';


const CustomModal = ({ isOpen, onClose, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  };

  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    fontFamily: 'var(--font-family-base)',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    transition: 'transform 0.2s ease-in-out',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '12px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    lineHeight: '1',
    color: '#999',
    transition: 'color 0.2s',
  };

  return (
    <div style={overlayStyle}>
      <div
        style={modalStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};


export default CustomModal;
