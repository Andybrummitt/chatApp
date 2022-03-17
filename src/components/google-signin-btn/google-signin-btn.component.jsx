import React from "react";
import { handleGoogleSignIn } from "../../firebase/firebase-utils/firebase.auth.utils";
import Button from "../button/button.component";

const GoogleSignInBtn = ({ setError }) => {
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

  return (
    <Button
      onClick={handleSignIn}
      children={"Sign In With Google"}
      google={"google"}
    />
  );
};

export default GoogleSignInBtn;
