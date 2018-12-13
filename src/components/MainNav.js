import React from "react";
import { Link } from "react-router-dom";

const MainNav = (props) => {
  return <div className="MainNav">
    {props.user ? (
      <button className="button" onClick={props.logOut}>
        Log Out
              </button>
    ) : (
        <button className="button" onClick={props.logIn}>
          Log In
        </button>
      )}
    <Link className="button home-button" to="/dashboard">Home</Link>
  </div>
}

export default MainNav;