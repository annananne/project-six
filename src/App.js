import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import ReactDependentScript from "react-dependent-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import apiKeys from "./data/secrets";
import LocationSearchInput from "./components/LocationSearchInput";
// import Map from "./components/Map.js";
import firebase from "./firebase.js";
import LandingPage from "./components/LandingPage.js";
import TripList from "./components/TripList.js";
import MapWithADirectionsRenderer from "./components/DirectionsMap.js";
import DateTimeInput from "./components/DateTimeInput";
import PointWeatherDisplay from "./components/PointWeatherDisplay";
// import CurrentTripInfo from './components/CurrentTripInfo';
import moment from "moment";

class App extends Component {
  constructor() {
    super();
    this.state = {
      hasUserSubmitted: false,
      originData: { address: "" },
      destinationData: { address: "" },
      directions: null,
      userTripPreferences: {
        travelMode: "DRIVING",
        avoidFerries: false,
        avoidHighways: false,
        avoidTolls: false
      },
      // tripData: {},
      tripData: null,
      //Stores all data related to origin point (place_id, address, display address, longitude, latitude, + relevant weather info) //Stores all user choices for the trip // we get this from user inputs //Stores all data related to destination point (place_id, address, display address, longitude, latitude, + relevant weather info)
      originDateTimeInSec: new Date().getTime(),
      //Stores all data related to origin point (place_id, address, display address, longitude, latitude, + relevant weather info)
      // use moment.js (https://momentjs.com/ to format user inputs)
      originDateTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      destinationDateTime: "", // to be set when directions are calculated
      weatherResults: {
        origin: null, 
        // middleOne: null,
        // (actual half of distance)
        // middleTwo: null, 
        // middleThree: null,
        destination: null
      }
    };
  }

