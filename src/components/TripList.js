import React, { Component } from "react";
import firebase, { auth, provider } from "../firebase.js";

const dbRef = firebase.database().ref();

class TripList extends Component {
  constructor() {
    super();
    this.state = {
      tripName: "",
      startPoint: "",
      endPoint: "",
      listOfTrips: []
    };
  }

  componentDidMount() {
    dbRef.on("value", (snapshot) => {
      const newTripList = snapshot.val() === null ? {} : snapshot.val();
      const newState = [];
      for (let tripKey in newTripList) {
        newTripList[tripKey].key = tripKey;
        newState.push(newTripList[tripKey]);
      }
      console.log(newState);
      this.setState({
        listOfTrips: newState
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const newTrip = {
      title: this.state.tripName,
      origin: this.state.startPoint,
      destination: this.state.endPoint
    };
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
    console.log(e.target.id);
    const tripRef = firebase.database().ref(e.target.id);
    tripRef.remove();
  };

  render() {
    return (
      <div>
        <header>
          <h1>All Trips!</h1>
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
            {this.state.listOfTrips.map((item) => {
              return (
                <li key={item.key}>
                  <h3>{item.title}</h3>
                  <p>Origin: {item.origin}</p>
                  <p>Destination: {item.destination}</p>
                  <button id={item.key} onClick={this.removeTrip}>
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