import React, { useState } from "react";
import { deleteAccount, handleSignOut } from "../../firebase/firebase-utils/firebase.auth.utils";

const AccountPage = () => {
  const [ showDeletePrompt, setShowDeletePrompt ] = useState(false);
  const [ error, setError ] = useState(null);
  const deleteAccountAndShowMessage = async () => {
    deleteAccount()
        .catch(error => setError(error))
  }
  return (
    <div>
    {error && <p>{error.message}</p>}
      <ul>
        <li onClick={handleSignOut}>Sign out</li>
        <li onClick={setShowDeletePrompt}>Delete Account</li>
      </ul>
      {showDeletePrompt && (
          <div>
              <p>Are you sure you want to delete your account?</p>
              <button onClick={deleteAccountAndShowMessage}>Yes</button><button onClick={() => setShowDeletePrompt(false)}>No</button>
          </div>
      )}
    </div>
  );
};

export default AccountPage;
