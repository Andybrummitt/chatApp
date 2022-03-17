import React, { useState } from "react";
import { handleSignIn } from "../../firebase/firebase-utils/firebase.auth.utils";
import { logInUser } from "../../redux/user/user.actions";
import Button from "../button/button.component";
import FormGroup from "../form-group/form-group.component";
import "./sign-in.styles.scss";

const SignIn = ({ setHasAccount }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignIn(userInfo.email, userInfo.password)
      .then((user) => logInUser(user))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name: key, value } = e.target;
    setUserInfo({
      ...userInfo,
      [key]: value,
    });
  };

  const { email, password } = userInfo;

  return (
    <div className="sign-in">
      <p className="go-to-signup" onClick={() => setHasAccount(false)}>
        I don't have an account
      </p>
      <h2 className="title">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup
          name="email"
          type="email"
          label="email"
          value={email}
          handleChange={handleChange}
          required
        />
        <FormGroup
          name="password"
          type="password"
          label="password"
          value={password}
          handleChange={handleChange}
          required
        />
        <Button type="submit" children="Sign In" />
      </form>
    </div>
  );
};

export default SignIn;
