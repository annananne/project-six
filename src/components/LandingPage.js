import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase.js";
import TripList from "./TripList.js";


// reference to the root of the database
// const dbRef = firebase.database().ref();

class LandingPage extends Component {
    constructor(){
        super();
        this.state = {
        }
    }

    login = () => {
        auth.sighInWithPopup(provider).then((result) => {
            console.log(result);
            this.setState ({
                user: result.user
            }, () => {
                // create a reference specific to user
                const dbRef = firebase.database().ref(`/${this.state.user.uid}`);
                // attaching our event listener to firebase
                dbRef.on('value', (snapshot) => {
                    console.log(snapshot.val());
                });
            }
        );

        });
    };

    logout = () => {
        auth.signOut().then(() => {
            this.setState({
                user:null
            });
        });
    };

    render() {
        return (
            <div>
                <h1>Wayfarer</h1>
                <p>Plan your perfect trip.</p>
                {this.state.user ?
                    <button onClick={this.logout}>Log Out</button>
                    :
                    <button onClick={this.login}>Log In</button>
                    // <button>Continue As Guest</button>
                }
            </div>
        )
    }

}

export default LandingPage;