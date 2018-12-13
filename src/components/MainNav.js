import React from "react";
import { Link } from "react-router-dom";

const MainNav = (props) => {
  return <div className="mainNav">
  <div className="wrapper clearfix">
    <h1>Wayfarer</h1>
      {window.location.pathname !== '/dashboard' && <Link className="button home-button" to="/dashboard">Home</Link>}
    {props.user ? (
      <button className="button" onClick={props.logOut}>
        Log Out
              </button>
    ) : (
        <button className="button" onClick={props.logIn}>
          Log In
        </button>
      )}
      
  </div>
  </div>
}

export default MainNav;