import React, { useState } from "react";
import { connect } from "react-redux";
import {
  checkUserNameAvailable,
  storeUserInDb,
  storeUsernameInDb,
} from "../../firebase/firebase.utils";
import { updateUserName } from "../../redux/user/user.actions";
import FormGroup from "../form-input/form-group.component";
import "./sign-up.styles.scss";

const SignUp = ({ setHasAccount, updateUserName }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const [error, setError] = useState("");

  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setError("Passwords don\'t match");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { displayName, email, password, confirmPassword } = userInfo;
    if (!validatePassword(password, confirmPassword)) {
      return;
    }

    let userNameAvailable;

    try {
      userNameAvailable = await checkUserNameAvailable(displayName);
    }
    catch(err){
      setError(`${error.code}: ${error.message}`)
    }

    if(!userNameAvailable){
      setError("Sorry that username is taken.");
      return;
    }

    storeUserInDb(email, password)
      .then((user) => storeUsernameInDb(user, displayName))
      .then(() => updateUserName(displayName))
      .catch((error) => {
        setError(`${error.code ? error.code : ''} ${error.message}`)
      });
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
      <p className="go-to-signin" onClick={() => setHasAccount(true)}>
        I already have an account
      </p>
      <h2 className="title">Sign Up</h2>
      <p className="error-message">{error}</p>
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

const mapDispatchToProps = (dispatch) => ({
  updateUserName: (username) => dispatch(updateUserName(username)),
});

export default connect(null, mapDispatchToProps)(SignUp);
