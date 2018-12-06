import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import ReactDependentScript from "react-dependent-script";
import {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import apiKeys from "./data/secrets";
import LocationSearchInput from './components/LocationSearchInput';
import Map from "./components/Map.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      originData: {
        address: ''
      },//Stores all data related to origin point (place_id, address, display address, longitude, latitude, + relevant weather info)
      destinationData: {
        address: ''
      }, //Stores all data related to destination point (place_id, address, display address, longitude, latitude, + relevant weather info)
      // desinationDataObject: {}
    };
  }

  // API call to get weather data - uses state values of latitude and longitude //**needs to be able to take in origin or destination data object */
  getWeather = () => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${
          apiKeys.darkSky
        }/${this.state.originData.latitude},${this.state.originData.longitude}`,
        {
          method: "GET",
          contentType: "json"
        }
      )
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Method to handle change in Google Places autocomplete entry field
  handleChange = (address, id) => {
    // console.log('address inside of handleChange', address);
    //Continuously update this.state.address to match what is put into input box (just text)
    // console.log(address);
    console.log("handling change")
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
    console.log('handleSelect address', address);
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
          address: results[0].formatted_address,
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

  render() {
    return <div className="App">
        <header className="App-header" />
        <main>
          <ReactDependentScript scripts={[`https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleMaps}&libraries=places`]}>
            {/* Input for origin point search */}
            <LocationSearchInput id="originData" address={this.state.originData.address} originData={this.state.originData} handleChange={this.handleChange} handleSelect={this.handleSelect}/>

            {/* Input for destination point search */}
            <LocationSearchInput id="destinationData" address={this.state.destinationData.address} destinationData={this.state.destinationData} handleChange={this.handleChange} handleSelect={this.handleSelect} />
          </ReactDependentScript>

          {/* Google Map embed*/}
          <Map originData={this.state.originData} destinationData={this.state.destinationData} />

          <div className="App">
            <button onClick={this.getWeather}>Get weather</button>
          </div>
        </main>
      </div>;
  }
}

export default App;
