// Import React, axios, React Router
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Import Firebase
import firebase from "../firebase.js";

// Import moment package
import moment from 'moment';

// Import all styles
import "../styles/TripList.css";

// Import SVG images
import tripListImg from "../assets/tripdashboardicon.svg";

// Import Font Awesome and add icons to library
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
library.add(faChevronLeft, faTimes);

// Trip list component begins
class TripList extends Component {
  constructor() {
    super();
    this.state = {
      tripName: "",
      startPoint: "",
      endPoint: ""
    };
  }

  // Method to remove trip from database
  removeTrip = (e) => {
    // Store id of selected trip
    const tripID = e.target.id;
    // Establish reference to trip in Firebase database of logged in user
    const tripRef = firebase.database().ref(`${this.props.user.uid}/${tripID}`);
    // Trigger confirm prompt with deletion warning; if true (i.e. user selects "OK"), remove trip from database
    const confirmation = window.confirm("Are you sure you want to delete this trip? Once deleted, a trip cannot be recovered.")
    if (confirmation === true) {
      tripRef.remove();
    }
  };

  render() {
    const {
      listOfTrips,
    } = this.props;
    return (
      <div className="tripList section">
        <div className="wrapper clearfix">
          {/* Link to dashboard */}
          <Link className="button home-button" to="/dashboard">
            <FontAwesomeIcon icon="chevron-left" className="icon" />
            <p>Dashboard</p>
          </Link>
          {/* Saved trips section */}
          <h2>Your saved trips</h2>
          <section className="display-trips">
            <ul>
              {/* Map over trip list and return a li for each of the trips in the user's database */}
              {Object.keys(listOfTrips).map((tripKey) => {
                const trip = listOfTrips[tripKey];
                // Variable to store departure date/time in display format
                const displayDateTime = moment(trip.originDateTime).format('DD MMM YYYY, HH:MM');
                return (
                  <li className="trip-items clearfix" key={tripKey}>
                    {/* Button to remove trip */}
                    <button
                      className="remove-btn button"
                      id={tripKey}
                      onClick={this.removeTrip}
                    >
                      <FontAwesomeIcon icon="times" className="icon" id={tripKey} style={{ 'margin-left': '0.5rem' }} />
                    </button>
                    {/* Trip title */}
                    <h3 className="trip-title">{trip.title}</h3>
                    {/* Trip details content */}
                    <div className="trip-items-content clearfix">
                      <div>
                        <img src={tripListImg} alt="A compass behind a cloud" className="trip-icon" />
                        <div className="trip-details">
                          <p><span>Origin </span>{trip.originData.address}</p>
                          <p><span>Destination </span>{trip.destinationData.address}</p>
                          <p><span>Departure time </span>{displayDateTime}</p>
                        </div>
                      </div>
                    </div>
                    {/* Button to change active trip */}
                    <button
                      className="blue-btn button"
                      id={tripKey} onClick={this.props.changeActiveTrip}>Set active
                      </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default TripList;