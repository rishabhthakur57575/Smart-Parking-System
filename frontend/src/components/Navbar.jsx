import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">P</span>
          <span className="brand-text">SmartPark</span>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        {/* Navigation links */}
        <nav className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/layout"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMenu}
          >
            Parking Layout
          </NavLink>
          <NavLink
            to="/exit"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMenu}
          >
            Exit Parking
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMenu}
          >
            History
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            onClick={closeMenu}
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
