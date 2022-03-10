import React from "react";
import { handleGoogleSignIn } from "../../firebase/firebase.utils";
import { logInUser } from "../../redux/user/user.actions";
import { connect } from "react-redux";

const GoogleSignInBtn = ({ setError, logInUser }) => {
  const handleSignIn = async () => {
    try {
      const result = await handleGoogleSignIn();
      if (typeof result === Error) {
        setError(result);
        return;
      }
      else {
        logInUser(result)
      }
    } catch (err) {
      setError(err);
    }
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

const mapDispatchToProps = (dispatch) => ({
  logInUser: (user) => dispatch(logInUser(user))
})


export default connect(null, mapDispatchToProps)(GoogleSignInBtn);
