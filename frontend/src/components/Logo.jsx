import React, { useState } from 'react';
import PropTypes from 'prop-types';
import footysageWhite from '../assets/images/footysage_white.png';
import footysageBlack from '../assets/images/footysage_black.png';
import statsbombRed from '../assets/images/statsbomb_red.png';
import statsbombWhite from '../assets/images/statsbomb_white.png';
import statsbombBlack from '../assets/images/statsbomb_black.png';


const logoMap = {
  footysage_white: footysageWhite,
  footysage_black: footysageBlack,
  statsbomb_red: statsbombRed,
  statsbomb_white: statsbombWhite,
  statsbomb_black: statsbombBlack,
};

const Logo = ({ variant, width = '100px', height = 'auto', style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);
  const logoSrc = logoMap[variant] || footysageBlack;

  const baseStyle = {
    width,
    height,
    objectFit: 'contain',
    transition: 'transform 0.2s ease-in-out',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    ...style,
  };

  return (
    <img
      src={logoSrc}
      alt={`${variant} logo`}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf([
    'footysage_white',
    'footysage_black',
    'statsbomb_red',
    'statsbomb_white',
    'statsbomb_black',
  ]).isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
};


export default Logo;
