import { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AccountPage from "./pages/AccountPage/AccountPage.component";
import Header from "./components/header/header.component";
import {
  auth,
  checkUserNameLinked,
} from "./firebase/firebase-utils/firebase.auth.utils";
import CreateUsernamePage from "./pages/create-username/create-username.component";
import HomePage from "./pages/homepage/homepage.component";
import SignInSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import {
  logInUser,
  logOutUser,
  setHasUniqueUsername,
} from "./redux/user/user.actions";

export const ThemeContext = createContext();

function App({
  user,
  hasUniqueUsername,
  setHasUniqueUsername,
  logInUser,
  logOutUser,
}) {

  const [ darkMode, setDarkMode ] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        logInUser(user);
        checkUserNameLinked(user)
          .then((response) => {
            if(response === true){
              setHasUniqueUsername(user.displayName)
            }
          })
          .catch((error) => console.log(error));
      } else {
        logOutUser(user);
      }
    });
    return () => unsubscribe();
  }, []);


  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`App ${darkMode ? 'dark' : ''}`}>
        <Header />
        <Routes>
          <Route
            exact
            path="/"
            element={
              user !== null && !hasUniqueUsername ? (
                <Navigate to="/createusername" />
              ) : user === null ? (
                <SignInSignUpPage />
              ) : hasUniqueUsername === user.displayName ? (
                <HomePage />
              ) : null
            }
          />
          <Route
            exact
            path="/signin"
            element={user ? <Navigate to="/" /> : <SignInSignUpPage />}
          />
          <Route
            exact
            path="/createusername"
            element={
              user !== null && !hasUniqueUsername ? (
                <CreateUsernamePage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            exact
            path="/account"
            element={user ? <AccountPage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  hasUniqueUsername: state.user.hasUniqueUsername,
});

const mapDispatchToProps = (dispatch) => ({
  logInUser: (user) => dispatch(logInUser(user)),
  logOutUser: (user) => dispatch(logOutUser(user)),
  setHasUniqueUsername: (response) => dispatch(setHasUniqueUsername(response)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
