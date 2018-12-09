import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase.js";
import TripList from "./TripList.js";


// reference to the root of the database
// const dbRef = firebase.database().ref();

class LandingPage extends Component {
    constructor(){
        super();
        this.state = {
<<<<<<< HEAD
            user: null
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount(){
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user:user 
                },
                () => {
                    // create reference specific to user
                    this.dbRef = firebase.database().ref(`/${this.state.user.uid}`)
                    // attaching our event listener to firebase
                    this.dbRef.on('value', (snapshot) => {
                        this.setState({
                            tripList: snapshot.val() || {}
                        })
                    });
                });
            };
        });
    };

    //componentWillUnmount(){
        // this is called when a component leaves the page
        // in our single page app with one component, it will never be called
        // if we were rerouting to a different view, it would be called when the route changed
        // if the component is going to leave the page at any point, add this code!
       // if(this.dbRef){
         //   this.dbRef.off();
      //  }
   // }

    // const dbRef = firebase.database().ref(`/${this.state.user.uid}`)

    handleSubmit(e) {
        const tripList = {
            title: this.state.tripName
        }
    }

    handleChange = e => {
        this.setState ({
            [e.target.id]: e.target.value
        })
=======
        }
>>>>>>> 641a89a1465442f4553b368312d676934094b667
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