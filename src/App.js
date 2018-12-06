import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import ReactDependentScript from "react-dependent-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import apiKeys from "./data/secrets";
import Map from "./components/Map.js";
import LocationSearchInput from './components/LocationSearchInput';
import DateTimeInput from "./components/DateTimeInput";
// import CurrentTripInfo from './components/CurrentTripInfo';
import moment from 'moment';


class App extends Component {
  constructor() {
    super();
    this.state = {
      address: "", //Stores address string on user input
      originData: {}, //Stores all data related to origin point (place_id, address, display address, longitude, latitude, + relevant weather info)
      destinationData: {}, //Stores all data related to destination point (place_id, address, display address, longitude, latitude, + relevant weather info)
      // we get this from user inputs
      // use moment.js (https://momentjs.com/ to format user inputs)
      userDateTime: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
    }
  }

  // API call to get weather data - uses state values of latitude and longitude //**needs to be able to take in origin or destination data object */
  // change the hardcoded long & lat below, prob this will receive parameters with the location info
  getWeather = () => {
    // DarkSky Time & date format
    // [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]
    const dateTime = `${this.state.userDateTime}:00`;
    axios
      .get(
      `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKeys.darkSky}/43.6532,-79.3832,${dateTime}`,

        {
          method: "GET",
          contentType: "json"
        }
      )
      .then(res => {
        console.log(res);
      });
  }

  //Method to handle change in Google Places autocomplete entry field
  handleChange = address => {
    console.log(address);
    //Continuously update this.state.address to match what is put into input box
    this.setState({ address });
  };

  //Method to handle select of suggested value
  handleSelect = address => {
    //Store displayed text value of address
    this.setState({
      address
    });
    //Run address through Google Maps geocode function
    geocodeByAddress(address)
      .then(results => {
        console.log("handleSelect results", results);
        const dataObject = {
          placeID: results[0].place_id,
          address: results[0].formatted_address,
          displayAddress: this.state.address
        };
        // const properties = props;
        this.setState({ originData: dataObject });

        // Run results from geocodeByAddress through function that gets latitude and longitude based on address
        return getLatLng(results[0]);
      })
      .then(latLng => {
        //Update data object to include latitude and longitude data
        const updatedDataObject = this.state.placeData;
        updatedDataObject.latitude = latLng.lat;
        updatedDataObject.longitude = latLng.lng;
        this.setState({ placeData: updatedDataObject });
        // console.log("Success", latLng.lat, latLng.lng)
      })
      .catch(error => console.error("Error", error));
  };

  handleDateTimeChange = (e) => {
    this.setState({
      userDateTime: e.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" />
        <main>
          <ReactDependentScript scripts={[`https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleMaps}&libraries=places`]}>
            {/* Input for origin point search */}
            <LocationSearchInput 
              id="originSearch" 
              origin={this.state.origin} 
              originData={this.state.originData} handleChange={this.handleChange} 
              handleSelect={this.handleSelect} 
            />

            {/* Input for destination point search */}
            <LocationSearchInput 
              id="destinationData" 
              address={this.state.address} 
              destinationData={this.state.destinationData} handleChange={this.handleChange} 
              handleSelect={this.handleSelect} 
            />
        <DateTimeInput 
          dateString={this.state.userDateTime}
          handleDateTimeChange={this.handleDateTimeChange}
        />
          </ReactDependentScript>

        
        {/* Google Map embed*/}
        <Map originData={this.state.originData} destinationData={this.state.destinationData} />

        <div className="App">
          <button 
            onClick={this.getWeather}
          >Get weather
          </button>
        </div>
      </main>
    </div>
  );
      
  }
}

export default App;
