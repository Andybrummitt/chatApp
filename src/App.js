import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AccountPage from "./components/AccountPage/AccountPage.component";
import Header from "./components/header/header.component";
import { auth, checkUserNameLinked } from "./firebase/firebase-utils/firebase.auth.utils";
import CreateUsernamePage from "./pages/create-username/create-username.component";
import HomePage from "./pages/homepage/homepage.component";
import SignInSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import {
  logInUser,
  logOutUser,
  setHasUniqueUsername,
} from "./redux/user/user.actions";

function App({
  user,
  hasUniqueUsername,
  setHasUniqueUsername,
  logInUser,
  logOutUser,
}) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("AUTH STATE CHANGED");
      if (user) {
        logInUser(user);
        checkUserNameLinked(user)
          .then((response) => {
            setHasUniqueUsername(response);
          })
          .catch((error) => console.log(error));
      } else {
        logOutUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
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
            ) : (
              <HomePage />
            )
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
        <Route exact path="/account" element={user ? <AccountPage /> : <Navigate to="/"/>} />
      </Routes>
    </div>
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
