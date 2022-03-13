import { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import CreateUsernamePage from "./pages/create-username/create-username.component";
import Header from "./components/header/header.component";
import { auth } from "./firebase/firebase.utils";
import HomePage from "./pages/homepage/homepage.component";
import SignInSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import { logInUser, logOutUser } from "./redux/user/user.actions";

function App({ user, logInUser, logOutUser }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('AUTH STATE CHANGED')
      if (user) {
        //action user log in and map state to props
        logInUser(user);
      } else {
        //action user log out
        logOutUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="/" element={
          user !== null && user.displayName === '' ? <Navigate to="/createusername" /> 
          : user === null ? <SignInSignUpPage /> 
          : <HomePage/> 
          }/>
        <Route exact path="/signin" element={
          user ? <Navigate to="/" /> : <SignInSignUpPage/>
        } />
        <Route exact path="/createusername" element={
          user !== null && user.displayName === '' ? <CreateUsernamePage/> : <Navigate to="/" />
        } />
      </Routes>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  logInUser: (user) => dispatch(logInUser(user)),
  logOutUser: (user) => dispatch(logOutUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
