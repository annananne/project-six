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

const findMax = (measurementType, weatherArr) => {
  const values = weatherArr.map(item => item[measurementType])
  return Math.max(...values)
}

const findMin = (measurementType, weatherArr) => {
  const values = weatherArr.map(item => item[measurementType])
  return Math.min(...values)
}

const convertFtoC = (f) => {
  return Math.ceil((5 / 9) * (f - 32));
}

// also works for: convert Miles Per Hour to Kilometers Per Hour

const convertMilesToKilometers = (milesPerHourNumber) => {
  const result = milesPerHourNumber * 1.609344;
  // leave 2 decimal places in. (?)
  return Math.round(result * 100) / 100;
}

// needed for pressure calculations
const convertMillibarsToKPa = (milibarNum) => {
  const result = milibarNum / 10;
  // leave 2 decimal places in. (?)
  return Math.round(result * 100) / 100
}


const formatAsPercentage = (num) => {

}

const SidebarOverview = (props) => {
  const {
    weatherData,
  } = props;

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
      <div className='weather-record'>
        <p>
          <span>Average temperature</span>
          {`${convertFtoC(findWeatherAverage('temperature', currentWeather))} °C`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Feels like</span>
          {`${convertFtoC(findWeatherAverage('apparentTemperature', currentWeather))} °C`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Lowest temperature</span>
          {`${convertFtoC(findMin('temperature', currentWeather))} °C`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Highest temperature</span>
          {`${convertFtoC(findMax('temperature', currentWeather))} °C`}
        </p>
      </div>
      
      <div className='weather-record'>
        <p>
          <span>Average wind speed</span>
          {`${convertMilesToKilometers(findWeatherAverage('windSpeed', currentWeather))} km/h`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Average visibility</span>
          {`${convertMilesToKilometers(findWeatherAverage('visibility', currentWeather))} km` }
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Average humidity</span>
          {`${findWeatherAverage('humidity', currentWeather)*100}%`}
        </p>
      </div>
      <div className='weather-record'>
        <p>
          <span>Average pressure</span>
          {`${convertMillibarsToKPa(findWeatherAverage('pressure', currentWeather))} kPa`}
        </p>
      </div>

      <div className='weather-record'>
        <p>
          {/* is this in percentage? */}
          <span>Average precip. probability</span>
          {`${findWeatherAverage('precipProbability', currentWeather)*100}%`}
        </p>
      </div>
      
      <div className='weather-record'>
        <p>
          <span>Average UV index</span>
          {findWeatherAverage('uvIndex', currentWeather)}
        </p>
      </div>
      
      {/* <div className="weather-record">
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
      </div> */}
    </div>
  )
}

export default SidebarOverview;