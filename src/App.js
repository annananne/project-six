import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import "./LoginPage.css";
import "./Dashboard.css";
import ReactDependentScript from "react-dependent-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import apiKeys from "./data/secrets";
// import LocationSearchInput from "./components/LocationSearchInput";
import firebase from "./firebase.js";
import TripList from "./components/TripList.js";
// import NewTripForm from "./components/NewTripForm.js";
import Dashboard from './components/Dashboard.js';
import CurrentTripInfo from './components/CurrentTripInfo';
// import DateTimeInput from "./components/DateTimeInput";
import PointWeatherDisplay from "./components/PointWeatherDisplay";
import NewTripManager from "./components/NewTripManager";
import LoginPage from './components/LoginPage';
import SidebarMain from './components/SidebarMain';
import MainNav from './components/MainNav.js'
import moment from "moment";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom";


// Google provider & auth module
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {

  constructor() {
    super();
    this.state = {
      listOfTrips: {},
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
      tripData: null,
      originDateTimeInSec: new Date().getTime() / 1000,
      originDateTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      destinationDateTime: "",
      weatherRequestInfo: {},
      weatherResults: [],
      receivedAllWeatherData: false,
      user: null,
      guest: null,
      isLabelVisible: [
        false, false, false, false, false
      ],
      areDirectionsVisible: true,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState(
          {
            user: user
          },
          () => {
            // create reference specific to user
            this.dbRef = firebase.database().ref(`/${this.state.user.uid}`);
            // attaching our event listener to firebase
            this.dbRef.on("value", snapshot => {
              console.log(snapshot.val());
              this.setState({
                listOfTrips: snapshot.val() || {}
              })
            });
          }
        );
      }
    });
  }

  // function to login
  logIn = (e) => {
    if (e.target.id === 'guest') {
      this.setState({
        guest: true
      })
    } else {
      auth.signInWithPopup(provider).then(result => {
        console.log(result);
        this.setState(
          {
            user: result.user,
            guest: false
          }
        );
      });
    }
    
  };

  // function to logout
  logOut = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null,
        guest: false
      });
    });
  };

  saveTripToDB = () => {
    alert('trip successfully saved!');
    if (this.props.user === null) {
      return;
    }
    const tripInfo = {
      origin: this.state.originData,
      destination: this.state.destinationData,
      originDateTime: this.state.originDateTime
    }
    this.dbRef.push(tripInfo);
  }

  componentDidUpdate(previousProps, previousState) {
    // only calculate the middle points when the tripData first gets into the App state
    if (
      this.state.tripData !== previousState.tripData &&
      previousState.tripData === null
    ) {
      // if (this.state.hasUserSubmitted) {
      //   alert('runs');
      // COORDS calculations
      // Calculate point coordinates and prepare them for weather requests

      const originLat = this.state.originData.latitude;
      const originLng = this.state.originData.longitude;
      const destinationLat = this.state.destinationData.latitude;
      const destinationLng = this.state.destinationData.longitude;

      // MIDDLE MAIN POINT
      const middleMainCoords = this.getMiddlePoint(originLat, originLng, destinationLat, destinationLng);
      const middleMainLat = middleMainCoords.lat();
      const middleMainLng = middleMainCoords.lng();

      // MIDDLE FIRST HALF POINT
      const middleFirstHalfCoords = this.getMiddlePoint(originLat, originLng, middleMainLat, middleMainLng);
      // MIDDLE SECOND HALF POINT
      const middleSecondHalfCoords = this.getMiddlePoint(middleMainLat, middleMainLng, destinationLat, destinationLng);

      // maybe we should also calculate and put in the time

      // TIME calculations
      const { originDateTime } = this.state;
      const originMoment = moment(originDateTime);
      const dateTimeFormat = "YYYY-MM-DDTHH:mm";
      // duration of the trip in seconds
      // if there are ever multiple legs, we can use legs[legsArray.length-1]
      const tripSeconds = this.state.tripData.routes[0].legs[0].duration.value;

      const middleFirstHalfMoment = moment(originMoment).add(Math.round(tripSeconds * 0.25), 'seconds');
      const middleMainMoment = moment(originMoment).add(Math.round(tripSeconds * 0.5), 'seconds');
      const middleSecondHalfMoment = moment(originMoment).add(Math.round(tripSeconds * 0.75), 'seconds');
      const destinationMoment = moment(originMoment).add(tripSeconds, 'seconds');

      const weatherRequestInfo = {
        origin: {
          lat: originLat,
          lng: originLng,
          dateTime: originDateTime
        },
        middleFirstHalf: {
          lat: middleFirstHalfCoords.lat(),
          lng: middleFirstHalfCoords.lng(),
          dateTime: middleFirstHalfMoment.format(dateTimeFormat)
        },
        middleMain: {
          lat: middleMainLat,
          lng: middleMainLng,
          dateTime: middleMainMoment.format(dateTimeFormat)
        },
        middleSecondHalf: {
          lat: middleSecondHalfCoords.lat(),
          lng: middleSecondHalfCoords.lng(),
          dateTime: middleSecondHalfMoment.format(dateTimeFormat)
        },
        destination: {
          lat: destinationLat,
          lng: destinationLng,
          dateTime: destinationMoment.format(dateTimeFormat)
        },
      }

      this.setState({
        // allPointCoordsCalculated: true,
        weatherRequestInfo: weatherRequestInfo
      });
      // sendWeatherData requests right away
      this.getWeather(weatherRequestInfo);

    }
  }
  // API call to get weather data - uses state values of latitude and longitude //**needs to be able to take in origin or destination data object */
  // change the hardcoded long & lat below, prob this will receive parameters with the location info

  getWeatherForPoint = (lat, lng, datetime, pointName) => {
    const dateTimeFormatted = `${datetime}:00`;
    let weatherRequestURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKeys.darkSky}/`;
    // adding relevant parameters for the request
    weatherRequestURL += `${lat},${lng},${dateTimeFormatted}`;

    // send the weather request to the API
    return (
      axios
        .get(weatherRequestURL, {
          method: "GET",
          contentType: "json"
        })
        // .then(res => {
        //   // console.log(`Got weather data successfully for ${pointName}`);
        //   // console.log(res.data);
        //   this.setState({
        //     weatherResults: {
        //       ...this.state.weatherResults,
        //       [pointName]: res.data
        //     }
        //   });
        // })
        .catch(error => {
          console.log(`Error when getting weather for ${pointName}: ${error}`);
        })
    );
  };

  // gets weather for all the points
  getWeather = weatherRequestInfo => {
    const weatherArray = [];
    Object.keys(weatherRequestInfo).forEach(pointName => {
      const point = weatherRequestInfo[pointName];
      weatherArray.push(
        this.getWeatherForPoint(point.lat, point.lng, point.dateTime, pointName)
      );
    });
    Promise.all(weatherArray).then(res => {
      res.map(object => {
        const weatherResults = res.map(object => {
          return object.data;
        });
        // const weatherMarkerData = this.state.weatherResults;
        // weatherMarkerData.push(object.data);

        // const receivedResults = weatherMarkerData;
        const gotAllWeather = weatherResults.length === 5;
        // debugger
        this.setState({
          weatherResults: weatherResults,
          receivedAllWeatherData: gotAllWeather,
        });
      });
    });
  };

  getMiddlePoint = (p1Lat, p1Lng, p2Lat, p2Lng) => {
    const p1 = new window.google.maps.LatLng(p1Lat, p1Lng);
    const p2 = new window.google.maps.LatLng(p2Lat, p2Lng);
    const middleLatLng = window.google.maps.geometry.spherical.computeOffset(
      p1,
      window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 2,
      window.google.maps.geometry.spherical.computeHeading(p1, p2)
    );
    // console.log("Point coordinates found", middleLatLng);
    return middleLatLng;
  };
  //Method to handle change in Google Places autocomplete entry field
  handleChange = (address, id) => {
    //Continuously update this.state.address to match what is put into input box (just text)
    const currentId = id;
    const tempObj = {};
    tempObj.address = address;
    this.setState({ [currentId]: tempObj });
  };

  //Method to handle select of suggested value
  handleSelect = (address, placeId, id) => {
    //Store displayed text value of address (properly formatted)
    const currentId = id;
    const tempObj = this.state[currentId];
    tempObj.address = address;
    this.setState({
      [currentId]: tempObj
    });

    //Run address through Google Maps geocode function
    geocodeByAddress(address)
      .then((results) => {
        //Returns object that contains results with formatted address, place ID, etc.
        const dataObject = {
          placeID: results[0].place_id,
          address: results[0].formatted_address
        };
        console.log("data object in geocode", dataObject);
        this.setState({ [currentId]: dataObject });

        // Run results from geocodeByAddress through function that gets latitude and longitude based on address
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        //Update data object to include latitude and longitude data
        const updatedDataObject = this.state[currentId];
        updatedDataObject.latitude = latLng.lat;
        updatedDataObject.longitude = latLng.lng;
        console.log("updatedDataObject in LatLng", updatedDataObject);
        this.setState({ [currentId]: updatedDataObject });
      })
      .catch((error) => console.error("Error", error));
  };

  handleDateTimeChange = (e) => {
    const unixDate = new Date(e.target.value).getTime();
    this.setState({
      originDateTimeInSec: unixDate,
      originDateTime: e.target.value
    });
  };

  saveSearchResults = (result) => {
    // Get duration of trip in seconds from returned results object
    const tripInSeconds = result.routes[0].legs[0].duration.value;
    // Get origin time (Unix) from state
    const originTime = this.state.originDateTimeInSec;
    // console.log("trip in seconds", tripInSeconds, "origin time", originTime);
    // Add two times together
    const time = tripInSeconds + originTime;
    // Get destination time in correct format using moment.js
    const destinationTime = moment.unix(time).format("YYYY-MM-DDTHH:mm");
    // console.log("origin time", originTime, "destination time", destinationTime);

    // Set trip data and destination date/time in state
    this.setState({
      tripData: result,
      destinationDateTime: destinationTime
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
    {
      if (
        this.state.originData.latitude &&
        this.state.originData.longitude &&
        this.state.destinationData.latitude &&
        this.state.destinationData.longitude
      ) {
        console.log("all vals");
        this.setState({
          hasUserSubmitted: true
        });
      }
    }
  };

  handleReset = () => {
    // alert('reset handle run');
    this.setState({
      hasUserSubmitted: false,
      originData: {},
      destinationData: {},
      // new
      directions: null,
      tripData: null,
      // reset it to not deal with issue of inability 
      // to request google maps directions for
      // time in the past
      originDateTimeInSec: new Date().getTime() / 1000,
      originDateTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      destinationDateTime: "",
      weatherRequestInfo: {},
      weatherResults: [],
      receivedAllWeatherData: false,
      isLabelVisible: [
        false, false, false, false, false
      ],
    });
  };

  handleRadioChange = (e) => {
    const newObj = this.state.userTripPreferences;
    this.state.userTripPreferences[e.target.name] = e.target.value;
    this.setState({
      userTripPreferences: newObj
    });
  };

  handleCheckboxChange = (e) => {
    const newObj = this.state.userTripPreferences;
    this.state.userTripPreferences[e.target.name] = !this.state
      .userTripPreferences[e.target.name];
    this.setState({
      userTripPreferences: newObj
    });
  };

  handleMarkerClick = markerIndex => {
    // const markerTitle = marker.wa.target.title;
    // console.log('ive been clicked', marker);
    const updatedArray = this.state.isLabelVisible;
    updatedArray[markerIndex] = !updatedArray[markerIndex];
    this.setState({
      isLabelVisible: updatedArray
    });
  };

  continueAsGuest = () => {
    this.setState({
      guest: true
    });
  };
  render() {
    return (
      <Router>
        <div className="App">
          <MainNav user={this.state.user} logIn={this.logIn} logOut={this.logOut} />
        {/* {this.state.user !== null || this.state.guest === true && <MainNav user={this.state.user} logIn={this.logIn} logOut={this.logOut}/>
        } */}
        {/* TO SEE USER'S NAME AND PICTURE, I don't know where to put it: */}

        {/* {this.state.user ?
            <div>
              <div className="user-profile clearfix">
                <img className="photoURL" src={this.state.user.photoURL} />
              </div>
              <p className="your-name">Hello, {this.state.user.displayName}!</p>
              </div>
            :
              <div>
                <p>You must be logged in to see.</p>
              </div>
          } */}

        <div>
          {this.state.user && <Redirect to="/dashboard" />}
          {this.state.guest && <Redirect to="/dashboard" />}
            <Route exact path="/" render={props => (
              <LoginPage
                {...props}
                user={this.state.user}
                guest={this.state.guest}
                logIn={this.logIn}
              />
            )}/>
          <Route
            path="/dashboard"
            render={props => (
              <Dashboard
                {...props}
                user={this.state.user}
                guest={this.state.guest}
              />
            )}
          />

          {/* <Route path="/newtrip" render={props => <TripManager {...props} originData={this.state.originData} destinationData={this.state.destinationData} userTripPreferences={this.state.userTripPreferences} userTripPreferences={this.state.userTripPreferences} originDateTime={this.state.originDateTime} saveSearchResults={this.saveSearchResults} handleDirClick={this.handleDirClick} handleMarkerClick={this.handleMarkerClick} markers={this.state.markers} handleReset={this.handleReset} handleSubmit={this.handleSubmit} handleChange={this.handleChange} handleSelect={this.handleSelect} handleDateTimeChange={this.handleDateTimeChange} handleRadioChange={this.handleRadioChange} handleCheckboxChange={this.handleCheckboxChange} />} /> */}

          <Route
            path="/newtrip"
            render={props => (
              <NewTripManager
                {...props}
                originData={this.state.originData}
                destinationData={this.state.destinationData}
                userTripPreferences={this.state.userTripPreferences}
                userTripPreferences={this.state.userTripPreferences}
                originDateTime={this.state.originDateTime}
                saveSearchResults={this.saveSearchResults}
                handleDirClick={this.handleDirClick}
                handleMarkerClick={this.handleMarkerClick}
                isLabelVisible={this.state.isLabelVisible}
                markers={this.state.markers}
                handleReset={this.handleReset}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                handleSelect={this.handleSelect}
                handleDateTimeChange={this.handleDateTimeChange}
                handleRadioChange={this.handleRadioChange}
                handleCheckboxChange={this.handleCheckboxChange}
                weatherResults={this.state.weatherResults}
                hasUserSubmitted={this.state.hasUserSubmitted} // new
                receivedAllWeatherData={this.state.receivedAllWeatherData}
                areDirectionsVisible={this.state.areDirectionsVisible}
                handleSidebarChange={this.state.handleSidebarChange}

                // new
                handleSavingTripToDB={this.saveTripToDB}

                // new (used for disabling the save trip button)
                user={this.state.user}

              />
            )}
          />
          <Route path="/tripdetails" render={props => <CurrentTripInfo {...props} markers={this.state.markers} userTripPreferences={this.state.userTripPreferences} areDirectionsVisible={this.state.areDirectionsVisible} handleSidebarChange={this.state.handleSidebarChange} />} />
          <Route path="/alltrips" render={() => (
            <TripList
              user={this.state.user}
              listOfTrips={this.state.listOfTrips}
            />
          )} />
        </div>
        </div>
      </Router>
    );
  }
}

export default App;
