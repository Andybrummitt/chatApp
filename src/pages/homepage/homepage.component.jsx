import React from "react";
import { connect } from "react-redux";
import { handleSignOut } from "../../firebase/firebase.utils";

const HomePage = ({ user }) => {
  return (
    <div>
      <div>HomePage: {user.displayName}</div>
      <button className="sign-out" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(HomePage);
