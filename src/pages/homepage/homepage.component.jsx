import React from 'react';
import { handleSignOut } from '../../firebase/firebase.utils';

const HomePage = () => {
  return (
    <div>
      <div>HomePage</div>
      <button className="sign-out" onClick={handleSignOut}>Sign Out</button>
    </div>
  )
}

export default HomePage