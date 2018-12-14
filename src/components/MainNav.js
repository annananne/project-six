import React from "react";
import { Link } from "react-router-dom";

//Component begins
const MainNav = (props) => {
  return <div className="mainNav section">
  <div className="wrapper clearfix">
      <Link to="/dashboard">
        <h1 onClick={props.handleReset}>Wayfarer</h1>
      </Link>
    <div className="mainNav-right">
      <p className="link"><span className="thin-text">Hello, </span>{props.user ? props.user.displayName : 'guest' }</p>
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
  </div>
}

export default MainNav;