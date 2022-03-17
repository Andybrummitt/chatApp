import React from "react";
import "./button.styles.scss";

const Button = ({ children, ...otherProps }) => {
  const { google } = { ...otherProps };
  return (
    <button className={`btn ${google ? "google-btn" : ""}`} {...otherProps}>
      {children}
    </button>
  );
};

export default Button;
