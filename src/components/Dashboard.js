import React from "react";
import { Link } from "react-router-dom";

import car from "../assets/car.svg";
import travel from "../assets/travel.svg";
import newTripImg from "../assets/newtrip.svg";
import allTripsImg from "../assets/alltrips.svg";

//Component begins
const Dashboard = (props) => {
  const {
    user,
  } = props;
  return <div className="dashboard">
    <div className="wrapper clearfix">
      <div className="clearfix">
        <h2>Dashboard</h2>
        <button className="button blue-btn">Details</button>
      </div>
      <div className="wrapper">
        <Link to="/newtrip" className="half-section">
          <div className="dashboard-container">
            <div className="dashboard-image">
              <img src={newTripImg} alt="An illustration of a backpack and a compass" />
            </div>
            <p>Start a new trip</p>
          </div>
          {/* <div className="first-circle circles">
          <img src={car} attribution="Travel by Chanut is Industries from the Noun Project" alt="An image of a car." />
          <p className="start-trip">Start a new trip</p>
          <div className="circle-fun clockwise"></div>
        </div> */}
        </Link>

        <Link to="/alltrips" className={user === null ? 'half-section disabled-link-to-all-trips' : 'half-section'}>
          <div className="dashboard-container">
            <div className="dashboard-image">
              <img src={allTripsImg} alt="An illustration of a suitcase and a passport" />
            </div>

            <p>See all trips</p>
          </div>
          {/* <div className="second-circle circles">
          <img className="travel-passport" src={travel} attribution="Travel by Chanut is Industries from the Noun Project" alt="An image of a passport." />
          <p className="all-trips">See all trips</p>
          <div className="circle-fun"></div>
        </div> */}
        </Link>
      </div>
    </div>
  </div>
}

export default Dashboard;
