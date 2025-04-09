import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


const CustomTextInput = ({ containerStyle = {}, style = {}, placeholder = '', showPasswordToggle = false }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = {
    backgroundColor: 'var(--color-grey-light)',
    border: isFocused ? '2px solid var(--color-green)' : '2px solid transparent',
    borderRadius: 'var(--border-radius)',
    padding: '10px',
    paddingRight: showPasswordToggle ? '40px' : '10px',
    fontSize: 'var(--font-size-base)',
    fontFamily: 'var(--font-family-base)',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.2s ease-in-out',
    ...style,
  };

  const containerBaseStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '90%',
    ...containerStyle,
  };

  const iconWrapperStyle = {
    position: 'absolute',
    right: '10px',
    padding: '5px',
    borderRadius: '50%',
    backgroundColor: isPasswordVisible ? 'var(--color-green)' : 'transparent',
    transition: 'background-color 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  return (
    <div style={containerBaseStyle}>
      <input
        type={showPasswordToggle && !isPasswordVisible ? 'password' : 'text'}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {showPasswordToggle && (
        <div
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          style={iconWrapperStyle}
        >
          {isPasswordVisible ? (
            <AiOutlineEyeInvisible size={20} color="#fff" />
          ) : (
            <AiOutlineEye size={20} color="#333" />
          )}
        </div>
      )}
    </div>
  );
};

CustomTextInput.propTypes = {
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  showPasswordToggle: PropTypes.bool,
};


export default CustomTextInput;
