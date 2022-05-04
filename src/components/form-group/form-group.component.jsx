import React, { useContext } from "react";
import { ThemeContext } from "../../App";
import "./form-group.styles.scss";

const FormGroup = ({ handleChange, ...otherProps }) => {
  const { type, label } = otherProps;

  const { darkMode } = useContext(ThemeContext);

  return (
    <div className="form-group">
      {label && <label htmlFor={type}>{`${label}:`}</label>}
      <input
        className={`form-input ${darkMode ? "dark" : ""}`}
        onChange={handleChange}
        {...otherProps}
      />
    </div>
  );
};

export default FormGroup;
