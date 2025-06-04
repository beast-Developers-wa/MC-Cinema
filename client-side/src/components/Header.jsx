import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faCircleUser
} from '@fortawesome/free-solid-svg-icons';
import '../styles/header.css';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">MC CINEMA</div>
      
      <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>               {/* Use Link */}
        <Link to="/product">Products</Link>   {/* Use Link */}
        <a href="#contact">Contact</a>
        <a href="#account"><FontAwesomeIcon icon={faCircleUser} /></a>
      </nav>

      <div className="menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
      </div>
    </header>
  );
};

export default Header;
