import React, { useState } from "react";
import { getUserFromDb } from "../../firebase/firebase-utils/firebase.chats.utils";
import Button from "../button/button.component";
import FormGroup from "../form-group/form-group.component";
import "./search-username.styles.scss";

const SearchUsername = ({
  user,
  usernameFromSearch,
  setUsernameFromSearch,
  setSearchedUserData,
}) => {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //  IF USERNAME FROM SEARCH !== USER.DISPLAYNAME
    if (usernameFromSearch !== user.displayName) {
      getUserFromDb(usernameFromSearch)
        .then((userdata) => {
          setSearchedUserData({ ...userdata, username: usernameFromSearch });
          setError("");
          setUsernameFromSearch("");
        })
        .catch((err) => setError(err));
    }
    //  SHOW MESSAGES SHOWING NO USERS FOUND
  };

  return (
    <div className="search-username-container">
      <form onSubmit={handleSubmit}>
        <FormGroup
          name="username"
          type="text"
          placeholder="Search username"
          value={usernameFromSearch}
          handleChange={(e) => setUsernameFromSearch(e.target.value)}
          required
        />
        <Button type="submit" children="Search" />
        <p className="error-message">{error.message}</p>
      </form>
    </div>
  );
};

export default SearchUsername;
