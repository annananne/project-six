import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import ReactDependentScript from "react-dependent-script";
import apiKeys from "./data/secrets";
import LocationSearchInput from './LocationSearchInput';

class App extends Component {
  constructor() {
    super();
    this.state = {
      originData: {},
      destinationData: {},
      origin: 'Toronto+Ontario',
      destination: 'Montreal+Quebec'
    }
  }
  getWeather = () => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKeys.darkSky}/43.6532,-79.3832,1544443200`,
        {
          method: "GET",
          contentType: "json"
        }
      )
      .then(res => {
        console.log(res);
      });
  };
  getMap = () => {
    axios
    .get(
      `https://cors-anywhere.herokuapp.com/https://www.google.com/maps/embed/v1/directions?key=${apiKeys.googleMaps}&origin=Oslo+Norway&destination=Telemark+Norway&avoid=tolls|highways`,
      {
        method: "GET",
        contentType: "jsonp"
      }
    )
    .then((res) => {
      // console.log("res", res);
    });
  }
  handleInputChange = (e) => {
    // Find values of place_id, address and latitude/longitude
    // Add values into correct corresponding object, depending on whether input is origin point or destination point
    console.log(e);
  }
  render() {
    return <div className="App">
        <header className="App-header" />
        <main>
          <ReactDependentScript scripts={[`https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleMaps}&libraries=places`]}>
            {/* Input for origin point search */}
            <LocationSearchInput id="originSearch" origin={this.state.origin} originData={this.state.originData} />

            {/* Input for destination point search */}
            <LocationSearchInput id="destinationSearch" destination={this.state.destination} destinationData={this.state.destinationData} />
          </ReactDependentScript>

          {/* Google Map */}
          <iframe src={`https://www.google.com/maps/embed/v1/directions?key=${apiKeys.googleMaps}&origin=${this.state.origin}&destination=${this.state.destination}&avoid=tolls|highways`} frameBorder="0" width="600" height="400" title="My map" />

          <div className="App">
            <button onClick={this.getWeather}>Get weather</button>
          </div>
        </main>
      </div>;
  }
}

export default App;
