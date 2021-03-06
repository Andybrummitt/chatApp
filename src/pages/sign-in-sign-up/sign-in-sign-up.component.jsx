import { useContext, useState } from "react";
import { ThemeContext } from "../../App";
import GoogleSignInBtn from "../../components/google-signin-btn/google-signin-btn.component";
import SignIn from "../../components/sign-in/sign-in.component";
import SignUp from "../../components/sign-up/sign-up.component";
import "./sign-in-sign-up.styles.scss";

const SignInSignUpPage = () => {
  const [hasAccount, setHasAccount] = useState(true);
  const [error, setError] = useState("");
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`sign-in-sign-up-container page-container ${
        darkMode ? "dark" : ""
      }`}
    >
      {hasAccount ? (
        <SignIn setHasAccount={setHasAccount} />
      ) : (
        <SignUp setHasAccount={setHasAccount} />
      )}
      <GoogleSignInBtn setError={setError} />
      {error && <p className="error-message">{error.message}</p>}
    </div>
  );
};

export default SignInSignUpPage;
