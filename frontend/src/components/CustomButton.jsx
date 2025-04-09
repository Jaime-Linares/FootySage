import React from 'react';
import PropTypes from 'prop-types';


const Button = ({ title, onPress, color = 'var(--color-green)', buttonStyle = {}, textStyle = {}, disabled = false }) => {
  const baseButtonStyle = {
    backgroundColor: disabled ? '#ccc' : color,
    padding: '10px 20px',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.3s ease-in-out',
    fontFamily: 'var(--font-family-base)',
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
    <button style={baseButtonStyle} onClick={onPress} disabled={disabled}>
      <span style={baseTextStyle}>{title}</span>
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  disabled: PropTypes.bool,
};


export default Button;
