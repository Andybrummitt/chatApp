import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./header.styles.scss";

const Header = (user) => {
  return (
    <div className="header">
      <nav>
        <Link to="/" className="nav-link logo-icon">
          Logo
        </Link>
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
