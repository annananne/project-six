// Import React
import React from "react";

// 
const findWeatherAverage = (measurementType, weatherArr) => {
  // Add up all values in inputted array that match inputted measurement type
  const sum = weatherArr.reduce((sum, item) => {
    return sum + item[measurementType];
  }, 0);
  // Divide sum by length of weather array to get average
  const result = sum / weatherArr.length;

  // Return result rounded to 2 decimal places; error handle for NaN result
  if (result === NaN) {
    return null;
  } else {
    return Math.round(result * 100) / 100;
  }
}

// Function to find minimum (lowest) or maximum (highest) temperature (by default returns max)
const findMinOrMax = (measurementType, weatherArr, minOrMax) => {
  // Return all values from inputted array that match inputted measurement type
  const values = weatherArr.map(item => item[measurementType]);
  // Return min/max value of the array based on string passed through as third variable
  if (minOrMax = 'min') {
    return Math.min(...values);
  } else {
    return Math.max(...values);
  }
}

// Function to convert degrees Farenheit to Celsius
const convertFtoC = (F) => {
  return Math.ceil((5 / 9) * (F - 32));
}

// Function to convert miles to kilometers; also works for converting miles/h to km/h
const convertMilesToKilometers = (milesPerHourNumber) => {
  const result = milesPerHourNumber * 1.609344;
  // Return result rounded to 2 decimal places
  return Math.round(result * 100) / 100;
}

// needed for pressure calculations
const convertMillibarsToKPa = (milibarNum) => {
  const result = milibarNum / 10;
  return Math.round(result * 100) / 100
}

// Sidebar overview component begins
const SidebarOverview = (props) => {
  const {
    weatherData,
  } = props;

  // If no weather data is available, return a message that data is loading
  if (!weatherData || weatherData.length === 0) {
    return <p>Loading weather...</p>;
  }


  // Map over weather data array and return only the object containing current weather data details
  const currentWeather = weatherData.map(weatherItem => {
    return weatherItem.currently;
  });

  return (
    <div className="SidebarOverview">
    {/* Average temperature */}
      <div className='weather-record'>
        <p>
          <span>Average temperature</span>
          {`${convertFtoC(findWeatherAverage('temperature', currentWeather))} °C`}
        </p>
      </div>
      {/* Feels like (average) */}
      <div className='weather-record'>
        <p>
          <span>Feels like (average)</span>
          {`${convertFtoC(findWeatherAverage('apparentTemperature', currentWeather))} °C`}
        </p>
      </div>
      {/* Lowest temperature */}
      <div className='weather-record'>
        <p>
          <span>Lowest temperature</span>
          {`${convertFtoC(findMinOrMax('temperature', currentWeather, 'min'))} °C`}
        </p>
      </div>
      {/* Highest temperature */}
      <div className='weather-record'>
        <p>
          <span>Highest temperature</span>
          {`${convertFtoC(findMinOrMax('temperature', currentWeather, 'max'))} °C`}
        </p>
      </div>
      {/* Average wind speed */}
      <div className='weather-record'>
        <p>
          <span>Average wind speed</span>
          {`${convertMilesToKilometers(findWeatherAverage('windSpeed', currentWeather))} km/h`}
        </p>
      </div>
      {/* Average visibility */}
      <div className='weather-record'>
        <p>
          <span>Average visibility</span>
          {findWeatherAverage('visibility', currentWeather) ? `${convertMilesToKilometers(findWeatherAverage('visibility', currentWeather))} km` : "N/A"}
        </p>
      </div>
      {/* Average humidity */}
      <div className='weather-record'>
        <p>
          <span>Average humidity</span>
          {`${findWeatherAverage('humidity', currentWeather)*100}%`}
        </p>
      </div>
      {/* Average pressure */}
      <div className='weather-record'>
        <p>
          <span>Average pressure</span>
          {`${convertMillibarsToKPa(findWeatherAverage('pressure', currentWeather))} kPa`}
        </p>
      </div>
      {/* Average precipitation probability */}
      <div className='weather-record'>
        <p>
          <span>Average precip. probability</span>
          {findWeatherAverage('precipProbability', currentWeather) ? `${findWeatherAverage('precipProbability', currentWeather) * 100}%` : "N/A"}
        </p>
      </div>
      {/* Average UV index */}
      <div className='weather-record'>
        <p>
          <span>Average UV index</span>
          {findWeatherAverage('uvIndex', currentWeather)}
        </p>
      </div>
    </div>
  )
}

export default SidebarOverview;