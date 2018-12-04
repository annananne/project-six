import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
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
  render() {
    return (
      <div className="App">
        <button onClick={this.getWeather}>Get weather</button>
      </div>
    );
  }
}

export default App;
