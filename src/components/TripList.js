import React, { Component } from "react";
import firebase from "../firebase.js";

// const dbRef = firebase.database().ref();
// const provider = new firebase.auth.GoogleAuthProvider(); 
// const auth = firebase.auth();

class TripList extends Component {
  constructor() {
    super();
    this.state = {
      tripName: "",
      startPoint: "",
      endPoint: ""
    };
  }
  // componentDidMount (){
  //   if (this.props.user) {
  //     console.log('recognizing user')
  //     this.dbRef = firebase.database().ref(`/${this.props.user.uid}`);
  //     this.dbRef.on("value", (snapshot) => {
  //       this.setState({ listOfTrips: snapshot.val() || {} });
  //     });
  //   }
  // }

  // componentDidMount() {
  //   console.log("I MOUNTED")
  //   if (this.props.user) {
  //     this.dbRef = firebase.database().ref(`/${this.props.user.uid}`)
  //     console.log(this.dbRef)
  //       this.dbRef.on('value', (snapshot) => {
  //         this.setState({
  //           listOfTrips: snapshot.val() || {}
  //         });
  //       })
  //   }
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     this.setState({
    //       user: user
    //     }, () => {
    //       this.dbRef = firebase.database().ref(`/${this.props.user.uid}`);
    //       this.dbRef.on('value', (snapshot) => {
    //         this.setState({
    //           listOfTrips: snapshot.val() || {}
    //         });
    //       })
    //     })
    //   }
    // })
    // dbRef.on("value", (snapshot) => {
    //   const newTripList = snapshot.val() === null ? {} : snapshot.val();
    //   const newState = [];
    //   for (let tripKey in newTripList) {
    //     newTripList[tripKey].key = tripKey;
    //     newState.push(newTripList[tripKey]);
    //   }
    //   console.log(newState);
    //   this.setState({
    //     listOfTrips: newState
    //   });
    // });
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const dbRef = firebase.database().ref(`${this.props.user.uid}`)
    const newTrip = {
      title: this.state.tripName,
      origin: this.state.startPoint,
      destination: this.state.endPoint
    };
    console.log(this.props.user.uid)
    console.log(newTrip);
    dbRef.push(newTrip);
    this.setState({
      tripName: "",
      startPoint: "",
      endPoint: ""
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  removeTrip = (e) => {
    const tripID = e.target.id;
    const tripRef = firebase.database().ref(`${this.props.user.uid}/${tripID}`);
    // console.log(e.target.id);
    // const tripRef = firebase.database().ref(e.target.id);
    tripRef.remove();
  };

  render() {
    // console.log(this.props.user.uid)
    return (

      <div class="alltrips-wrapper">
        <header>
          <h3>All Trips!</h3>
        </header>
        <section className="mockInput">
          <form action="" onSubmit={this.handleSubmit}>
            <label htmlFor="tripName">Enter Trip Name</label>
            <input
              type="text"
              id="tripName"
              placeholder="Trip Name"
              onChange={this.handleChange}
              value={this.state.tripName}
            />

            <label htmlFor="startPoint">Enter Starting Point</label>
            <input
              type="text"
              id="startPoint"
              placeholder="Your Location"
              onChange={this.handleChange}
              value={this.state.startPoint}
            />

            <label htmlFor="endPoint">Enter End Point</label>
            <input
              type="text"
              id="endPoint"
              placeholder="Destination"
              onChange={this.handleChange}
              value={this.state.endPoint}
            />

            <button>Save Trip!</button>
          </form>
        </section>

        <section>
          <ul>
            {Object.entries(this.props.listOfTrips).map((item) => {
              console.log(item, "bananas")
              return (
                <li key={item[0]}>
                  <h3>{item[1].title}</h3>
                  <p>Origin: {item[1].origin}</p>
                  <p>Destination: {item[1].destination}</p>
                  <button id={item[0]} onClick={this.removeTrip}>
                    Remove Trip!
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    );
  }
}


export default TripList;