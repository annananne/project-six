import React from "react";

const LoginPage = (props) => {
  return (
    <div className="login-page">
      <div className="wrapper">
        <h1>Wayfarer</h1>
        <p>Plan your perfect trip.</p>
        <button className="button" onClick={props.logIn}>Log In</button>
        <button className="link" onClick={props.logIn} id="guest">Continue as a guest</button>
      </div>
    </div>
  )
}

export default LoginPage;