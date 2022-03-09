import React from "react";
import { Link } from "react-router-dom";
import "./header.styles.scss";


const Header = () => {
  return (
    <div className="header">
      <nav>
        <Link to="/" className="nav-link logo-icon">
          Logo
        </Link>
        <Link to="/" className="nav-link chat-link">
          Chat
        </Link>
        <Link to="/" className="nav-link find-friends-link">
          Find Friends
        </Link>
        <Link to="/signin" className="nav-link account-link">
          Account
        </Link>
      </nav>
    </div>
  );
};

export default Header;
