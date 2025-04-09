import React, { useState } from 'react';
import PropTypes from 'prop-types';


const FootballLogo = ({ src, alt = 'football logo', width = '50px', height = '50px', style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    width,
    height,
    objectFit: 'contain',
    transition: 'transform 0.2s ease-in-out',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

FootballLogo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
};


export default FootballLogo;
