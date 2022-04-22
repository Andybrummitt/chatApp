import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import { ThemeContext } from "../../App";
import Button from "../../components/button/button.component";
import FormGroup from "../../components/form-group/form-group.component";
import {
  checkUserNameAvailable,
  storeUsernameInDbAndUpdateProfile,
} from "../../firebase/firebase-utils/firebase.auth.utils";
import { setHasUniqueUsername } from "../../redux/user/user.actions";
import "./create-username.styles.scss";

const CreateUsernamePage = ({ user, setHasUniqueUsername }) => {

  const { darkMode } = useContext(ThemeContext);

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userNameAvailable;

    try {
      userNameAvailable = await checkUserNameAvailable(username);
    } catch (err) {
      setError(`${error.code}: ${error.message}`);
    }

    if (!userNameAvailable) {
      setError("Sorry that username is taken.");
      return;
    }

    storeUsernameInDbAndUpdateProfile(user, username)
      .then(() => setHasUniqueUsername(username))
      .catch((error) => {
        setError(`${error.code ? error.code : ""} ${error.message}`);
      });
  };

  return (
    <div className={`create-username-container ${darkMode ? 'dark' : ''}`}>
      <form onSubmit={handleSubmit}>
        <p className="error-message">{error}</p>
        <FormGroup
          name="username"
          type="text"
          label="username"
          value={username}
          handleChange={(e) => setUsername(e.target.value)}
          required
        />
        <Button type="submit" children="Submit" />
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  setHasUniqueUsername: (username) => dispatch(setHasUniqueUsername(username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateUsernamePage);
