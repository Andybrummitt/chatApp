import React from "react";
import { handleGoogleSignIn } from "../../firebase/firebase.utils";

const GoogleSignInBtn = ({ setError, logInUser }) => {
  const handleSignIn = async () => {
    try {
      const result = await handleGoogleSignIn();
      if (typeof result === Error) {
        setError(result);
      } 
    } catch (error) {
      setError(error);
    }
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default GoogleSignInBtn;
