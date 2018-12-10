import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return <div>
      <Link to="/newtrip">Start a new trip</Link>
      <Link to="/alltrips">See all trips</Link>
  </div>;
}

export default Dashboard;
