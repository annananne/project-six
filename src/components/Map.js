import React, { Component } from "react";
import axios from "axios";
import apiKeys from "../data/secrets";

class Map extends Component {
  constructor(){
    super();
  }
  render(){
    return <div>
        <iframe src={`https://www.google.com/maps/embed/v1/directions?key=${apiKeys.googleMaps}&origin=Toronto+Ontario&destination=Montreal+Quebec&avoid=tolls|highways`} frameBorder="0" width="600" height="400" title="My map" />;
      </div>;
  }
}
export default Map;
