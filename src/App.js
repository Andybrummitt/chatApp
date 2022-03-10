import { Route, Routes } from 'react-router-dom'
import Header from './components/header/header.component';
import HomePage from './pages/homepage/homepage.component';
import SignInSignUpPage from './pages/sign-in-sign-up/sign-in-sign-up.component';
import { auth } from './firebase/firebase.utils';
import { connect } from 'react-redux';

import './App.css';
import { useEffect, useState } from 'react';
import { logInUser, logOutUser } from './redux/user/user.actions';

function App({ user, logInUser, logOutUser }) {

  useEffect(( ) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        //action user log in and map state to props
        logInUser(user)
      }
      else {
        //action user log out
        logOutUser(user)
      }
    })
    return () => unsubscribe();
  }, [])

  return (
    <div className="App">
      <Header />
      <Routes>
      {/* redirect to home if user */}
        <Route path='/signin' element={<SignInSignUpPage />}/>
        <Route exact path='/' element={<HomePage />} />
      </Routes>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  logInUser: (user) => dispatch(logInUser(user)),
  logOutUser: (user) => dispatch(logOutUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