  componentDidUpdate(previousProps, previousState) {

    if (this.state.tripData !== previousState.tripData && previousState.tripData === null) {
      const originLat = this.state.originData.latitude;
      const originLng = this.state.originData.longitude;
      const destinationLat = this.state.destinationData.latitude;
      const destinationLng = this.state.destinationData.longitude;
      const middlePointCoordinates = this.getMiddlePoint(originLat, originLng, destinationLat, destinationLng);
      // we need to save middle point to state
      const middleMainLat = middlePointCoordinates.lat();
      const middleMainLng = middlePointCoordinates.lng();

      const middleFirstHalf = this.getMiddlePoint(originLat, originLng, middleMainLat, middleMainLng);
      const middleSecondHalf = this.getMiddlePoint(middleMainLat, middleMainLng, destinationLat, destinationLng);
      const middleFirstLat = middlePointCoordinates.lat();
      const middleFirstLng = middlePointCoordinates.lng();
      const middleSecondLat = middlePointCoordinates.lat();
      const middleSecondLng = middlePointCoordinates.lng();
    }
  }
  // API call to get weather data - uses state values of latitude and longitude //**needs to be able to take in origin or destination data object */
  // change the hardcoded long & lat below, prob this will receive parameters with the location info
  getWeather = () => {
    const dateTime = `${this.state.originDateTime}:00`;
    const originDateTime = `${this.state.originDateTime}:00`;
    // find out destinationDateTime

    const originWeatherURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${
      apiKeys.darkSky
    }/${this.state.originData.latitude},${
      this.state.originData.longitude
    },${dateTime}`;

    const destinationWeatherURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${
      apiKeys.darkSky
    }/${this.state.destinationData.latitude},${
      this.state.destinationData.longitude
    },${dateTime}`;
    // DarkSky Time & date format
    // [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]

    // for now - later refactor

    // this gets origin
    axios
      .get(originWeatherURL, {
        method: "GET",
        contentType: "json"
      })
      .then(res => {
        console.log(res);
        // cons
        this.setState({
          weatherResults: {
            ...this.state.weatherResults,
            origin: res.data
          }
        });
      })
      .catch(error => {
        console.log(error);
      });

    // this gets destination
    axios
      .get(destinationWeatherURL, {
        method: "GET",
        contentType: "json"
      })
      .then(res => {
        console.log(res);
        this.setState({
          weatherResults: {
            ...this.state.weatherResults,
            destination: res.data
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getMiddlePoint = (p1Lat, p1Lng, p2Lat, p2Lng) => {
    const p1 = new window.google.maps.LatLng(p1Lat, p1Lng);
    const p2 = new window.google.maps.LatLng(p2Lat, p2Lng);
    const middleLatLng = window.google.maps.geometry.spherical.computeOffset(p1,
      window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 2,
      window.google.maps.geometry.spherical.computeHeading(p1, p2));
      console.log('MIDDLE POOOOOO', middleLatLng);
      return middleLatLng;
    // var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
    
  }
  //Method to handle change in Google Places autocomplete entry field
  // handleChange = address => {
  //   console.log(address);
  //   //Continuously update this.state.address to match what is put into input box
  //   this.setState({ address });
  // };

  //Method to handle change in Google Places autocomplete entry field
  handleChange = (address, id) => {
    // console.log('address inside of handleChange', address);
    //Continuously update this.state.address to match what is put into input box (just text)
    // console.log(address);
    console.log("handling change");
    const currentId = id;
    // console.log(currentId);
    // const tempObj = {};
    const tempObj = {};
    tempObj.address = address;
    // console.log(tempObj);
    // this.setState({ [currentId]: tempObj });
    this.setState({ [currentId]: tempObj });
  };

  //Method to handle select of suggested value
  handleSelect = (address, placeId, id) => {
    //Store displayed text value of address (properly formatted)
    // console.log('id inside of handleSelect', id);
    console.log("handleSelect address", address);
    const currentId = id;
    const tempObj = this.state[currentId];
    tempObj.address = address;
    this.setState({
      [currentId]: tempObj
    });
    // const textValue = address;
    // console.log(textValue);

    //Run address through Google Maps geocode function
    geocodeByAddress(address)
      .then(results => {
        //Returns object that contains results with formatted address, place ID, etc.
        console.log("handleSelect results", results);
        const dataObject = {
          placeID: results[0].place_id,
          address: results[0].formatted_address
          // displayAddress: this.state.address
        };

        this.setState({ [currentId]: dataObject });

        // Run results from geocodeByAddress through function that gets latitude and longitude based on address
        return getLatLng(results[0]);
      })
      .then(latLng => {
        //Update data object to include latitude and longitude data
        const updatedDataObject = this.state[currentId];
        updatedDataObject.latitude = latLng.lat;
        updatedDataObject.longitude = latLng.lng;
        this.setState({ [currentId]: updatedDataObject });
      })
      .catch(error => console.error("Error", error));
  };

  handleDateTimeChange = e => {
    const unixDate = new Date(e.target.value).getTime();
    this.setState({
      originDateTimeInSec: unixDate,
      originDateTime: e.target.value
    });
  };

  saveSearchResults = result => {
    // Get duration of trip in seconds from returned results object
    const tripInSeconds = result.routes[0].legs[0].duration.value;
    // Get origin time (Unix) from state
    const originTime = this.state.originDateTimeInSec;
    // Add two times together
    const time = tripInSeconds + originTime;
    // Get destination time in correct format using moment.js
    const destinationTime = moment.unix(time).format("YYYY-MM-DDTHH:mm");

    // Set trip data and destination date/time in state
    this.setState({
      tripData: result,
      destinationDateTime: destinationTime
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    {
      if (
        this.state.originData.latitude &&
        this.state.originData.longitude &&
        this.state.destinationData.latitude &&
        this.state.destinationData.longitude
      ) {
        this.setState({
          hasUserSubmitted: true
        });
      }
    }
  };

  handleReset = () => {
    this.setState({
      originData: {},
      destinationData: {},
      hasUserSubmitted: false,
      weatherResults: {
        origin: null,
        destination: null
      }
    });
  };

  handleRadioChange = e => {
    // console.log(e.target);
    const newObj = this.state.userTripPreferences;
    this.state.userTripPreferences[e.target.name] = e.target.value;
    this.setState({
      userTripPreferences: newObj
    });
  };

  handleCheckboxChange = e => {
    const newObj = this.state.userTripPreferences;
    this.state.userTripPreferences[e.target.name] = !this.state
      .userTripPreferences[e.target.name];
    this.setState({
      userTripPreferences: newObj
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header" />
        <LandingPage />

        <TripList />
        <main>
          {this.state.hasUserSubmitted ? (
            <div>
              <div>
                <MapWithADirectionsRenderer
                  originLat={this.state.originData.latitude}
                  originLong={this.state.originData.longitude}
                  destinationLat={this.state.destinationData.latitude}
                  destinationLong={this.state.destinationData.longitude}
                  userTripPreferences={this.state.userTripPreferences}
                  originDateTime={this.state.originDateTime}
                  saveSearchResults={this.saveSearchResults}
                />
                <button onClick={this.handleReset}>Reset</button>
              </div>{" "}
            </div>
          ) : (
            <form action="" onSubmit={this.handleSubmit}>
              <ReactDependentScript
                scripts={[
                  `https://maps.googleapis.com/maps/api/js?key=${
                    apiKeys.googleMaps
                  }&libraries=places,geometry,drawing`
                ]}
              >
                {/* Input for origin point search */}
                <LocationSearchInput
                  id="originData"
                  address={this.state.originData.address}
                  originData={this.state.originData}
                  handleChange={this.handleChange}
                  handleSelect={this.handleSelect}
                />
                {/* Input for destination point search */}
                <LocationSearchInput
                  id="destinationData"
                  address={this.state.destinationData.address}
                  destinationData={this.state.destinationData}
                  handleChange={this.handleChange}
                  handleSelect={this.handleSelect}
                />
                <DateTimeInput
                  dateString={this.state.originDateTime}
                  handleDateTimeChange={this.handleDateTimeChange}
                />
                <fieldset>
                  <label htmlFor="driving">Driving</label>
                  <input
                    type="radio"
                    id="driving"
                    name="travelMode"
                    value="DRIVING"
                    onChange={this.handleRadioChange} // className="no-display"
                    checked={
                      this.state.userTripPreferences.travelMode === "DRIVING"
                    }
                  />

                  <label htmlFor="bicycling">Bicycling</label>
                  <input
                    type="radio"
                    id="bicycling"
                    name="travelMode"
                    value="BICYCLING"
                    onChange={this.handleRadioChange}
                    checked={
                      this.state.userTripPreferences.travelMode === "BICYCLING"
                    }
                  />
                </fieldset>
                <fieldset>
                  <label htmlFor="ferries">Avoid ferries</label>
                  <input
                    type="checkbox"
                    id="ferries"
                    name="avoidFerries"
                    onChange={this.handleCheckboxChange}
                  />

                  <label htmlFor="highways">Avoid highways</label>
                  <input
                    type="checkbox"
                    id="highways"
                    name="avoidHighways"
                    onChange={this.handleCheckboxChange}
                  />

                  <label htmlFor="tolls">Avoid tolls</label>
                  <input
                    type="checkbox"
                    id="tolls"
                    name="avoidTolls"
                    onChange={this.handleCheckboxChange}
                  />
                </fieldset>
                <input type="submit" value="Get recommendation" />
              </ReactDependentScript>
            </form>
          )}

          <div className="App">
            <button onClick={this.getWeather}>Get weather</button>

            {this.state.weatherResults.origin !== null &&
              this.state.weatherResults.destination !== null && (
                <PointWeatherDisplay
                  originWeatherData={this.state.weatherResults.origin}
                  destinationWeatherData={this.state.weatherResults.destination}
                  originAddress={this.state.originData.address}
                  destinationAddress={this.state.destinationData.address}
                  // tempOrigin={this.state.weatherResults.origin.currently.temperature} tempDest={this.state.weatherResults.destination.currently.temperature}
                />
              )}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
