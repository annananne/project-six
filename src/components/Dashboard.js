import React from "react";
import { Link, Switch } from "react-router-dom";

import car from "../assets/car.svg";
import travel from "../assets/travel.svg";

const Dashboard = (props) => {
  const {
    user,
  } = props;

  // return <div className="dashboard">
  //     <div className="dashboard-wrapper clearfix">
  //       <h2>Dashboard</h2>
  //         <Link to="/newtrip"> 
  //           <div className="first-circle circles">
  //               <img src={car} attribution="Travel by Chanut is Industries from the Noun Project" alt="An image of a car." />
  //               <p className="start-trip">Start a new trip</p>
  //               <div className="circle-fun clockwise"></div>
  //           </div>
  //         </Link>

  //         <Link to="/alltrips" className={user === null ? 'disabled-link-to-all-trips' : ''}>
  //           <div className="second-circle circles">
  //             <img className="travel-passport" src={travel} attribution="Travel by Chanut is Industries from the Noun Project" alt="An image of a passport." />
  //             <p className="all-trips">See all trips</p>
  //             <div className="circle-fun"></div>
  //         </div>
  //       </Link>
  //   </div>
  // </div>
  return <div className="dashboard">
    <div className="wrapper clearfix">
      <h2>Dashboard</h2>
      <Link to="/newtrip">
        <div className="first-circle circles">
          <img src={car} attribution="Travel by Chanut is Industries from the Noun Project" alt="An image of a car." />
          <p className="start-trip">Start a new trip</p>
          <div className="circle-fun clockwise"></div>
        </div>
      </Link>

      <Link to="/alltrips" className={user === null ? 'disabled-link-to-all-trips' : ''}>
        <div className="second-circle circles">
          <img className="travel-passport" src={travel} attribution="Travel by Chanut is Industries from the Noun Project" alt="An image of a passport." />
          <p className="all-trips">See all trips</p>
          <div className="circle-fun"></div>
        </div>
      </Link>
    </div>
  </div>
}

export default Dashboard;
