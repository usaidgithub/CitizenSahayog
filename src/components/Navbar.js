import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) {
        console.log("Unable to logout");
      }
      navigate('/');
    } catch (error) {
      console.log("An error occurred");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">Citizen Sahayog</Link>
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/home" className="nav-links" onClick={toggleMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/myposts" className="nav-links" onClick={toggleMenu}>My Posts</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-links" onClick={toggleMenu}>Profile</Link>
          </li>
          <li className="nav-item">
            <span style={{ cursor: 'pointer' }} onClick={handleLogout} className="nav-links">Logout</span>
          </li>
        </ul>
      </div>
    </nav>
  );
}
