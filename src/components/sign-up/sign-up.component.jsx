import React, { useState } from "react";
import FormGroup from "../form-input/form-group.component";
import "./sign-up.styles.scss";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // check password strength
    // check display name availability
    // check if user in db
    // if all checks good then update user to auth and store in db
  };

  const handleChange = (e) => {
    const { name: key, value } = e.target;
    setUserInfo({
      ...userInfo,
      [key]: value,
    });
  };

  return (
    <div className="sign-up">
      <h2 className="title">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup
          name="email"
          type="email"
          label="email"
          value={userInfo.email}
          handleChange={handleChange}
        />
        <FormGroup
          name="password"
          type="password"
          label="password"
          value={userInfo.password}
          handleChange={handleChange}
        />
        <FormGroup
          name="confirmPassword"
          type="password"
          label="confirm password"
          value={userInfo.confirmPassword}
          handleChange={handleChange}
        />
        <FormGroup
          name="displayName"
          type="displayName"
          label="display name"
          value={userInfo.displayName}
          handleChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
