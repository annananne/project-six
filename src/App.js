// Import React, axios, React Router
import React, { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";

// Import React Google Places Autocomplete package
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

// Import Firebase
import firebase from "./firebase.js";

// Import API keys
import apiKeys from "./data/secrets";

// Import moment plugin
import moment from "moment";

// Import all styles
import "./styles/App.css";
import "./styles/LoginPage.css";
import "./styles/MainNav.css";
import "./styles/Dashboard.css";

// Import all components
import TripList from "./components/TripList.js";
import Dashboard from './components/Dashboard.js';
import CurrentTripInfo from './components/CurrentTripInfo';
import NewTripManager from "./components/NewTripManager";
import LoginPage from './components/LoginPage';
import MainNav from './components/MainNav.js'

// Initialize Firebase provider and auth variables
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

// App component begins
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

  

  // Function to handle user login
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

  // Function to handle user logout
  logOut = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null,
        guest: false
      });
    });
  };

  // Method to allow user to continue as guest
  continueAsGuest = () => {
    this.setState({
      guest: true
    });
  };

  // Function to save current trip to Firebase database
  saveTripToDB = () => {
    if (this.props.user === null) {
      return;
    }
    const tripName = window.prompt("Please enter a name for your trip.");
    if (tripName === null) {
      return;
    } else {
      const tripInfo = {
        title: tripName,
        originData: {
          address: this.state.originData.address,
          latitude: this.state.originData.latitude,
          longitude: this.state.originData.longitude,
          placeID: this.state.originData.placeID,
        },
        destinationData: {
          address: this.state.destinationData.address,
          latitude: this.state.destinationData.latitude,
          longitude: this.state.destinationData.longitude,
          placeID: this.state.destinationData.placeID,
        },
        originDateTime: this.state.originDateTime
      }
      this.dbRef.push(tripInfo);
      alert('Trip successfully saved!');
    }
  }

  

  // Method to handle weather API call
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

  // Method to get weather for all 5 trip points
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

  // Method to get middle point between any two established points
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

  //Method to handle select of suggested autocomplete place value
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

  // Method to handle change of date and time input value
  handleDateTimeChange = (e) => {
    const unixDate = new Date(e.target.value).getTime();
    this.setState({
      originDateTimeInSec: unixDate,
      originDateTime: e.target.value
    });
  };

  // Method to save search results
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

  // Method to handle submit of new trip form
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

  // Method to handle reset of application
  handleReset = () => {
    // alert('reset handle run');
    this.setState({
      hasUserSubmitted: false,
      originData: {},
      destinationData: {},
      userTripPreferences: {
        travelMode: "DRIVING",
        avoidFerries: false,
        avoidHighways: false,
        avoidTolls: false
      },
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
      areDirectionsVisible: false,
    });
  };

  // Method to handle change of any radio input (new trip form), i.e. transportation method
  handleRadioChange = (e) => {
    const newObj = this.state.userTripPreferences;
    this.state.userTripPreferences[e.target.name] = e.target.value;
    this.setState({
      userTripPreferences: newObj
    });
  };

  // Method to handle change of any checkbox input (new trip form), i.e. customizable travel options
  handleCheckboxChange = (e) => {
    const newObj = this.state.userTripPreferences;
    this.state.userTripPreferences[e.target.name] = !this.state
      .userTripPreferences[e.target.name];
    this.setState({
      userTripPreferences: newObj
    });
  };

  // Method to handle click of map marker to show/hide marker
  handleMarkerClick = markerIndex => {
    // const markerTitle = marker.wa.target.title;
    // console.log('ive been clicked', marker);
    const updatedArray = this.state.isLabelVisible;
    updatedArray[markerIndex] = !updatedArray[markerIndex];
    this.setState({
      isLabelVisible: updatedArray
    });
  };

 

  // Method to remove trip from database
  removeTrip = (e) => {
    const tripID = e.target.id;
    console.log(tripID);
    const tripRef = firebase.database().ref(`${this.state.user.uid}/${tripID}`);
    // console.log(tripRef);
    // const trip = tripRef.child(tripID);

    const confirmation = window.confirm("Are you sure you want to delete this trip? Once deleted, a trip cannot be recovered.")
    if (confirmation === true) {
      tripRef.remove();
    }
  };

  // Method to change active trip displayed on map
  changeActiveTrip = (e) => {
    console.log(e.target.id);
    const tripID = e.target.id;
    console.log('list of trips change active', this.state.listOfTrips);
    this.setState({
      originData: this.state.listOfTrips[tripID].originData,
      destinationData: this.state.listOfTrips[tripID].destinationData,
      originDateTime: this.state.listOfTrips[tripID].originDateTime
    }, () => {
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
    })
    
    // console.log(this.state.user.uid)
    // const activeTripRef = firebase.database().ref(`${this.state.user.uid}/${tripID}`);
    // console.log(activeTripRef);
    // console.log('origin', activeTripRef.originData, 'destination', activeTripRef.destinationData);

    // Find activetrip info 
    // Rerun function

    // console.log(activeTripRef);

    
  }

  // Lifecycle method - component did mount
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

  // Lifecycle method - component did update
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

  render() {
    return (
      <Router>
        <div className="App">
          {window.location.pathname !== '/' && <MainNav user={this.state.user} logIn={this.logIn} logOut={this.logOut} handleReset={this.handleReset} />
          }
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
            )} />
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
                changeActiveTrip={this.changeActiveTrip}
              />
            )} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
