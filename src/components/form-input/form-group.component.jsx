import React from "react";

import './form-group.styles.scss'

const FormGroup = ({ handleChange, ...otherProps }) => {

  const { type, label } = otherProps;

  return (
    <div className="form-group">
        <label htmlFor={type}>{`${label}:`}</label>
        <input className="form-input" onChange={handleChange} {...otherProps} maxlength="35"/>    
    </div>
  )
};

export default FormGroup;
