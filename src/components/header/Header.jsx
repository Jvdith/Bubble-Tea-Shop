// src/components/header/Header.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import bubbleIcon from '../../assets/bubble-icon.png';
import Login from '../login/Login';
import ThemeToggle from '../theme-toggle/ThemeToggle';

const Header = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/home', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/news', label: 'News' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/' || location.pathname === '/home';
    return location.pathname === path;
  };

  return (
    <header className="main-header">
      <div className="header-inner">
        <Link to="/home" className="logo-container" onClick={() => setMenuOpen(false)}>
          <span
            className="logo-icon"
            style={{ backgroundImage: `url(${bubbleIcon})` }}
            aria-hidden
          ></span>
          <span className="logo-text">Bubbly</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
          <span className="menu-toggle-bar" />
        </button>

        <nav className={`nav-menu ${menuOpen ? 'nav-menu-open' : ''}`}>
          {navItems.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-item ${isActive(to) ? 'nav-item-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="header-login">
            <Login />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;