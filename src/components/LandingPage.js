import React, { Component } from "react";
import firebase from "../firebase.js";


// reference to the root of the database
// const dbRef = firebase.database().ref();

class LandingPage extends Component {
    constructor(){
        super();
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <h1>Wayfarer</h1>
                <p>Plan your perfect trip.</p>
                <button onClick={this.props.logIn}>Log In</button>
                <button>Continue As Guest</button>
            </div>
        )
    }

}

export default LandingPage;