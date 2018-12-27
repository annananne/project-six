// Import React, axios, React Router
import React, { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
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
      listOfTrips: {}, // Object to store all user saved trip objects; pulled from Firebase on load of dashboard
      hasUserSubmitted: false, // Boolean to determine whether user has submitted new trip form
      originData: { address: "" }, // Object to store all data relating to trip origin point (address, place ID, latitude, longitude)
      destinationData: { address: "" }, // Object to store all data relating to trip destination point (address, place ID, latitude, longitude)
      userTripPreferences: { // Object to store user trip preferences
        travelMode: "DRIVING",
        avoidFerries: false,
        avoidHighways: false,
        avoidTolls: false
      },
      tripData: null, // Object to store routes/directions for trip from Google Maps API call
      originDateTimeInSec: moment(new Date()).add(15, "minutes").valueOf() / 1000, // Numerical value of date and time user will leave their origin point (Unix time) - add 15 minutes to account for user input time
      originDateTime: moment(new Date()).add(15, "minutes").format("YYYY-MM-DDTHH:mm"), // String to store date and time user will leave their origin point - add 15 minutes to account for user input time
      destinationDateTime: "", // String to store date and time user will arrive at their detination point
      weatherRequestInfo: {}, // Object to store date/time, latitude and longitude of all five equidistant points of journey
      weatherResults: [], // Array to store weather data from API call for all five equidistant points of journey
      receivedAllWeatherData: false, // Boolean to determine whether all weather data has been returned from API
      user: null, // Object to store all user data from Google auth (if user is logged in)
      guest: null, // Boolean to determine whether user is in guest mode or not
      isLabelVisible: [ // Array to store boolean visibility value for each marker on the map
        false, false, false, false, false
      ],
    };
  }

  // Function to handle user login
  logIn = (e) => {
    // Check if clicked element is guest button, if yes, set state of guest to true
    if (e.target.id === 'guest') {
      this.setState({
        guest: true
      })
      // If no:
    } else {
      // Call Firebase sign in method using Google authorization, then store user info in state and change guest status to "false"
      auth.signInWithPopup(provider).then(result => {
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
    // Call Firebase sign out method, then empty user info object and set state of guest to "true"
    auth.signOut().then(() => {
      this.setState({
        user: null,
        guest: true
      });
    });
  };

  // Function to save current trip to Firebase database
  saveTripToDB = () => {
    // If there is no user (i.e. user not logged in), prompt alert to let user know they must log in
    if (this.state.user === null) {
      alert("You must log in to save trips to your dashboard.");
      return;
    }

    // Prompt user to enter a trip name
    const tripName = window.prompt("Please enter a name for your trip.");
    // If user selects cancel, terminate trip save process
    if (!tripName) {
      return;
      // If user enters valid trip name, then:
    } else {
      // Store all info of current trip in a temporary object
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
      // Push object with trip info to Firebase
      this.dbRef.push(tripInfo);
      // Alert user that their trip has been successful saved
      alert('Your trip has been saved!');
    }
  }

  // Method to handle weather API call - takes parameters of latitude, longitude, date/time and name of point passed through
  getWeatherForPoint = (lat, lng, datetime, pointName) => {
    // Format date and time for API call
    const dateTimeFormatted = `${datetime}:00`;
    // Create weather request URL
    let weatherRequestURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${apiKeys.darkSky}/`;
    // Add relevant parameters for the request
    weatherRequestURL += `${lat},${lng},${dateTimeFormatted}`;

    // Make call to DarkSky API
    return (
      axios
        .get(weatherRequestURL, {
          method: "GET",
          contentType: "json"
        })
        .catch(error => {
          console.log(`Error when getting weather for ${pointName}: ${error}`);
        })
    );
  };

  // Method to get weather for all 5 trip points, taking in object of weather request points
  getWeather = weatherRequestInfo => {
    // Initialize empty array to store weather data for all five points
    const weatherArray = [];
    // Use each of the point names from object that has been passed through to grab object containing point data
    Object.keys(weatherRequestInfo).forEach(pointName => {
      const point = weatherRequestInfo[pointName];
      // Make API call using getWeatherForPoint method for each of the 5 points; push each result containing weather data into temporary weather array
      weatherArray.push(
        this.getWeatherForPoint(point.lat, point.lng, point.dateTime, pointName)
      );
    });
    // When all 5 points have been returned, map over array and store returned values
    Promise.all(weatherArray).then(res => {
      res.map(object => {
        const weatherResults = res.map(object => {
          return object.data;
        });
        // Establish boolean variable that determines whether all 5 results have been returned
        const gotAllWeather = weatherResults.length === 5;
        // Update state of weather results array and set boolean indicating whether all data has been received to true or false, based on whether all 5 results have been returned
        this.setState({
          weatherResults: weatherResults,
          receivedAllWeatherData: gotAllWeather,
        });
      });
    });
  };

  // Method to get middle point between any two established points
  getMiddlePoint = (p1Lat, p1Lng, p2Lat, p2Lng) => {
    // Pass inputs of latitude and longitude for each point through Google Maps API (geometry library) to calculate input
    const p1 = new window.google.maps.LatLng(p1Lat, p1Lng);
    const p2 = new window.google.maps.LatLng(p2Lat, p2Lng);
    const middleLatLng = window.google.maps.geometry.spherical.computeOffset(
      p1,
      window.google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 2,
      window.google.maps.geometry.spherical.computeHeading(p1, p2)
    );
    // Return latitude and longitude of midpoint
    return middleLatLng;
  };

  // Method to handle change in Google Places autocomplete entry field
  handleChange = (address, id) => {
    //Continuously update this.state.address to match what is put into input box (just text)
    const currentId = id;
    const tempObj = {};
    tempObj.address = address;
    this.setState({ [currentId]: tempObj });
  };

  // Method to handle select of suggested autocomplete place value
  handleSelect = (address, placeId, id) => {
    // Target either originData or destinationData object in state based on id of input
    const currentId = id;
    const tempObj = this.state[currentId];
    // Store displayed text value of address (properly formatted) in object and set to state
    tempObj.address = address;
    this.setState({
      [currentId]: tempObj
    });

    // Run address through Google Maps geocode function
    geocodeByAddress(address)
      .then((results) => {
        // Store results of formatted address and place ID in object and set to state
        const dataObject = {
          placeID: results[0].place_id,
          address: results[0].formatted_address
        };
        this.setState({ [currentId]: dataObject });
        // Run results from geocodeByAddress through function that gets latitude and longitude based on address
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        // Update data object to include latitude and longitude data and set to state
        const updatedDataObject = this.state[currentId];
        updatedDataObject.latitude = latLng.lat;
        updatedDataObject.longitude = latLng.lng;
        this.setState({ [currentId]: updatedDataObject });
      })
      .catch((error) => console.error("Error", error));
  };

  // Method to handle change of date and time input value
  handleDateTimeChange = (e) => {
    // Store Unix date and time in variable
    const unixDate = new Date(e.target.value).getTime();
    // Update state of both regular/moment format date/time and Unix date/time
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

  // Method to handle submit of new trip form
  handleSubmit = (e) => {
    // Prevent default refresh
    e.preventDefault();
    // Check if origin and destination both have latitude and longitude, if yes, set state of user submission to true
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
  };

  // Method to handle reset of application
  handleReset = () => {
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
      tripData: null,
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

  // Method to handle change of any radio input (new trip form), i.e. transportation method
  handleRadioChange = (e) => {
    // Duplicate current user trip preferences from state into temporary object
    const newObj = this.state.userTripPreferences;
    // Store value of clicked radio button in relevant key and update user trip preferences object in state
    newObj[e.target.name] = e.target.value;
    this.setState({
      userTripPreferences: newObj
    });
  };

  // Method to handle change of any checkbox input (new trip form), i.e. customizable travel options
  handleCheckboxChange = (e) => {
    // Duplicate current user trip preferences into temporary object
    const newObj = this.state.userTripPreferences;
    // Set value of checked box in relevant key to opposite of current boolean value and update user trip preferences object in state
    newObj[e.target.name] = !newObj[e.target.name];
    this.setState({
      userTripPreferences: newObj
    });
  };

  // Method to handle click of map marker to show/hide marker
  handleMarkerClick = markerIndex => {
    // Duplicate array with visibility status of labels into temporary array
    const updatedArray = this.state.isLabelVisible;
    // Set value at selected index in array to opposite of its current boolean value and update state of label visibility array
    updatedArray[markerIndex] = !updatedArray[markerIndex];
    this.setState({
      isLabelVisible: updatedArray
    });
  };

  // Method to remove trip from database
  removeTrip = (e) => {
    // Store id of selected trip
    const tripID = e.target.id;
    // Establish reference to trip in Firebase database of logged in user
    const tripRef = firebase.database().ref(`${this.state.user.uid}/${tripID}`);
    // Trigger confirm prompt with deletion warning; if true (i.e. user selects "OK"), remove trip from database
    const confirmation = window.confirm("Are you sure you want to delete this trip? Once deleted, a trip cannot be recovered.")
    if (confirmation === true) {
      tripRef.remove();
    }
  };

  // Method to change active trip displayed on map
  // changeActiveTrip = (e) => {
  //   console.log(e.target.id);
  //   const tripID = e.target.id;
  //   console.log('list of trips change active', this.state.listOfTrips);
  //   this.setState({
  //     originData: this.state.listOfTrips[tripID].originData,
  //     destinationData: this.state.listOfTrips[tripID].destinationData,
  //     originDateTime: this.state.listOfTrips[tripID].originDateTime
  //   }, () => {
  //     if (
  //       this.state.originData.latitude &&
  //       this.state.originData.longitude &&
  //       this.state.destinationData.latitude &&
  //       this.state.destinationData.longitude
  //     ) {
  //       console.log("all vals");
  //       this.setState({
  //         hasUserSubmitted: true
  //       });
  //     }
  //   })
  // }

  // Lifecycle method - component did mount
  componentDidMount() {
    // On component did mount, check change of authorization state
    auth.onAuthStateChanged(user => {
      // If there is a user, set state of user
      if (user) {
        this.setState(
          {
            user: user
          },
          () => {
            // Create a reference specific to the user
            this.dbRef = firebase.database().ref(`/${this.state.user.uid}`);
            // Attach the event listener to firebase to listen for changes; on change, update list of trips in state
            this.dbRef.on("value", snapshot => {
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
    // Check if this is the first instance of trip data entering state (i.e. changing from null to a populated value)
    if (
      this.state.tripData !== previousState.tripData &&
      previousState.tripData === null
    ) {

      // Set temporary variables to store latitude and longitude of origin and destination
      const originLat = this.state.originData.latitude;
      const originLng = this.state.originData.longitude;
      const destinationLat = this.state.destinationData.latitude;
      const destinationLng = this.state.destinationData.longitude;

      // Get overall middle point coordinates (latitude/longitude) using getMiddlePoint method and origin/destination points
      const middleMainCoords = this.getMiddlePoint(originLat, originLng, destinationLat, destinationLng);
      const middleMainLat = middleMainCoords.lat();
      const middleMainLng = middleMainCoords.lng();

      // Get midpoint between origin and overall trip midpoint using getMiddlePoint method
      const middleFirstHalfCoords = this.getMiddlePoint(originLat, originLng, middleMainLat, middleMainLng);
      // Get midpoint between overall trip midpoint and destination point using getMiddlePoint method
      const middleSecondHalfCoords = this.getMiddlePoint(middleMainLat, middleMainLng, destinationLat, destinationLng);

      // Store origin date/time, origin date/time in moment format, and date/time format in temporary variables
      const { originDateTime } = this.state;
      const originMoment = moment(originDateTime);
      const dateTimeFormat = "YYYY-MM-DDTHH:mm";
      // Store the duration of the trip in seconds; if there are ever multiple legs, we can use legs[legsArray.length-1]
      const tripSeconds = this.state.tripData.routes[0].legs[0].duration.value;
      // Get timing of all four remaining trip points in moment format
      const middleFirstHalfMoment = moment(originMoment).add(Math.round(tripSeconds * 0.25), 'seconds');
      const middleMainMoment = moment(originMoment).add(Math.round(tripSeconds * 0.5), 'seconds');
      const middleSecondHalfMoment = moment(originMoment).add(Math.round(tripSeconds * 0.75), 'seconds');
      const destinationMoment = moment(originMoment).add(tripSeconds, 'seconds');
      // Create an object to store latitude, longitude, and date/time of all 5 trip points
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
      // Set state of weather request info to object with five points
      this.setState({
        // allPointCoordsCalculated: true,
        weatherRequestInfo: weatherRequestInfo
      });
      // Call method to get weather for the 5 points, passing in object of weather request points as data
      this.getWeather(weatherRequestInfo);
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          {/* If there is a pathname in URL, show main navigation (to ensure it is not shown on home page) */}
          {window.location.pathname !== '/' && <MainNav user={this.state.user} logIn={this.logIn} logOut={this.logOut} handleReset={this.handleReset} />
          }
          <div>

            {/* When exact path contains no pathname in URL, show login page */}
            <Route exact path="/" render={props => (
              <LoginPage
                {...props}
                user={this.state.user}
                guest={this.state.guest}
                logIn={this.logIn}
              />
            )} />

            {/* When path is "/dashboard", show dashboard */}
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

            {/* If there is either a user or guest status is true, redirect to dashboard */}
            {(this.state.user || this.state.guest) && <Redirect to="/dashboard" />}

            {/* When path is "/newtrip", show new trip manager */}
            <Route
              path="/newtrip"
              render={props => (
                <NewTripManager
                  {...props}
                  originData={this.state.originData}
                  destinationData={this.state.destinationData}
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
                  hasUserSubmitted={this.state.hasUserSubmitted}
                  receivedAllWeatherData={this.state.receivedAllWeatherData}
                  handleSidebarChange={this.state.handleSidebarChange}
                  handleSavingTripToDB={this.saveTripToDB}
                  user={this.state.user}

                />
              )}
            />

            {/* When path is "/tripdetails", show current trip info component */}
            <Route path="/tripdetails" render={props => <CurrentTripInfo {...props} markers={this.state.markers} userTripPreferences={this.state.userTripPreferences} handleSidebarChange={this.state.handleSidebarChange} />} />

            {/* When path is "/alltrips", show trip list component */}
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
