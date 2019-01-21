// Import React, React Router
import React from "react";
import { Link } from "react-router-dom";

// Import SVG images
import newTripImg from "../assets/newtrip.svg";
import allTripsImg from "../assets/alltrips.svg";

// Dashboard component begins
const Dashboard = (props) => {
  const {
    user,
  } = props;
  return <div className="dashboard">
    <div className="wrapper clearfix">
      <div className="clearfix">
        <h2>Dashboard</h2>
        <button className="button blue-btn">More info</button>
      </div>
      <div className="wrapper wrapper--dashboard clearfix">
        {/* Button to link to new trip component */}
        <Link to="/newtrip" className="half-section">
          <div className="dashboard-container">
            <div className="dashboard-image">
              <img src={newTripImg} alt="An illustration of a backpack and a compass" />
            </div>
            <p>Start a new trip</p>
          </div>
        </Link>
        {/* Button to link to trip list component */}
        {/* (Conditional rendering of disabled/enabled button based on whether or not user is logged in) */}
        <Link to="/alltrips" className={user === null ? 'half-section disabled-link-to-all-trips' : 'half-section'}> 
          <div className="dashboard-container">
            <div className="dashboard-image">
              <img src={allTripsImg} alt="An illustration of a suitcase and a passport" />
            </div>
            <p>See all trips</p>
          </div>
        </Link>
      </div>
    </div>
  </div>
}

export default Dashboard;
