import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import { ThemeContext } from "../../App";
import "./header.styles.scss";

const Header = (user) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className="header">
      <nav>
        <Link to="/" className="nav-link logo-icon">
          <p className="title">Chatty</p>
        </Link>
        <form className="switch-slider">
          <Switch
            onChange={toggleDarkMode}
            checked={darkMode}
            checkedIcon={false}
            uncheckedIcon={false}
            offColor={"#e4e6eb"}
            onColor={"#3a3b3c"}
          />
          <label>Dark Mode</label>
        </form>
        <Link
          to={user.user ? "/account" : "/"}
          className="nav-link account-link"
        >
          <FontAwesomeIcon icon={faUser} size="2x" />
        </Link>
      </nav>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(Header);
