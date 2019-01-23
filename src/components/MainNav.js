// Import React, React Router
import React from "react";
import { Link } from "react-router-dom";

const firstName = name => {
  return name.substr(0, name.indexOf(' '));
}

// Main nav component begins
const MainNav = (props) => {
  return <div className="mainNav section">
  <div className="wrapper clearfix">
      <Link to="/dashboard">
        <h1 onClick={props.handleReset}className="title--wide">Wayfarer</h1>
        <h1 onClick={props.handleReset} className="title--narrow">W.</h1>
      </Link>
    <div className="mainNav-right">
      {/* Conditional rendering of user display name or "guest" string based on whether or not user is logged in */}
      <p className="link"><span className="thin-text">Hello, </span>{props.user ? firstName(props.user.displayName) : 'guest' }</p>
      {/* Conditional rendering of log in/log out button based on whether or not user is logged in */}
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