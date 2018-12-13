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
      // <div class="alltrips-wrapper clearfix">
        <div class="alltrips-wrapper">
        <header>
          <h3 className="alltrips-heading">All Trips!</h3>
        </header>

        <section className="display-trips">
          <ul>
            {Object.keys(listOfTrips).map((tripKey) => {
              const trip = listOfTrips[tripKey];
              const displayDateTime = moment(trip.originDateTime).format('DD MMM YYYY, HH:MM');

              return (
                <li className="trip-items clearfix" key={tripKey}>
                  {/* <h4>{item[1].title}</h4> */}
                  <div className="trip-items-content">
                    <p><span>Origin: </span>{trip.origin.address}</p>
                    <p><span>Destination: </span>{trip.destination.address}</p>
                    {/* Date Time of Origin: */}
                    <p><span>Departure Time: </span>{displayDateTime}</p>
                  </div>
                  <button 
                    className="remove-btn button"
                    id={tripKey}
                    onClick={this.removeTrip}
                  >
                    Remove
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