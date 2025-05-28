import React from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import fetch_navbar_logo from "../../Assets/fetch_navbar_logo.jpeg";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <nav className="navbar">
        <img src={fetch_navbar_logo} alt="Fetch Logo" className="navbar-logo" />

        <button onClick={handleLogout} className="logout-button">Logout</button>
    </nav>
  );
}

export default NavBar;
