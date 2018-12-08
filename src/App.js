import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import ReactDependentScript from "react-dependent-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import apiKeys from "./data/secrets";
import LocationSearchInput from "./components/LocationSearchInput";
// import Map from "./components/Map.js";
import firebase from "./firebase.js"
import LandingPage from "./components/LandingPage.js"
import TripList from "./components/TripList.js";
import MapWithADirectionsRenderer from "./components/DirectionsMap.js";
import DateTimeInput from "./components/DateTimeInput";
import PointWeatherDisplay from "./components/PointWeatherDisplay";
// import CurrentTripInfo from './components/CurrentTripInfo';
import moment from 'moment';


class App extends Component {
  constructor() {
    super();
    this.state = { 
      hasUserSubmitted: false,
      originData: {
        address: ""
      },
      // originData: {
      //   address:"Toronto, ON, Canada",
      //   latitude: 43.653226,
      //   longitude: -79.38318429999998,
      //   placeID: "ChIJpTvG15DL1IkRd8S0KlBVNTI"
      // },
      //Stores all data related to origin point (place_id, address, display address, longitude, latitude, + relevant weather info)
      destinationData: {
        address: ""
      }, // desinationDataObject: {} //Stores all data related to destination point (place_id, address, display address, longitude, latitude, + relevant weather info)
      // destinationData: {}, // we get this from user inputs //Stores all data related to destination point (place_id, address, display address, longitude, latitude, + relevant weather info)
      // use moment.js (https://momentjs.com/ to format user inputs)
      originDateTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"), 
      destinationDateTime: '', // to be set when directions are calculated 
      weatherResults: { 
        origin: null, // middleOne
        // middleTwo (actual half of distance)
        // middleThree
        destination: null 
      },
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
      }/${this.state.originData.latitude},${this.state.originData.longitude},${dateTime}`;

    const destinationWeatherURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${
      apiKeys.darkSky
      }/${this.state.destinationData.latitude},${this.state.destinationData.longitude},${dateTime}`;
    // DarkSky Time & date format
    // [YYYY]-[MM]-[DD]T[HH]:[MM]:[SS][timezone]

    // for now - later refactor

    // this gets origin
    axios.get(originWeatherURL,
        {
          method: "GET",
          contentType: "json"
        }
      )
      .then(res => {
        console.log(res);
        // cons
        this.setState({
          weatherResults: {
            ...this.state.weatherResults,
            origin: res.data,
          }
        })
      })
      .catch(error => {
        console.log(error);
      });

      // this gets destination
    axios.get(destinationWeatherURL,
        {
          method: "GET",
          contentType: "json"
        }
      )
      .then(res => {
        console.log(res);
        this.setState({
          weatherResults: {
            ...this.state.weatherResults,
            destination: res.data,
          }
        })
      })
      .catch(error => {
        console.log(error);
      });
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

  handleDateTimeChange = (e) => {
    this.setState({
      originDateTime: e.target.value
    })
  }

  handleSubmit = (e) => {
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
      },
    })
  }

  render() {
    return <div className="App">
        <header className="App-header" />
        <LandingPage />

        <TripList />
        <main>
          {this.state.hasUserSubmitted ? <div>
              <MapWithADirectionsRenderer originLat={this.state.originData.latitude} originLong={this.state.originData.longitude} destinationLat={this.state.destinationData.latitude} destinationLong={this.state.destinationData.longitude} />
              <button onClick={this.handleReset}>Reset</button>
            </div> : <form action="" onSubmit={this.handleSubmit}>
              <ReactDependentScript scripts={[`https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleMaps}&libraries=places,geometry,drawing`]}>
                {/* Input for origin point search */}
                <LocationSearchInput id="originData" address={this.state.originData.address} originData={this.state.originData} handleChange={this.handleChange} handleSelect={this.handleSelect} />

                {/* Input for destination point search */}
                <LocationSearchInput id="destinationData" address={this.state.destinationData.address} destinationData={this.state.destinationData} handleChange={this.handleChange} handleSelect={this.handleSelect} />

                <DateTimeInput dateString={this.state.originDateTime} handleDateTimeChange={this.handleDateTimeChange} />

                <input type="submit" value="Get recommendation" />
              </ReactDependentScript>
            </form>}

          <div className="App">
            <button onClick={this.getWeather}>Get weather</button>

            {
              this.state.weatherResults.origin !== null && this.state.weatherResults.destination !== null && 
              <PointWeatherDisplay 
                originWeatherData={this.state.weatherResults.origin}
                destinationWeatherData={this.state.weatherResults.destination}
                originAddress={this.state.originData.address} 
                destinationAddress={this.state.destinationData.address} 
                // tempOrigin={this.state.weatherResults.origin.currently.temperature} tempDest={this.state.weatherResults.destination.currently.temperature} 
              />
            }
          </div>
        </main>
      </div>;
  }
}


export default App;
