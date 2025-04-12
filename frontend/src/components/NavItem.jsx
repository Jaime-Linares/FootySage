import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const NavItem = ({ to, children, active = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: active ? 'bold' : 500,
    fontSize: '18px',
    textDecorationLine: active ? 'underline' : isHovered ? 'underline' : 'none',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  };

  return (
    <Link
      to={to}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};


export default NavItem;
