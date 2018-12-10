import React, { Component } from "react";
import MapWithADirectionsRenderer from "./DirectionsMap.js";



class CurrentTripInfo extends Component {
  render() {
    return (
      <div>
        <p>I am the map</p>
        {/* <MapWithADirectionsRenderer /> */}
      </div>
    )
  }
}

export default CurrentTripInfo;

// 1. Exactly what data we can pull to send to our users
// 2 API calls for both user inputs (point A, point B)
  // -lat
  // -long
  // temperature (temperature history) - based on user input on date & time

// 2. Measure points on the journey according to lat and long as well as the time
  // points of major temp (weather) change - no more than 5

// 3. And what points to call to the weather API to know the exact weather at the journey’s time

// 4. *live updating* - need to be able to run a function based on variables
  // save both calls res in vars

// 5. does the API shows any warnings on special weather conditions?
// Icons for any extreme warnings (weather conditions, trip issues, etc.)
  // Other times section

// Average temperature (historical)
// Average conditions
// Some other time options within 4hr window (2 before, 2 after)
// On click, update map to include that time and update weather conditions accordingly
  // Tips section
// Includes tips on what to brings
// Includes tips on what to consider about the trip (e.g. trip length, etc.)