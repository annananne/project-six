import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import LocationSearchInput from './LocationSearchInput';

class App extends Component {
  constructor() {
    super();
    this.state = {
      origin: 'Toronto+Ontario',
      destination: 'Montreal+Quebec'
    }
  }
  getWeather = () => {
    // $.ajax({
    //   url: 'https://api.darksky.net/forecast/07b4604d016bdc5d5a0f1a893639c687/43.6532,-79.3832,1543924800',
    //   method: 'GET',
    //   dataType: 'jsonp'
    // })
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/07b4604d016bdc5d5a0f1a893639c687/43.6532,-79.3832,1544443200",
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
      "https://cors-anywhere.herokuapp.com/https://www.google.com/maps/embed/v1/directions?key=AIzaSyAwLJ7Hzo0t_a9H7-_2gUN4BbQJ3noHuvA&origin=Oslo+Norway&destination=Telemark+Norway&avoid=tolls|highways",
      {
        method: "GET",
        contentType: "jsonp"
      }
    )
    .then((res) => {
      // console.log("res", res);
    });
  }
  render() {
    return <div className="App">
        <header className="App-header" />
        <main>
          <LocationSearchInput />
          <iframe src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAwLJ7Hzo0t_a9H7-_2gUN4BbQJ3noHuvA&origin=${this.state.origin}&destination=${this.state.destination}&avoid=tolls|highways`} frameBorder="0" width="600" height="400" title="My map" />
          <div className="App">
            <button onClick={this.getWeather}>Get weather</button>
          </div>
        </main>
      </div>;
  }
}

export default App;
