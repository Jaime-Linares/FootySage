import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


const NavItem = ({ to, children, onClick, activePaths }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const currentPath = location.pathname;
  const paths = Array.isArray(activePaths) && activePaths.length > 0 ? activePaths : [to];

  const isActive = paths.some(path => {
    if (path.includes(':')) {
      const regex = new RegExp(
        '^' + path
          .replace(/:[^/]+/g, '[^/]+')
          .replace(/\//g, '\\/') + '$'
      );
      return regex.test(currentPath);
    } else {
      return path === currentPath;
    }
  });

  const baseStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 500,
    fontSize: '18px',
    textDecorationLine: isActive ? 'underline' : isHovered ? 'underline' : 'none',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
};


export default NavItem;
