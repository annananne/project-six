import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import LocationSearchInput from './LocationSearchInput';

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

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      origin: 'Toronto+Ontario',
      destination: 'Montreal+Quebec'
    }
  }
  render() {
    return <div className="App">
        <header className="App-header" />
        <main>
          <LocationSearchInput />
          <iframe src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAwLJ7Hzo0t_a9H7-_2gUN4BbQJ3noHuvA&origin=${this.state.origin}&destination=${this.state.destination}&avoid=tolls|highways`} frameBorder="0" width="600" height="400" title="My map" />
        </main>
      </div>;
  }
}

export default App;
