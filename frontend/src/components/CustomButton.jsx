import React, { useState } from 'react';
import PropTypes from 'prop-types';


const CustomButton = ({ title, onPress, color = 'var(--color-green)', buttonStyle = {}, textStyle = {}, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseButtonStyle = {
    backgroundColor: disabled ? '#ccc' : color,
    padding: '10px 20px',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'var(--font-family-base)',
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
    ...buttonStyle,
  };

  const baseTextStyle = {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '15px',
    fontFamily: 'var(--font-family-base)',
    ...textStyle,
  };

  return (
    <button
      style={baseButtonStyle}
      onClick={onPress}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={baseTextStyle}>{title}</span>
    </button>
  );
};

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  disabled: PropTypes.bool,
};


export default CustomButton;
