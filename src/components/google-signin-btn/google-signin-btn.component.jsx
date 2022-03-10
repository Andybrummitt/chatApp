import React from 'react'
import { handleGoogleSignIn } from '../../firebase/firebase.utils'


const GoogleSignInBtn = () => {
  return (
    <button onClick={handleGoogleSignIn}>Sign in with Google</button>
  )
}

export default GoogleSignInBtn