import React, { Component } from "react";

// helper function that converts temperature in F to C
const convertFtoC = (f) => {
  return Math.ceil((5 / 9) * (f - 32));
}

//Component begins
class PointWeatherDisplay extends Component {
  render() {
    const { 
      originWeatherData,
      destinationWeatherData,
      originAddress,
      destinationAddress
    } = this.props;

    const tempOriginC = convertFtoC(originWeatherData.currently.temperature);

    const tempDestinationC = convertFtoC(destinationWeatherData.currently.temperature);

    return (
      <div>
        { originWeatherData !== null && 
        <div>
          <p>{ originAddress }</p>
          <p>{ tempOriginC } °C</p>
        </div>
        }
        { destinationWeatherData !== null && 
        <div>
        <p>{ destinationAddress }</p>
          <p>{ tempDestinationC } °C</p>
        </div>
        }

      </div>
    );
  }
}

export default PointWeatherDisplay;





