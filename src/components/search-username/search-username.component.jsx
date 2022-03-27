import React, { useState } from "react";
import {
  createNewChat,
  getUserFromDb,
} from "../../firebase/firebase-utils/firebase.chats.utils";
import Button from "../button/button.component";
import FormGroup from "../form-group/form-group.component";
import './search-username.styles.scss';

const SearchUsername = ({ user, setSearchedUserData }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    getUserFromDb(username)
      .then((userdata) => {
          console.log({...userdata, username})
          setSearchedUserData({ ...userdata, username })
      })
      .catch((err) => setError(err));
  };

  return (
    <div className="search-username-container">
        <form onSubmit={handleSubmit}>
        <FormGroup
            name="username"
            type="text"
            placeholder="Search username"
            value={username}
            handleChange={(e) => setUsername(e.target.value)}
            required
        />
        <Button type="submit" children="Search" />
        <p className="error-message">{error}</p>
        </form>
    </div>
  );
};

export default SearchUsername;
