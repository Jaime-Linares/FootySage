import React from 'react';
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
  const logoSrc = logoMap[variant] || footysageBlack;

  return (
    <img
      src={logoSrc}
      alt={`${variant} logo`}
      style={{
        width,
        height,
        objectFit: 'contain',
        ...style,
      }}
    />
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['footysage_white', 'footysage_black', 'statsbomb_red', 'statsbomb_white', 'statsbomb_black']).isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.object,
};


export default Logo;
