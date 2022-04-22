import React, { useContext, useState } from "react";
import { ThemeContext } from "../../App";
import {
  deleteAccount,
  handleSignOut,
} from "../../firebase/firebase-utils/firebase.auth.utils";
import "./accountpage.styles.scss";

const AccountPage = () => {

  const { darkMode } = useContext(ThemeContext);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [error, setError] = useState(null);
  const deleteAccountAndShowMessage = async () => {
    deleteAccount().catch((error) => setError(error));
  };
  return (
    <div className={`account-page-container ${darkMode ? 'dark' : ''}`}>
      <h2>My Account</h2>
      {error && <p className="error-message">{error.message}</p>}
      <ul className="account-options">
        <li onClick={handleSignOut}>Sign out</li>
        <li onClick={setShowDeletePrompt}>Delete Account</li>
      </ul>
      {showDeletePrompt && (
        <div className="delete-prompt-container">
          <p>Are you sure you want to delete your account?</p>
          <div className="delete-options-btns">
            <button onClick={deleteAccountAndShowMessage}>Yes</button>
            <button onClick={() => setShowDeletePrompt(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
