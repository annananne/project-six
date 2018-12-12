import React from "react";

// Helper function
// const findAverage = (arr, oneLevelDeep, twoLevelsDeep) => {
//   const sum = arr.reduce((a, b) => a + b, 0);
//   return sum / arr.length;
// }

const findWeatherAverage = (measurementType, weatherArr) => {
  const sum = weatherArr.reduce((sum, item) => {
    return sum + item[measurementType];
  }, 0);
  const result = sum / weatherArr.length;
  // leave 2 decimal places in.
  // maybe use toFixed() ?
  return Math.round(result * 100) / 100
}

const formatAsPercentage = (num) => {

}

const SidebarOverview = (props) => {
  const {
    weatherData,
  } = props;

  // console.log("SIDEBAR OVERVIEW RECEIVED WEATHER DATA");
  // console.log(weatherData);

  if (!weatherData || weatherData.length === 0) {
    return <p>Loading weather...</p>;
  }

  // calculate weather values here (AVERAGES)
  // map weather array with all info to array with just 'currently' objects info
  const currentWeather = weatherData.map(weatherItem => {
    return weatherItem.currently;
  });

  return (
    <div className="SidebarOverview">
      <h2>Weather Summary</h2>

      
      <div className='weather-record'>
        <p>
          <span>Avg Temperature: </span>
          {findWeatherAverage('temperature', currentWeather)}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Avg Apparent Temperature ("Feels Like"): </span>
          {findWeatherAverage('apparentTemperature', currentWeather)}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Avg Humidity</span>
          {`${findWeatherAverage('humidity', currentWeather)*100}%`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          {/* is this in percentage? */}
          <span>Precip Probability Avg: </span>
          {`${findWeatherAverage('precipProbability', currentWeather)*100}%`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Precip Intensity Avg: </span>
          {/* is this in percentage? */}
          {`${findWeatherAverage('precipIntensity', currentWeather) * 100}%`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Wind Speed Avg: </span>
          {/* check what units are these? m/s? */}
          {findWeatherAverage('windSpeed', currentWeather)}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>UV Index: </span>
          {findWeatherAverage('uvIndex', currentWeather)}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Visibility: </span>
          {findWeatherAverage('visibility', currentWeather)}
        </p>
      </div>
      <div className="weather-record">
        <p className="weather-special-title">Weather summary by point:</p>
        {
          currentWeather.map((item, i) => {
            return (
              <p key={item.time}>
                <span>Point {i + 1}: </span>
                {item.summary}
              </p>
            )
          })
        }
      </div>
    </div>
  )
}

export default SidebarOverview;