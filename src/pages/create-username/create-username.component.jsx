import React, { useState } from 'react'
import FormGroup from '../../components/form-group/form-group.component'
import { checkUserNameAvailable, storeUsernameInDb, updateUserDisplaynameInDb } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import Button from '../../components/button/button.component';

const CreateUsernamePage = ({ user }) => {

  const [ username, setUsername ] = useState('');
  const [ error, setError ] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('woo')
    let userNameAvailable;

    try {
      userNameAvailable = await checkUserNameAvailable(username);
    }
    catch(err){
      setError(`${error.code}: ${error.message}`)
    }

    if(!userNameAvailable){
      setError("Sorry that username is taken.");
      return;
    }

    storeUsernameInDb(user, username)
      .then(() => updateUserDisplaynameInDb(username))
      .catch((error) => {
        setError(`${error.code ? error.code : ''} ${error.message}`)
      });
  }

  return (
    <form onSubmit={handleSubmit}>
    <p className="error-message">{error}</p>
      <FormGroup
          name="username"
          type="text"
          label="username"
          value={username}
          handleChange={(e) => setUsername(e.target.value)}
          required
        />
      <Button type="submit" children="Submit" />
    </form>
  )
}

const mapStateToProps = (state) => ({
  user: state.user
})


export default connect(mapStateToProps)(CreateUsernamePage)