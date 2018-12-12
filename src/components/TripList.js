import React, { Component } from "react";
import firebase from "../firebase.js";

class TripList extends Component {
  constructor() {
    super();
    this.state = {
      tripName: "",
      startPoint: "",
      endPoint: ""
    };
  }
 

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
    tripRef.remove();
  };

  render() {
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

        <section className="display-trips">
          <ul>
            {Object.entries(this.props.listOfTrips).map((item) => {
              console.log(item, "bananas")
              return (
                <li className="trip-items" key={item[0]}>
                  <h4>{item[1].title}</h4>
                  <p>Origin: {item[1].origin}</p>
                  <p>Destination: {item[1].destination}</p>
                  <button className="remove-btn button" id={item[0]} onClick={this.removeTrip}>
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