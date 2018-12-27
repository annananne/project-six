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
    console.log(tripID);
    const tripRef = firebase.database().ref(`${this.props.user.uid}/${tripID}`);
    // console.log(tripRef);
    // const trip = tripRef.child(tripID);

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

          <Link className="button home-button" to="/dashboard">
            <FontAwesomeIcon icon="chevron-left" className="icon" />
            <p>Dashboard</p>
          </Link>
          <h2>Your saved trips</h2>

          <section className="display-trips">
            <ul>
              {Object.keys(listOfTrips).map((tripKey) => {
                console.log('list of trips', listOfTrips)
                const trip = listOfTrips[tripKey];
                const displayDateTime = moment(trip.originDateTime).format('DD MMM YYYY, HH:MM');

                return (
                  <li className="trip-items clearfix" key={tripKey}>
                    {/* <h4>{item[1].title}</h4> */}
                    
                    <button
                      className="remove-btn button"
                      id={tripKey}
                      onClick={this.removeTrip}
                    >
                      {/* <FontAwesomeIcon icon="times" className="icon" id={tripKey}/> */}
                      Remove
                    </button>
                    <h3 className="trip-title">{trip.title}</h3>
                    <div className="trip-items-content clearfix">
                    <div>
                      <img src={tripListImg} alt="A compass behind a cloud" className="trip-icon"/>
                      <div className="trip-details">
                      <p><span>Origin </span>{trip.originData.address}</p>
                      <p><span>Destination </span>{trip.destinationData.address}</p>
                      {/* Date Time of Origin: */}
                      <p><span>Departure Time </span>{displayDateTime}</p>
                      </div>
                        </div>
                    </div>
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