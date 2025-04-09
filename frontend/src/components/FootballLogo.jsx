import React from 'react';
import PropTypes from 'prop-types';


const FootballLogo = ({ src, alt = 'football logo', width = '50px', height = '50px', style = {} }) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        objectFit: 'contain',
        ...style,
      }}
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
