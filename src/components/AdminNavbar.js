import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
   
      navigate('/');
    } 

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
            <Link to="/adminhome" className="nav-links" onClick={toggleMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/analysis" className="nav-links" onClick={toggleMenu}>Analysis</Link>
          </li>
          <li className="nav-item">
            <Link to="/reports" className="nav-links" onClick={toggleMenu}>Reports</Link>
          </li>
          <li className="nav-item">
            <Link to="/acknowledged_posts" className="nav-links" onClick={toggleMenu}>Acknowledged Posts</Link>
          </li>
          <li className="nav-item">
            <span style={{ cursor: 'pointer' }} onClick={handleLogout} className="nav-links">Logout</span>
          </li>
        </ul>
      </div>
    </nav>
  );
}
