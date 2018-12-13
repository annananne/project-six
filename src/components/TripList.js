import React, { Component } from "react";
import firebase from "../firebase.js";
import moment from 'moment';

class TripList extends Component {
  constructor() {
    super();
    this.state = {
      tripName: "",
      startPoint: "",
      endPoint: ""
    };
  }

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
    const {
      listOfTrips,
    } = this.props;

    // console.log('list of trips');
    // console.log(listOfTrips);

    return (
      <div class="alltrips-wrapper clearfix">
        <header>
          <h3>All Trips!</h3>
        </header>

        <section className="display-trips">
          <ul>
            {Object.keys(listOfTrips).map((tripKey) => {
              const trip = listOfTrips[tripKey];
              const displayDateTime = moment(trip.originDateTime).format('DD MMM YYYY, HH:MM');

              return (
                <li className="trip-items" key={tripKey}>
                  {/* <h4>{item[1].title}</h4> */}
                  <p>Origin: {trip.origin.address}</p>
                  <p>Destination: {trip.destination.address}</p>
                  <p>Date Time of Origin: {displayDateTime}</p>
                  <button 
                    className="remove-btn button"
                    id={tripKey}
                    onClick={this.removeTrip}
                  >
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