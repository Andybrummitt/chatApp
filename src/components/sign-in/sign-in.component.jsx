import React, { useState } from 'react'
import FormGroup from '../form-input/form-group.component';

import './sign-in.styles.scss'

const SignIn = () => {

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: "",
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // log in user and change state to auth
      };
    
      const handleChange = (e) => {
        const { name: key, value } = e.target;
        setUserInfo({
          ...userInfo,
          [key]: value,
        });
      };

      const { email, password } = userInfo;


  return (
      <div className="sign-in">
        <h2 className="title">Sign In</h2>
        <form onSubmit={handleSubmit}>
            <FormGroup
            name="email"
            type="email"
            label="email"
            value={email}
            handleChange={handleChange}
            />
            <FormGroup
            name="password"
            type="password"
            label="password"
            value={password}
            handleChange={handleChange}
            />
            <button type="submit">Sign In</button>
        </form>
      </div>
  )
}

export default SignIn
